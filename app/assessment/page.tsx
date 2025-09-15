"use client";

import { useState, useEffect, useCallback } from "react";
import { OrganizationForm } from "@/components/assessment/organization-form";
import { QuestionCard } from "@/components/assessment/question-card";
import { ProgressHeader } from "@/components/assessment/progress-header";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment-questions";
import { calculateInsiderRiskIndex } from "@/lib/scoring";
import { AssessmentAnswer } from "@/lib/zod-schemas";
import { useRouter } from "next/navigation";
import { getAssessmentJsonLd } from "@/lib/seo";
import Script from "next/script";
import { submitAssessment } from "@/app/actions/assessment";

interface OrganizationData {
  organizationName: string;
  industry: string;
  employeeCount: string;
  contactEmail?: string;
  emailOptIn: boolean;
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
    console.log("🔍 Starting assessment completion...");
    console.log("Organization data:", organizationData);
    console.log("Answers count:", answers.size);
    console.log("Expected questions:", ASSESSMENT_QUESTIONS.length);

    if (!organizationData) {
      console.error("❌ No organization data found");
      return;
    }

    try {
      const answersArray = Array.from(answers.values());
      console.log("📊 Calculating score with", answersArray.length, "answers");
      
      // Calculate the score
      const result = calculateInsiderRiskIndex({
        answers: answersArray,
        industry: organizationData.industry,
        companySize: organizationData.employeeCount,
      });

      console.log("✅ Score calculated:", result.totalScore);

      // Convert answers Map to object for saving and sharing
      const answersObject: Record<string, number> = {};
      answers.forEach((answer) => {
        answersObject[answer.questionId] = answer.value;
      });

      // Save to localStorage for results page
      const assessmentData = {
        organizationData,
        result,
        completedAt: new Date().toISOString(),
        answers: answersObject, // Include original answers for sharing
      };

      // Submit to server (saves to database and sends email if opted in)
      try {
        console.log("📤 Submitting assessment to server...");

        // Map the string values to proper enum values
        const industryEnums = ['TECHNOLOGY', 'FINANCIAL_SERVICES', 'HEALTHCARE', 'RETAIL', 'MANUFACTURING', 'GOVERNMENT', 'EDUCATION', 'ENERGY', 'TELECOMMUNICATIONS', 'MEDIA_ENTERTAINMENT'] as const;
        const sizeEnums = ['STARTUP_1_50', 'SMALL_51_250', 'MID_251_1000', 'LARGE_1001_5000', 'ENTERPRISE_5000_PLUS'] as const;

        const industryMap: Record<string, typeof industryEnums[number]> = {
          'technology': 'TECHNOLOGY',
          'financial-services': 'FINANCIAL_SERVICES',
          'healthcare': 'HEALTHCARE',
          'retail': 'RETAIL',
          'manufacturing': 'MANUFACTURING',
          'government': 'GOVERNMENT',
          'education': 'EDUCATION',
          'energy': 'ENERGY',
          'telecommunications': 'TELECOMMUNICATIONS',
          'media-entertainment': 'MEDIA_ENTERTAINMENT',
        };

        const sizeMap: Record<string, typeof sizeEnums[number]> = {
          '1-50': 'STARTUP_1_50',
          '51-250': 'SMALL_51_250',
          '251-1000': 'MID_251_1000',
          '1001-5000': 'LARGE_1001_5000',
          '5000+': 'ENTERPRISE_5000_PLUS',
        };

        const serverResult = await submitAssessment({
          organizationName: organizationData.organizationName || undefined,
          industry: industryMap[organizationData.industry] || undefined,
          size: sizeMap[organizationData.employeeCount] || undefined,
          region: undefined,
          answers: answersObject,
          emailOptIn: organizationData.emailOptIn,
          contactEmail: organizationData.contactEmail,
        });

        if (serverResult.success && serverResult.assessmentId) {
          console.log("✅ Assessment submitted to server, ID:", serverResult.assessmentId);
          // Navigate to the proper results page with assessment ID
          router.push(`/results/${serverResult.assessmentId}`);
          return; // Exit early on successful server submission
        } else {
          console.error("⚠️ Server submission failed:", serverResult.error);
        }
      } catch (serverError) {
        console.error("⚠️ Server submission failed:", serverError);
      }

      // Fallback to localStorage-based results only if server submission fails
      if (typeof window !== "undefined") {
        localStorage.setItem("assessment-result", JSON.stringify(assessmentData));
        console.log("💾 Data saved to localStorage as fallback");

        // Verify data was saved
        const savedData = localStorage.getItem("assessment-result");
        if (savedData) {
          console.log("✅ Fallback data verified, navigating to localStorage-based results...");
          // Small delay to ensure localStorage is fully written
          setTimeout(() => {
            router.push("/assessment/results");
          }, 100);
        } else {
          console.error("❌ Failed to save data to localStorage");
          alert("There was an error saving your assessment. Please try again.");
        }
      }
    } catch (error) {
      console.error("❌ Error completing assessment:", error);
      alert("There was an error processing your assessment. Please try again.");
    }
  }, [organizationData, answers]);

  const handleNext = useCallback(() => {
    console.log(`📍 handleNext called - current index: ${currentQuestionIndex}/${ASSESSMENT_QUESTIONS.length - 1}`);
    
    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      console.log("➡️ Moving to next question");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("🏁 Reached final question, completing assessment");
      handleCompleteAssessment();
    }
  }, [currentQuestionIndex, handleCompleteAssessment]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

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
  }, [currentStep, currentQuestionIndex, answers, handleNext, handlePrevious]);

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