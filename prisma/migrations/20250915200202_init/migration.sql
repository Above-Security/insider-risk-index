-- CreateEnum
CREATE TYPE "public"."Industry" AS ENUM ('TECHNOLOGY', 'FINANCIAL_SERVICES', 'HEALTHCARE', 'RETAIL', 'MANUFACTURING', 'GOVERNMENT', 'EDUCATION', 'ENERGY', 'TELECOMMUNICATIONS', 'MEDIA_ENTERTAINMENT', 'TRANSPORTATION', 'HOSPITALITY', 'REAL_ESTATE', 'PROFESSIONAL_SERVICES', 'NON_PROFIT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."CompanySize" AS ENUM ('STARTUP_1_50', 'SMALL_51_250', 'MID_251_1000', 'LARGE_1001_5000', 'ENTERPRISE_5000_PLUS');

-- CreateEnum
CREATE TYPE "public"."Region" AS ENUM ('NORTH_AMERICA', 'SOUTH_AMERICA', 'EUROPE', 'ASIA_PACIFIC', 'MIDDLE_EAST', 'AFRICA', 'GLOBAL');

-- CreateEnum
CREATE TYPE "public"."MatrixCategory" AS ENUM ('MOTIVE', 'COERCION', 'MANIPULATION');

-- CreateTable
CREATE TABLE "public"."Assessment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationName" TEXT,
    "industry" "public"."Industry",
    "size" "public"."CompanySize",
    "region" "public"."Region",
    "orgMetaHash" TEXT,
    "answers" JSONB NOT NULL,
    "pillarScores" JSONB NOT NULL,
    "iri" DOUBLE PRECISION NOT NULL,
    "level" INTEGER NOT NULL,
    "emailOptIn" BOOLEAN NOT NULL DEFAULT false,
    "contactEmail" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BenchmarkSnapshot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "industry" "public"."Industry",
    "size" "public"."CompanySize",
    "region" "public"."Region",
    "pillarAverages" JSONB NOT NULL,
    "iriAverage" DOUBLE PRECISION NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BenchmarkSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PillarScore" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "pillar" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "contributionToTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PillarScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Playbook" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pillarId" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "estimatedTime" TEXT NOT NULL,
    "tags" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Playbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Research" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authors" TEXT[],
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "downloadUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Research_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "properties" JSONB NOT NULL DEFAULT '{}',
    "userId" TEXT,
    "sessionId" TEXT,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "newsletterSubscribed" BOOLEAN NOT NULL DEFAULT false,
    "preferences" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NewsletterSubscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "preferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NewsletterSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MatrixTechnique" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "techniqueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."MatrixCategory" NOT NULL,
    "tactics" TEXT[],
    "version" TEXT NOT NULL DEFAULT '1.0',
    "lastSyncAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatrixTechnique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MatrixPrevention" (
    "id" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "implementation" TEXT NOT NULL,
    "costLevel" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "effectiveness" INTEGER NOT NULL,
    "primaryPillar" TEXT NOT NULL,
    "secondaryPillars" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "MatrixPrevention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MatrixDetection" (
    "id" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dataSource" TEXT NOT NULL,
    "queryExample" TEXT,
    "falsePositiveRate" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "requiredTools" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "alternativeTools" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "primaryPillar" TEXT NOT NULL,

    CONSTRAINT "MatrixDetection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MatrixPillarMapping" (
    "id" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,
    "pillarId" TEXT NOT NULL,
    "relevanceScore" DOUBLE PRECISION NOT NULL,
    "impactWeight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MatrixPillarMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MatrixCaseStudy" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "techniqueId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "industry" "public"."Industry" NOT NULL,
    "companySize" "public"."CompanySize" NOT NULL,
    "impactDescription" TEXT NOT NULL,
    "costEstimate" TEXT,
    "timelineDays" INTEGER,
    "missedControls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "effectiveControls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lessonsLearned" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "anonymous" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MatrixCaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IndustryBenchmark" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "industry" "public"."Industry" NOT NULL,
    "region" "public"."Region",
    "avgAnnualCost" DOUBLE PRECISION NOT NULL,
    "avgIncidentCost" DOUBLE PRECISION NOT NULL,
    "avgIncidentsPerYear" DOUBLE PRECISION NOT NULL,
    "avgContainmentDays" INTEGER NOT NULL,
    "avgVisibilityScore" DOUBLE PRECISION NOT NULL,
    "avgCoachingScore" DOUBLE PRECISION NOT NULL,
    "avgEvidenceScore" DOUBLE PRECISION NOT NULL,
    "avgIdentityScore" DOUBLE PRECISION NOT NULL,
    "avgPhishingScore" DOUBLE PRECISION NOT NULL,
    "avgIRI" DOUBLE PRECISION NOT NULL,
    "sourceStudy" TEXT NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "confidenceLevel" DOUBLE PRECISION,
    "marginOfError" DOUBLE PRECISION,
    "reportYear" INTEGER NOT NULL,
    "dataCollectionStart" TIMESTAMP(3) NOT NULL,
    "dataCollectionEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndustryBenchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GlossaryTerm" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "term" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "longExplanation" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "difficulty" TEXT NOT NULL DEFAULT 'intermediate',
    "relatedTerms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "matrixTechniques" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pillarRelevance" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sources" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastReviewed" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrainingModule" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "content" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "pillarFocus" TEXT NOT NULL,
    "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coversTechniques" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "simulationScenarios" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TrainingModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RiskProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orgHash" TEXT NOT NULL,
    "industry" "public"."Industry" NOT NULL,
    "size" "public"."CompanySize" NOT NULL,
    "region" "public"."Region" NOT NULL,
    "initialIRI" DOUBLE PRECISION NOT NULL,
    "currentIRI" DOUBLE PRECISION NOT NULL,
    "improvementTrend" DOUBLE PRECISION NOT NULL,
    "lastAssessmentDate" TIMESTAMP(3) NOT NULL,
    "assessmentCount" INTEGER NOT NULL DEFAULT 1,
    "riskFactors" JSONB NOT NULL,
    "maturityProgression" JSONB NOT NULL,
    "projectedIRI" DOUBLE PRECISION,
    "riskTrendDirection" TEXT,

    CONSTRAINT "RiskProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."APIKey" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "keyHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rateLimitRpm" INTEGER NOT NULL DEFAULT 60,
    "rateLimitDaily" INTEGER NOT NULL DEFAULT 1000,
    "lastUsed" TIMESTAMP(3),
    "totalRequests" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "APIKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."APIUsage" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "apiKeyId" TEXT,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "responseStatus" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "requestSize" INTEGER,
    "responseSize" INTEGER,

    CONSTRAINT "APIUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DataSource" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "contactEmail" TEXT,
    "licenseType" TEXT NOT NULL,
    "attributionText" TEXT NOT NULL,
    "requiredCitation" TEXT NOT NULL,
    "logoUrl" TEXT,
    "updateFrequency" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "nextExpectedUpdate" TIMESTAMP(3),
    "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "peerReviewed" BOOLEAN NOT NULL DEFAULT false,
    "industryRecognized" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Assessment_createdAt_idx" ON "public"."Assessment"("createdAt");

-- CreateIndex
CREATE INDEX "Assessment_industry_idx" ON "public"."Assessment"("industry");

-- CreateIndex
CREATE INDEX "Assessment_size_idx" ON "public"."Assessment"("size");

-- CreateIndex
CREATE INDEX "Assessment_region_idx" ON "public"."Assessment"("region");

-- CreateIndex
CREATE INDEX "Assessment_level_idx" ON "public"."Assessment"("level");

-- CreateIndex
CREATE INDEX "Assessment_iri_idx" ON "public"."Assessment"("iri");

-- CreateIndex
CREATE INDEX "Assessment_orgMetaHash_idx" ON "public"."Assessment"("orgMetaHash");

-- CreateIndex
CREATE INDEX "BenchmarkSnapshot_industry_idx" ON "public"."BenchmarkSnapshot"("industry");

-- CreateIndex
CREATE INDEX "BenchmarkSnapshot_size_idx" ON "public"."BenchmarkSnapshot"("size");

-- CreateIndex
CREATE INDEX "BenchmarkSnapshot_region_idx" ON "public"."BenchmarkSnapshot"("region");

-- CreateIndex
CREATE INDEX "BenchmarkSnapshot_periodStart_idx" ON "public"."BenchmarkSnapshot"("periodStart");

-- CreateIndex
CREATE INDEX "PillarScore_assessmentId_idx" ON "public"."PillarScore"("assessmentId");

-- CreateIndex
CREATE INDEX "PillarScore_pillar_idx" ON "public"."PillarScore"("pillar");

-- CreateIndex
CREATE UNIQUE INDEX "Playbook_slug_key" ON "public"."Playbook"("slug");

-- CreateIndex
CREATE INDEX "Playbook_pillarId_idx" ON "public"."Playbook"("pillarId");

-- CreateIndex
CREATE INDEX "Playbook_published_idx" ON "public"."Playbook"("published");

-- CreateIndex
CREATE INDEX "Playbook_difficulty_idx" ON "public"."Playbook"("difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "Research_slug_key" ON "public"."Research"("slug");

-- CreateIndex
CREATE INDEX "Research_category_idx" ON "public"."Research"("category");

-- CreateIndex
CREATE INDEX "Research_featured_idx" ON "public"."Research"("featured");

-- CreateIndex
CREATE INDEX "Research_publishedAt_idx" ON "public"."Research"("publishedAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_timestamp_idx" ON "public"."AnalyticsEvent"("timestamp");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_name_idx" ON "public"."AnalyticsEvent"("name");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_idx" ON "public"."AnalyticsEvent"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_idx" ON "public"."AnalyticsEvent"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_email_key" ON "public"."NewsletterSubscription"("email");

-- CreateIndex
CREATE INDEX "NewsletterSubscription_email_idx" ON "public"."NewsletterSubscription"("email");

-- CreateIndex
CREATE INDEX "NewsletterSubscription_active_idx" ON "public"."NewsletterSubscription"("active");

-- CreateIndex
CREATE UNIQUE INDEX "MatrixTechnique_techniqueId_key" ON "public"."MatrixTechnique"("techniqueId");

-- CreateIndex
CREATE INDEX "MatrixTechnique_category_idx" ON "public"."MatrixTechnique"("category");

-- CreateIndex
CREATE INDEX "MatrixTechnique_techniqueId_idx" ON "public"."MatrixTechnique"("techniqueId");

-- CreateIndex
CREATE INDEX "MatrixTechnique_lastSyncAt_idx" ON "public"."MatrixTechnique"("lastSyncAt");

-- CreateIndex
CREATE INDEX "MatrixPrevention_techniqueId_idx" ON "public"."MatrixPrevention"("techniqueId");

-- CreateIndex
CREATE INDEX "MatrixPrevention_primaryPillar_idx" ON "public"."MatrixPrevention"("primaryPillar");

-- CreateIndex
CREATE INDEX "MatrixPrevention_effectiveness_idx" ON "public"."MatrixPrevention"("effectiveness");

-- CreateIndex
CREATE INDEX "MatrixDetection_techniqueId_idx" ON "public"."MatrixDetection"("techniqueId");

-- CreateIndex
CREATE INDEX "MatrixDetection_primaryPillar_idx" ON "public"."MatrixDetection"("primaryPillar");

-- CreateIndex
CREATE INDEX "MatrixDetection_dataSource_idx" ON "public"."MatrixDetection"("dataSource");

-- CreateIndex
CREATE INDEX "MatrixPillarMapping_pillarId_idx" ON "public"."MatrixPillarMapping"("pillarId");

-- CreateIndex
CREATE INDEX "MatrixPillarMapping_relevanceScore_idx" ON "public"."MatrixPillarMapping"("relevanceScore");

-- CreateIndex
CREATE UNIQUE INDEX "MatrixPillarMapping_techniqueId_pillarId_key" ON "public"."MatrixPillarMapping"("techniqueId", "pillarId");

-- CreateIndex
CREATE INDEX "MatrixCaseStudy_techniqueId_idx" ON "public"."MatrixCaseStudy"("techniqueId");

-- CreateIndex
CREATE INDEX "MatrixCaseStudy_industry_idx" ON "public"."MatrixCaseStudy"("industry");

-- CreateIndex
CREATE INDEX "MatrixCaseStudy_published_idx" ON "public"."MatrixCaseStudy"("published");

-- CreateIndex
CREATE INDEX "IndustryBenchmark_industry_idx" ON "public"."IndustryBenchmark"("industry");

-- CreateIndex
CREATE INDEX "IndustryBenchmark_reportYear_idx" ON "public"."IndustryBenchmark"("reportYear");

-- CreateIndex
CREATE INDEX "IndustryBenchmark_sourceStudy_idx" ON "public"."IndustryBenchmark"("sourceStudy");

-- CreateIndex
CREATE UNIQUE INDEX "IndustryBenchmark_industry_region_sourceStudy_reportYear_key" ON "public"."IndustryBenchmark"("industry", "region", "sourceStudy", "reportYear");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryTerm_term_key" ON "public"."GlossaryTerm"("term");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryTerm_slug_key" ON "public"."GlossaryTerm"("slug");

-- CreateIndex
CREATE INDEX "GlossaryTerm_category_idx" ON "public"."GlossaryTerm"("category");

-- CreateIndex
CREATE INDEX "GlossaryTerm_published_idx" ON "public"."GlossaryTerm"("published");

-- CreateIndex
CREATE INDEX "GlossaryTerm_featured_idx" ON "public"."GlossaryTerm"("featured");

-- CreateIndex
CREATE INDEX "GlossaryTerm_term_idx" ON "public"."GlossaryTerm"("term");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingModule_slug_key" ON "public"."TrainingModule"("slug");

-- CreateIndex
CREATE INDEX "TrainingModule_category_idx" ON "public"."TrainingModule"("category");

-- CreateIndex
CREATE INDEX "TrainingModule_pillarFocus_idx" ON "public"."TrainingModule"("pillarFocus");

-- CreateIndex
CREATE INDEX "TrainingModule_published_idx" ON "public"."TrainingModule"("published");

-- CreateIndex
CREATE INDEX "TrainingModule_difficulty_idx" ON "public"."TrainingModule"("difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "RiskProfile_orgHash_key" ON "public"."RiskProfile"("orgHash");

-- CreateIndex
CREATE INDEX "RiskProfile_industry_idx" ON "public"."RiskProfile"("industry");

-- CreateIndex
CREATE INDEX "RiskProfile_size_idx" ON "public"."RiskProfile"("size");

-- CreateIndex
CREATE INDEX "RiskProfile_currentIRI_idx" ON "public"."RiskProfile"("currentIRI");

-- CreateIndex
CREATE INDEX "RiskProfile_lastAssessmentDate_idx" ON "public"."RiskProfile"("lastAssessmentDate");

-- CreateIndex
CREATE UNIQUE INDEX "APIKey_keyHash_key" ON "public"."APIKey"("keyHash");

-- CreateIndex
CREATE INDEX "APIKey_active_idx" ON "public"."APIKey"("active");

-- CreateIndex
CREATE INDEX "APIKey_keyHash_idx" ON "public"."APIKey"("keyHash");

-- CreateIndex
CREATE INDEX "APIUsage_timestamp_idx" ON "public"."APIUsage"("timestamp");

-- CreateIndex
CREATE INDEX "APIUsage_apiKeyId_idx" ON "public"."APIUsage"("apiKeyId");

-- CreateIndex
CREATE INDEX "APIUsage_endpoint_idx" ON "public"."APIUsage"("endpoint");

-- CreateIndex
CREATE INDEX "APIUsage_responseStatus_idx" ON "public"."APIUsage"("responseStatus");

-- CreateIndex
CREATE UNIQUE INDEX "DataSource_name_key" ON "public"."DataSource"("name");

-- CreateIndex
CREATE INDEX "DataSource_type_idx" ON "public"."DataSource"("type");

-- CreateIndex
CREATE INDEX "DataSource_active_idx" ON "public"."DataSource"("active");

-- CreateIndex
CREATE INDEX "DataSource_lastUpdated_idx" ON "public"."DataSource"("lastUpdated");

-- AddForeignKey
ALTER TABLE "public"."PillarScore" ADD CONSTRAINT "PillarScore_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "public"."Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatrixPrevention" ADD CONSTRAINT "MatrixPrevention_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "public"."MatrixTechnique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatrixDetection" ADD CONSTRAINT "MatrixDetection_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "public"."MatrixTechnique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatrixPillarMapping" ADD CONSTRAINT "MatrixPillarMapping_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "public"."MatrixTechnique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatrixCaseStudy" ADD CONSTRAINT "MatrixCaseStudy_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "public"."MatrixTechnique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."APIUsage" ADD CONSTRAINT "APIUsage_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "public"."APIKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
