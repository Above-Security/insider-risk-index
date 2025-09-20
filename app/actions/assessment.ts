"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { calculateInsiderRiskIndex } from "@/lib/scoring";
import { AssessmentAnswer } from "@/lib/zod-schemas";
import { Industry, CompanySize, Region } from "@prisma/client";
import crypto from "crypto";
import { sendEmail } from "@/lib/email/client";
import { render } from "@react-email/render";
import { AssessmentCompleteEmail } from "@/emails/assessment-complete";
import { PILLARS } from "@/lib/pillars";
import { generatePDFAttachment } from "@/lib/pdf/email-attachment";

// Validation schema for assessment submission
const AssessmentSubmissionSchema = z.object({
  organizationName: z.string().optional(),
  industry: z.nativeEnum(Industry).optional(),
  size: z.nativeEnum(CompanySize).optional(),
  region: z.nativeEnum(Region).optional(),
  answers: z.record(z.string(), z.number().min(0).max(100)),
  emailOptIn: z.boolean().default(false),
  contactEmail: z.string().refine(
    (email) => email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    "Invalid email format"
  ).optional(),
});

export type AssessmentSubmission = z.infer<typeof AssessmentSubmissionSchema>;

/**
 * Submit an assessment and calculate the Insider Risk Index
 */
