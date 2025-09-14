import React from 'react';
import { BRAND_COLORS, RISK_LEVEL_COLORS, PILLAR_COLORS } from '../styles';
import { PDFCard, PDFGrid, PDFFlexBox } from './PDFSection';

interface ScoreData {
  totalScore: number;
  level: number;
  levelDescription: string;
  pillarBreakdown: Array<{
    pillarId: string;
    score: number;
    weight: number;
    contributionToTotal: number;
  }>;
  benchmark: {
    industry: number;
    companySize: number;
    overall: number;
  };
}

interface PDFScoreProps {
  scoreData: ScoreData;
  organizationInfo: {
    industry: string;
    employeeCount: string;
  };
}

/**
 * PDFScore - Main score display with risk level and benchmarks
 */
export function PDFScore({ scoreData, organizationInfo }: PDFScoreProps) {
  const getRiskLevel = (score: number) => {
    if (score <= 24) return { level: 1, name: 'Ad Hoc', color: RISK_LEVEL_COLORS[1] };
    if (score <= 44) return { level: 2, name: 'Emerging', color: RISK_LEVEL_COLORS[2] };
    if (score <= 64) return { level: 3, name: 'Managed', color: RISK_LEVEL_COLORS[3] };
    if (score <= 84) return { level: 4, name: 'Proactive', color: RISK_LEVEL_COLORS[4] };
    return { level: 5, name: 'Optimized', color: RISK_LEVEL_COLORS[5] };
  };

  const riskLevel = getRiskLevel(scoreData.totalScore);

  const benchmarkComparisons = {
    industry: scoreData.totalScore - scoreData.benchmark.industry,
    companySize: scoreData.totalScore - scoreData.benchmark.companySize,
    overall: scoreData.totalScore - scoreData.benchmark.overall
  };

  return (
    <div className="pdf-score mb-8">
      {/* Main Score Display */}
      <PDFCard className="text-center mb-6" padding="lg">
        <div className="mb-4">
          <div
            className="text-6xl font-extrabold mb-2"
            style={{ color: riskLevel.color }}
          >
            {Math.round(scoreData.totalScore)}
          </div>
          <div className="text-2xl text-slate-600 font-medium">
            out of 100
          </div>
        </div>

        <div
          className="inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-4"
          style={{ backgroundColor: riskLevel.color }}
        >
          Level {riskLevel.level}: {riskLevel.name}
        </div>

        <p className="text-slate-600 text-lg">
          Your Insider Risk Index Score
        </p>
      </PDFCard>

      {/* Benchmark Comparisons */}
      <PDFGrid columns={3} gap="md" className="mb-6">
        <PDFCard>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 8a1 1 0 011-1h4a1 1 0 011 1v4H7v-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-slate-600">Industry Average</span>
            </div>

            <div className="text-3xl font-bold text-slate-900 mb-1">
              {Math.round(scoreData.benchmark.industry)}
            </div>

            <div className="flex items-center justify-center gap-1">
              {benchmarkComparisons.industry >= 0 ? (
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span
                className={`text-sm font-semibold ${
                  benchmarkComparisons.industry >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {benchmarkComparisons.industry >= 0 ? '+' : ''}
                {Math.round(benchmarkComparisons.industry)}
              </span>
            </div>

            <div className="text-xs text-slate-500 mt-2">
              vs {organizationInfo.industry.replace(/_/g, ' ')} sector
            </div>
          </div>
        </PDFCard>

        <PDFCard>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span className="text-sm font-medium text-slate-600">Company Size</span>
            </div>

            <div className="text-3xl font-bold text-slate-900 mb-1">
              {Math.round(scoreData.benchmark.companySize)}
            </div>

            <div className="flex items-center justify-center gap-1">
              {benchmarkComparisons.companySize >= 0 ? (
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span
                className={`text-sm font-semibold ${
                  benchmarkComparisons.companySize >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {benchmarkComparisons.companySize >= 0 ? '+' : ''}
                {Math.round(benchmarkComparisons.companySize)}
              </span>
            </div>

            <div className="text-xs text-slate-500 mt-2">
              vs {organizationInfo.employeeCount.replace(/_/g, '-')} companies
            </div>
          </div>
        </PDFCard>

        <PDFCard>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-slate-600">Overall Average</span>
            </div>

            <div className="text-3xl font-bold text-slate-900 mb-1">
              {Math.round(scoreData.benchmark.overall)}
            </div>

            <div className="flex items-center justify-center gap-1">
              {benchmarkComparisons.overall >= 0 ? (
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span
                className={`text-sm font-semibold ${
                  benchmarkComparisons.overall >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {benchmarkComparisons.overall >= 0 ? '+' : ''}
                {Math.round(benchmarkComparisons.overall)}
              </span>
            </div>

            <div className="text-xs text-slate-500 mt-2">
              vs global benchmark
            </div>
          </div>
        </PDFCard>
      </PDFGrid>
    </div>
  );
}

/**
 * PDFPillarBreakdown - Detailed breakdown of pillar scores
 */
export function PDFPillarBreakdown({ scoreData }: { scoreData: ScoreData }) {
  const getPillarName = (pillarId: string) => {
    const names = {
      'visibility': 'Visibility & Monitoring',
      'prevention-coaching': 'Prevention & Coaching',
      'coaching': 'Prevention & Coaching',
      'investigation-evidence': 'Investigation & Evidence',
      'evidence': 'Investigation & Evidence',
      'identity-saas': 'Identity & SaaS Security',
      'identity': 'Identity & SaaS Security',
      'phishing-resilience': 'Phishing Resilience',
      'phishing': 'Phishing Resilience'
    };
    return names[pillarId as keyof typeof names] || pillarId;
  };

  return (
    <PDFCard className="pillar-breakdown">
      <h4 className="text-xl font-bold mb-6 text-slate-900">Security Pillar Breakdown</h4>

      <PDFGrid columns={1} gap="md">
        {scoreData.pillarBreakdown.map((pillar, index) => (
          <div key={`pillar-${pillar.pillarId || index}-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4 flex-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: PILLAR_COLORS[pillar.pillarId as keyof typeof PILLAR_COLORS] }}
              />
              <div>
                <div className="font-semibold text-slate-900">
                  {getPillarName(pillar.pillarId)}
                </div>
                <div className="text-sm text-slate-500">
                  Weight: {Math.round(pillar.weight * 100)}% • Contribution: {pillar.contributionToTotal?.toFixed(1) || '0.0'} points
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className="text-2xl font-bold"
                style={{ color: PILLAR_COLORS[pillar.pillarId as keyof typeof PILLAR_COLORS] }}
              >
                {Math.round(pillar.score)}
              </div>
              <div className="text-sm text-slate-500">/ 100</div>
            </div>
          </div>
        ))}
      </PDFGrid>
    </PDFCard>
  );
}

export default PDFScore;