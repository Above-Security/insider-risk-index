"use client";

import { useState } from "react";
import { AssessmentQuestion } from "@/lib/zod-schemas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

  const handleValueChange = (newValue: string) => {
    const numValue = parseInt(newValue, 10);
    setSelectedValue(numValue);
    onAnswer(numValue, questionRationale);
  };

  const handleRationaleChange = (newRationale: string) => {
    setQuestionRationale(newRationale);
    if (selectedValue !== undefined) {
      onAnswer(selectedValue, newRationale);
    }
  };

  const selectedOption = question.options.find(opt => opt.value === selectedValue);

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
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
              variant="ghost"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex-shrink-0"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {showExplanation && question.explanation && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-900">{question.explanation}</p>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <RadioGroup value={selectedValue?.toString()} onValueChange={handleValueChange}>
          <div className="space-y-3">
            {question.options.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <RadioGroupItem 
                  value={option.value.toString()} 
                  id={`option-${option.value}`}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none flex-1">
                  <Label 
                    htmlFor={`option-${option.value}`}
                    className="text-sm font-medium cursor-pointer"
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
                  className="text-xs px-2 py-0.5"
                >
                  {option.value}pts
                </Badge>
              </div>
            ))}
          </div>
        </RadioGroup>

        {selectedValue !== undefined && selectedOption && (
          <div className="border-t pt-4 space-y-4">
            <div className="p-3 bg-gray-50 rounded-md">
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
            onClick={onPrevious}
            disabled={questionNumber === 1}
          >
            Previous
          </Button>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              Progress: {questionNumber}/{totalQuestions}
            </div>
            <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto mt-1">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          
          <Button
            onClick={onNext}
            disabled={selectedValue === undefined}
          >
            {isLast ? "Complete Assessment" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}