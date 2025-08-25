"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { calculateInsiderRiskIndex } from "@/lib/scoring";
import { AssessmentAnswer } from "@/lib/zod-schemas";
import { Industry, CompanySize, Region } from "@prisma/client";
import crypto from "crypto";

// Validation schema for assessment submission
const AssessmentSubmissionSchema = z.object({
  industry: z.nativeEnum(Industry).optional(),
  size: z.nativeEnum(CompanySize).optional(),
  region: z.nativeEnum(Region).optional(),
  answers: z.record(z.string(), z.number().min(0).max(100)),
  emailOptIn: z.boolean().default(false),
  contactEmail: z.string().email().optional(),
});

export type AssessmentSubmission = z.infer<typeof AssessmentSubmissionSchema>;

/**
 * Submit an assessment and calculate the Insider Risk Index
 */
export async function submitAssessment(data: AssessmentSubmission) {
  try {
    // Validate input
    const validated = AssessmentSubmissionSchema.parse(data);
    
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
    const assessment = await prisma.assessment.create({
      data: {
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
    
    return {
      success: true,
      assessmentId: assessment.id,
      result: {
        ...scoringResult,
        assessmentId: assessment.id,
      },
    };
  } catch (error) {
    console.error("Assessment submission error:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid assessment data",
        details: error.issues,
      };
    }
    
    return {
      success: false,
      error: "Failed to submit assessment",
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
      include: {
        pillarBreakdown: true,
      },
    });
    
    if (!assessment) {
      return {
        success: false,
        error: "Assessment not found",
      };
    }
    
    // Get benchmarks for comparison
    const benchmarks = await getBenchmarks({
      industry: assessment.industry,
      size: assessment.size,
      region: assessment.region,
    });
    
    return {
      success: true,
      assessment,
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