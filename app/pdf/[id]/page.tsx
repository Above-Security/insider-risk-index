import { Suspense } from 'react';
import { getAssessmentResults } from '@/app/actions/assessment';
import { PDFDocument } from '@/lib/pdf/components/PDFDocument';
import { PDFScore, PDFPillarBreakdown } from '@/lib/pdf/components/PDFScore';
import { PDFRecommendations } from '@/lib/pdf/components/PDFRecommendations';
import { PDFBenchmarks } from '@/lib/pdf/components/PDFBenchmarks';
import { PDFHeader } from '@/lib/pdf/components/PDFHeader';
import { PDFFooter } from '@/lib/pdf/components/PDFFooter';
import { PILLARS } from '@/lib/pillars';
import { notFound } from 'next/navigation';

interface PDFPageProps {
  params: Promise<{ id: string }>;
}

export default async function PDFPage({ params }: PDFPageProps) {
  const { id } = await params;

  // Fetch assessment data
  const response = await getAssessmentResults(id);

  if (!response.success || !response.assessment) {
    notFound();
  }

  const { assessment, benchmarks } = response;

  // Transform data for PDF components
  const organizationInfo = {
    name: assessment.industry ?
      assessment.industry.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) :
      'Organization',
    industry: assessment.industry || 'UNKNOWN',
    employeeCount: assessment.size || 'UNKNOWN',
  };

  const scoreData = {
    totalScore: assessment.iri,
    level: assessment.level,
    levelDescription: getLevelDescription(assessment.level),
    pillarBreakdown: assessment.pillarBreakdown.map(pb => ({
      pillarId: pb.pillar,
      score: pb.score,
      weight: pb.weight,
      contributionToTotal: pb.contributionToTotal
    })),
    benchmark: {
      industry: benchmarks?.industry?.iriAverage || 64.2,
      companySize: benchmarks?.size?.iriAverage || 64.2,
      overall: benchmarks?.overall?.iriAverage || 64.2
    }
  };

  // Generate comprehensive recommendations
  const recommendations = generateRecommendations(scoreData.pillarBreakdown);

  // Get strengths and weaknesses
  const { strengths, weaknesses } = analyzePerformance(scoreData.pillarBreakdown);

  return (
    <PDFDocument
      title={`Insider Risk Assessment - ${organizationInfo.name}`}
      className="comprehensive-report"
    >
      {/* Header Section */}
      <PDFHeader
        organizationName={organizationInfo.name}
        industry={organizationInfo.industry}
        employeeCount={organizationInfo.employeeCount}
        generatedAt={new Date()}
      />

      {/* Executive Summary */}
      <section className="executive-summary mb-8 page-break-inside-avoid">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Executive Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800">Assessment Overview</h3>
              <p className="text-slate-700 mb-4">
                This comprehensive insider risk assessment evaluates your organization's security posture
                across five critical pillars of insider threat management. The assessment provides actionable
                insights based on industry best practices and benchmarking data.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Industry:</span>
                  <span className="font-medium">{organizationInfo.industry.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Company Size:</span>
                  <span className="font-medium">{organizationInfo.employeeCount.replace(/_/g, '-')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Assessment Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800">Key Findings</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-md">
                  <div className="text-sm text-slate-600">Overall Risk Index</div>
                  <div className="text-2xl font-bold text-slate-900">{Math.round(scoreData.totalScore)}/100</div>
                  <div className="text-sm font-medium" style={{ color: getRiskLevelColor(scoreData.totalScore) }}>
                    {scoreData.levelDescription}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-slate-600">Top Strength</div>
                    <div className="font-medium text-green-700">{strengths[0]}</div>
                  </div>
                  <div>
                    <div className="text-slate-600">Priority Area</div>
                    <div className="font-medium text-orange-600">{weaknesses[0]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Score Section */}
      <PDFScore
        scoreData={scoreData}
        organizationInfo={organizationInfo}
      />

      {/* Detailed Pillar Analysis */}
      <section className="pillar-analysis mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Detailed Security Pillar Analysis</h2>

          <PDFPillarBreakdown scoreData={scoreData} />

          {/* Individual Pillar Insights */}
          <div className="mt-6 space-y-4">
            {scoreData.pillarBreakdown.map((pillar, index) => {
              const pillarInfo = PILLARS.find(p => p.id === pillar.pillarId);
              return (
                <div key={pillar.pillarId} className="border-l-4 pl-4"
                     style={{ borderLeftColor: getPillarColor(pillar.pillarId) }}>
                  <h4 className="font-semibold text-slate-900">{pillarInfo?.name || pillar.pillarId}</h4>
                  <p className="text-sm text-slate-600 mb-2">{pillarInfo?.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-700">Score: <strong>{Math.round(pillar.score)}/100</strong></span>
                    <span className="text-slate-700">Weight: <strong>{Math.round(pillar.weight * 100)}%</strong></span>
                    <span className="text-slate-700">Contribution: <strong>{pillar.contributionToTotal.toFixed(1)} points</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industry Benchmarking */}
      <PDFBenchmarks
        scoreData={scoreData}
        organizationInfo={organizationInfo}
      />

      {/* Comprehensive Recommendations */}
      <section className="recommendations mb-8">
        <PDFRecommendations
          recommendations={recommendations}
          pillarScores={scoreData.pillarBreakdown}
        />
      </section>

      {/* Implementation Roadmap */}
      <section className="implementation-roadmap mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">90-Day Implementation Roadmap</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-800">Phase 1: Immediate Actions (Days 1-30)</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Address critical security gaps identified in lowest-scoring pillar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Implement basic monitoring and alerting mechanisms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Conduct stakeholder awareness sessions</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-800">Phase 2: Foundation Building (Days 31-60)</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Deploy comprehensive monitoring tools and dashboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Establish formal incident response procedures</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Launch employee training and awareness programs</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-800">Phase 3: Optimization (Days 61-90)</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Fine-tune detection algorithms and reduce false positives</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Conduct tabletop exercises and scenario testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Establish continuous improvement metrics and KPIs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="next-steps mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Recommended Next Steps</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-slate-900">Prioritize High-Impact Improvements</h3>
                <p className="text-slate-700 text-sm">Focus on recommendations that address your lowest-scoring pillars first, as these represent the greatest risk exposure.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-slate-900">Establish Measurement Framework</h3>
                <p className="text-slate-700 text-sm">Implement regular assessment cycles to track progress and ensure continuous improvement of your insider risk posture.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-slate-900">Engage Stakeholders</h3>
                <p className="text-slate-700 text-sm">Share these findings with executive leadership and department heads to ensure organization-wide commitment to improvement initiatives.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PDFFooter />
    </PDFDocument>
  );
}

// Helper functions
function getLevelDescription(level: number): string {
  const levels = {
    1: 'Ad Hoc - Minimal controls in place',
    2: 'Emerging - Basic framework established',
    3: 'Managed - Standard processes implemented',
    4: 'Proactive - Advanced capabilities deployed',
    5: 'Optimized - Industry-leading practices'
  };
  return levels[level as keyof typeof levels] || 'Unknown Level';
}

function getRiskLevelColor(score: number): string {
  if (score <= 24) return '#dc2626'; // red-600
  if (score <= 44) return '#ea580c'; // orange-600
  if (score <= 64) return '#ca8a04'; // yellow-600
  if (score <= 84) return '#16a34a'; // green-600
  return '#059669'; // emerald-600
}

function getPillarColor(pillarId: string): string {
  const colors = {
    visibility: '#3b82f6',     // blue-500
    coaching: '#10b981',       // emerald-500
    evidence: '#f59e0b',       // amber-500
    identity: '#8b5cf6',       // violet-500
    phishing: '#ec4899'        // pink-500
  };
  return colors[pillarId as keyof typeof colors] || '#6b7280';
}

function generateRecommendations(pillars: any[]) {
  const sortedPillars = [...pillars].sort((a, b) => a.score - b.score);
  const lowestPillar = sortedPillars[0];

  const baseRecommendations = [
    {
      id: `${lowestPillar.pillarId}-priority`,
      pillarId: lowestPillar.pillarId,
      title: `Strengthen ${getPillarName(lowestPillar.pillarId)} Capabilities`,
      description: `Address critical gaps in ${getPillarName(lowestPillar.pillarId).toLowerCase()} to improve overall security posture.`,
      priority: 'high' as const,
      difficulty: 'moderate' as const,
      timeToImplement: '4-8 weeks',
      estimatedImpact: 85
    }
  ];

  return baseRecommendations;
}

function getPillarName(pillarId: string): string {
  const names = {
    visibility: 'Visibility & Monitoring',
    coaching: 'Prevention & Coaching',
    evidence: 'Investigation & Evidence',
    identity: 'Identity & SaaS Security',
    phishing: 'Phishing Resilience'
  };
  return names[pillarId as keyof typeof names] || pillarId;
}

function analyzePerformance(pillars: any[]) {
  const sorted = [...pillars].sort((a, b) => b.score - a.score);

  const strengths = sorted.slice(0, 2).map(p => getPillarName(p.pillarId));
  const weaknesses = sorted.slice(-2).map(p => getPillarName(p.pillarId));

  return { strengths, weaknesses };
}