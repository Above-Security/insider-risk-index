"use client";

import { useState, useEffect, useRef } from "react";
import { AssessmentQuestion } from "@/lib/zod-schemas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AboveButton } from "@/components/ui/above-components";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Info, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: AssessmentQuestion;
  value?: number;
  rationale?: string;
  onAnswer: (value: number, rationale?: string) => void;
  isLast?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  questionNumber: number;
  totalQuestions: number;
  className?: string;
}

export function QuestionCard({
  question,
  value,
  rationale,
  onAnswer,
  isLast = false,
  onNext,
  onPrevious,
  questionNumber,
  totalQuestions,
  className,
}: QuestionCardProps) {
  const [selectedValue, setSelectedValue] = useState<number | undefined>(value);
  const [questionRationale, setQuestionRationale] = useState(rationale || "");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [pulseOption, setPulseOption] = useState<number | null>(null);
  
  // Refs for focus management
  const cardRef = useRef<HTMLDivElement>(null);
  const explanationButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  
  // Update state when props change (navigation between questions)
  useEffect(() => {
    setSelectedValue(value);
    setQuestionRationale(rationale || "");
    setShowExplanation(false);
    setIsNavigating(false);
    
    // Auto-focus the card for keyboard navigation
    if (cardRef.current) {
      cardRef.current.focus();
    }
  }, [question.id, value, rationale]);

  const handleValueChange = (newValue: string) => {
    const numValue = parseInt(newValue, 10);
    
    // If clicking the same option, provide visual feedback
    if (selectedValue === numValue) {
      setPulseOption(numValue);
      setTimeout(() => setPulseOption(null), 600);
      return;
    }
    
    setSelectedValue(numValue);
    onAnswer(numValue, questionRationale);
    
    // Auto-focus next button when selection is made
    setTimeout(() => {
      if (nextButtonRef.current) {
        nextButtonRef.current.focus();
      }
    }, 100);
  };

  const handleRationaleChange = (newRationale: string) => {
    setQuestionRationale(newRationale);
    if (selectedValue !== undefined) {
      onAnswer(selectedValue, newRationale);
    }
  };
  
  const handleNext = (e?: React.MouseEvent) => {
    console.log("🔘 QuestionCard handleNext called", { selectedValue, isNavigating });
    
    // Prevent default form submission behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (selectedValue === undefined) {
      console.log("❌ No value selected, returning");
      return;
    }
    
    console.log("✅ Calling onNext callback");
    setIsNavigating(true);
    onNext?.();
  };
  
  const handlePrevious = () => {
    setIsNavigating(true);
    onPrevious?.();
  };

  const selectedOption = question.options.find(opt => opt.value === selectedValue);

  return (
    <Card 
      ref={cardRef}
      tabIndex={-1}
      className={cn(
        "w-full max-w-4xl mx-auto bg-above-white border-above-rose-100/30 shadow-soft transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2",
        isNavigating && "opacity-75 pointer-events-none",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                Question {questionNumber} of {totalQuestions}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Weight: {Math.round(question.weight * 100)}%
              </Badge>
            </div>
            <CardTitle className="text-lg leading-7">
              {question.question}
            </CardTitle>
          </div>
          
          {question.explanation && (
            <Button
              ref={explanationButtonRef}
              variant="ghost"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex-shrink-0 hover:bg-above-blue-50 focus:bg-above-blue-50 focus:ring-2 focus:ring-above-blue-500 focus:ring-offset-1"
              aria-expanded={showExplanation}
              aria-label={showExplanation ? "Hide explanation" : "Show explanation"}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {showExplanation && question.explanation && (
          <div className="mt-3 p-3 bg-above-blue-50 border border-above-blue-200 rounded-md">
            <div className="flex gap-2">
              <Info className="h-4 w-4 text-above-blue-700 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-above-blue-900">{question.explanation}</p>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <RadioGroup 
          value={selectedValue?.toString()} 
          onValueChange={handleValueChange}
          className="focus-within:ring-2 focus-within:ring-above-rose-500 focus-within:ring-offset-2 rounded-md transition-all duration-200"
        >
          <div className="space-y-3">
            {question.options.map((option) => (
              <div 
                key={option.value} 
                className={cn(
                  "flex items-start space-x-3 group cursor-pointer rounded-lg p-3 -mx-3 transition-all duration-200",
                  selectedValue === option.value 
                    ? "bg-above-rose-50 border border-above-rose-200" 
                    : "hover:bg-slate-50 border border-transparent",
                  pulseOption === option.value && "animate-pulse-confirm ring-2 ring-above-rose-400"
                )}
                onClick={() => handleValueChange(option.value.toString())}
              >
                <RadioGroupItem 
                  value={option.value.toString()} 
                  id={`option-${option.value}`}
                  className="mt-1 focus:ring-above-rose-500 focus:ring-offset-2 transition-all duration-200 pointer-events-none"
                />
                <div className="grid gap-1.5 leading-none flex-1 pointer-events-none">
                  <Label 
                    htmlFor={`option-${option.value}`}
                    className="text-sm font-medium cursor-pointer transition-colors duration-200 group-hover:text-above-rose-700 group-focus-within:text-above-rose-700"
                  >
                    {option.label}
                  </Label>
                  {option.description && (
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </div>
                <Badge 
                  variant={selectedValue === option.value ? "default" : "outline"}
                  className={cn(
                    "text-xs px-2 py-0.5 transition-all duration-200 pointer-events-none",
                    selectedValue === option.value 
                      ? "bg-above-rose-700 text-white shadow-sm" 
                      : "hover:bg-above-rose-50 hover:border-above-rose-300 group-hover:bg-above-rose-50 group-hover:border-above-rose-300"
                  )}
                >
                  {option.value}pts
                </Badge>
              </div>
            ))}
          </div>
        </RadioGroup>

        {selectedValue !== undefined && selectedOption && (
          <div className="border-t pt-4 space-y-4">
            <div className="p-3 bg-above-blue-50 rounded-md">
              <p className="text-sm font-medium mb-1">Selected: {selectedOption.label}</p>
              {selectedOption.description && (
                <p className="text-xs text-muted-foreground">
                  {selectedOption.description}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rationale" className="text-sm font-medium">
                Additional Comments (Optional)
              </Label>
              <Textarea
                id="rationale"
                placeholder="Provide any additional context or rationale for your selection..."
                value={questionRationale}
                onChange={(e) => handleRationaleChange(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={questionNumber === 1 || isNavigating}
            className="focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              Progress: {questionNumber}/{totalQuestions}
            </div>
            <div className="w-64 h-2 bg-above-blue-100 rounded-full mx-auto mt-1">
              <div 
                className="h-full bg-above-rose-700 rounded-full transition-all duration-300"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          
          <Button
            ref={nextButtonRef}
            onClick={handleNext}
            disabled={selectedValue === undefined || isNavigating}
            type="button"
            className="bg-above-rose-600 hover:bg-above-rose-700 text-white focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLast ? "Complete Assessment" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}