export async function submitAssessment(data: AssessmentSubmission) {
  try {
    console.log("🔍 Starting assessment submission...");
    console.log("🔍 DATABASE_URL present:", !!process.env.DATABASE_URL);

    // Test database connection
    try {
      await prisma.$connect();
      console.log("✅ Database connection successful");
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError);
      throw new Error(`Database connection failed: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
    }

    // Validate input
    const validated = AssessmentSubmissionSchema.parse(data);
    console.log("✅ Data validation successful");
    
    // Convert answers to array format for scoring
    const answersArray: AssessmentAnswer[] = Object.entries(validated.answers).map(
      ([questionId, value]) => ({
        questionId,
        value,
      })
    );
    
    // Calculate IRI score
    const scoringResult = calculateInsiderRiskIndex({
      answers: answersArray,
      industry: validated.industry || "",
      companySize: validated.size || "",
    });
    
    // Generate org meta hash if industry and size provided
    let orgMetaHash: string | null = null;
    if (validated.industry && validated.size) {
      const hashInput = `${validated.industry}_${validated.size}`;
      orgMetaHash = crypto
        .createHash("sha256")
        .update(hashInput)
        .digest("hex")
        .substring(0, 16);
    }
    
    // Create pillar breakdown records
    const pillarBreakdownData = scoringResult.pillarBreakdown.map((pb) => ({
      pillar: pb.pillarId,
      score: pb.score,
      weight: pb.weight,
      contributionToTotal: pb.contributionToTotal,
    }));
    
    // Save assessment to database
    console.log("🔍 Attempting to save assessment to database...");
    const assessment = await prisma.assessment.create({
      data: {
        organizationName: validated.organizationName,
        industry: validated.industry,
        size: validated.size,
        region: validated.region,
        orgMetaHash,
        answers: validated.answers,
        pillarScores: scoringResult.pillarBreakdown.reduce(
          (acc, pb) => ({
            ...acc,
            [pb.pillarId]: pb.score,
          }),
          {}
        ),
        iri: scoringResult.totalScore,
        level: scoringResult.level,
        emailOptIn: validated.emailOptIn,
        contactEmail: validated.contactEmail,
        pillarBreakdown: {
          create: pillarBreakdownData,
        },
      },
      include: {
        pillarBreakdown: true,
      },
    });

    console.log("✅ Assessment saved successfully with ID:", assessment.id);
    
    // Update benchmark snapshots (in background)
    if (validated.industry || validated.size || validated.region) {
      updateBenchmarkSnapshots({
        industry: validated.industry,
        size: validated.size,
        region: validated.region,
        iri: scoringResult.totalScore,
        pillarScores: scoringResult.pillarBreakdown,
      }).catch(console.error);
    }
    
    // Send email if email address was provided
    if (validated.contactEmail && validated.emailOptIn) {
      try {
        console.log('📧 Assessment email flow started:', {
          emailOptIn: validated.emailOptIn,
          contactEmail: validated.contactEmail,
          organizationName: validated.organizationName,
          score: Math.round(scoringResult.totalScore),
          level: scoringResult.level,
          levelDescription: scoringResult.levelDescription
        });
        
        // Get pillar scores for email
        const pillarScores = scoringResult.pillarBreakdown.map(pb => ({
          name: PILLARS.find(p => p.id === pb.pillarId)?.name || pb.pillarId,
          score: Math.round(pb.score)
        }));
        
        // Get top strengths and key risks
        const sortedPillars = [...scoringResult.pillarBreakdown].sort((a, b) => b.score - a.score);
        const topStrengths = sortedPillars.slice(0, 3).map(p =>
          PILLARS.find(pillar => pillar.id === p.pillarId)?.name || p.pillarId
        );
        const keyRisks = sortedPillars.slice(-3).map(p =>
          PILLARS.find(pillar => pillar.id === p.pillarId)?.name || p.pillarId
        );

        console.log('📧 Email template data prepared:', {
          pillarScoresCount: pillarScores.length,
          topStrengthsCount: topStrengths.length,
          keyRisksCount: keyRisks.length,
          topStrengths,
          keyRisks
        });

        // Render email HTML
        const emailHtml = await render(
          AssessmentCompleteEmail({
            organizationName: validated.organizationName,
            iriScore: Math.round(scoringResult.totalScore),
            maturityLevel: scoringResult.levelDescription,
            maturityLevelNumber: scoringResult.level,
            pillarScores,
            topStrengths,
            keyRisks,
            resultsUrl: `${process.env.NEXT_PUBLIC_SITE_URL?.trim()}/results/${assessment.id}`,
            pdfUrl: `${process.env.NEXT_PUBLIC_SITE_URL?.trim()}/api/pdf/${assessment.id}`
          })
        );

        console.log('📧 Email HTML rendered, length:', emailHtml.length);
        
        // Generate PDF attachment asynchronously if enabled
        let pdfAttachment = null;
        if (process.env.ENABLE_PDF_EMAIL_ATTACHMENTS?.trim() === 'true') {
          try {
            console.log('📄 Generating PDF attachment for assessment email...');
            const pdfData = await generatePDFAttachment({
              assessment: assessment as any,
              type: 'board-brief'
            });
            pdfAttachment = {
              filename: pdfData.filename,
              content: pdfData.buffer
            };
            console.log('✅ PDF attachment generated successfully:', {
              filename: pdfData.filename,
              bufferLength: pdfData.buffer.length
            });
          } catch (pdfError) {
            console.error('❌ Failed to generate PDF attachment:', {
              error: pdfError instanceof Error ? pdfError.message : pdfError,
              stack: pdfError instanceof Error ? pdfError.stack : undefined
            });
            // Continue without attachment - user can still download from results page
          }
        } else {
          console.log('📄 PDF attachments disabled - user can download from results page');
        }

        // Send the email (with or without PDF attachment)
        console.log('📧 Preparing to send assessment email:', {
          to: validated.contactEmail,
          subject: `Your Insider Risk Assessment Score: ${Math.round(scoringResult.totalScore)}/100`,
          hasAttachment: !!pdfAttachment,
          htmlLength: emailHtml.length
        });

        const emailResult = await sendEmail({
          to: validated.contactEmail,
          subject: `Your Insider Risk Assessment Score: ${Math.round(scoringResult.totalScore)}/100`,
          html: emailHtml,
          attachments: pdfAttachment ? [pdfAttachment] : undefined,
        });

        console.log('📧 Assessment email send result:', {
          success: emailResult.success,
          error: emailResult.error,
          emailId: emailResult.data?.id
        });
        
        if (emailResult.success) {
          console.log('✅ Assessment email sent successfully:', {
            to: validated.contactEmail,
            emailId: emailResult.data?.id
          });
          // Update assessment record to track email was sent
          await prisma.assessment.update({
            where: { id: assessment.id },
            data: {
              emailSent: true,
              emailSentAt: new Date()
            }
          }).catch((updateError) => {
            console.error('❌ Failed to update assessment email status:', updateError);
          });
        } else {
          console.error('❌ Failed to send assessment email:', {
            error: emailResult.error,
            to: validated.contactEmail
          });
        }
      } catch (emailError) {
        console.error('❌ Error in assessment email flow:', {
          error: emailError instanceof Error ? emailError.message : emailError,
          stack: emailError instanceof Error ? emailError.stack : undefined,
          contactEmail: validated.contactEmail
        });
        // Don't fail the assessment submission if email fails
      }
    } else {
      console.log('📧 Email notification skipped:', {
        emailOptIn: validated.emailOptIn,
        hasContactEmail: !!validated.contactEmail
      });
    }
    
    return {
      success: true,
      assessmentId: assessment.id,
      result: {
        ...scoringResult,
        assessmentId: assessment.id,
      },
    };
  } catch (error) {
    console.error("❌ Assessment submission error:", error);
    console.error("❌ Error type:", error?.constructor?.name);
    console.error("❌ Error message:", error instanceof Error ? error.message : String(error));
    console.error("❌ Error stack:", error instanceof Error ? error.stack : 'No stack trace');

    if (error instanceof z.ZodError) {
      console.error("❌ Zod validation errors:", error.issues);
      return {
        success: false,
        error: "Invalid assessment data",
        details: error.issues,
      };
    }

    return {
      success: false,
      error: "Failed to submit assessment",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get assessment results by ID
 */
export async function getAssessmentResults(assessmentId: string) {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        organizationName: true,
        industry: true,
        size: true,
        region: true,
        orgMetaHash: true,
        answers: true,
        pillarScores: true,
        iri: true,
        level: true,
        emailOptIn: true,
        contactEmail: true,
        emailSent: true,
        emailSentAt: true,
      },
    });

    if (!assessment) {
      return {
        success: false,
        error: "Assessment not found",
      };
    }

    // Fetch pillar breakdown separately to avoid potential issues
    const pillarBreakdown = await prisma.pillarScore.findMany({
      where: { assessmentId },
    });

    // Get benchmarks for comparison
    const benchmarks = await getBenchmarks({
      industry: assessment.industry,
      size: assessment.size,
      region: assessment.region,
    });

    return {
      success: true,
      assessment: {
        ...assessment,
        pillarBreakdown,
      },
      benchmarks,
    };
  } catch (error) {
    console.error("Error fetching assessment results:", error);
    return {
      success: false,
      error: "Failed to fetch assessment results",
    };
  }
}

/**
 * Get benchmark data for comparison
 */
async function getBenchmarks(params: {
  industry?: Industry | null;
  size?: CompanySize | null;
  region?: Region | null;
}) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const benchmarks = await prisma.benchmarkSnapshot.findMany({
    where: {
      AND: [
        params.industry ? { industry: params.industry } : {},
        params.size ? { size: params.size } : {},
        params.region ? { region: params.region } : {},
        {
          periodEnd: {
            gte: thirtyDaysAgo,
          },
        },
      ],
    },
    orderBy: {
      periodEnd: "desc",
    },
    take: 1,
  });
  
  // Get overall benchmark
  const overallBenchmark = await prisma.benchmarkSnapshot.findFirst({
    where: {
      industry: null,
      size: null,
      region: null,
      periodEnd: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      periodEnd: "desc",
    },
  });
  
  return {
    industry: benchmarks.find((b) => b.industry === params.industry),
    size: benchmarks.find((b) => b.size === params.size),
    region: benchmarks.find((b) => b.region === params.region),
    overall: overallBenchmark,
  };
}

/**
 * Update benchmark snapshots with new assessment data
 */
async function updateBenchmarkSnapshots(params: {
  industry?: Industry | null;
  size?: CompanySize | null;
  region?: Region | null;
  iri: number;
  pillarScores: Array<{ pillarId: string; score: number }>;
}) {
  // This would be implemented as a background job in production
  // For now, we'll just log the intention
  console.log("Updating benchmark snapshots with new assessment data", {
    industry: params.industry,
    size: params.size,
    region: params.region,
    iri: params.iri,
  });
  
  // In production, this would:
  // 1. Find or create current period benchmark snapshot
  // 2. Recalculate averages with new data
  // 3. Update sample size
  // 4. Save updated snapshot
}

/**
 * Generate a shareable link for assessment results
 */
export async function generateShareableLink(assessmentId: string) {
  try {
    // Verify assessment exists
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: { id: true },
    });
    
    if (!assessment) {
      return {
        success: false,
        error: "Assessment not found",
      };
    }
    
    // Generate shareable token
    const token = crypto.randomBytes(32).toString("hex");
    
    // In production, store this token with expiration
    // For now, we'll just return the shareable URL
    const shareableUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/results/share/${token}`;
    
    return {
      success: true,
      url: shareableUrl,
      token,
    };
  } catch (error) {
    console.error("Error generating shareable link:", error);
    return {
      success: false,
      error: "Failed to generate shareable link",
    };
  }
}