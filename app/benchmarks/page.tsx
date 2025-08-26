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
  // Transform data for charts
  const industryChartData = PILLARS.map(pillar => ({
    pillarId: pillar.id,
    score: Object.values(INDUSTRY_BENCHMARKS).reduce((sum, industry) => 
      sum + ((industry.pillarAverages as Record<string, number>)[pillar.id] || 0), 0
    ) / Object.values(INDUSTRY_BENCHMARKS).length,
    maxScore: 100,
    weight: pillar.weight,
    contributionToTotal: 0, // This would be calculated based on actual data
  }));

  // Generate JSON-LD structured data
  const benchmarkDatasetJsonLd = getBenchmarkDatasetJsonLd();

  return (
    <div className={`min-h-screen bg-above-blue-50 ${getSectionLayout('sm')}`}>
      <div className={getPageLayout()}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Industry Benchmarks
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
            Industry benchmarks derived from Ponemon Institute 2025 research, Verizon DBIR 2024 analysis, 
            and Gartner Market Guide insights across financial services, healthcare, and other industries
          </p>
          <div className="mt-6 flex items-center justify-center space-x-8 text-sm text-slate-500">
            <span>• Ponemon Institute 2025 Cost Study</span>
            <span>• Verizon DBIR 2024 Analysis</span>
            <span>• Gartner Market Guide G00805757</span>
          </div>
        </div>

        {/* Overview Stats */}
        <div className={`${getGridClass('metrics', '2-4')} mb-12`}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Assessments</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {OVERALL_BENCHMARKS.totalAssessments.toLocaleString()}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-above-rose-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Average Score</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {OVERALL_BENCHMARKS.averageScore}
                  </p>
                </div>
                <Target className="h-8 w-8 text-above-blue-800" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monthly Growth</p>
                  <p className="text-3xl font-bold text-slate-900">
                    +{OVERALL_BENCHMARKS.trends.monthlyGrowth}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-above-peach-800" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Score Improvement</p>
                  <p className="text-3xl font-bold text-slate-900">
                    +{OVERALL_BENCHMARKS.trends.scoreImprovement}%
                  </p>
                </div>
                <Zap className="h-8 w-8 text-above-lavender-800" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benchmark Tabs */}
        <Tabs defaultValue="industry" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="industry" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                By Industry
              </TabsTrigger>
              <TabsTrigger value="size" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                By Company Size
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Industry Benchmarks */}
          <TabsContent value="industry" className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Industry Benchmarks</h2>
              <p className="text-slate-600">
                Average scores across different industries based on {' '}
                {Object.values(INDUSTRY_BENCHMARKS).reduce((sum, industry) => sum + industry.sampleSize, 0).toLocaleString()} assessments
              </p>
            </div>

            {/* Industry Grid */}
            <div className={getGridClass('cards', '1-2-3')}>
              {Object.entries(INDUSTRY_BENCHMARKS).map(([key, industry]) => (
                <Card key={key} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{industry.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {industry.sampleSize} orgs
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
                      <p className="text-sm font-medium text-slate-700">Pillar Breakdown:</p>
                      {PILLARS.map(pillar => {
                        const score = (industry.pillarAverages as Record<string, number>)[pillar.id] || 0;
                        return (
                          <div key={pillar.id} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{pillar.name.split(' ')[0]}</span>
                            <span className="font-medium">{score}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Industry Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Industry Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <PillarBarChart
                    pillarBreakdown={industryChartData}
                    title=""
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Size Benchmarks */}
          <TabsContent value="size" className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Company Size Benchmarks</h2>
              <p className="text-slate-600">
                How insider risk scores vary by organization size
              </p>
            </div>

            {/* Size Grid */}
            <div className={getGridClass('cards', '1-2-3')}>
              {Object.entries(SIZE_BENCHMARKS).map(([key, sizeData]) => (
                <Card key={key} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{sizeData.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {sizeData.sampleSize} orgs
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
                      <p className="text-sm font-medium text-slate-700">Pillar Breakdown:</p>
                      {PILLARS.map(pillar => {
                        const score = (sizeData.pillarAverages as Record<string, number>)[pillar.id] || 0;
                        return (
                          <div key={pillar.id} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{pillar.name.split(' ')[0]}</span>
                            <span className="font-medium">{score}%</span>
                          </div>
                        );
                      })}
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
        <div className="mt-16 bg-above-rose-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            See How You Compare
          </h3>
          <p className="text-above-rose-100 mb-6">
            Take our assessment to benchmark your organization against these industry standards
          </p>
          <a
            href="/assessment"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-above-rose-600 bg-white hover:bg-above-rose-50 transition-colors"
          >
            Start Your Assessment
          </a>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            Benchmark data is updated quarterly. Last updated: {formatDate(OVERALL_BENCHMARKS.lastUpdated)}
          </p>
          <p className="mt-1">
            All data is anonymized and aggregated to protect participant privacy.
          </p>
        </div>
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