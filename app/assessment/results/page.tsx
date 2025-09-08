"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ResultsSummary } from "@/components/assessment/results-summary";
import { ShareResults } from "@/components/assessment/share-results";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, TrendingUp, Shield, Award, Target, Download, BookOpen, BarChart3, Lightbulb, CheckCircle } from "lucide-react";
import { AssessmentResult } from "@/lib/zod-schemas";
import { getRiskLevel } from "@/lib/pillars";

interface AssessmentData {
  organizationData: {
    organizationName: string;
    industry: string;
    employeeCount: string;
    contactEmail?: string;
    includeInBenchmarks: boolean;
  };
  result: AssessmentResult;
  completedAt: string;
  answers?: Record<string, number>; // Original answers for sharing
}

export default function AssessmentResultsPage() {
  console.log("🎯 AssessmentResultsPage component started loading");
  
  const router = useRouter();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  
  console.log("🎯 AssessmentResultsPage state initialized");

  useEffect(() => {
    // Load assessment data from localStorage with smooth loading
    const loadData = async () => {
      try {
        // Add slight delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const storedData = localStorage.getItem("assessment-result");
        console.log("🔍 Results page loading data:", storedData ? "Found data" : "No data");
        
        if (storedData) {
          try {
            const data = JSON.parse(storedData) as AssessmentData;
            console.log("✅ Parsed assessment data:", {
              hasOrgData: !!data.organizationData,
              hasResult: !!data.result,
              resultScore: data.result?.totalScore,
              completedAt: data.completedAt
            });
            setAssessmentData(data);
            
            // Trigger fade-in animation
            setTimeout(() => setFadeIn(true), 100);
          } catch (parseError) {
            console.error("❌ Error parsing stored data:", parseError);
            setError("Error loading assessment results. Please try again.");
          }
        } else {
          console.log("❌ No stored data found");
          setError("No assessment results found. Please take the assessment first.");
        }
      } catch (err) {
        console.error("Error loading assessment data:", err);
        setError("Error loading assessment results. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Auto-focus results when loaded
  useEffect(() => {
    if (assessmentData && resultsRef.current && fadeIn) {
      resultsRef.current.focus();
    }
  }, [assessmentData, fadeIn]);

  const handleGeneratePDF = async (type: "board-brief" | "detailed-plan") => {
    if (!assessmentData) return;
    
    setPdfGenerating(type);
    
    try {
      // Call API to generate PDF
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          organizationData: assessmentData.organizationData,
          result: assessmentData.result,
        }),
      });

      if (response.ok) {
        // Download the PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${assessmentData.organizationData.organizationName}-${type}-${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Error generating PDF:", response.statusText);
        // You could show an error message to the user here
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      // You could show an error message to the user here
    } finally {
      setPdfGenerating(null);
    }
  };

  const handleRetakeAssessment = () => {
    // Clear stored results
    localStorage.removeItem("assessment-result");
    router.push("/assessment");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-above-blue-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-above-rose-700" />
            <div className="absolute inset-0 rounded-full bg-above-rose-100 animate-pulse opacity-25"></div>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Analyzing Your Results</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Processing your assessment and generating personalized insights based on industry benchmarks...
          </p>
        </div>
      </div>
    );
  }

  if (error || !assessmentData) {
    console.log("🚨 Results page showing error state:", { error, hasAssessmentData: !!assessmentData });
    
    return (
      <div className="min-h-screen bg-above-blue-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertDescription>
              {error || "Assessment results not found."}
            </AlertDescription>
          </Alert>
          
          <div className="mt-8 text-center space-y-4">
            <Button 
              onClick={() => {
                console.log("🔄 Retake Assessment button clicked");
                handleRetakeAssessment();
              }} 
              size="lg"
            >
              Take Assessment
            </Button>
            <div>
              <Button variant="outline" onClick={() => router.push("/")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={resultsRef}
      tabIndex={-1}
      className={`min-h-screen bg-above-blue-50 py-8 transition-all duration-700 focus:outline-none ${
        fadeIn ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with navigation */}
        <div className="mb-8 flex items-center justify-between animate-slide-in-left">
          <Button 
            variant="outline" 
            onClick={() => router.back()} 
            className="gap-2 hover:bg-above-rose-50 hover:border-above-rose-300 focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="text-sm text-slate-500">
            Completed: {new Date(assessmentData.completedAt).toLocaleDateString()}
          </div>
        </div>

        {/* Results Summary */}
        <div className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          <ResultsSummary
            result={assessmentData.result}
            organizationInfo={assessmentData.organizationData}
            onGeneratePDF={handleGeneratePDF}
            pdfGenerating={pdfGenerating}
            answers={assessmentData.answers}
          />
        </div>

        {/* Marketing Hero Section */}
        <div className="mt-12 bg-gradient-to-br from-above-rose-50 via-white to-above-blue-50 rounded-2xl border-2 border-above-rose-200 shadow-xl animate-slide-in-up" style={{ animationDelay: '400ms' }}>
          <div className="p-8 text-center">
            {/* Success Badge */}
            <div className="flex justify-center mb-6">
              <Badge className="bg-above-rose-600 hover:bg-above-rose-700 text-white px-4 py-2 text-base font-semibold">
                <CheckCircle className="h-5 w-5 mr-2" />
                Assessment Complete
              </Badge>
            </div>
            
            {/* Marketing Headline */}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              🎯 Your Insider Risk Journey Starts Now
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Join <strong className="text-above-rose-600">14,170+ organizations</strong> using evidence-based insights to strengthen their insider risk posture. Your personalized roadmap awaits.
            </p>
            
            {/* Share Section */}
            <div className="mb-8">
              <ShareResults 
                result={assessmentData.result}
                organizationName={assessmentData.organizationData.organizationName}
                className="justify-center"
              />
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-above-rose-200">
                <div className="text-2xl font-bold text-above-rose-600">${(17400000/1000000).toFixed(1)}M</div>
                <div className="text-sm text-slate-600">Avg Annual Cost of Insider Threats</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-above-blue-200">
                <div className="text-2xl font-bold text-above-blue-600">81 Days</div>
                <div className="text-sm text-slate-600">Average Containment Time</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-above-peach-200">
                <div className="text-2xl font-bold text-above-peach-600">68%</div>
                <div className="text-sm text-slate-600">Breaches Include Human Element</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-above-lavender-200">
                <div className="text-2xl font-bold text-above-lavender-600">{assessmentData.result.level}/5</div>
                <div className="text-sm text-slate-600">Your Risk Maturity Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-in-up" style={{ animationDelay: '600ms' }}>
          
          {/* PDF Download Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-above-rose-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-above-rose-100 rounded-full flex items-center justify-center group-hover:bg-above-rose-200 transition-colors">
                <Download className="h-8 w-8 text-above-rose-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Executive Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-center">Professional PDF reports for board presentations and detailed implementation planning.</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => handleGeneratePDF('board-brief')}
                  disabled={pdfGenerating === 'board-brief'}
                  className="w-full bg-above-rose-600 hover:bg-above-rose-700 text-white"
                  size="lg"
                >
                  {pdfGenerating === 'board-brief' ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <>📋 Board Brief (2 pages)</>
                  )}
                </Button>
                <Button 
                  onClick={() => handleGeneratePDF('detailed-plan')}
                  disabled={pdfGenerating === 'detailed-plan'}
                  variant="outline"
                  className="w-full border-above-rose-300 hover:bg-above-rose-50"
                  size="lg"
                >
                  {pdfGenerating === 'detailed-plan' ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <>📊 Detailed Plan (8-10 pages)</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Playbooks */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-above-blue-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-above-blue-100 rounded-full flex items-center justify-center group-hover:bg-above-blue-200 transition-colors">
                <BookOpen className="h-8 w-8 text-above-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Implementation Playbooks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-center">Step-by-step guides tailored to your risk profile and industry benchmarks.</p>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-above-blue-600" />
                  Visibility Foundation (12,000+ words)
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-above-blue-600" />
                  Prevention & Coaching (15,000+ words)
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-above-blue-600" />
                  Investigation & Evidence
                </div>
              </div>
              <Button 
                onClick={() => router.push('/playbooks')}
                className="w-full bg-above-blue-600 hover:bg-above-blue-700 text-white"
                size="lg"
              >
                🔧 Browse Playbooks
              </Button>
            </CardContent>
          </Card>

          {/* Industry Benchmarks */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-above-peach-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-above-peach-100 rounded-full flex items-center justify-center group-hover:bg-above-peach-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-above-peach-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Industry Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-center">Compare against {assessmentData.organizationData.industry} peers and track improvement over time.</p>
              <div className="bg-above-peach-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-above-peach-600 mb-1">
                  {assessmentData.result.totalScore > assessmentData.result.benchmark.industry ? '📈' : '📊'} 
                  {Math.abs(assessmentData.result.totalScore - assessmentData.result.benchmark.industry).toFixed(1)} pts
                </div>
                <div className="text-xs text-slate-600">
                  {assessmentData.result.totalScore > assessmentData.result.benchmark.industry ? 'Above' : 'Below'} industry average
                </div>
              </div>
              <Button 
                onClick={() => router.push('/benchmarks')}
                className="w-full bg-above-peach-600 hover:bg-above-peach-700 text-white"
                size="lg"
              >
                📊 View Benchmarks
              </Button>
            </CardContent>
          </Card>

          {/* Research & Insights */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-above-lavender-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-above-lavender-100 rounded-full flex items-center justify-center group-hover:bg-above-lavender-200 transition-colors">
                <Lightbulb className="h-8 w-8 text-above-lavender-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Latest Research</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-center">Access cutting-edge research from Ponemon Institute, Gartner, and security leaders.</p>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-above-lavender-600" />
                  2025 Cost of Insider Threats Report
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-above-lavender-600" />
                  Gartner Market Guide Analysis
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-above-lavender-600" />
                  Above Security Intelligence
                </div>
              </div>
              <Button 
                onClick={() => router.push('/research')}
                className="w-full bg-above-lavender-600 hover:bg-above-lavender-700 text-white"
                size="lg"
              >
                🔬 Explore Research
              </Button>
            </CardContent>
          </Card>

          {/* Matrix Techniques */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-slate-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <Shield className="h-8 w-8 text-slate-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Threat Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-center">Explore the Insider Threat Matrix with 50+ techniques and prevention strategies.</p>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-slate-700 mb-1">ForScie Community</div>
                <div className="text-xs text-slate-600">Global security research collaboration</div>
              </div>
              <Button 
                onClick={() => router.push('/matrix')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white"
                size="lg"
              >
                🔍 Explore Matrix
              </Button>
            </CardContent>
          </Card>

          {/* Retake Assessment */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-above-rose-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-above-rose-100 rounded-full flex items-center justify-center group-hover:bg-above-rose-200 transition-colors">
                <Target className="h-8 w-8 text-above-rose-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Track Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-center">Retake the assessment quarterly to track improvements and benchmark progress.</p>
              <div className="bg-above-rose-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-above-rose-700 mb-1">Current Level: {assessmentData.result.level}/5</div>
                <div className="text-xs text-slate-600">{getRiskLevel(assessmentData.result.totalScore).name}</div>
              </div>
              <Button 
                onClick={handleRetakeAssessment}
                variant="outline"
                className="w-full border-above-rose-300 hover:bg-above-rose-50"
                size="lg"
              >
                🔄 Retake Assessment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Research Recommendations */}
        <div className="mt-16 bg-gradient-to-br from-above-lavender-50 via-white to-above-peach-50 rounded-2xl border border-above-lavender-200 shadow-lg animate-slide-in-up" style={{ animationDelay: '800ms' }}>
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                📚 Recommended Reading Based on Your Results
              </h3>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Curated research and insights to help improve your {getRiskLevel(assessmentData.result.totalScore).name.toLowerCase()} insider risk posture
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Research Article 1 - Always relevant */}
              <Card className="group hover:shadow-lg transition-all duration-300 border hover:border-above-lavender-300">
                <CardHeader className="pb-3">
                  <Badge className="w-fit bg-above-lavender-100 text-above-lavender-800 border-above-lavender-200 mb-2">
                    📈 Market Analysis
                  </Badge>
                  <CardTitle className="text-lg leading-tight">Gartner Market Guide for Insider Risk Management Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Comprehensive analysis of 48% attack frequency increase and the "Rule of Three" framework for insider threat management.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full border-above-lavender-300 hover:bg-above-lavender-50"
                    onClick={() => router.push('/research/gartner-market-guide-2025')}
                  >
                    Read Analysis →
                  </Button>
                </CardContent>
              </Card>
              
              {/* Research Article 2 - Cost focused */}
              <Card className="group hover:shadow-lg transition-all duration-300 border hover:border-above-peach-300">
                <CardHeader className="pb-3">
                  <Badge className="w-fit bg-above-peach-100 text-above-peach-800 border-above-peach-200 mb-2">
                    💰 Cost Analysis
                  </Badge>
                  <CardTitle className="text-lg leading-tight">2025 Cost of Insider Threats Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Ponemon Institute reveals $17.4M average annual cost and 81-day containment time. Essential for ROI calculations.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full border-above-peach-300 hover:bg-above-peach-50"
                    onClick={() => router.push('/research/ponemon-cost-2025')}
                  >
                    Explore Costs →
                  </Button>
                </CardContent>
              </Card>
              
              {/* Research Article 3 - Conditional based on score */}
              <Card className={`group hover:shadow-lg transition-all duration-300 border ${
                assessmentData.result.totalScore < 50 
                  ? 'hover:border-above-rose-300' 
                  : 'hover:border-above-blue-300'
              }`}>
                <CardHeader className="pb-3">
                  <Badge className={`w-fit border ${
                    assessmentData.result.totalScore < 50 
                      ? 'bg-above-rose-100 text-above-rose-800 border-above-rose-200' 
                      : 'bg-above-blue-100 text-above-blue-800 border-above-blue-200'
                  } mb-2`}>
                    {assessmentData.result.totalScore < 50 ? '🚨 Improvement' : '🔧 Enhancement'}
                  </Badge>
                  <CardTitle className="text-lg leading-tight">
                    {assessmentData.result.totalScore < 50 
                      ? 'Building Your First Insider Risk Program' 
                      : 'Advanced Insider Risk Strategies'
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    {assessmentData.result.totalScore < 50 
                      ? 'Step-by-step guide to establishing foundational controls and detection capabilities for emerging programs.'
                      : 'Advanced techniques for mature programs including AI-driven detection and behavioral analytics.'
                    }
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`w-full ${
                      assessmentData.result.totalScore < 50 
                        ? 'border-above-rose-300 hover:bg-above-rose-50' 
                        : 'border-above-blue-300 hover:bg-above-blue-50'
                    }`}
                    onClick={() => router.push(
                      assessmentData.result.totalScore < 50 
                        ? '/research/building-first-program'
                        : '/research/advanced-strategies'
                    )}
                  >
                    {assessmentData.result.totalScore < 50 ? 'Get Started →' : 'Learn More →'}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Industry-specific research */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-above-lavender-200 mb-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">
                🏭 {assessmentData.organizationData.industry} Industry Insights
              </h4>
              <p className="text-slate-600 mb-4">
                Your industry faces unique insider risk challenges. Explore tailored research and benchmark data specific to {assessmentData.organizationData.industry.toLowerCase()} organizations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="sm"
                  variant="outline"
                  className="border-above-lavender-300 hover:bg-above-lavender-50"
                  onClick={() => router.push(`/benchmarks?industry=${assessmentData.organizationData.industry}`)}
                >
                  📊 Industry Benchmarks
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  className="border-above-lavender-300 hover:bg-above-lavender-50"
                  onClick={() => router.push(`/research?filter=${assessmentData.organizationData.industry}`)}
                >
                  🔬 Industry Research
                </Button>
              </div>
            </div>
            
            {/* Email subscription */}
            <div className="bg-gradient-to-r from-above-blue-600 to-above-lavender-600 rounded-xl text-white p-6 text-center">
              <h4 className="text-xl font-bold mb-2">📧 Stay Ahead of Emerging Threats</h4>
              <p className="opacity-90 mb-4">
                Get the latest insider risk research, threat intelligence, and industry benchmarks delivered monthly.
              </p>
              <Button 
                size="lg"
                className="bg-white text-above-blue-600 hover:bg-gray-100 font-semibold"
                onClick={() => router.push('/contact?source=results-newsletter')}
              >
                Subscribe to Research Updates
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-above-rose-600 to-above-blue-600 rounded-2xl text-white shadow-2xl animate-slide-in-up" style={{ animationDelay: '1000ms' }}>
          <div className="p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              🚀 Ready to Transform Your Security Posture?
            </h3>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Above Security's Enterprise Insider Threat Intelligence Platform provides the tools and insights you need to move from reactive to proactive security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-white text-above-rose-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                onClick={() => window.open('https://abovesecurity.ai', '_blank')}
              >
                🔗 Learn About Above Security
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
                onClick={() => router.push('/contact')}
              >
                💬 Contact Our Experts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}