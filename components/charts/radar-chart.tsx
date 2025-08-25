"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { PILLARS, getPillarColor } from "@/lib/pillars";
import { ScoreBreakdown } from "@/lib/zod-schemas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RadarChartProps {
  pillarBreakdown: ScoreBreakdown[];
  title?: string;
  className?: string;
}

export function InsiderRiskRadarChart({ pillarBreakdown, title = "Risk Assessment Overview", className }: RadarChartProps) {
  // Transform data for radar chart
  const chartData = PILLARS.map(pillar => {
    const breakdown = pillarBreakdown.find(p => p.pillarId === pillar.id);
    return {
      pillar: pillar.name.split(" ")[0], // First word for cleaner display
      fullName: pillar.name,
      score: breakdown?.score || 0,
      maxScore: 100,
      color: pillar.color,
    };
  });

  return (
    <Card className={`bg-above-white border-above-rose-100/30 shadow-soft ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid className="stroke-muted" />
              <PolarAngleAxis 
                dataKey="pillar" 
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-muted-foreground"
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: 'currentColor' }}
                tickCount={6}
                className="text-muted-foreground"
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#7AB7FF"
                fill="#7AB7FF"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {chartData.map((item) => (
            <div key={item.pillar} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.fullName}</span>
              <span className="ml-auto font-medium">{item.score}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}