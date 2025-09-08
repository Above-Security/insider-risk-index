"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResultsSummary } from "@/components/assessment/results-summary";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Shield, Award, ExternalLink } from "lucide-react";
import { AssessmentResult } from "@/lib/zod-schemas";
import { calculateInsiderRiskIndex } from "@/lib/scoring";
import { decodeAssessmentData, ShareableAssessmentData } from "@/lib/share-utils";
import Link from "next/link";

interface AssessmentData {
  organizationData: {
    organizationName: string;
    industry: string;
    employeeCount: string;
  };
  result: AssessmentResult;
  completedAt: string;
}

function ShareableResultsContent() {
  const searchParams = useSearchParams();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedData = async () => {
      try {
        const encodedData = searchParams.get('data');
        
        if (!encodedData) {
          throw new Error('No assessment data found in URL');
        }

        console.log('🔍 Loading shared assessment data...');
        
        // Decode the shared data
        const sharedData: ShareableAssessmentData = decodeAssessmentData(encodedData);
        
        console.log('✅ Successfully decoded shared data:', {
          orgName: sharedData.organizationData.organizationName,
          answersCount: Object.keys(sharedData.answers).length,
          completedAt: sharedData.completedAt
        });

        // Convert answers to the format expected by the scoring system
        const answersArray = Object.entries(sharedData.answers).map(([questionId, value]) => ({
          questionId,
          value,
        }));

        // Calculate the assessment result
        const result = calculateInsiderRiskIndex({
          answers: answersArray,
          industry: sharedData.organizationData.industry,
          companySize: sharedData.organizationData.employeeCount,
        });

        setAssessmentData({
          organizationData: sharedData.organizationData,
          result,
          completedAt: sharedData.completedAt,
        });

      } catch (error) {
        console.error('❌ Error loading shared assessment:', error);
        setError(error instanceof Error ? error.message : 'Failed to load assessment data');
      } finally {
        setLoading(false);
      }
    };

    loadSharedData();
  }, [searchParams]);

  const handleGeneratePDF = async (type: "board-brief" | "detailed-plan") => {
    if (!assessmentData) return;
    
    // For shared results, we can't use the database ID, so we'll create a temporary approach
    // In a real implementation, you might want to create a temporary assessment record
    console.log(`Generating ${type} PDF for shared results...`);
    alert(`PDF generation for shared results is not yet implemented. Please take your own assessment at /assessment to generate PDFs.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-above-blue-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-above-blue-600 mx-auto" />
          <div className="text-lg font-medium text-gray-700">Loading shared assessment results...</div>
          <div className="text-sm text-gray-500">Decoding assessment data</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-above-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700">Unable to Load Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3 text-center">
              <p className="text-sm text-gray-600">
                The shared assessment link may be invalid or corrupted.
              </p>
              
              <div className="flex flex-col gap-2">
                <Link href="/assessment" passHref>
                  <Button className="w-full">
                    Take New Assessment
                  </Button>
                </Link>
                <Link href="/" passHref>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assessmentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-above-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Award className="h-8 w-8 text-above-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shared Assessment Results</h1>
                <p className="text-gray-600">Insider Risk Index Assessment</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/assessment" passHref>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Take Your Own Assessment
                </Button>
              </Link>
              <Link href="/" passHref>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Results Notice */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Shared Assessment Results</strong> - These results were shared from another organization's assessment completed on {new Date(assessmentData.completedAt).toLocaleDateString()}. 
            This is a read-only view. <Link href="/assessment" className="underline text-above-blue-600">Take your own assessment</Link> to get personalized results and PDF reports.
          </AlertDescription>
        </Alert>
      </div>

      {/* Results Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <ResultsSummary
          result={assessmentData.result}
          organizationInfo={assessmentData.organizationData}
          onGeneratePDF={handleGeneratePDF}
          className="animate-fadeIn"
        />
      </div>
    </div>
  );
}

export default function ShareableResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-above-blue-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-above-blue-600 mx-auto" />
          <div className="text-lg font-medium text-gray-700">Loading shared assessment results...</div>
        </div>
      </div>
    }>
      <ShareableResultsContent />
    </Suspense>
  );
}