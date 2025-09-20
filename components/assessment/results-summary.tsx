"use client";

import { AssessmentResult } from "@/lib/zod-schemas";
import { PILLARS, getRiskLevel } from "@/lib/pillars";
import { ScoreGauge } from "@/components/charts/score-gauge";
import { InsiderRiskRadarChart } from "@/components/charts/radar-chart";
import { PillarBarChart } from "@/components/charts/bar-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  DollarSign,
  Clock,
  Shield,
  Users,
  Building,
  Calendar,
  Briefcase
} from "lucide-react";
import { ShareResults } from "./share-results";
import { formatPercentage } from "@/lib/utils";

interface ResultsSummaryProps {
  result: AssessmentResult;
  organizationInfo: {
    organizationName: string;
    industry: string;
    employeeCount: string;
  };
  onGeneratePDF?: () => void;
  pdfGenerating?: string | null;
  assessmentId?: string;
  answers?: Record<string, number>; // Original answers for sharing
  className?: string;
}

export function ResultsSummary({
  result,
  organizationInfo,
  onGeneratePDF,
  pdfGenerating,
  assessmentId,
  answers,
  className
}: ResultsSummaryProps) {
  const riskLevel = getRiskLevel(result.totalScore);

  const topStrengths = result.pillarBreakdown
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const bottomWeaknesses = result.pillarBreakdown
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const benchmarkComparison = {
    industry: result.totalScore - result.benchmark.industry,
    companySize: result.totalScore - result.benchmark.companySize,
    overall: result.totalScore - result.benchmark.overall,
  };

  // Calculate business impact metrics based on Ponemon 2025 research
  const averageAnnualCost = 17400000; // $17.4M average from Ponemon 2025
  const averageIncidentCost = 676517; // Average per incident
  const averageContainmentDays = 81; // Average containment time

  // Risk calculations based on score
  const riskMultiplier = Math.max(0.3, (100 - result.totalScore) / 100);
  const estimatedAnnualRisk = Math.round(averageAnnualCost * riskMultiplier / 1000000 * 10) / 10; // In millions
  const estimatedIncidentCost = Math.round(averageIncidentCost * riskMultiplier / 1000); // In thousands
  const estimatedContainmentTime = Math.round(averageContainmentDays * riskMultiplier);

  // ROI calculations for improvements
  const potentialSavings = Math.round((averageAnnualCost * (riskMultiplier - 0.3)) / 1000000 * 10) / 10;
  const implementationCost = Math.round(potentialSavings * 0.15 * 10) / 10; // Assume 15% of savings for implementation

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-above-blue-50 to-above-lavender-50 rounded-xl p-8 border border-above-blue-200">
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Briefcase className="h-6 w-6 text-above-blue-700" />
              <span className="text-sm font-semibold text-above-blue-700 uppercase tracking-wider">
                Executive Assessment Report
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Insider Risk Assessment
            </h1>
            <h2 className="text-2xl font-semibold text-slate-700">
              {organizationInfo.organizationName}
            </h2>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                {organizationInfo.industry.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {organizationInfo.employeeCount}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Badge
              variant={riskLevel.level <= 2 ? "destructive" : riskLevel.level === 3 ? "warning" : "success"}
              className="px-6 py-3 text-lg font-semibold"
            >
              Risk Level {riskLevel.level}: {riskLevel.name}
            </Badge>
          </div>
        </div>
      </div>

      {/* Executive Summary Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Primary Score */}
        <div className="lg:col-span-2">
          <Card className="h-full border-2 border-above-blue-200 shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-slate-700">Insider Risk Index Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <ScoreGauge score={result.totalScore} size="lg" showLabel={true} />
              </div>
              <div>
                <div className="text-5xl font-bold mb-2" style={{ color: riskLevel.color }}>
                  {Math.round(result.totalScore)}
                </div>
                <div className="text-lg font-semibold text-slate-600 mb-1">
                  {riskLevel.name} Maturity
                </div>
                <div className="text-sm text-slate-500">
                  {result.totalScore >= result.benchmark.industry ? '↗️ Above' : '↘️ Below'} Industry Average ({Math.round(result.benchmark.industry)})
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Impact Metrics */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-above-rose-200 bg-gradient-to-br from-above-rose-50 to-above-peach-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-above-rose-700" />
                Annual Risk Exposure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-above-rose-700 mb-1">
                ${estimatedAnnualRisk}M
              </div>
              <div className="text-sm text-slate-600">
                Based on {Math.round(riskMultiplier * 100)}% risk factor
              </div>
            </CardContent>
          </Card>

          <Card className="border-above-peach-200 bg-gradient-to-br from-above-peach-50 to-above-rose-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-above-peach-700" />
                Incident Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-above-peach-700 mb-1">
                {estimatedContainmentTime} days
              </div>
              <div className="text-sm text-slate-600">
                Estimated containment period
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Business Impact Analysis */}
      <Card className="border-above-blue-200 bg-gradient-to-br from-above-blue-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-above-blue-700" />
            Business Impact Analysis
          </CardTitle>
          <p className="text-slate-600">
            Financial risk assessment based on Ponemon Institute 2025 research and industry benchmarks
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg border border-above-rose-200">
              <div className="text-3xl font-bold text-above-rose-700 mb-2">
                ${estimatedAnnualRisk}M
              </div>
              <div className="text-sm font-semibold text-slate-700 mb-1">
                Annual Risk Exposure
              </div>
              <div className="text-xs text-slate-500">
                {Math.round(riskMultiplier * 100)}% of industry average
              </div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border border-above-peach-200">
              <div className="text-3xl font-bold text-above-peach-700 mb-2">
                ${estimatedIncidentCost}K
              </div>
              <div className="text-sm font-semibold text-slate-700 mb-1">
                Per Incident Cost
              </div>
              <div className="text-xs text-slate-500">
                Estimated impact per breach
              </div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border border-above-blue-200">
              <div className="text-3xl font-bold text-above-blue-700 mb-2">
                {estimatedContainmentTime}
              </div>
              <div className="text-sm font-semibold text-slate-700 mb-1">
                Containment Days
              </div>
              <div className="text-xs text-slate-500">
                Time to resolve incidents
              </div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-2">
                ${potentialSavings}M
              </div>
              <div className="text-sm font-semibold text-slate-700 mb-1">
                Potential Savings
              </div>
              <div className="text-xs text-slate-500">
                With improved maturity
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-green-700" />
              <h4 className="font-semibold text-green-800">ROI Projection</h4>
            </div>
            <p className="text-sm text-slate-700">
              Investing approximately <strong>${implementationCost}M</strong> in security improvements could potentially save
              <strong> ${potentialSavings}M</strong> annually, delivering a <strong>{potentialSavings > 0 ? Math.round((potentialSavings / Math.max(implementationCost, 0.1)) * 10) / 10 : 0}:1 ROI</strong>
              within the first year.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Assessment Visualization */}
        <Card className="border-above-lavender-200 bg-gradient-to-br from-above-lavender-50 to-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-5 w-5 text-above-lavender-700" />
              Security Pillar Performance
            </CardTitle>
            <p className="text-sm text-slate-600">
              Assessment across five critical insider risk management areas
            </p>
          </CardHeader>
          <CardContent>
            <InsiderRiskRadarChart
              pillarBreakdown={result.pillarBreakdown}
              title=""
              showTitle={false}
            />
          </CardContent>
        </Card>

        {/* Benchmark Comparison */}
        <Card className="border-above-blue-200 bg-gradient-to-br from-above-blue-50 to-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-above-blue-700" />
              Industry Benchmarking
            </CardTitle>
            <p className="text-sm text-slate-600">
              Performance comparison against industry peers and standards
            </p>
          </CardHeader>
          <CardContent>
            <PillarBarChart
              pillarBreakdown={result.pillarBreakdown}
              benchmarkData={result.benchmark.industry ?
                PILLARS.reduce((acc, pillar) => ({
                  ...acc,
                  [pillar.id]: result.benchmark.industry
                }), {}) : undefined
              }
              title=""
              showTitle={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Pillar Analysis */}
      <Card className="border-above-peach-200 bg-gradient-to-br from-above-peach-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Shield className="h-6 w-6 text-above-peach-700" />
            Security Pillar Assessment
          </CardTitle>
          <p className="text-slate-600">
            Detailed analysis of your organization's performance across each security domain
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {PILLARS.map((pillar, index) => {
              const pillarResult = result.pillarBreakdown.find(p => p.pillarId === pillar.id);
              const score = pillarResult?.score || 0;
              const weight = pillarResult?.weight || pillar.weight;
              const contribution = pillarResult?.contributionToTotal || 0;
              const industryAvg = result.benchmark.industry || 65;
              const variance = score - industryAvg;

              const getMaturityLevel = (score: number) => {
                if (score >= 85) return { level: "Optimized", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" };
                if (score >= 65) return { level: "Proactive", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" };
                if (score >= 45) return { level: "Managed", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" };
                if (score >= 25) return { level: "Emerging", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" };
                return { level: "Ad Hoc", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" };
              };

              const maturity = getMaturityLevel(score);

              return (
                <div key={pillar.id} className={`p-6 rounded-xl border-2 ${maturity.border} ${maturity.bg}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                          <span className="text-lg font-bold text-slate-700">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{pillar.name}</h3>
                          <div className="flex items-center gap-4 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${maturity.bg} ${maturity.color} border ${maturity.border}`}>
                              {maturity.level}
                            </span>
                            <span className="text-sm text-slate-600">
                              {Math.round(weight * 100)}% assessment weight
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{pillar.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                          <div className="text-2xl font-bold text-slate-900 mb-1">{Math.round(score)}</div>
                          <div className="text-sm text-slate-600">Your Score</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                          <div className="text-2xl font-bold text-slate-600 mb-1">{Math.round(industryAvg)}</div>
                          <div className="text-sm text-slate-600">Industry Avg</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                          <div className={`text-2xl font-bold mb-1 ${variance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {variance >= 0 ? '+' : ''}{Math.round(variance)}
                          </div>
                          <div className="text-sm text-slate-600">Variance</div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-1 flex flex-col items-center justify-center text-center">
                      <div className="text-4xl font-bold mb-2" style={{ color: pillar.color }}>
                        {Math.round(score)}
                      </div>
                      <div className="text-sm text-slate-500 mb-2">
                        {contribution.toFixed(1)} pts contribution
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(score, 2)}%`,
                            backgroundColor: pillar.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Insights & Recommendations */}
      <div className="space-y-8">
        {/* Key Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Organizational Strengths */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-700" />
                Security Strengths
              </CardTitle>
              <p className="text-slate-600">
                Areas where your organization demonstrates strong insider risk management
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.strengths.slice(0, 5).map((strength, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-700">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{strength}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Critical Improvements */}
          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-700" />
                Priority Improvements
              </CardTitle>
              <p className="text-slate-600">
                Critical areas requiring immediate attention and investment
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.weaknesses.slice(0, 5).map((weakness, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-red-700">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{weakness}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Executive Action Plan */}
        <Card className="border-above-blue-200 bg-gradient-to-br from-above-blue-50 to-white">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <FileText className="h-6 w-6 text-above-blue-700" />
              Executive Action Plan
            </CardTitle>
            <p className="text-slate-600">
              Prioritized recommendations for board-level review and implementation
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {result.recommendations.slice(0, 5).map((recommendation, index) => {
                const priorities = ['Critical', 'High', 'Medium', 'Medium', 'Low'];
                const priorityColors = ['text-red-700 bg-red-50 border-red-200', 'text-orange-700 bg-orange-50 border-orange-200', 'text-yellow-700 bg-yellow-50 border-yellow-200', 'text-blue-700 bg-blue-50 border-blue-200', 'text-slate-700 bg-slate-50 border-slate-200'];
                const timeframes = ['0-30 days', '1-3 months', '3-6 months', '6-12 months', '12+ months'];
                const costs = ['High', 'Medium', 'Medium', 'Low', 'Low'];

                return (
                  <div key={index} className="p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-above-blue-200 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-above-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-above-blue-700">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
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
                        <p className="text-slate-900 font-medium leading-relaxed">{recommendation}</p>
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">
                            <strong>Expected Impact:</strong> Implementation of this recommendation could reduce risk exposure by {Math.round((5 - index) * 8)}%
                            and improve overall security posture within the specified timeframe.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Executive Actions & Next Steps */}
      <Card className="border-above-blue-200 bg-gradient-to-r from-above-blue-50 to-above-lavender-50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-above-blue-700" />
            Executive Actions
          </CardTitle>
          <p className="text-slate-600">
            Immediate steps for board presentation and strategic implementation
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => {
                if (onGeneratePDF) {
                  onGeneratePDF();
                } else if (assessmentId) {
                  const pdfUrl = `/api/pdf/${assessmentId}`;
                  console.log(`🔍 Generating comprehensive PDF for assessment ${assessmentId}`);
                  window.open(pdfUrl, '_blank');
                }
              }}
              className="flex items-center gap-2 h-16 text-lg"
              size="lg"
            >
              <Download className="h-6 w-6" />
              Download Board Report PDF
            </Button>

            {assessmentId && (
              <ShareResults
                result={{
                  totalScore: result.totalScore,
                  level: result.level,
                  levelDescription: riskLevel.name
                }}
                organizationName={organizationInfo.organizationName}
                organizationInfo={{
                  industry: organizationInfo.industry,
                  employeeCount: organizationInfo.employeeCount
                }}
                answers={answers}
                className="h-16"
              />
            )}
          </div>

          {/* Strategic Next Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-above-blue-700" />
                Immediate Actions (0-30 days)
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-above-blue-200">
                  <span className="text-above-blue-700 font-bold">1.</span>
                  <span className="text-sm text-slate-700">Present findings to board and executive leadership</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-above-blue-200">
                  <span className="text-above-blue-700 font-bold">2.</span>
                  <span className="text-sm text-slate-700">Establish insider risk program budget and timeline</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-above-blue-200">
                  <span className="text-above-blue-700 font-bold">3.</span>
                  <span className="text-sm text-slate-700">Begin implementation of critical priority recommendations</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-above-blue-700" />
                Long-term Strategy (3-12 months)
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-above-blue-200">
                  <span className="text-above-blue-700 font-bold">1.</span>
                  <span className="text-sm text-slate-700">Deploy comprehensive monitoring and analytics solutions</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-above-blue-200">
                  <span className="text-above-blue-700 font-bold">2.</span>
                  <span className="text-sm text-slate-700">Implement organization-wide training and awareness programs</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-above-blue-200">
                  <span className="text-above-blue-700 font-bold">3.</span>
                  <span className="text-sm text-slate-700">Schedule quarterly assessments to track progress</span>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Summary */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="text-center space-y-3">
              <h4 className="text-xl font-bold text-green-800">Investment Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-700">${estimatedAnnualRisk}M</div>
                  <div className="text-sm text-slate-600">Current Risk Exposure</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">${implementationCost}M</div>
                  <div className="text-sm text-slate-600">Estimated Investment</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-700">${potentialSavings}M</div>
                  <div className="text-sm text-slate-600">Annual Savings Potential</div>
                </div>
              </div>
              <p className="text-sm text-slate-700 italic">
                "Proactive insider risk management delivers measurable ROI while protecting organizational reputation and competitive advantage."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}