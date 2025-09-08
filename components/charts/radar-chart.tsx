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
  console.log("🎯 RadarChart received pillarBreakdown:", pillarBreakdown);
  console.log("🎯 PILLARS array:", PILLARS);
  
  // Transform data for radar chart
  const chartData = PILLARS.map(pillar => {
    const breakdown = pillarBreakdown.find(p => p.pillarId === pillar.id);
    const transformed = {
      pillar: pillar.name.split(" ")[0], // First word for cleaner display
      fullName: pillar.name,
      score: breakdown?.score || 0,
      maxScore: 100,
      color: pillar.color,
    };
    console.log(`🎯 Pillar ${pillar.id}:`, { 
      pillarBreakdown_found: breakdown, 
      transformed,
      pillar_name: pillar.name,
      pillar_color: pillar.color
    });
    return transformed;
  });
  
  console.log("🎯 Final chartData:", chartData);
  console.log("🎯 chartData has items:", chartData.length);
  console.log("🎯 chartData sample scores:", chartData.map(d => ({ pillar: d.pillar, score: d.score })));

  return (
    <Card className={`bg-white border-rose-200 shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full" style={{ minHeight: '400px', width: '100%' }}>
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="pillar" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickCount={6}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p>No chart data available</p>
                <p className="text-sm">chartData: {JSON.stringify(chartData)}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {chartData.map((item) => (
            <div key={item.pillar} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600">{item.fullName}</span>
              <span className="ml-auto font-medium">{item.score}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}