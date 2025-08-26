"use client";

import { useState } from "react";
import { OrganizationForm } from "@/components/assessment/organization-form";
import { QuestionCard } from "@/components/assessment/question-card";
import { ProgressHeader } from "@/components/assessment/progress-header";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment-questions";
import { calculateInsiderRiskIndex } from "@/lib/scoring";
import { AssessmentAnswer } from "@/lib/zod-schemas";
import { useRouter } from "next/navigation";
import { analytics } from "@/lib/analytics";
import { getAssessmentJsonLd } from "@/lib/seo";
import Script from "next/script";

interface OrganizationData {
  organizationName: string;
  industry: string;
  employeeCount: string;
  contactEmail?: string;
  includeInBenchmarks: boolean;
}

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<"organization" | "questions" | "complete">("organization");
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, AssessmentAnswer>>(new Map());
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  
  const handleOrganizationSubmit = async (data: OrganizationData) => {
    setOrganizationData(data);
    setCurrentStep("questions");
    
    // Track assessment start
    await analytics.trackAssessment({
      type: "assessment_started",
      industry: data.industry,
      companySize: data.employeeCount,
    });
  };

  const handleAnswer = (questionId: string, value: number, rationale?: string) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, { questionId, value, rationale });
    setAnswers(newAnswers);
    
    const newAnsweredQuestions = new Set(answeredQuestions);
    newAnsweredQuestions.add(questionId);
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const handleNext = () => {
    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleCompleteAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleCompleteAssessment = async () => {
    if (!organizationData) return;

    try {
      const answersArray = Array.from(answers.values());
      
      // Calculate the score
      const result = calculateInsiderRiskIndex({
        answers: answersArray,
        industry: organizationData.industry,
        companySize: organizationData.employeeCount,
      });

      // Track assessment completion
      await analytics.trackAssessment({
        type: "assessment_completed",
        industry: organizationData.industry,
        companySize: organizationData.employeeCount,
        score: result.totalScore,
        level: result.level,
      });

      // Save to localStorage for results page
      const assessmentData = {
        organizationData,
        result,
        completedAt: new Date().toISOString(),
      };
      
      if (typeof window !== "undefined") {
        localStorage.setItem("assessment-result", JSON.stringify(assessmentData));
      }

      // Navigate to results
      router.push("/assessment/results");
    } catch (error) {
      console.error("Error completing assessment:", error);
      // Handle error - could show an error message
    }
  };

  if (currentStep === "organization") {
    return (
      <div className="min-h-screen bg-above-blue-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Insider Risk Assessment
              </h1>
              <p className="mt-4 text-xl text-slate-600">
                Research-backed assessment framework developed from analysis of $17.4M average annual 
                insider threat costs and 48% increase in attack frequency
              </p>
              <div className="mt-6 text-sm text-slate-500">
                <p className="mb-2">
                  <strong>Methodology:</strong> 20 questions across 5 pillars weighted by economic impact analysis
                </p>
                <div className="flex items-center justify-center space-x-6">
                  <span>• Ponemon Institute 2025</span>
                  <span>• Gartner Market Guide G00805757</span>
                  <span>• Verizon DBIR 2024</span>
                </div>
              </div>
            </div>
            
            <OrganizationForm onSubmit={handleOrganizationSubmit} />
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "questions") {
    const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
    const currentAnswer = answers.get(currentQuestion.id);

    return (
      <div className="min-h-screen bg-above-blue-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <ProgressHeader
              currentQuestionIndex={currentQuestionIndex}
              answeredQuestions={answeredQuestions}
              organizationName={organizationData?.organizationName}
              industry={organizationData?.industry}
              employeeCount={organizationData?.employeeCount}
            />
          </div>

          <QuestionCard
            question={currentQuestion}
            value={currentAnswer?.value}
            rationale={currentAnswer?.rationale}
            onAnswer={(value, rationale) => handleAnswer(currentQuestion.id, value, rationale)}
            isLast={currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1}
            onNext={handleNext}
            onPrevious={handlePrevious}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={ASSESSMENT_QUESTIONS.length}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        id="assessment-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getAssessmentJsonLd()),
        }}
      />
      {/* Fallback for unexpected state */}
      <div className="min-h-screen bg-above-blue-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Loading Assessment...</h1>
          </div>
        </div>
      </div>
    </>
  );
}