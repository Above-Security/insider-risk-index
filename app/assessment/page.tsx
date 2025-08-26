"use client";

import { useState, useEffect, useCallback } from "react";
import { OrganizationForm } from "@/components/assessment/organization-form";
import { QuestionCard } from "@/components/assessment/question-card";
import { ProgressHeader } from "@/components/assessment/progress-header";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment-questions";
import { calculateInsiderRiskIndex } from "@/lib/scoring";
import { AssessmentAnswer } from "@/lib/zod-schemas";
import { useRouter } from "next/navigation";
import { analytics } from "@/lib/analytics-client";
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
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard navigation in questions step
      if (currentStep !== "questions") return;
      
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'ArrowRight':
          case 'n':
            event.preventDefault();
            if (answers.has(ASSESSMENT_QUESTIONS[currentQuestionIndex].id)) {
              handleNext();
            }
            break;
          case 'ArrowLeft':
          case 'p':
            event.preventDefault();
            if (currentQuestionIndex > 0) {
              handlePrevious();
            }
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, currentQuestionIndex, answers]);
  
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

  const handleCompleteAssessment = useCallback(async () => {
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
  }, [organizationData, answers, router]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleCompleteAssessment();
    }
  }, [currentQuestionIndex, handleCompleteAssessment]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  if (currentStep === "organization") {
    return (
      <div className="min-h-screen bg-above-blue-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12 animate-fade-in">
              <div className="sr-only">
                <h1>Insider Risk Assessment - Step 1 of 2: Organization Information</h1>
                <p>Please provide your organization details to begin the assessment.</p>
              </div>
              <h1 
                className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl" 
                aria-label="Insider Risk Assessment"
              >
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
                <div className="flex items-center justify-center space-x-6" role="list" aria-label="Data sources">
                  <span role="listitem">• Ponemon Institute 2025</span>
                  <span role="listitem">• Gartner Market Guide G00805757</span>
                  <span role="listitem">• Verizon DBIR 2024</span>
                </div>
              </div>
            </div>
            
            <div className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
              <OrganizationForm onSubmit={handleOrganizationSubmit} />
            </div>
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
        {/* Skip link for screen readers */}
        <a 
          href="#main-question" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-above-rose-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main question
        </a>
        
        {/* Announcement for screen readers */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Question {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}: {currentQuestion.question}
        </div>
        
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

          <main id="main-question" role="main">
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
          </main>
          
          {/* Keyboard shortcuts help */}
          <div className="mt-8 text-center">
            <details className="inline-block text-sm text-slate-600">
              <summary className="cursor-pointer hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2 rounded px-2 py-1">
                Keyboard Shortcuts
              </summary>
              <div className="mt-2 p-3 bg-white rounded-lg border border-above-blue-200 text-left max-w-sm">
                <div className="space-y-1 text-xs">
                  <div><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">Ctrl+→</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">Ctrl+N</kbd> Next question</div>
                  <div><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">Ctrl+←</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">Ctrl+P</kbd> Previous question</div>
                  <div><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">Tab</kbd> Navigate between options</div>
                </div>
              </div>
            </details>
          </div>
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
      <div className="min-h-screen bg-above-blue-50 py-12 flex items-center justify-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-above-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-subtle">
              <div className="w-8 h-8 bg-above-rose-700 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Loading Assessment...</h1>
            <p className="text-slate-600">Please wait while we prepare your assessment.</p>
          </div>
        </div>
      </div>
    </>
  );
}