// ISR: Revalidate every hour (3600 seconds) for fresh benchmark data
export const revalidate = 3600;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PillarBarChart } from "@/components/charts/bar-chart";
import { SimpleScoreGauge } from "@/components/charts/score-gauge";
import { 
  INDUSTRY_BENCHMARKS, 
  SIZE_BENCHMARKS, 
  OVERALL_BENCHMARKS,
  PILLARS 
} from "@/lib/pillars";
import { pageMetadata, getBenchmarkDatasetJsonLd } from "@/lib/seo";
import Link from "next/link";
import { 
  Building, 
  Users, 
  TrendingUp, 
  BarChart3,
  Zap,
  Target
} from "lucide-react";
import { getPageLayout, getSectionLayout, getGridClass } from "@/lib/layout-utils";
import { formatDate } from "@/lib/utils";
import Script from "next/script";

export const metadata = pageMetadata.benchmarks();

export default function BenchmarksPage() {
  // Transform data for charts - calculate industry averages properly
  const industryChartData = PILLARS.map(pillar => {
    const industries = Object.values(INDUSTRY_BENCHMARKS);
    const totalScore = industries.reduce((sum, industry) => {
      return sum + ((industry.pillarAverages as Record<string, number>)[pillar.id] || 0);
    }, 0);
    const avgScore = totalScore / industries.length;
    
    return {
      pillarId: pillar.id,
      score: avgScore,
      maxScore: 100,
      weight: pillar.weight,
      contributionToTotal: (avgScore * pillar.weight) / 100,
    };
  });

  // Generate JSON-LD structured data
  const benchmarkDatasetJsonLd = getBenchmarkDatasetJsonLd();

  return (
    <div className="min-h-screen bg-gradient-to-br from-above-blue-50 via-white to-above-lavender-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="h-6 w-6 text-above-blue-700" />
            <Badge variant="secondary" className="bg-above-blue-100 text-above-blue-800 border-above-blue-200">
              Industry Intelligence
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Industry Benchmarks
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Industry intelligence based on <strong>authoritative security research</strong> with 
            estimated organizational benchmarks for comparative analysis
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
              Research-Informed Estimates
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              Ponemon Institute Data
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
              Verizon DBIR Insights
            </Badge>
          </div>
        </div>

        {/* Critical Industry Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-semibold uppercase tracking-wide">Annual Cost</p>
                  <p className="text-3xl font-bold text-red-900">$17.4M</p>
                  <p className="text-red-700 text-xs">Average per organization</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-500" />
              </div>
              <div className="mt-3 text-xs text-red-600">
                Ponemon Institute 2025
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-semibold uppercase tracking-wide">Organizations Attacked</p>
                  <p className="text-3xl font-bold text-orange-900">83%</p>
                  <p className="text-orange-700 text-xs">Experienced insider attacks in 2024</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-3 text-xs text-orange-600">
                IBM Security Report 2024
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Breach Factor</p>
                  <p className="text-3xl font-bold text-blue-900">68%</p>
                  <p className="text-blue-700 text-xs">Involve human elements</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-3 text-xs text-blue-600">
                Verizon DBIR 2024
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide">Containment Time</p>
                  <p className="text-3xl font-bold text-purple-900">81</p>
                  <p className="text-purple-700 text-xs">Days average</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-3 text-xs text-purple-600">
                Detection to resolution
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benchmark Tabs */}
        <Tabs defaultValue="industry" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/60 backdrop-blur-sm shadow-sm">
              <TabsTrigger value="industry" className="flex items-center gap-2 data-[state=active]:bg-above-blue-100 data-[state=active]:text-above-blue-900">
                <Building className="h-4 w-4" />
                By Industry
              </TabsTrigger>
              <TabsTrigger value="size" className="flex items-center gap-2 data-[state=active]:bg-above-blue-100 data-[state=active]:text-above-blue-900">
                <Users className="h-4 w-4" />
                By Company Size
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Industry Benchmarks */}
          <TabsContent value="industry" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Industry Analysis</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Estimated organizational security posture across industry sectors based on 
                research insights and threat landscape analysis
              </p>
            </div>

            {/* Industry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Object.entries(INDUSTRY_BENCHMARKS).map(([key, industry]) => (
                <Card key={key} className="hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">{industry.name}</CardTitle>
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                        Estimated
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <SimpleScoreGauge 
                        score={industry.averageScore}
                        label="Overall Score"
                        className="justify-center"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
                        Pillar Breakdown:
                      </p>
                      {PILLARS.map(pillar => {
                        const score = (industry.pillarAverages as Record<string, number>)[pillar.id] || 0;
                        return (
                          <div key={pillar.id} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{pillar.name.split(' ')[0]}</span>
                            <span className="font-semibold text-slate-900">{score}%</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 mt-4 border-t border-slate-100">
                      <div className="text-xs text-slate-500 space-y-1">
                        <div>Avg Cost: ${(industry.averageCostPerIncident / 1000).toFixed(0)}k</div>
                        <div>Containment: {industry.avgContainmentDays} days</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Industry Insights */}
            <Card className="bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-above-blue-700" />
                  Key Industry Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Highest Performing Sectors</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">Technology</span>
                        <span className="font-semibold text-green-700">79/100</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm">Financial Services</span>
                        <span className="font-semibold text-blue-700">74/100</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                        <span className="text-sm">Government</span>
                        <span className="font-semibold text-purple-700">72/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Areas for Improvement</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                        <span className="text-sm">Non-Profit</span>
                        <span className="font-semibold text-orange-700">52/100</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm">Education</span>
                        <span className="font-semibold text-red-700">56/100</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <span className="text-sm">Healthcare</span>
                        <span className="font-semibold text-yellow-700">58/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Size Benchmarks */}
          <TabsContent value="size" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Organization Size Analysis</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Estimated security maturity patterns across different organization sizes
              </p>
            </div>

            {/* Size Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Object.entries(SIZE_BENCHMARKS).map(([key, sizeData]) => (
                <Card key={key} className="hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">{sizeData.name}</CardTitle>
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                        Estimated
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <SimpleScoreGauge 
                        score={sizeData.averageScore}
                        label="Overall Score"
                        className="justify-center"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
                        Pillar Breakdown:
                      </p>
                      {PILLARS.map(pillar => {
                        const score = (sizeData.pillarAverages as Record<string, number>)[pillar.id] || 0;
                        return (
                          <div key={pillar.id} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{pillar.name.split(' ')[0]}</span>
                            <span className="font-semibold text-slate-900">{score}%</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 mt-4 border-t border-slate-100">
                      <div className="text-xs text-slate-500 space-y-1">
                        <div>Avg Cost: ${(sizeData.averageCostPerIncident / 1000).toFixed(0)}k</div>
                        <div>Containment: {sizeData.avgContainmentDays} days</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Size Trend Analysis */}
            <div className={getGridClass('content', '1-2')}>
              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-above-rose-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm">
                        Larger organizations (5,000+ employees) score 26 points higher on average than smaller ones (1-50 employees)
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-above-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm">
                        Identity & SaaS/OAuth shows the largest gap between company sizes
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-above-peach-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm">
                        Phishing Resilience scores are most consistent across all company sizes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-above-lavender-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Small Organizations:</strong> Focus on basic visibility and prevention controls first
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-above-lavender-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Medium Organizations:</strong> Invest in investigation capabilities and identity management
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-above-lavender-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Large Organizations:</strong> Implement advanced analytics and behavioral monitoring
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="mt-16 bg-gradient-to-r from-above-blue-600 via-above-rose-600 to-above-peach-600 border-none shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <Target className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Benchmark Your Organization
            </h3>
            <p className="text-white/90 mb-6 text-lg max-w-2xl mx-auto">
              Get your comprehensive insider risk assessment and see how you compare against 
              these industry benchmarks from <strong>real research data</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-above-rose-700 bg-white hover:bg-above-rose-50 transition-colors shadow-lg"
              >
                Start Free Assessment
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                View Research Sources
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources & Disclaimer */}
        <Card className="mt-8 bg-white/60 backdrop-blur-sm border-amber-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                <h4 className="text-lg font-semibold text-slate-900">Data Transparency</h4>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-800 font-medium mb-2">
                  ⚠️ Important: Benchmark Data Methodology
                </p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  While our top-level statistics ($17.4M costs, 81-day containment, 68% human factor) come from 
                  <strong> authoritative sources like Ponemon Institute 2025 and Verizon DBIR 2024</strong>, the 
                  individual industry breakdowns and organization-specific scores shown here are <strong>estimates</strong> 
                  based on research insights, threat landscape analysis, and industry patterns.
                </p>
              </div>
              <p className="text-sm text-slate-600 max-w-4xl mx-auto leading-relaxed">
                <strong>Authoritative Data Sources:</strong> Ponemon Institute 2025 Cost Report, 
                Verizon 2024 DBIR, IBM Security Reports, and Gartner Market Guide G00805757. 
                <strong>Industry estimates</strong> are derived from these sources combined with 
                general cybersecurity maturity patterns and threat intelligence.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                  Research-Informed Estimates
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                  Authoritative Statistics
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                  Industry Analysis
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* JSON-LD structured data */}
      <Script
        id="benchmarks-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(benchmarkDatasetJsonLd),
        }}
      />
    </div>
  );
}