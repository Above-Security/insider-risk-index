"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ResultsSummary } from "@/components/assessment/results-summary";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { AssessmentResult } from "@/lib/zod-schemas";
import { analytics } from "@/lib/analytics";

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
}

export default function AssessmentResultsPage() {
  const router = useRouter();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load assessment data from localStorage with smooth loading
    const loadData = async () => {
      try {
        // Add slight delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const storedData = localStorage.getItem("assessment-result");
        if (storedData) {
          const data = JSON.parse(storedData) as AssessmentData;
          setAssessmentData(data);
          
          // Track results viewing
          analytics.trackPageView("/assessment/results", {
            score: data.result.totalScore,
            level: data.result.level,
            industry: data.organizationData.industry,
          });
          
          // Trigger fade-in animation
          setTimeout(() => setFadeIn(true), 100);
        } else {
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
      // Track PDF generation
      await analytics.trackContent({
        type: "pdf_generated",
        contentId: `${type}-${Date.now()}`,
        contentType: "pdf",
      });

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
    return (
      <div className="min-h-screen bg-above-blue-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertDescription>
              {error || "Assessment results not found."}
            </AlertDescription>
          </Alert>
          
          <div className="mt-8 text-center space-y-4">
            <Button onClick={handleRetakeAssessment} size="lg">
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
          />
        </div>

        {/* Additional Actions */}
        <div className="mt-12 bg-white rounded-lg border p-6 shadow-sm animate-slide-in-up" style={{ animationDelay: '400ms' }}>
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">What would you like to do next?</h3>
              <p className="text-slate-600">Continue your insider risk management journey</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Button 
                variant="outline" 
                onClick={handleRetakeAssessment}
                className="h-auto p-6 flex-col space-y-3 hover:bg-above-rose-50 hover:border-above-rose-300 focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2 transition-all duration-200 group"
              >
                <div className="text-base font-semibold group-hover:text-above-rose-700 transition-colors">Retake Assessment</div>
                <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">Get updated results with current state</div>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push("/playbooks")}
                className="h-auto p-6 flex-col space-y-3 hover:bg-above-blue-50 hover:border-above-blue-300 focus:ring-2 focus:ring-above-blue-500 focus:ring-offset-2 transition-all duration-200 group"
              >
                <div className="text-base font-semibold group-hover:text-above-blue-700 transition-colors">Browse Playbooks</div>
                <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">Detailed implementation guides</div>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push("/benchmarks")}
                className="h-auto p-6 flex-col space-y-3 hover:bg-above-lavender-50 hover:border-above-lavender-300 focus:ring-2 focus:ring-above-lavender-500 focus:ring-offset-2 transition-all duration-200 group"
              >
                <div className="text-base font-semibold group-hover:text-above-lavender-700 transition-colors">View Benchmarks</div>
                <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">Industry comparisons & trends</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}