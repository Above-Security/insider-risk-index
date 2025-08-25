"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle } from "lucide-react";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment-questions";
import { PILLARS } from "@/lib/pillars";

interface ProgressHeaderProps {
  currentQuestionIndex: number;
  answeredQuestions: Set<string>;
  organizationName?: string;
  industry?: string;
  employeeCount?: string;
}

export function ProgressHeader({ 
  currentQuestionIndex, 
  answeredQuestions,
  organizationName,
  industry,
  employeeCount
}: ProgressHeaderProps) {
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const completedQuestions = answeredQuestions.size;
  const estimatedTimeRemaining = Math.max(1, Math.ceil((totalQuestions - completedQuestions) * 0.5));

  // Calculate pillar progress
  const pillarProgress = PILLARS.map(pillar => {
    const pillarQuestions = ASSESSMENT_QUESTIONS.filter(q => q.pillar === pillar.id);
    const answeredPillarQuestions = pillarQuestions.filter(q => answeredQuestions.has(q.id));
    const progress = pillarQuestions.length > 0 ? (answeredPillarQuestions.length / pillarQuestions.length) * 100 : 0;
    
    return {
      ...pillar,
      totalQuestions: pillarQuestions.length,
      answeredQuestions: answeredPillarQuestions.length,
      progress
    };
  });

  return (
    <div className="space-y-6">
      {/* Organization Info */}
      {organizationName && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Assessment for {organizationName}
          </h1>
          {industry && employeeCount && (
            <p className="text-gray-600">
              {industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {employeeCount} employees
            </p>
          )}
        </div>
      )}

      {/* Overall Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
              <p className="text-sm text-gray-600">
                {completedQuestions} of {totalQuestions} questions completed
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                ~{estimatedTimeRemaining} min remaining
              </div>
              <Badge variant="outline">
                {Math.round(progressPercentage)}% complete
              </Badge>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-3 mb-4" />
          
          {/* Pillar Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {pillarProgress.map((pillar) => (
              <div key={pillar.id} className="text-center">
                <div 
                  className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${pillar.color}20` }}
                >
                  {pillar.progress === 100 ? (
                    <CheckCircle className="h-4 w-4" style={{ color: pillar.color }} />
                  ) : (
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: pillar.color }}
                    />
                  )}
                </div>
                <div className="text-xs font-medium text-gray-900 mb-1">
                  {pillar.name}
                </div>
                <div className="text-xs text-gray-600">
                  {pillar.answeredQuestions}/{pillar.totalQuestions}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div 
                    className="h-1 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: pillar.color,
                      width: `${pillar.progress}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}