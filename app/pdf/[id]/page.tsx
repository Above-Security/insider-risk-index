import { getAssessmentResults } from '@/app/actions/assessment';
import { PILLARS } from '@/lib/pillars';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Shield, BarChart3, BookOpen, Search, FileText } from 'lucide-react';
import { mapAssessmentToMatrix, generateThreatIntelligenceSummary } from '@/lib/matrix-mapping';

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

  // Helper function to format company size
  const formatCompanySize = (size: string | null) => {
    if (!size) return "Unknown";

    const sizeMap: Record<string, string> = {
      'STARTUP_1_50': '1-50 employees',
      'SMALL_51_250': '51-250 employees',
      'MID_251_1000': '251-1,000 employees',
      'LARGE_1001_5000': '1,001-5,000 employees',
      'ENTERPRISE_5000_PLUS': '5,000+ employees'
    };

    return sizeMap[size] || "Unknown";
  };

  // Format data (organizationName might not exist on the type yet)
  const organizationName = (assessment as any).organizationName || 'Your Organization';
  const industry = assessment.industry?.replace(/_/g, ' ') || 'Unknown';
  const size = formatCompanySize(assessment.size);
  const level = assessment.level || 1;
  const iri = Math.round(assessment.iri || 0);

  const levelNames: Record<number, string> = {
    1: 'Ad Hoc',
    2: 'Emerging',
    3: 'Managed',
    4: 'Proactive',
    5: 'Optimized'
  };

  const levelColors: Record<number, string> = {
    1: '#D13366', // Above rose-950
    2: '#FF7E54', // Above peach-900
    3: '#68ADFF', // Above blue-900
    4: '#22C55E', // Green
    5: '#10B981'  // Emerald
  };

  // Get pillar scores - convert from pillarScores JSON to expected format
  const pillarScores = assessment.pillarBreakdown && assessment.pillarBreakdown.length > 0
    ? assessment.pillarBreakdown
    : Object.entries(assessment.pillarScores as Record<string, number> || {}).map(([pillar, score]) => ({
        pillar,
        score,
        weight: PILLARS.find(p => p.id === pillar)?.weight || 0.2,
        contributionToTotal: score * (PILLARS.find(p => p.id === pillar)?.weight || 0.2)
      }));

  // Generate Matrix mapping and threat intelligence
  const matrixMapping = await mapAssessmentToMatrix(pillarScores, iri);
  const threatIntelligence = generateThreatIntelligenceSummary(matrixMapping, iri);

  return (
    <main className="pdf-page bg-gradient-to-br from-above-peach-50 via-above-white to-above-lavender-50 min-h-screen">
      {/* Header Section - Fixed layout with overflow protection */}
      <header className="grainy-gradient-subtle">
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            {/* Main Content - 3 columns */}
            <div className="lg:col-span-3 space-y-4">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-above-rose-100/80 text-above-rose-800 border border-above-rose-200 px-3 py-1.5 rounded-full text-xs font-semibold w-fit">
                <Shield className="h-3 w-3 text-above-rose-700 flex-shrink-0" />
                <span className="whitespace-nowrap">Assessment Report</span>
              </div>

              {/* Title - constrained width */}
              <div className="space-y-3 max-w-xl">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight break-words">
                  {organizationName ? `${organizationName} - Insider Risk Assessment` : 'Insider Risk Assessment'}
                </h1>
                <p className="text-base text-slate-700 leading-relaxed">
                  Security Posture Analysis
                </p>
              </div>

              {/* Organization tags - force wrap */}
              <div className="flex flex-wrap gap-2 max-w-md">
                <span className="bg-above-rose-100/80 text-above-rose-900 px-2 py-1 rounded-md font-medium text-xs whitespace-nowrap">
                  {industry?.substring(0, 15)}
                </span>
                <span className="bg-above-blue-100/80 text-above-blue-900 px-2 py-1 rounded-md font-medium text-xs whitespace-nowrap">
                  {size}
                </span>
                <span className="bg-above-peach-100/80 text-above-peach-900 px-2 py-1 rounded-md font-medium text-xs whitespace-nowrap">
                  Level {level}
                </span>
              </div>

              {/* Above Security sponsorship - prominent */}
              <div className="bg-white rounded-lg p-4 border-2 border-slate-900 shadow-lg max-w-md">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-900 font-bold whitespace-nowrap">Sponsored by</span>
                  <div className="flex-shrink-0">
                    <Image
                      src="/above-logo-with-text.png"
                      alt="Above Security"
                      width={160}
                      height={53}
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Report Card - 2 columns with max width */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 border border-above-rose-200 rounded-xl p-4 shadow-soft-lg max-w-xs mx-auto lg:mx-0">

                {/* Card Header - compact */}
                <div className="text-center mb-4 pb-3 border-b border-above-rose-100">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">
                    Assessment Summary
                  </h3>
                  <p className="text-xs text-slate-600">Risk Profile</p>
                </div>

                {/* Report Details - constrained */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-0.5">
                        Industry
                      </p>
                      <p className="font-semibold text-slate-900 text-xs truncate">
                        {industry}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-0.5">
                        Size
                      </p>
                      <p className="font-semibold text-slate-900 text-xs truncate">
                        {size}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-0.5">
                        Level
                      </p>
                      <p className="font-semibold text-slate-900 text-xs">
                        {levelNames[level]}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-0.5">
                        Date
                      </p>
                      <p className="font-semibold text-slate-900 text-xs">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-above-rose-100">
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-0.5">
                      Report ID
                    </p>
                    <p className="font-mono text-xs text-slate-700 break-all">
                      {id.substring(0, 8)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Executive Summary Section */}
      <section className="py-12 bg-above-white">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Executive Summary</h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Assessment results benchmarked against industry peers and global standards
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Score Card - constrained */}
            <div className="bg-gradient-to-br from-above-rose-50 to-above-peach-50 border border-above-rose-200 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Risk Index Score</h3>
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-2 mb-3">
                    <span className="text-5xl font-bold" style={{ color: levelColors[level] }}>
                      {iri}
                    </span>
                    <span className="text-xl text-slate-500">/100</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold mb-1" style={{ color: levelColors[level] }}>
                      {levelNames[level]}
                    </p>
                    <p className="text-sm text-slate-600">Level {level} of 5</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  <strong>{levelNames[level].toLowerCase()}</strong> approach to insider risk management.
                </p>
              </div>
            </div>

            {/* Benchmark Comparison - constrained */}
            <div className="bg-gradient-to-br from-above-blue-50 to-above-lavender-50 border border-above-blue-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Benchmarking</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-above-white rounded-lg border border-above-blue-200">
                  <span className="text-slate-700 font-medium text-sm">Your Score</span>
                  <span className="text-lg font-bold text-above-rose-700">{iri}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-above-white/70 rounded-lg">
                  <span className="text-slate-600 text-sm truncate">Industry Avg</span>
                  <span className="text-base font-semibold text-slate-700">{Math.round(benchmarks?.industry?.iriAverage || 65)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-above-white/70 rounded-lg">
                  <span className="text-slate-600 text-sm">Global Avg</span>
                  <span className="text-base font-semibold text-slate-700">{Math.round(benchmarks?.overall?.iriAverage || 64)}</span>
                </div>
                <div className="mt-3 p-3 rounded-lg border" style={{
                  borderColor: iri > (benchmarks?.industry?.iriAverage || 65) ? '#22C55E' : '#FF7E54',
                  backgroundColor: iri > (benchmarks?.industry?.iriAverage || 65) ? '#F0FDF4' : '#FFF8F5'
                }}>
                  <p className="text-center font-medium text-sm" style={{
                    color: iri > (benchmarks?.industry?.iriAverage || 65) ? '#15803D' : '#C2410C'
                  }}>
                    {iri > (benchmarks?.industry?.iriAverage || 65)
                      ? '✓ Above Average'
                      : '⚠ Below Average'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Dashboard - constrained */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-above-white border-l-4 border-above-rose-700 rounded-lg p-4 shadow-md">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-1">Level</p>
              <p className="text-xl font-bold text-above-rose-700 truncate">{levelNames[level]}</p>
            </div>
            <div className="bg-above-white border-l-4 border-above-blue-700 rounded-lg p-4 shadow-md">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-1">Score</p>
              <p className="text-xl font-bold text-above-blue-800">{iri}%</p>
            </div>
            <div className="bg-above-white border-l-4 border-green-500 rounded-lg p-4 shadow-md">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-1">Strengths</p>
              <p className="text-xl font-bold text-green-700">{pillarScores.filter(p => p.score > 70).length}</p>
              <p className="text-xs text-slate-600">Strong</p>
            </div>
            <div className="bg-above-white border-l-4 border-above-peach-700 rounded-lg p-4 shadow-md">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-1">Focus</p>
              <p className="text-xl font-bold text-above-peach-800">{pillarScores.filter(p => p.score < 50).length}</p>
              <p className="text-xs text-slate-600">Areas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Pillars Analysis */}
      <section className="py-12 bg-gradient-to-br from-above-lavender-50 to-above-blue-50">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Pillar Analysis</h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Performance across five critical insider risk management pillars
            </p>
          </div>

          <div className="space-y-6">
            {PILLARS.map((pillar, index) => {
              const score = pillarScores.find(ps => ps.pillar === pillar.id);
              const scoreValue = score?.score || 0;
              const weight = score?.weight || pillar.weight;
              const contribution = score?.contributionToTotal || 0;

              const pillarColor = scoreValue > 70 ? '#22C55E' : scoreValue > 40 ? '#FF7E54' : '#D13366';

              const pillarStyles = [
                { bg: 'bg-above-rose-50', border: 'border-above-rose-200', accent: 'bg-above-rose-100', text: 'text-above-rose-800' },
                { bg: 'bg-above-blue-50', border: 'border-above-blue-200', accent: 'bg-above-blue-100', text: 'text-above-blue-800' },
                { bg: 'bg-above-peach-50', border: 'border-above-peach-200', accent: 'bg-above-peach-100', text: 'text-above-peach-800' },
                { bg: 'bg-above-lavender-50', border: 'border-above-lavender-200', accent: 'bg-above-lavender-100', text: 'text-above-lavender-800' },
                { bg: 'bg-red-50', border: 'border-red-200', accent: 'bg-red-100', text: 'text-red-800' }
              ];
              const style = pillarStyles[index];

              return (
                <div key={pillar.id} className={`${style.bg} ${style.border} border rounded-xl p-6 shadow-lg`}>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-3">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-br from-white to-slate-100 rounded-full border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-slate-900 mb-2 break-words">{pillar.name}</h3>
                          <div className={`inline-block px-2 py-1 ${style.accent} ${style.text} text-xs font-bold rounded-full border ${style.border} mb-3`}>
                            {Math.round(weight * 100)}% Weight
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed mb-4 break-words">{pillar.description?.substring(0, 150)}...</p>
                        </div>
                      </div>

                      {/* Progress Bar - constrained */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-slate-600">Performance</span>
                          <span className="text-sm font-bold" style={{ color: pillarColor }}>
                            {Math.round(scoreValue)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-4">
                          <div
                            className="h-4 rounded-full"
                            style={{
                              width: `${Math.max(scoreValue, 5)}%`,
                              backgroundColor: pillarColor
                            }}
                          />
                        </div>
                      </div>

                      {/* Status Indicator - compact */}
                      <div>
                        {scoreValue < 50 && (
                          <div className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium border border-red-200 w-fit">
                            ⚠️ Critical
                          </div>
                        )}
                        {scoreValue >= 50 && scoreValue < 70 && (
                          <div className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium border border-orange-200 w-fit">
                            📊 Moderate
                          </div>
                        )}
                        {scoreValue >= 70 && (
                          <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium border border-green-200 w-fit">
                            ✅ Strong
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-1 text-center">
                      <div className="text-3xl font-bold mb-1" style={{ color: pillarColor }}>
                        {Math.round(scoreValue)}
                      </div>
                      <p className="text-xs text-slate-500">
                        {contribution.toFixed(1)} pts
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Threat Intelligence & Matrix Integration - Simplified */}
      <section className="py-12 bg-gradient-to-br from-above-peach-50 to-above-rose-50">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Threat Intelligence</h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Assessment mapped to real-world threat techniques and defensive measures
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Risk Level Assessment */}
            <div className="bg-white/90 border border-above-rose-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Risk Assessment</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-4 h-4 rounded-full ${
                  threatIntelligence.riskLevel === 'High' ? 'bg-red-500' :
                  threatIntelligence.riskLevel === 'Medium' ? 'bg-yellow-500' :
                  threatIntelligence.riskLevel === 'Medium-Low' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <span className="font-semibold text-slate-900">{threatIntelligence.riskLevel} Risk</span>
              </div>
              <p className="text-sm text-slate-600">{threatIntelligence.summary}</p>
            </div>

            {/* Top Threat Techniques */}
            <div className="bg-white/90 border border-above-blue-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Relevant Threat Techniques</h3>
              <div className="space-y-2">
                {threatIntelligence.topTechniques.length > 0 ? (
                  threatIntelligence.topTechniques.slice(0, 4).map((technique, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-above-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">{technique}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-600">
                    Your strong security posture mitigates most common insider threat techniques.
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Playbooks */}
            <div className="bg-white/90 border border-above-peach-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Implementation Playbooks</h3>
              <div className="space-y-2">
                {matrixMapping.recommendedPlaybooks.map((playbook, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-above-peach-500 rounded-full"></div>
                    <span className="text-sm text-slate-700">{playbook}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Recommendations */}
            <div className="bg-white/90 border border-above-lavender-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Priority Actions</h3>
              <div className="space-y-2">
                {threatIntelligence.keyRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-above-lavender-500 rounded-full"></div>
                    <span className="text-sm text-slate-700">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-above-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Additional Resources</h2>
              <p className="text-lg text-slate-600">
                Comprehensive tools and insights to strengthen your insider risk program
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-above-rose-50 to-above-peach-50 rounded-xl p-6 border border-above-rose-200 text-center">
                <div className="w-12 h-12 bg-above-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-above-rose-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Benchmarks</h3>
                <p className="text-sm text-slate-600 mb-4">Industry comparisons and peer analysis</p>
                <a href="https://insiderisk.io/benchmarks" target="_blank" rel="noopener noreferrer"
                   className="inline-block bg-white rounded px-3 py-2 text-xs font-mono text-above-rose-700 border hover:bg-above-rose-50 transition-colors">
                  insiderisk.io/benchmarks
                </a>
              </div>

              <div className="bg-gradient-to-br from-above-blue-50 to-above-lavender-50 rounded-xl p-6 border border-above-blue-200 text-center">
                <div className="w-12 h-12 bg-above-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-above-blue-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Glossary</h3>
                <p className="text-sm text-slate-600 mb-4">Security terminology and definitions</p>
                <a href="https://insiderisk.io/glossary" target="_blank" rel="noopener noreferrer"
                   className="inline-block bg-white rounded px-3 py-2 text-xs font-mono text-above-blue-700 border hover:bg-above-blue-50 transition-colors">
                  insiderisk.io/glossary
                </a>
              </div>

              <div className="bg-gradient-to-br from-above-peach-50 to-above-lavender-50 rounded-xl p-6 border border-above-peach-200 text-center">
                <div className="w-12 h-12 bg-above-peach-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-above-peach-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Matrix</h3>
                <p className="text-sm text-slate-600 mb-4">Interactive threat technique database</p>
                <a href="https://insiderisk.io/matrix" target="_blank" rel="noopener noreferrer"
                   className="inline-block bg-white rounded px-3 py-2 text-xs font-mono text-above-peach-700 border hover:bg-above-peach-50 transition-colors">
                  insiderisk.io/matrix
                </a>
              </div>

              <div className="bg-gradient-to-br from-above-lavender-50 to-above-blue-50 rounded-xl p-6 border border-above-lavender-200 text-center">
                <div className="w-12 h-12 bg-above-lavender-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-above-lavender-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Playbooks</h3>
                <p className="text-sm text-slate-600 mb-4">Implementation guides and frameworks</p>
                <a href="https://insiderisk.io/playbooks" target="_blank" rel="noopener noreferrer"
                   className="inline-block bg-white rounded px-3 py-2 text-xs font-mono text-above-lavender-700 border hover:bg-above-lavender-50 transition-colors">
                  insiderisk.io/playbooks
                </a>
              </div>
            </div>

            {/* Additional External Resources */}
            <div className="mt-12 bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">External Resources</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Industry Research</h4>
                  <div className="space-y-2">
                    <a href="https://www.ponemon.org/research/ponemon-library" target="_blank" rel="noopener noreferrer"
                       className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      → Ponemon Institute Research Library
                    </a>
                    <a href="https://www.verizon.com/business/resources/reports/dbir/" target="_blank" rel="noopener noreferrer"
                       className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      → Verizon Data Breach Investigations Report
                    </a>
                    <a href="https://www.gartner.com/en/research" target="_blank" rel="noopener noreferrer"
                       className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      → Gartner Research & Advisory
                    </a>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Security Frameworks</h4>
                  <div className="space-y-2">
                    <a href="https://insiderthreatmatrix.org" target="_blank" rel="noopener noreferrer"
                       className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      → ForScie Insider Threat Matrix
                    </a>
                    <a href="https://attack.mitre.org/" target="_blank" rel="noopener noreferrer"
                       className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      → MITRE ATT&CK Framework
                    </a>
                    <a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener noreferrer"
                       className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      → NIST Cybersecurity Framework
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-above-lavender-100 to-above-peach-100 py-12 border-t border-above-lavender-200">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-slate-900 mb-3">About This Assessment</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  The Insider Risk Index evaluates organizational security posture across five critical pillars,
                  providing actionable insights based on industry best practices and peer benchmarking.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Methodology</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Scores are calculated using weighted algorithms validated against Ponemon Institute research
                  and Gartner frameworks, ensuring accurate and meaningful risk assessment.
                </p>
              </div>
              <div className="text-center md:text-right">
                <div className="inline-flex items-center gap-3 mb-4">
                  <Image
                    src="/logo.png"
                    alt="Insider Risk Index"
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                  <span className="font-bold text-slate-900">Insider Risk Index™</span>
                </div>
                <p className="text-sm text-slate-700 mb-1">Sponsored by Above Security</p>
                <p className="text-sm text-above-blue-700 font-medium mb-4">insiderisk.io</p>
                <p className="text-xs text-slate-500">
                  © {new Date().getFullYear()} Above Security. All rights reserved.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-above-lavender-300 text-center">
              <p className="text-xs text-slate-600">
                This report contains confidential security assessment data. Distribution is limited to authorized personnel only.
                <br />
                Generated on {new Date().toLocaleString()} • Report ID: {id}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
