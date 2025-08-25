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
  Download
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
  onGeneratePDF: (type: "board-brief" | "detailed-plan") => void;
  assessmentId?: string;
  className?: string;
}

export function ResultsSummary({ 
  result, 
  organizationInfo, 
  onGeneratePDF,
  assessmentId,
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

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Assessment Results for {organizationInfo.organizationName}
          </h1>
          <p className="text-muted-foreground">
            {organizationInfo.industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {organizationInfo.employeeCount} employees
          </p>
        </div>
        
        <Badge 
          variant={riskLevel.level <= 2 ? "destructive" : riskLevel.level === 3 ? "warning" : "success"}
          className="px-4 py-2 text-sm"
        >
          Level {riskLevel.level}: {riskLevel.name}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                <p className="text-3xl font-bold" style={{ color: riskLevel.color }}>
                  {result.totalScore}
                </p>
                <p className="text-xs text-muted-foreground">out of 100</p>
              </div>
              <ScoreGauge score={result.totalScore} size="sm" showLabel={false} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {benchmarkComparison.industry >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <p className="text-sm font-medium text-muted-foreground">Industry Benchmark</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">
                  {formatPercentage(result.benchmark.industry, 1)}
                </p>
                <p className={`text-sm ${benchmarkComparison.industry >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {benchmarkComparison.industry >= 0 ? '+' : ''}{formatPercentage(benchmarkComparison.industry, 1)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">vs industry average (Ponemon 2025)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-muted-foreground">Company Size Benchmark</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">
                  {formatPercentage(result.benchmark.companySize, 1)}
                </p>
                <p className={`text-sm ${benchmarkComparison.companySize >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {benchmarkComparison.companySize >= 0 ? '+' : ''}{formatPercentage(benchmarkComparison.companySize, 1)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">vs similar companies (size-based analysis)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="radar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="radar">Risk Overview</TabsTrigger>
          <TabsTrigger value="comparison">Benchmark Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="radar">
          <InsiderRiskRadarChart 
            pillarBreakdown={result.pillarBreakdown}
            title="Risk Assessment Breakdown"
          />
        </TabsContent>
        
        <TabsContent value="comparison">
          <PillarBarChart
            pillarBreakdown={result.pillarBreakdown}
            benchmarkData={result.benchmark.industry ? 
              PILLARS.reduce((acc, pillar) => ({
                ...acc,
                [pillar.id]: result.benchmark.industry
              }), {}) : undefined
            }
            title="Your Score vs Industry Benchmark"
          />
        </TabsContent>
      </Tabs>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.strengths.slice(0, 3).map((strength, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm">{strength}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.weaknesses.slice(0, 3).map((weakness, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm">{weakness}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.recommendations.slice(0, 5).map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5 flex-shrink-0">
                  {index + 1}
                </Badge>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={() => onGeneratePDF("board-brief")} 
          className="flex items-center gap-2"
          variant="outline"
        >
          <FileText className="h-4 w-4" />
          Board Brief PDF
        </Button>
        
        <Button 
          onClick={() => onGeneratePDF("detailed-plan")}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Detailed Action Plan PDF
        </Button>
        
        {assessmentId && (
          <ShareResults
            assessmentId={assessmentId}
            totalScore={result.totalScore}
            level={result.level}
            organizationName={organizationInfo.organizationName}
          />
        )}
      </div>

      {/* Next Steps */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-900">What&apos;s Next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                Download your detailed action plan to share with stakeholders
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                Browse our playbooks for step-by-step implementation guides
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                Schedule a follow-up assessment in 6 months to track progress
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}