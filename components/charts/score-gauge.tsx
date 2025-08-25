"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getRiskLevel, getScoreLabel, getColorFromScore } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ScoreGauge({ score, size = "md", showLabel = true, className }: ScoreGaugeProps) {
  const riskLevel = getRiskLevel(score);
  const scoreLabel = getScoreLabel(score);
  const colors = getColorFromScore(score);
  
  // Create gauge data - we show the score and the remainder
  const gaugeData = [
    { name: "Score", value: score, color: riskLevel.color },
    { name: "Remaining", value: 100 - score, color: "#F8FBFF" }, // above-blue-50
  ];

  const sizeConfig = {
    sm: { width: 120, height: 120, fontSize: "text-lg", labelSize: "text-xs" },
    md: { width: 160, height: 160, fontSize: "text-2xl", labelSize: "text-sm" },
    lg: { width: 200, height: 200, fontSize: "text-3xl", labelSize: "text-base" },
  };

  const config = sizeConfig[size];

  return (
    <Card className={`bg-above-white border-above-rose-100/30 shadow-soft ${className}`}>
      <CardContent className="p-6 flex flex-col items-center">
        <div className="relative" style={{ width: config.width, height: config.height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius="70%"
                outerRadius="90%"
                paddingAngle={0}
                dataKey="value"
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Score display in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`font-bold ${config.fontSize}`} style={{ color: riskLevel.color }}>
              {Math.round(score)}
            </div>
            {showLabel && (
              <div className={`${config.labelSize} text-muted-foreground font-medium`}>
                {scoreLabel}
              </div>
            )}
          </div>
        </div>
        
        {showLabel && (
          <div className="mt-4 text-center">
            <div className="font-semibold text-sm" style={{ color: riskLevel.color }}>
              Level {riskLevel.level}: {riskLevel.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              {riskLevel.description}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SimpleScoreGaugeProps {
  score: number;
  maxScore?: number;
  label?: string;
  color?: string;
  className?: string;
}

export function SimpleScoreGauge({ 
  score, 
  maxScore = 100, 
  label, 
  color,
  className 
}: SimpleScoreGaugeProps) {
  const percentage = (score / maxScore) * 100;
  const displayColor = color || getRiskLevel(percentage).color;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#F8FBFF"
            strokeWidth="2"
          />
          {/* Progress circle */}
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={displayColor}
            strokeWidth="2"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Score in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color: displayColor }}>
            {Math.round(score)}
          </span>
        </div>
      </div>
      
      {label && (
        <div className="flex-1">
          <div className="font-medium text-sm">{label}</div>
          <div className="text-xs text-muted-foreground">
            {Math.round(score)}/{maxScore}
          </div>
        </div>
      )}
    </div>
  );
}