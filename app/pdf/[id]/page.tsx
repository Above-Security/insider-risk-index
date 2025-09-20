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
              Strategic insider risk assessment with business impact analysis and ROI projections
            </p>
          </div>

          {/* Business Impact Calculations */}
          {(() => {
            const averageAnnualCost = 17400000; // $17.4M from Ponemon 2025
            const averageIncidentCost = 676517;
            const averageContainmentDays = 81;
            const riskMultiplier = Math.max(0.3, (100 - iri) / 100);
            const estimatedAnnualRisk = Math.round(averageAnnualCost * riskMultiplier / 1000000 * 10) / 10;
            const estimatedIncidentCost = Math.round(averageIncidentCost * riskMultiplier / 1000);
            const estimatedContainmentTime = Math.round(averageContainmentDays * riskMultiplier);
            const potentialSavings = Math.round((averageAnnualCost * (riskMultiplier - 0.3)) / 1000000 * 10) / 10;
            const implementationCost = Math.round(potentialSavings * 0.15 * 10) / 10;

            return (
              <div className="mb-8 p-6 bg-gradient-to-r from-above-blue-50 to-above-lavender-50 rounded-xl border border-above-blue-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">Business Impact Analysis</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-white rounded-lg border border-above-rose-200">
                    <div className="text-2xl font-bold text-above-rose-700 mb-1">${estimatedAnnualRisk}M</div>
                    <div className="text-sm text-slate-600">Annual Risk Exposure</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-above-peach-200">
                    <div className="text-2xl font-bold text-above-peach-700 mb-1">${estimatedIncidentCost}K</div>
                    <div className="text-sm text-slate-600">Per Incident Cost</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-above-blue-200">
                    <div className="text-2xl font-bold text-above-blue-700 mb-1">{estimatedContainmentTime}</div>
                    <div className="text-sm text-slate-600">Containment Days</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-700 mb-1">${potentialSavings}M</div>
                    <div className="text-sm text-slate-600">Potential Savings</div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg border border-green-200 text-center">
                  <p className="text-sm text-slate-700">
                    <strong>ROI Projection:</strong> ${implementationCost}M investment could deliver ${potentialSavings}M annual savings
                    ({potentialSavings > 0 ? Math.round((potentialSavings / Math.max(implementationCost, 0.1)) * 10) / 10 : 0}:1 ROI)
                  </p>
                </div>
              </div>
            );
          })()}

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
              const industryAvg = benchmarks?.industry?.iriAverage || 65;
              const variance = scoreValue - industryAvg;

              const getMaturityLevel = (score: number) => {
                if (score >= 85) return { level: "Optimized", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", bgColor: "#22C55E" };
                if (score >= 65) return { level: "Proactive", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", bgColor: "#3B82F6" };
                if (score >= 45) return { level: "Managed", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", bgColor: "#F59E0B" };
                if (score >= 25) return { level: "Emerging", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", bgColor: "#FF7E54" };
                return { level: "Ad Hoc", color: "text-red-700", bg: "bg-red-50", border: "border-red-200", bgColor: "#D13366" };
              };

              const maturity = getMaturityLevel(scoreValue);

              return (
                <div key={pillar.id} className={`p-6 rounded-xl border-2 ${maturity.border} ${maturity.bg}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                    {/* Main Content - 2 columns */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{pillar.name}</h3>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${maturity.bg} ${maturity.color} border ${maturity.border}`}>
                            {maturity.level}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{pillar.description}</p>
                    </div>

                    {/* Score Display - 1 column */}
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 mb-1">{Math.round(scoreValue)}</div>
                        <div className="text-sm text-slate-600">Your Score</div>
                      </div>

                      <div className="w-full space-y-2">
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>0</span>
                          <span>100</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(scoreValue, 2)}%`,
                              backgroundColor: maturity.bgColor
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Industry Comparison - 1 column */}
                    <div className="space-y-3">
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <div className="text-4xl font-bold mb-2" style={{ color: pillar.color }}>
                          {Math.round(scoreValue)}
                        </div>
                        <div className="text-sm text-slate-600">Current Score</div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Industry Average:</span>
                          <span className="font-semibold">{Math.round(industryAvg)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Variance:</span>
                          <span className={`font-semibold ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {variance >= 0 ? '+' : ''}{Math.round(variance)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Weight:</span>
                          <span className="font-semibold">{Math.round(weight * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">IRI Contribution:</span>
                          <span className="font-semibold">{Math.round(contribution)}</span>
                        </div>
                      </div>
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

      {/* Strategic Insights & Recommendations */}
      <section className="py-12 bg-above-white">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Strategic Insights & Recommendations</h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Data-driven insights and actionable recommendations based on your assessment results
            </p>
          </div>

          {/* Key Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Organizational Strengths */}
            <div className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 text-sm">✓</span>
                  </div>
                  Security Strengths
                </h3>
                <p className="text-slate-600 text-sm">
                  Areas where your organization demonstrates strong insider risk management
                </p>
              </div>
              <div className="space-y-3">
                {(() => {
                  const strengths = [
                    `Strong performance in ${PILLARS.find(p => pillarScores.find(ps => ps.pillar === p.id && ps.score > 70))?.name || 'security controls'}`,
                    `Above-average maturity level (Level ${level}) compared to industry peers`,
                    `Effective risk mitigation strategies reducing annual exposure by $${Math.round((1 - (Math.max(0.3, (100 - iri) / 100))) * 5)}M`,
                    `Comprehensive security framework implementation`,
                    `Strong compliance and governance practices`
                  ];

                  return strengths.slice(0, 5).map((strength, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-green-700">{index + 1}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-900">{strength}</p>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Critical Improvements */}
            <div className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-700 text-sm">!</span>
                  </div>
                  Priority Improvements
                </h3>
                <p className="text-slate-600 text-sm">
                  Critical areas requiring immediate attention and investment
                </p>
              </div>
              <div className="space-y-3">
                {(() => {
                  const weaknesses = [
                    `Enhanced monitoring capabilities needed in ${PILLARS.find(p => pillarScores.find(ps => ps.pillar === p.id && ps.score < 50))?.name || 'security controls'}`,
                    `Incident response procedures require modernization`,
                    `Employee training programs need expansion`,
                    `Identity and access management controls require strengthening`,
                    `Risk assessment processes need formalization`
                  ];

                  return weaknesses.slice(0, 5).map((weakness, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-red-700">{index + 1}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-900">{weakness}</p>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Action Plan */}
      <section className="py-12 bg-gradient-to-br from-above-blue-50 to-white">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Executive Action Plan</h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Prioritized recommendations for board-level review and strategic implementation
            </p>
          </div>

          {/* Detailed Recommendations */}
          <div className="mb-8">
            <div className="space-y-6">
              {(() => {
                const recommendations = [
                  'Implement comprehensive user behavior analytics to detect anomalous activity patterns',
                  'Deploy zero-trust architecture with continuous identity verification',
                  'Establish formal incident response procedures with defined escalation paths',
                  'Develop organization-wide security awareness training program',
                  'Integrate advanced threat detection with automated response capabilities'
                ];
                const priorities = ['Critical', 'High', 'Medium', 'Medium', 'Low'];
                const priorityColors = ['text-red-700 bg-red-50 border-red-200', 'text-orange-700 bg-orange-50 border-orange-200', 'text-yellow-700 bg-yellow-50 border-yellow-200', 'text-blue-700 bg-blue-50 border-blue-200', 'text-slate-700 bg-slate-50 border-slate-200'];
                const timeframes = ['0-30 days', '1-3 months', '3-6 months', '6-12 months', '12+ months'];
                const costs = ['High', 'Medium', 'Medium', 'Low', 'Low'];

                return recommendations.slice(0, 5).map((recommendation, index) => (
                  <div key={index} className="p-6 bg-white rounded-xl border-2 border-slate-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-above-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-above-blue-700">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[index]}`}>
                            {priorities[index]} Priority
                          </span>
                          <span className="text-xs text-slate-500">
                            Timeline: {timeframes[index]}
                          </span>
                          <span className="text-xs text-slate-500">
                            Investment: {costs[index]}
                          </span>
                        </div>
                        <p className="text-slate-900 font-medium leading-relaxed mb-3">{recommendation}</p>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">
                            <strong>Expected Impact:</strong> Implementation of this recommendation could reduce risk exposure by {Math.round((5 - index) * 8)}%
                            and improve overall security posture within the specified timeframe.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Immediate Actions */}
            <div className="bg-white rounded-xl border border-above-blue-200 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Immediate Actions (0-30 days)</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-above-blue-50 rounded-lg">
                  <span className="text-above-blue-700 font-bold">1.</span>
                  <span className="text-sm text-slate-700">Present findings to board and executive leadership</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-above-blue-50 rounded-lg">
                  <span className="text-above-blue-700 font-bold">2.</span>
                  <span className="text-sm text-slate-700">Establish insider risk program budget and timeline</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-above-blue-50 rounded-lg">
                  <span className="text-above-blue-700 font-bold">3.</span>
                  <span className="text-sm text-slate-700">Begin implementation of critical priority recommendations</span>
                </div>
              </div>
            </div>

            {/* Long-term Strategy */}
            <div className="bg-white rounded-xl border border-above-peach-200 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Strategic Implementation (3-12 months)</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-above-peach-50 rounded-lg">
                  <span className="text-above-peach-700 font-bold">1.</span>
                  <span className="text-sm text-slate-700">Deploy comprehensive monitoring and analytics solutions</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-above-peach-50 rounded-lg">
                  <span className="text-above-peach-700 font-bold">2.</span>
                  <span className="text-sm text-slate-700">Implement organization-wide training and awareness programs</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-above-peach-50 rounded-lg">
                  <span className="text-above-peach-700 font-bold">3.</span>
                  <span className="text-sm text-slate-700">Schedule quarterly assessments to track progress</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
              <h3 className="text-lg font-bold text-green-800 mb-4">Organizational Strengths</h3>
              <div className="space-y-2">
                {pillarScores.filter(p => p.score > 70).slice(0, 3).map((pillar, index) => {
                  const pillarInfo = PILLARS.find(p => p.id === pillar.pillar);
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">{pillarInfo?.name}: {Math.round(pillar.score)}% performance</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200 p-6">
              <h3 className="text-lg font-bold text-red-800 mb-4">Priority Improvements</h3>
              <div className="space-y-2">
                {pillarScores.filter(p => p.score < 60).slice(0, 3).map((pillar, index) => {
                  const pillarInfo = PILLARS.find(p => p.id === pillar.pillar);
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">{pillarInfo?.name}: {Math.round(pillar.score)}% performance</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Enhanced ROI Summary */}
          <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="text-center space-y-6">
              <h3 className="text-xl font-bold text-green-800">Investment Summary & ROI Projection</h3>

              {(() => {
                const averageAnnualCost = 17400000;
                const riskMultiplier = Math.max(0.3, (100 - iri) / 100);
                const estimatedAnnualRisk = Math.round(averageAnnualCost * riskMultiplier / 1000000 * 10) / 10;
                const potentialSavings = Math.round((averageAnnualCost * (riskMultiplier - 0.3)) / 1000000 * 10) / 10;
                const implementationCost = Math.round(potentialSavings * 0.15 * 10) / 10;

                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div className="p-4 bg-white rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-700 mb-1">${estimatedAnnualRisk}M</div>
                        <div className="text-sm text-slate-600">Current Risk Exposure</div>
                        <div className="text-xs text-slate-500 mt-1">Based on Ponemon 2025 research</div>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700 mb-1">${implementationCost}M</div>
                        <div className="text-sm text-slate-600">Estimated Investment</div>
                        <div className="text-xs text-slate-500 mt-1">15% of potential savings</div>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-emerald-700 mb-1">${potentialSavings}M</div>
                        <div className="text-sm text-slate-600">Annual Savings Potential</div>
                        <div className="text-xs text-slate-500 mt-1">{potentialSavings > 0 ? Math.round((potentialSavings / Math.max(implementationCost, 0.1)) * 10) / 10 : 0}:1 ROI expected</div>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <p className="text-sm text-slate-700">
                        <strong>Strategic Value:</strong> Investing approximately ${implementationCost}M in security improvements could potentially save
                        ${potentialSavings}M annually, delivering a {potentialSavings > 0 ? Math.round((potentialSavings / Math.max(implementationCost, 0.1)) * 10) / 10 : 0}:1 ROI while protecting organizational reputation and competitive advantage.
                      </p>
                    </div>

                    <p className="text-sm text-slate-700 italic">
                      "Proactive insider risk management delivers measurable ROI while protecting organizational reputation and competitive advantage."
                    </p>
                  </>
                );
              })()}
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
