import { PrismaClient } from "@prisma/client";
import { AssessmentSubmission, AssessmentResult, BenchmarkData } from "./zod-schemas";
import { Industry, CompanySize, Region } from "@prisma/client";

// Global PrismaClient instance with connection pooling
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Database operations for assessments
export class AssessmentDB {
  /**
   * Save an assessment submission and its results
   */
  static async saveAssessment({
    submission,
    result,
  }: {
    submission: AssessmentSubmission;
    result: AssessmentResult;
  }) {
    try {
      const assessment = await prisma.assessment.create({
        data: {
          industry: submission.industry as Industry | undefined,
          size: submission.employeeCount as CompanySize | undefined,
          contactEmail: submission.contactEmail,
          emailOptIn: Boolean(submission.includeInBenchmarks),
          answers: submission.answers,
          pillarScores: result.pillarBreakdown.reduce((acc: Record<string, number>, breakdown) => {
            acc[breakdown.pillarId] = breakdown.score;
            return acc;
          }, {}),
          iri: result.totalScore,
          level: result.level,
        },
        include: {
          pillarBreakdown: true,
        },
      });

      // Create pillar breakdown records
      await prisma.pillarScore.createMany({
        data: result.pillarBreakdown.map(breakdown => ({
          assessmentId: assessment.id,
          pillar: breakdown.pillarId,
          score: breakdown.score,
          weight: breakdown.weight,
          contributionToTotal: breakdown.contributionToTotal,
        })),
      });

      return assessment;
    } catch (error) {
      console.error("Error saving assessment:", error);
      throw new Error("Failed to save assessment");
    }
  }

  /**
   * Get an assessment by ID
   */
  static async getAssessment(id: string) {
    try {
      return await prisma.assessment.findUnique({
        where: { id },
        include: {
          pillarBreakdown: true,
        },
      });
    } catch (error) {
      console.error("Error retrieving assessment:", error);
      throw new Error("Failed to retrieve assessment");
    }
  }

  /**
   * Get benchmark data for industry and company size
   */
  static async getBenchmarkData({
    industry,
    companySize,
  }: {
    industry?: string;
    companySize?: string;
  }): Promise<BenchmarkData> {
    try {
      const benchmarks = {
        industry: null as any,
        size: null as any,
        overall: null as any,
      };

      // Get industry benchmark
      if (industry) {
        const industryBenchmark = await prisma.benchmarkSnapshot.findFirst({
          where: {
            industry: industry as Industry,
            size: null,
            region: null,
          },
          orderBy: { createdAt: 'desc' },
        });

        if (industryBenchmark) {
          benchmarks.industry = {
            iriAverage: industryBenchmark.iriAverage,
            pillarAverages: industryBenchmark.pillarAverages as Record<string, number>,
            sampleSize: industryBenchmark.sampleSize,
          };
        }
      }

      // Get size benchmark
      if (companySize) {
        const sizeBenchmark = await prisma.benchmarkSnapshot.findFirst({
          where: {
            size: companySize as CompanySize,
            industry: null,
            region: null,
          },
          orderBy: { createdAt: 'desc' },
        });

        if (sizeBenchmark) {
          benchmarks.size = {
            iriAverage: sizeBenchmark.iriAverage,
            pillarAverages: sizeBenchmark.pillarAverages as Record<string, number>,
            sampleSize: sizeBenchmark.sampleSize,
          };
        }
      }

      // Get overall benchmark
      const overallBenchmark = await prisma.benchmarkSnapshot.findFirst({
        where: {
          industry: null,
          size: null,
          region: null,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (overallBenchmark) {
        benchmarks.overall = {
          iriAverage: overallBenchmark.iriAverage,
          pillarAverages: overallBenchmark.pillarAverages as Record<string, number>,
          sampleSize: overallBenchmark.sampleSize,
        };
      }

      return benchmarks;
    } catch (error) {
      console.error("Error retrieving benchmark data:", error);
      throw new Error("Failed to retrieve benchmark data");
    }
  }

  /**
   * Calculate and update benchmark snapshots
   */
  static async updateBenchmarks() {
    try {
      // Update overall benchmark
      const overallStats = await prisma.assessment.aggregate({
        _avg: { iri: true },
        _count: { id: true },
      });

      if (overallStats._avg.iri !== null && overallStats._count.id > 0) {
        await prisma.benchmarkSnapshot.upsert({
          where: {
            id: 'overall-benchmark',
          },
          create: {
            id: 'overall-benchmark',
            iriAverage: overallStats._avg.iri,
            sampleSize: overallStats._count.id,
            pillarAverages: {},
          },
          update: {
            iriAverage: overallStats._avg.iri,
            sampleSize: overallStats._count.id,
          },
        });
      }

      // Update industry benchmarks
      const industries = await prisma.assessment.groupBy({
        by: ['industry'],
        _avg: { iri: true },
        _count: { id: true },
        where: { industry: { not: null } },
      });

      for (const industryGroup of industries) {
        if (industryGroup.industry && industryGroup._avg.iri !== null) {
          await prisma.benchmarkSnapshot.upsert({
            where: {
              id: `industry-${industryGroup.industry}`,
            },
            create: {
              id: `industry-${industryGroup.industry}`,
              industry: industryGroup.industry,
              iriAverage: industryGroup._avg.iri,
              sampleSize: industryGroup._count.id,
              pillarAverages: {},
            },
            update: {
              iriAverage: industryGroup._avg.iri,
              sampleSize: industryGroup._count.id,
            },
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating benchmarks:", error);
      throw new Error("Failed to update benchmarks");
    }
  }
}

// Export convenience functions
export const saveAssessment = AssessmentDB.saveAssessment.bind(AssessmentDB);
export const getAssessment = AssessmentDB.getAssessment.bind(AssessmentDB);
export const getBenchmarkData = AssessmentDB.getBenchmarkData.bind(AssessmentDB);
export const updateBenchmarks = AssessmentDB.updateBenchmarks.bind(AssessmentDB);