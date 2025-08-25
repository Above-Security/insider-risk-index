"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const mockResults = {
  totalScore: 67,
  level: 3,
  levelName: "Managed",
  pillarScores: [
    { name: "Visibility", score: 75, color: "#3b82f6" },
    { name: "Coaching", score: 62, color: "#10b981" },
    { name: "Evidence", score: 58, color: "#8b5cf6" },
    { name: "Identity", score: 72, color: "#f59e0b" },
    { name: "Phishing", score: 68, color: "#ef4444" },
  ]
};

export function ResultsPreview() {
  const maxScore = Math.max(...mockResults.pillarScores.map(p => p.score));
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <Badge variant="secondary" className="text-xs">Sample Results</Badge>
        </div>
        <CardTitle className="text-2xl">Your Assessment Results Preview</CardTitle>
        <p className="text-gray-600">
          See how your results would look with detailed analysis and recommendations
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score Overview */}
          <div className="space-y-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {mockResults.totalScore}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-1">
                Overall Score
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Level {mockResults.level}: {mockResults.levelName}
              </Badge>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Pillar Breakdown</h4>
              <div className="space-y-3">
                {mockResults.pillarScores.map((pillar) => (
                  <div key={pillar.name} className="flex items-center gap-3">
                    <div className="w-20 text-sm font-medium text-gray-700">
                      {pillar.name}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{ 
                            backgroundColor: pillar.color,
                            width: `${pillar.score}%`
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-sm font-semibold text-gray-900">
                      {pillar.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Visual Radar Chart (Simplified) */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 mb-6">
              {/* Radar Chart Background */}
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Grid circles */}
                {[1, 2, 3, 4].map((ring) => (
                  <circle
                    key={ring}
                    cx="100"
                    cy="100"
                    r={ring * 20}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Grid lines */}
                {mockResults.pillarScores.map((_, index) => {
                  const angle = (index * 72 - 90) * Math.PI / 180;
                  const x2 = 100 + 80 * Math.cos(angle);
                  const y2 = 100 + 80 * Math.sin(angle);
                  return (
                    <line
                      key={index}
                      x1="100"
                      y1="100"
                      x2={x2}
                      y2={y2}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  );
                })}
                
                {/* Data polygon */}
                <polygon
                  points={mockResults.pillarScores
                    .map((pillar, index) => {
                      const angle = (index * 72 - 90) * Math.PI / 180;
                      const radius = (pillar.score / 100) * 80;
                      const x = 100 + radius * Math.cos(angle);
                      const y = 100 + radius * Math.sin(angle);
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  fill="rgba(59, 130, 246, 0.2)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                
                {/* Data points */}
                {mockResults.pillarScores.map((pillar, index) => {
                  const angle = (index * 72 - 90) * Math.PI / 180;
                  const radius = (pillar.score / 100) * 80;
                  const x = 100 + radius * Math.cos(angle);
                  const y = 100 + radius * Math.sin(angle);
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={pillar.color}
                    />
                  );
                })}
                
                {/* Labels */}
                {mockResults.pillarScores.map((pillar, index) => {
                  const angle = (index * 72 - 90) * Math.PI / 180;
                  const labelRadius = 95;
                  const x = 100 + labelRadius * Math.cos(angle);
                  const y = 100 + labelRadius * Math.sin(angle);
                  return (
                    <text
                      key={index}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-medium fill-gray-700"
                    >
                      {pillar.name}
                    </text>
                  );
                })}
              </svg>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Interactive radar chart showing your strength across all pillars
              </p>
              <Button asChild>
                <Link href="/assessment">
                  Get Your Real Results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}