import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAssessmentResults } from "@/app/actions/assessment";
import { sendEmail } from "@/lib/email/client";
import { render } from "@react-email/render";
import AssessmentCompleteEmail from "@/emails/assessment-complete";
import { generatePDFAttachment } from "@/lib/pdf/email-attachment";

const EmailResultsSchema = z.object({
  assessmentId: z.string().min(1),
  recipientEmail: z.string().email(),
  recipientName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Manual email send request started');

    const body = await request.json();
    console.log('📧 Request body received:', {
      assessmentId: body.assessmentId,
      recipientEmail: body.recipientEmail,
      recipientName: body.recipientName
    });

    const { assessmentId, recipientEmail, recipientName } = EmailResultsSchema.parse(body);
    console.log('📧 Request validation passed');

    // Get assessment results
    console.log('📧 Fetching assessment results for ID:', assessmentId);
    const response = await getAssessmentResults(assessmentId);

    if (!response.success || !response.assessment) {
      console.error('📧 Assessment not found:', {
        success: response.success,
        hasAssessment: !!response.assessment,
        assessmentId
      });
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    const { assessment } = response;
    console.log('📧 Assessment data retrieved:', {
      id: assessment.id,
      iri: assessment.iri,
      level: assessment.level,
      organizationName: (assessment as any).organizationName,
      industry: assessment.industry,
      hasPillarBreakdown: !!(assessment as any).pillarBreakdown
    });

    const score = Math.round(assessment.iri);
    const level = assessment.level;

    // Calculate business impact metrics (same as in results page)
    const averageAnnualCost = 17400000;
    const averageIncidentCost = 676517;
    const averageContainmentDays = 81;
    const riskMultiplier = Math.max(0.3, (100 - score) / 100);
    const estimatedAnnualRisk = Math.round(averageAnnualCost * riskMultiplier / 1000000 * 10) / 10;
    const estimatedIncidentCost = Math.round(averageIncidentCost * riskMultiplier / 1000);
    const estimatedContainmentTime = Math.round(averageContainmentDays * riskMultiplier);

    console.log('📧 Business impact calculations:', {
      score,
      level,
      riskMultiplier,
      estimatedAnnualRisk,
      estimatedIncidentCost,
      estimatedContainmentTime
    });

    // Generate email content with correct props
    const organizationName = (assessment as any).organizationName || "Organization";
    const industry = assessment.industry?.replace(/_/g, ' ') || "Unknown";

    // Get maturity level description
    const MATURITY_LEVELS = {
      1: "Ad Hoc",
      2: "Emerging",
      3: "Managed",
      4: "Proactive",
      5: "Optimized"
    };
    const maturityLevel = MATURITY_LEVELS[level as keyof typeof MATURITY_LEVELS] || "Unknown";

    // Build pillar scores from breakdown
    const pillarBreakdown = (assessment as any).pillarBreakdown || [];
    const pillarScores = pillarBreakdown.map((p: any) => ({
      name: p.pillarId,
      score: Math.round(p.score)
    }));

    // Generate simple top strengths and key risks
    const sortedPillars = [...pillarScores].sort((a, b) => b.score - a.score);
    const topStrengths = sortedPillars.slice(0, 3).map(p => p.name);
    const keyRisks = sortedPillars.slice(-3).map(p => p.name);

    console.log('📧 Email template data prepared:', {
      organizationName,
      iriScore: score,
      maturityLevel,
      maturityLevelNumber: level,
      pillarScoresCount: pillarScores.length,
      topStrengthsCount: topStrengths.length,
      keyRisksCount: keyRisks.length
    });

    const emailHtml = await render(
      AssessmentCompleteEmail({
        organizationName,
        iriScore: score,
        maturityLevel,
        maturityLevelNumber: level,
        pillarScores,
        topStrengths,
        keyRisks,
        resultsUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/results/${assessmentId}`,
        pdfUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/pdf/${assessmentId}`,
      })
    );

    console.log('📧 Email HTML rendered successfully, length:', emailHtml.length);

    // Generate PDF attachment if environment variable is enabled
    let pdfAttachment;
    if (process.env.ENABLE_PDF_EMAIL_ATTACHMENTS?.trim() === 'true') {
      try {
        console.log("📄 Generating PDF attachment for manual email send");
        const pdfData = await generatePDFAttachment({ assessment, type: 'board-brief' });
        pdfAttachment = {
          filename: pdfData.filename,
          content: pdfData.buffer
        };
        console.log("✅ PDF attachment generated successfully:", {
          filename: pdfData.filename,
          bufferLength: pdfData.buffer.length
        });
      } catch (pdfError) {
        console.error('📄 PDF generation failed for manual email:', {
          error: pdfError instanceof Error ? pdfError.message : pdfError,
          stack: pdfError instanceof Error ? pdfError.stack : undefined
        });
        // Continue without attachment
      }
    } else {
      console.log('📄 PDF attachment skipped:', {
        enablePdfAttachmentsRaw: process.env.ENABLE_PDF_EMAIL_ATTACHMENTS,
        enablePdfAttachmentsTrimmed: process.env.ENABLE_PDF_EMAIL_ATTACHMENTS?.trim()
      });
    }

    // Send email
    const subject = recipientName
      ? `Insider Risk Assessment Results shared by ${recipientName} - Score: ${score}/100`
      : `Insider Risk Assessment Results - Score: ${score}/100`;

    console.log('📧 Preparing to send email:', {
      to: recipientEmail,
      subject,
      htmlLength: emailHtml.length,
      hasAttachment: !!pdfAttachment
    });

    const result = await sendEmail({
      to: recipientEmail,
      subject,
      html: emailHtml,
      attachments: pdfAttachment ? [pdfAttachment] : undefined,
    });

    console.log('📧 Email send result:', {
      success: result.success,
      error: result.error,
      emailId: result.data?.id,
      resultData: result.data
    });

    if (result.success) {
      console.log(`✅ Manual results email sent successfully to: ${recipientEmail}`, {
        emailId: result.data?.id,
        subject
      });
      return NextResponse.json({
        success: true,
        message: `Results successfully sent to ${recipientEmail}`,
        emailId: result.data?.id
      });
    } else {
      console.error('❌ Manual email send failed:', {
        error: result.error,
        recipient: recipientEmail,
        subject
      });
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("❌ Email results API error:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error?.constructor?.name
    });

    if (error instanceof z.ZodError) {
      console.error("❌ Zod validation error:", {
        issues: error.issues,
        receivedData: error.issues.map(issue => ({
          path: issue.path,
          message: issue.message,
          received: issue.code === 'invalid_type' ? (issue as any).received : undefined
        }))
      });
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send results email" },
      { status: 500 }
    );
  }
}