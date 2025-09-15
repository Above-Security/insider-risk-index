import { NextResponse } from "next/server";
import { sendTestEmail, sendEmail } from "@/lib/email/client";
import { render } from "@react-email/render";
import { AssessmentCompleteEmail } from "@/emails/assessment-complete";
import { generatePDFAttachment } from "@/lib/pdf/email-attachment";

export async function GET(request: Request) {
  try {
    // Get email from query params
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get("email");
    const type = searchParams.get("type") || "simple";
    
    if (!testEmail) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }
    
    let result;
    
    if (type === "simple") {
      // Send simple test email
      result = await sendTestEmail(testEmail);
    } else if (type === "assessment" || type === "board-brief") {
      // Send sample assessment email
      const emailHtml = await render(
        AssessmentCompleteEmail({
          organizationName: "Test Organization",
          iriScore: 72,
          maturityLevel: "Proactive",
          maturityLevelNumber: 4,
          pillarScores: [
            { name: "Visibility Foundation", score: 85 },
            { name: "Prevention & Coaching", score: 70 },
            { name: "Investigation & Evidence", score: 65 },
            { name: "Identity & SaaS", score: 75 },
            { name: "Phishing Resilience", score: 68 }
          ],
          topStrengths: [
            "Visibility Foundation",
            "Identity & SaaS",
            "Prevention & Coaching"
          ],
          keyRisks: [
            "Investigation & Evidence",
            "Phishing Resilience",
            "Prevention & Coaching"
          ],
          resultsUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/results/test-123`,
          pdfUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/pdf/detailed/test-123`
        })
      );
      
      // Generate test PDF attachment
      let pdfAttachment = null;
      if (searchParams.get("pdf") === "true") {
        try {
          // Create mock assessment for PDF generation
          const mockAssessment = {
            id: "test-123",
            createdAt: new Date(),
            updatedAt: new Date(),
            industry: "TECHNOLOGY" as any,
            size: "MID_251_1000" as any,
            region: null,
            orgMetaHash: null,
            organizationName: "Test Organization",
            answers: {},
            pillarScores: {},
            iri: 72,
            level: 4,
            emailOptIn: true,
            contactEmail: testEmail,
            emailSent: false,
            emailSentAt: null,
            pillarBreakdown: [
              { id: "1", assessmentId: "test-123", pillar: "visibility", score: 85, weight: 0.25, contributionToTotal: 21.25 },
              { id: "2", assessmentId: "test-123", pillar: "prevention-coaching", score: 70, weight: 0.25, contributionToTotal: 17.5 },
              { id: "3", assessmentId: "test-123", pillar: "investigation-evidence", score: 65, weight: 0.20, contributionToTotal: 13 },
              { id: "4", assessmentId: "test-123", pillar: "identity-saas", score: 75, weight: 0.15, contributionToTotal: 11.25 },
              { id: "5", assessmentId: "test-123", pillar: "phishing-resilience", score: 68, weight: 0.15, contributionToTotal: 10.2 }
            ]
          };
          
          const pdfType = (type === 'board-brief') ? 'board-brief' : 'detailed-plan';
          const pdfData = await generatePDFAttachment({
            assessment: mockAssessment,
            type: pdfType as 'detailed-plan' | 'board-brief'
          });
          pdfAttachment = {
            filename: pdfData.filename,
            content: pdfData.buffer.toString('base64')
          };
          console.log('Test PDF attachment generated:', pdfData.filename);
        } catch (error) {
          console.error('Failed to generate test PDF attachment:', error);
        }
      }
      
      result = await sendEmail({
        to: testEmail,
        subject: "Test Assessment Results - Score: 72/100",
        html: emailHtml,
        attachments: pdfAttachment ? [pdfAttachment] : undefined,
      });
    }
    
    if (result?.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent to ${testEmail}`,
        type,
        data: result.data
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: result?.error || "Failed to send email",
          details: result
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { 
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : error
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, type = "simple" } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required in request body" },
        { status: 400 }
      );
    }
    
    // Same logic as GET but with POST body
    let result;
    
    if (type === "simple") {
      result = await sendTestEmail(email);
    } else if (type === "assessment") {
      const emailHtml = await render(
        AssessmentCompleteEmail({
          organizationName: body.organizationName || "Test Organization",
          iriScore: body.iriScore || 72,
          maturityLevel: body.maturityLevel || "Proactive",
          maturityLevelNumber: body.maturityLevelNumber || 4,
          pillarScores: body.pillarScores || [
            { name: "Visibility Foundation", score: 85 },
            { name: "Prevention & Coaching", score: 70 },
            { name: "Investigation & Evidence", score: 65 },
            { name: "Identity & SaaS", score: 75 },
            { name: "Phishing Resilience", score: 68 }
          ],
          topStrengths: body.topStrengths || [
            "Visibility Foundation",
            "Identity & SaaS",
            "Prevention & Coaching"
          ],
          keyRisks: body.keyRisks || [
            "Investigation & Evidence",
            "Phishing Resilience",
            "Prevention & Coaching"
          ],
          resultsUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/results/test-123`,
          pdfUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/pdf/detailed/test-123`
        })
      );
      
      result = await sendEmail({
        to: email,
        subject: body.subject || "Test Assessment Results - Score: 72/100",
        html: emailHtml,
      });
    }
    
    if (result?.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent to ${email}`,
        type,
        data: result.data
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: result?.error || "Failed to send email",
          details: result
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { 
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : error
      },
      { status: 500 }
    );
  }
}