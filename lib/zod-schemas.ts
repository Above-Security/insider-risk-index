import { z } from "zod";

// Assessment-related schemas
export const AssessmentQuestionSchema = z.object({
  id: z.string(),
  pillarId: z.string(),
  question: z.string(),
  options: z.array(z.object({
    value: z.number(),
    label: z.string(),
    description: z.string().optional(),
  })),
  weight: z.number().min(0).max(1),
  explanation: z.string().optional(),
  matrixTechniques: z.array(z.string()).optional(),
});

export const AssessmentAnswerSchema = z.object({
  questionId: z.string(),
  value: z.number(),
  rationale: z.string().optional(),
});

export const AssessmentSubmissionSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  industry: z.string().min(1, "Industry is required"),
  employeeCount: z.enum(["1-50", "51-200", "201-1000", "1001-5000", "5000+"]),
  answers: z.array(AssessmentAnswerSchema),
  contactEmail: z.string().refine(
    (email) => email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    "Invalid email format"
  ).optional(),
  includeInBenchmarks: z.boolean().default(false),
});

// Pillar schemas
export const PillarSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  weight: z.number().min(0).max(1),
  color: z.string(),
  icon: z.string(),
  order: z.number(),
});

// Scoring schemas
export const ScoreBreakdownSchema = z.object({
  pillarId: z.string(),
  score: z.number().min(0).max(100),
  maxScore: z.number().min(0).max(100),
  weight: z.number().min(0).max(1),
  contributionToTotal: z.number().min(0).max(100),
});

export const AssessmentResultSchema = z.object({
  totalScore: z.number().min(0).max(100),
  level: z.number().min(1).max(5),
  levelDescription: z.string(),
  pillarBreakdown: z.array(ScoreBreakdownSchema),
  recommendations: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  benchmark: z.object({
    industry: z.number().min(0).max(100),
    companySize: z.number().min(0).max(100),
    overall: z.number().min(0).max(100),
  }),
});

// Content schemas
export const PlaybookSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  pillarId: z.string(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedTime: z.string(),
  tags: z.array(z.string()),
  content: z.string(),
  published: z.boolean().default(false),
  publishedAt: z.date().optional(),
  updatedAt: z.date(),
});

export const ResearchSchema = z.object({
  slug: z.string(),
  title: z.string(),
  abstract: z.string(),
  authors: z.array(z.string()),
  publishedAt: z.date(),
  tags: z.array(z.string()),
  category: z.enum(["whitepaper", "case-study", "survey", "analysis"]),
  content: z.string(),
  downloadUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
});

// SEO schemas
export const MetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
  openGraph: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url(),
    siteName: z.string(),
    images: z.array(z.object({
      url: z.string().url(),
      width: z.number(),
      height: z.number(),
      alt: z.string(),
    })),
    locale: z.string(),
    type: z.string(),
  }).optional(),
  twitter: z.object({
    card: z.string(),
    title: z.string(),
    description: z.string(),
    images: z.array(z.string().url()),
  }).optional(),
  jsonLd: z.record(z.string(), z.any()).optional(),
});

// Analytics schemas
export const AnalyticsEventSchema = z.object({
  name: z.string(),
  properties: z.record(z.string(), z.any()).optional(),
  timestamp: z.date().optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
});

export const BenchmarkDataSchema = z.object({
  industry: z.string(),
  companySize: z.string(),
  totalScore: z.number().min(0).max(100),
  pillarScores: z.record(z.string(), z.number()),
  timestamp: z.date(),
  region: z.string().optional(),
});

// PDF generation schemas
export const PDFConfigSchema = z.object({
  format: z.enum(["a4", "letter"]),
  orientation: z.enum(["portrait", "landscape"]),
  margins: z.object({
    top: z.string(),
    right: z.string(),
    bottom: z.string(),
    left: z.string(),
  }),
  includeCharts: z.boolean().default(true),
  includeBenchmarks: z.boolean().default(true),
  includeRecommendations: z.boolean().default(true),
});

// Form validation schemas
export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(1, "Company name is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  subscribe: z.boolean().default(false),
});

export const NewsletterSubscriptionSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  preferences: z.array(z.enum(["updates", "research", "playbooks", "industry-news"])).optional(),
});

// Type exports
export type AssessmentQuestion = z.infer<typeof AssessmentQuestionSchema>;
export type AssessmentAnswer = z.infer<typeof AssessmentAnswerSchema>;
export type AssessmentSubmission = z.infer<typeof AssessmentSubmissionSchema>;
export type Pillar = z.infer<typeof PillarSchema>;
export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>;
export type AssessmentResult = z.infer<typeof AssessmentResultSchema>;
export type Playbook = z.infer<typeof PlaybookSchema>;
export type Research = z.infer<typeof ResearchSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;
export type BenchmarkData = z.infer<typeof BenchmarkDataSchema>;
export type PDFConfig = z.infer<typeof PDFConfigSchema>;
export type ContactForm = z.infer<typeof ContactFormSchema>;
export type NewsletterSubscription = z.infer<typeof NewsletterSubscriptionSchema>;