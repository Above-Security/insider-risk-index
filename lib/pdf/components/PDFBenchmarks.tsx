import React from 'react';
import { BRAND_COLORS } from '../styles';
import { PDFCard, PDFGrid } from './PDFSection';

interface BenchmarkData {
  industry: number;
  companySize: number;
  overall: number;
}

interface ScoreData {
  totalScore: number;
  benchmark: BenchmarkData;
  pillarBreakdown: Array<{
    pillarId: string;
    score: number;
    weight: number;
  }>;
}

interface OrganizationInfo {
  industry: string;
  employeeCount: string;
}

interface PDFBenchmarksProps {
  scoreData: ScoreData;
  organizationInfo: OrganizationInfo;
}

/**
 * PDFBenchmarks - Industry and peer comparison analysis
 */
export function PDFBenchmarks({ scoreData, organizationInfo }: PDFBenchmarksProps) {
  const benchmarkComparisons = {
    industry: scoreData.totalScore - scoreData.benchmark.industry,
    companySize: scoreData.totalScore - scoreData.benchmark.companySize,
    overall: scoreData.totalScore - scoreData.benchmark.overall
  };

  const formatIndustry = (industry: string) => {
    return industry.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatEmployeeCount = (count: string) => {
    return count.replace(/_/g, '-');
  };

  return (
    <section className="benchmarks-section mb-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Industry Benchmarking</h2>
        </div>

        <div className="mb-6">
          <p className="text-slate-700">
            Your organization's performance compared to industry peers and market averages.
            These benchmarks are based on aggregated assessment data from organizations
            across various industries and company sizes.
          </p>
        </div>

        {/* Benchmark Comparison Cards */}
        <PDFGrid columns={3} gap="md" className="mb-6">
          {/* Industry Benchmark */}
          <PDFCard className="text-center">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 8a1 1 0 011-1h4a1 1 0 011 1v4H7v-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-slate-700">Industry Peer</span>
            </div>

            <div className="text-3xl font-bold text-slate-900 mb-2">
              {Math.round(scoreData.benchmark.industry)}
            </div>

            <div className="flex items-center justify-center gap-1 mb-2">
              {benchmarkComparisons.industry >= 0 ? (
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span className={`text-sm font-semibold ${benchmarkComparisons.industry >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {benchmarkComparisons.industry >= 0 ? '+' : ''}{Math.round(benchmarkComparisons.industry)}
              </span>
            </div>

            <div className="text-xs text-slate-500">
              vs {formatIndustry(organizationInfo.industry)}
            </div>
          </PDFCard>

          {/* Company Size Benchmark */}
          <PDFCard className="text-center">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span className="text-sm font-medium text-slate-700">Similar Size</span>
            </div>

            <div className="text-3xl font-bold text-slate-900 mb-2">
              {Math.round(scoreData.benchmark.companySize)}
            </div>

            <div className="flex items-center justify-center gap-1 mb-2">
              {benchmarkComparisons.companySize >= 0 ? (
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span className={`text-sm font-semibold ${benchmarkComparisons.companySize >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {benchmarkComparisons.companySize >= 0 ? '+' : ''}{Math.round(benchmarkComparisons.companySize)}
              </span>
            </div>

            <div className="text-xs text-slate-500">
              vs {formatEmployeeCount(organizationInfo.employeeCount)} orgs
            </div>
          </PDFCard>

          {/* Overall Market Benchmark */}
          <PDFCard className="text-center">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-slate-700">Market Average</span>
            </div>

            <div className="text-3xl font-bold text-slate-900 mb-2">
              {Math.round(scoreData.benchmark.overall)}
            </div>

            <div className="flex items-center justify-center gap-1 mb-2">
              {benchmarkComparisons.overall >= 0 ? (
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span className={`text-sm font-semibold ${benchmarkComparisons.overall >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {benchmarkComparisons.overall >= 0 ? '+' : ''}{Math.round(benchmarkComparisons.overall)}
              </span>
            </div>

            <div className="text-xs text-slate-500">
              vs global benchmark
            </div>
          </PDFCard>
        </PDFGrid>

        {/* Performance Insights */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-slate-900">Benchmark Insights</h3>
          <div className="space-y-2 text-sm text-slate-700">
            {benchmarkComparisons.industry > 5 && (
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <p>
                  <strong>Above industry average:</strong> Your organization performs significantly better
                  than typical {formatIndustry(organizationInfo.industry).toLowerCase()} organizations.
                </p>
              </div>
            )}
            {benchmarkComparisons.companySize > 5 && (
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <p>
                  <strong>Leading peer group:</strong> Your insider risk management capabilities
                  exceed those of similar-sized organizations.
                </p>
              </div>
            )}
            {benchmarkComparisons.overall < -5 && (
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                <p>
                  <strong>Improvement opportunity:</strong> There's significant potential to enhance
                  your insider risk posture relative to market leaders.
                </p>
              </div>
            )}
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
              <p>
                Benchmarks are updated quarterly based on assessment data from organizations
                worldwide, ensuring current and relevant comparisons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}