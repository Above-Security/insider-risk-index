"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Target, TrendingUp } from "lucide-react";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment-questions";
import { PILLARS } from "@/lib/pillars";
import { cn } from "@/lib/utils";

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
    const pillarQuestions = ASSESSMENT_QUESTIONS.filter(q => q.pillarId === pillar.id);
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
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm border border-above-rose-100">
            <div className="w-10 h-10 bg-above-rose-100 rounded-full flex items-center justify-center">
              <Target className="h-5 w-5 text-above-rose-700" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-slate-900">
                {organizationName}
              </h1>
              {industry && employeeCount && (
                <p className="text-sm text-slate-600">
                  {industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {employeeCount} employees
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overall Progress */}
      <Card className="animate-slide-in-up border-above-rose-100/50 shadow-soft">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-above-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-above-blue-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Assessment Progress</h3>
                <p className="text-sm text-slate-600">
                  {completedQuestions} of {totalQuestions} questions completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-above-blue-50 rounded-full px-3 py-1">
                <Clock className="h-4 w-4" />
                ~{estimatedTimeRemaining} min remaining
              </div>
              <Badge 
                variant={progressPercentage > 75 ? "default" : "outline"}
                className={cn(
                  "px-3 py-1 text-sm font-semibold",
                  progressPercentage > 75 && "bg-above-rose-700 text-white"
                )}
              >
                {Math.round(progressPercentage)}% complete
              </Badge>
            </div>
          </div>
          
          <div className="mb-6">
            <Progress 
              value={progressPercentage} 
              className="h-4 bg-above-blue-100 [&>div]:bg-above-rose-700 [&>div]:transition-all [&>div]:duration-500 shadow-inner rounded-full"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
              <span>Start</span>
              <span className="font-medium text-slate-700">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span>Complete</span>
            </div>
          </div>
          
          {/* Pillar Progress */}
          <div className="bg-above-blue-50/30 rounded-xl p-4 border border-above-blue-100/50">
            <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-above-rose-700 rounded-full"></div>
              Pillar Progress
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {pillarProgress.map((pillar, index) => (
                <div 
                  key={pillar.id} 
                  className={cn(
                    "group relative bg-white rounded-lg p-3 border transition-all duration-300 hover:shadow-md hover:scale-105 cursor-default",
                    pillar.progress === 100 
                      ? "border-green-200 bg-green-50" 
                      : pillar.progress > 0 
                      ? "border-above-rose-200 bg-above-rose-50" 
                      : "border-slate-200 hover:border-slate-300"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-center">
                    <div 
                      className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${pillar.color}15` }}
                    >
                      {pillar.progress === 100 ? (
                        <CheckCircle className="h-5 w-5 text-green-600 animate-pulse-subtle" />
                      ) : (
                        <div 
                          className="w-5 h-5 rounded-full transition-all duration-300" 
                          style={{ backgroundColor: pillar.color }}
                        />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                      {pillar.name}
                    </div>
                    <div className="text-xs text-slate-600 mb-2">
                      {pillar.answeredQuestions}/{pillar.totalQuestions} questions
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full transition-all duration-700 ease-out"
                        style={{ 
                          backgroundColor: pillar.progress === 100 ? '#10b981' : pillar.color,
                          width: `${pillar.progress}%`,
                          boxShadow: pillar.progress > 0 ? `0 0 8px ${pillar.color}40` : 'none'
                        }}
                      />
                    </div>
                    <div className="text-xs font-medium text-slate-700 mt-1">
                      {Math.round(pillar.progress)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}