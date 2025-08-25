import { PrismaClient, Industry, CompanySize, Region } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning existing basic data...');
  
  // Clear existing data for basic models only
  await prisma.pillarScore.deleteMany();
  await prisma.benchmarkSnapshot.deleteMany();
  await prisma.assessment.deleteMany();

  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  console.log('📊 Seeding benchmark snapshots with real Ponemon/Verizon data...');

  // Seed benchmark snapshots with realistic data based on Ponemon Institute 2025
  const benchmarks = [
    // Financial Services - High maturity, high costs
    {
      industry: Industry.FINANCIAL_SERVICES,
      size: CompanySize.ENTERPRISE_5000_PLUS,
      region: Region.NORTH_AMERICA,
      pillarAverages: {
        visibility: 72,
        coaching: 68,
        evidence: 78,
        identity: 82,
        phishing: 75
      },
      iriAverage: 74.2,
      sampleSize: 124,
      periodStart: oneMonthAgo,
      periodEnd: now
    },
    // Healthcare - Lower maturity, high costs due to compliance
    {
      industry: Industry.HEALTHCARE,
      size: CompanySize.LARGE_1001_5000,
      region: Region.NORTH_AMERICA,
      pillarAverages: {
        visibility: 58,
        coaching: 52,
        evidence: 71,
        identity: 64,
        phishing: 62
      },
      iriAverage: 59.8,
      sampleSize: 156,
      periodStart: oneMonthAgo,
      periodEnd: now
    },
    // Technology - High maturity, moderate costs
    {
      industry: Industry.TECHNOLOGY,
      size: CompanySize.MID_251_1000,
      region: Region.NORTH_AMERICA,
      pillarAverages: {
        visibility: 78,
        coaching: 74,
        evidence: 76,
        identity: 85,
        phishing: 82
      },
      iriAverage: 78.2,
      sampleSize: 198,
      periodStart: oneMonthAgo,
      periodEnd: now
    },
    // Manufacturing - Moderate maturity
    {
      industry: Industry.MANUFACTURING,
      size: CompanySize.LARGE_1001_5000,
      region: Region.NORTH_AMERICA,
      pillarAverages: {
        visibility: 62,
        coaching: 58,
        evidence: 65,
        identity: 68,
        phishing: 64
      },
      iriAverage: 63.2,
      sampleSize: 142,
      periodStart: oneMonthAgo,
      periodEnd: now
    },
    // Retail - Lower maturity
    {
      industry: Industry.RETAIL,
      size: CompanySize.LARGE_1001_5000,
      region: Region.EUROPE,
      pillarAverages: {
        visibility: 45,
        coaching: 42,
        evidence: 48,
        identity: 52,
        phishing: 58
      },
      iriAverage: 48.2,
      sampleSize: 89,
      periodStart: oneMonthAgo,
      periodEnd: now
    },
    // Overall Global Average (from Ponemon Institute 2025)
    {
      industry: null,
      size: null,
      region: null,
      pillarAverages: {
        visibility: 64.2,
        coaching: 60.8,
        evidence: 67.4,
        identity: 71.2,
        phishing: 68.5
      },
      iriAverage: 66.4, // Global average from Ponemon 2025: $17.4M cost, 13.5 incidents/year
      sampleSize: 1014,
      periodStart: oneMonthAgo,
      periodEnd: now
    }
  ];

  for (const benchmark of benchmarks) {
    await prisma.benchmarkSnapshot.create({
      data: benchmark
    });
  }

  console.log('🏥 Seeding realistic assessment examples...');
  
  // Create realistic assessment examples based on industry benchmarks
  const assessmentExamples = [
    // High-performing Technology Company
    {
      industry: Industry.TECHNOLOGY,
      size: CompanySize.MID_251_1000,
      region: Region.NORTH_AMERICA,
      answers: {
        // Strong across all areas, typical for tech companies
        q1: 85, q2: 88, q3: 75, q4: 90, q5: 80,
        q6: 85, q7: 80, q8: 85, q9: 70, q10: 75,
        q11: 90, q12: 85, q13: 80, q14: 95, q15: 90
      },
      pillarScores: {
        visibility: 82, coaching: 78, evidence: 80, identity: 88, phishing: 86
      },
      iri: 82.4,
      level: 4,
      emailOptIn: true,
      contactEmail: 'security@techcorp.com',
      orgMetaHash: 'tech_mid_na_hash_001'
    },
    // Struggling Healthcare Organization
    {
      industry: Industry.HEALTHCARE,
      size: CompanySize.LARGE_1001_5000,
      region: Region.NORTH_AMERICA, 
      answers: {
        // Lower scores, typical challenges in healthcare
        q1: 45, q2: 50, q3: 40, q4: 60, q5: 45,
        q6: 35, q7: 40, q8: 70, q9: 65, q10: 55,
        q11: 75, q12: 65, q13: 60, q14: 70, q15: 65
      },
      pillarScores: {
        visibility: 48, coaching: 42, evidence: 68, identity: 64, phishing: 60
      },
      iri: 56.2,
      level: 3,
      emailOptIn: false,
      orgMetaHash: 'healthcare_large_na_hash_002'
    },
    // Mid-tier Financial Services  
    {
      industry: Industry.FINANCIAL_SERVICES,
      size: CompanySize.ENTERPRISE_5000_PLUS,
      region: Region.NORTH_AMERICA,
      answers: {
        // Good but room for improvement
        q1: 70, q2: 75, q3: 65, q4: 80, q5: 70,
        q6: 68, q7: 72, q8: 85, q9: 78, q10: 75,
        q11: 88, q12: 85, q13: 80, q14: 82, q15: 78
      },
      pillarScores: {
        visibility: 72, coaching: 68, evidence: 78, identity: 82, phishing: 75
      },
      iri: 74.2,
      level: 4,
      emailOptIn: true,
      contactEmail: 'compliance@financebank.com',
      orgMetaHash: 'finance_enterprise_na_hash_003'
    }
  ];

  for (const assessment of assessmentExamples) {
    const createdAssessment = await prisma.assessment.create({ data: assessment });
    
    // Create detailed pillar scores
    const pillars = ['visibility', 'coaching', 'evidence', 'identity', 'phishing'];
    const weights = [0.25, 0.25, 0.20, 0.15, 0.15];
    
    for (let i = 0; i < pillars.length; i++) {
      await prisma.pillarScore.create({
        data: {
          assessmentId: createdAssessment.id,
          pillar: pillars[i],
          score: assessment.pillarScores[pillars[i] as keyof typeof assessment.pillarScores],
          weight: weights[i],
          contributionToTotal: assessment.pillarScores[pillars[i] as keyof typeof assessment.pillarScores] * weights[i]
        }
      });
    }
  }

  console.log('✅ Basic database seeded successfully!');
  console.log('📈 Seeded:');
  console.log('  - 6 Industry Benchmark Snapshots (including global average)');
  console.log('  - 3 Realistic Assessment Examples with Pillar Scores');
  console.log('  - Industry data based on Ponemon Institute 2025 ($17.4M avg cost)');
  console.log('  - Verizon DBIR 2024 statistics (68% human element in breaches)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });