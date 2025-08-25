"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight,
  CheckCircle,
  Eye,
  Users,
  Shield,
  Key,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";

const previewQuestions = [
  {
    id: 1,
    pillar: "visibility",
    icon: Eye,
    color: "#3b82f6",
    question: "How quickly can your organization detect unauthorized access to sensitive data?",
    options: [
      "Within minutes through automated alerts",
      "Within hours through manual monitoring",
      "Within days through periodic reviews",
      "We discover breaches weeks or months later",
      "We have no detection capabilities"
    ]
  },
  {
    id: 2, 
    pillar: "coaching",
    icon: Users,
    color: "#10b981",
    question: "How does your organization handle employees who exhibit concerning behavior?",
    options: [
      "Structured intervention with HR and security",
      "Manager coaching and documentation",
      "Informal conversations only",
      "We typically wait and see",
      "No formal process exists"
    ]
  },
  {
    id: 3,
    pillar: "evidence",
    icon: Shield,
    color: "#8b5cf6",
    question: "What data retention capabilities does your organization maintain for investigations?",
    options: [
      "Comprehensive forensic capabilities (1+ years)",
      "Good retention with some gaps (6-12 months)",
      "Basic logging (1-6 months)",
      "Minimal retention (< 1 month)",
      "No systematic data retention"
    ]
  }
];

export function AssessmentPreview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = previewQuestions[currentQuestion];
  const IconComponent = question.icon;

  const handleNext = () => {
    if (currentQuestion < previewQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const resetPreview = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Preview Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            This was just a small taste of our comprehensive 20-question assessment. 
            The full assessment covers all 5 pillars with detailed analysis and benchmarking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/assessment">
                Take Full Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button variant="outline" onClick={resetPreview}>
              Try Preview Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${question.color}20` }}
            >
              <IconComponent className="h-6 w-6" style={{ color: question.color }} />
            </div>
            <div>
              <Badge 
                variant="outline" 
                style={{ color: question.color, borderColor: question.color }}
                className="text-xs mb-1"
              >
                {question.pillar.charAt(0).toUpperCase() + question.pillar.slice(1)} Pillar
              </Badge>
              <CardTitle className="text-lg">
                Question {currentQuestion + 1} of {previewQuestions.length}
              </CardTitle>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Preview Mode</div>
            <div className="w-24 bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / previewQuestions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {question.question}
          </h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                  <span className="text-sm">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            This is a preview. Full assessment has detailed explanations.
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="min-w-24"
          >
            {currentQuestion < previewQuestions.length - 1 ? 'Next' : 'Finish'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}