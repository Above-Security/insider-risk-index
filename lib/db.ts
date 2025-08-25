import { PrismaClient } from "@prisma/client";
import { AssessmentSubmission, AssessmentResult, BenchmarkData } from "./zod-schemas";

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
          organizationName: submission.organizationName,
          industry: submission.industry,
          employeeCount: submission.employeeCount,
          contactEmail: submission.contactEmail,
          includeInBenchmarks: submission.includeInBenchmarks,
          totalScore: result.totalScore,
          level: result.level,
          levelDescription: result.levelDescription,
          answers: {
            create: submission.answers.map(answer => ({
              questionId: answer.questionId,
              value: answer.value,
              rationale: answer.rationale,
            })),
          },
          pillarScores: {
            create: result.pillarBreakdown.map(breakdown => ({
              pillarId: breakdown.pillarId,
              score: breakdown.score,
              maxScore: breakdown.maxScore,
              weight: breakdown.weight,
              contributionToTotal: breakdown.contributionToTotal,
            })),
          },
          recommendations: result.recommendations,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          benchmarkIndustry: result.benchmark.industry,
          benchmarkCompanySize: result.benchmark.companySize,
          benchmarkOverall: result.benchmark.overall,
        },
        include: {
          answers: true,
          pillarScores: true,
        },
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
          answers: true,
          pillarScores: true,
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
  }) {
    try {
      const whereClause: any = {
        includeInBenchmarks: true,
      };

      if (industry) whereClause.industry = industry;
      if (companySize) whereClause.employeeCount = companySize;

      const assessments = await prisma.assessment.findMany({
        where: whereClause,
        include: {
          pillarScores: true,
        },
      });

      if (assessments.length === 0) {
        return null;
      }

      // Calculate averages
      const totalScoreSum = assessments.reduce((sum, a) => sum + a.totalScore, 0);
      const averageScore = totalScoreSum / assessments.length;

      // Calculate pillar averages
      const pillarAverages: Record<string, number> = {};
      const pillarCounts: Record<string, number> = {};

      for (const assessment of assessments) {
        for (const pillarScore of assessment.pillarScores) {
          if (!pillarAverages[pillarScore.pillarId]) {
            pillarAverages[pillarScore.pillarId] = 0;
            pillarCounts[pillarScore.pillarId] = 0;
          }
          pillarAverages[pillarScore.pillarId] += pillarScore.score;
          pillarCounts[pillarScore.pillarId]++;
        }
      }

      // Normalize pillar averages
      for (const pillarId in pillarAverages) {
        pillarAverages[pillarId] = pillarAverages[pillarId] / pillarCounts[pillarId];
      }

      return {
        averageScore: Math.round(averageScore * 100) / 100,
        pillarAverages,
        sampleSize: assessments.length,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error("Error retrieving benchmark data:", error);
      throw new Error("Failed to retrieve benchmark data");
    }
  }

  /**
   * Get overall statistics
   */
  static async getOverallStats() {
    try {
      const stats = await prisma.assessment.aggregate({
        _count: {
          id: true,
        },
        _avg: {
          totalScore: true,
        },
        where: {
          includeInBenchmarks: true,
        },
      });

      // Get level distribution
      const levelDistribution = await prisma.assessment.groupBy({
        by: ["level"],
        _count: {
          level: true,
        },
        where: {
          includeInBenchmarks: true,
        },
      });

      const distribution: Record<string, number> = {};
      const totalCount = stats._count.id || 0;

      for (const level of levelDistribution) {
        const percentage = totalCount > 0 ? (level._count.level / totalCount) * 100 : 0;
        distribution[`level${level.level}`] = Math.round(percentage);
      }

      return {
        totalAssessments: totalCount,
        averageScore: Math.round((stats._avg.totalScore || 0) * 100) / 100,
        distribution,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error("Error retrieving overall stats:", error);
      throw new Error("Failed to retrieve overall statistics");
    }
  }

  /**
   * Search assessments with filters
   */
  static async searchAssessments({
    industry,
    companySize,
    minScore,
    maxScore,
    limit = 50,
    offset = 0,
  }: {
    industry?: string;
    companySize?: string;
    minScore?: number;
    maxScore?: number;
    limit?: number;
    offset?: number;
  }) {
    try {
      const whereClause: any = {};

      if (industry) whereClause.industry = industry;
      if (companySize) whereClause.employeeCount = companySize;
      if (minScore !== undefined || maxScore !== undefined) {
        whereClause.totalScore = {};
        if (minScore !== undefined) whereClause.totalScore.gte = minScore;
        if (maxScore !== undefined) whereClause.totalScore.lte = maxScore;
      }

      const [assessments, totalCount] = await Promise.all([
        prisma.assessment.findMany({
          where: whereClause,
          include: {
            pillarScores: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: limit,
          skip: offset,
        }),
        prisma.assessment.count({
          where: whereClause,
        }),
      ]);

      return {
        assessments,
        totalCount,
        hasMore: offset + assessments.length < totalCount,
      };
    } catch (error) {
      console.error("Error searching assessments:", error);
      throw new Error("Failed to search assessments");
    }
  }
}

// Content management operations
export class ContentDB {
  /**
   * Get published playbooks with optional filtering
   */
  static async getPlaybooks({
    pillarId,
    difficulty,
    tags,
    limit = 20,
  }: {
    pillarId?: string;
    difficulty?: string;
    tags?: string[];
    limit?: number;
  } = {}) {
    try {
      const whereClause: any = {
        published: true,
      };

      if (pillarId) whereClause.pillarId = pillarId;
      if (difficulty) whereClause.difficulty = difficulty;
      if (tags?.length) {
        whereClause.tags = {
          hasEvery: tags,
        };
      }

      return await prisma.playbook.findMany({
        where: whereClause,
        orderBy: {
          updatedAt: "desc",
        },
        take: limit,
      });
    } catch (error) {
      console.error("Error retrieving playbooks:", error);
      throw new Error("Failed to retrieve playbooks");
    }
  }

  /**
   * Get a specific playbook by slug
   */
  static async getPlaybook(slug: string) {
    try {
      return await prisma.playbook.findUnique({
        where: { slug },
      });
    } catch (error) {
      console.error("Error retrieving playbook:", error);
      throw new Error("Failed to retrieve playbook");
    }
  }

  /**
   * Get published research articles
   */
  static async getResearch({
    category,
    tags,
    featured,
    limit = 20,
  }: {
    category?: string;
    tags?: string[];
    featured?: boolean;
    limit?: number;
  } = {}) {
    try {
      const whereClause: any = {};

      if (category) whereClause.category = category;
      if (featured !== undefined) whereClause.featured = featured;
      if (tags?.length) {
        whereClause.tags = {
          hasEvery: tags,
        };
      }

      return await prisma.research.findMany({
        where: whereClause,
        orderBy: {
          publishedAt: "desc",
        },
        take: limit,
      });
    } catch (error) {
      console.error("Error retrieving research:", error);
      throw new Error("Failed to retrieve research");
    }
  }

  /**
   * Get a specific research article by slug
   */
  static async getResearchArticle(slug: string) {
    try {
      return await prisma.research.findUnique({
        where: { slug },
      });
    } catch (error) {
      console.error("Error retrieving research article:", error);
      throw new Error("Failed to retrieve research article");
    }
  }
}

// Analytics and tracking
export class AnalyticsDB {
  /**
   * Track an analytics event
   */
  static async trackEvent({
    name,
    properties,
    userId,
    sessionId,
  }: {
    name: string;
    properties?: Record<string, any>;
    userId?: string;
    sessionId?: string;
  }) {
    try {
      await prisma.analyticsEvent.create({
        data: {
          name,
          properties: properties || {},
          userId,
          sessionId,
        },
      });
    } catch (error) {
      console.error("Error tracking analytics event:", error);
      // Don't throw error for analytics failures
    }
  }

  /**
   * Get analytics data for a date range
   */
  static async getAnalytics({
    startDate,
    endDate,
    eventName,
  }: {
    startDate: Date;
    endDate: Date;
    eventName?: string;
  }) {
    try {
      const whereClause: any = {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      };

      if (eventName) whereClause.name = eventName;

      return await prisma.analyticsEvent.findMany({
        where: whereClause,
        orderBy: {
          timestamp: "desc",
        },
      });
    } catch (error) {
      console.error("Error retrieving analytics:", error);
      throw new Error("Failed to retrieve analytics data");
    }
  }
}

// Database health and maintenance
export class DatabaseHealth {
  /**
   * Check database connection
   */
  static async checkConnection() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: "healthy", timestamp: new Date() };
    } catch (error) {
      console.error("Database connection error:", error);
      return { status: "unhealthy", error: error instanceof Error ? error.message : "Unknown error", timestamp: new Date() };
    }
  }

  /**
   * Get database statistics
   */
  static async getStats() {
    try {
      const [assessmentCount, playbookCount, researchCount, analyticsCount] = await Promise.all([
        prisma.assessment.count(),
        prisma.playbook.count(),
        prisma.research.count(),
        prisma.analyticsEvent.count(),
      ]);

      return {
        assessments: assessmentCount,
        playbooks: playbookCount,
        research: researchCount,
        analyticsEvents: analyticsCount,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Error retrieving database stats:", error);
      throw new Error("Failed to retrieve database statistics");
    }
  }

  /**
   * Clean up old analytics events
   */
  static async cleanupAnalytics(olderThanDays = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const result = await prisma.analyticsEvent.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate,
          },
        },
      });

      return { deletedCount: result.count, timestamp: new Date() };
    } catch (error) {
      console.error("Error cleaning up analytics:", error);
      throw new Error("Failed to cleanup analytics data");
    }
  }
}

export { prisma as default };