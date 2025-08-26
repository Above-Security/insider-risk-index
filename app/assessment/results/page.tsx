"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    // Load assessment data from localStorage
    try {
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
      } else {
        setError("No assessment results found. Please take the assessment first.");
      }
    } catch (err) {
      console.error("Error loading assessment data:", err);
      setError("Error loading assessment results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGeneratePDF = async (type: "board-brief" | "detailed-plan") => {
    if (!assessmentData) return;
    
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
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your results...</p>
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
    <div className="min-h-screen bg-above-blue-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="text-sm text-slate-500">
            Completed: {new Date(assessmentData.completedAt).toLocaleDateString()}
          </div>
        </div>

        {/* Results Summary */}
        <ResultsSummary
          result={assessmentData.result}
          organizationInfo={assessmentData.organizationData}
          onGeneratePDF={handleGeneratePDF}
        />

        {/* Additional Actions */}
        <div className="mt-12 bg-white rounded-lg border p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">What would you like to do next?</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                onClick={handleRetakeAssessment}
                className="h-auto p-4 flex-col space-y-2"
              >
                <div className="font-medium">Retake Assessment</div>
                <div className="text-xs text-slate-500">Get updated results</div>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push("/playbooks")}
                className="h-auto p-4 flex-col space-y-2"
              >
                <div className="font-medium">Browse Playbooks</div>
                <div className="text-xs text-slate-500">Implementation guides</div>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push("/benchmarks")}
                className="h-auto p-4 flex-col space-y-2"
              >
                <div className="font-medium">View Benchmarks</div>
                <div className="text-xs text-slate-500">Industry comparisons</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}