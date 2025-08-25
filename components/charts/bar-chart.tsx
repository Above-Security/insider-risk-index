"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ScoreBreakdown } from "@/lib/zod-schemas";
import { PILLARS, getPillarColor } from "@/lib/pillars";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PillarBarChartProps {
  pillarBreakdown: ScoreBreakdown[];
  benchmarkData?: Record<string, number>;
  title?: string;
  className?: string;
}

export function PillarBarChart({ 
  pillarBreakdown, 
  benchmarkData,
  title = "Pillar Scores Comparison",
  className 
}: PillarBarChartProps) {
  const chartData = PILLARS.map(pillar => {
    const breakdown = pillarBreakdown.find(p => p.pillarId === pillar.id);
    const benchmark = benchmarkData?.[pillar.id];
    
    return {
      name: pillar.name.replace(" & ", "\n& "),
      pillarId: pillar.id,
      score: breakdown?.score || 0,
      benchmark: benchmark || 0,
      color: pillar.color,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md">
          <p className="font-medium">{label.replace("\n", " ")}</p>
          <div className="space-y-1 mt-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="capitalize">{entry.dataKey}:</span>
                <span className="font-medium">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 11, fill: 'currentColor' }}
                angle={-45}
                textAnchor="end"
                height={80}
                className="text-muted-foreground"
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                name="Your Score"
              />
              {benchmarkData && (
                <Bar 
                  dataKey="benchmark" 
                  fill="#94A3B8"
                  radius={[4, 4, 0, 0]}
                  name="Industry Avg"
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Color-coded legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>Your Score</span>
          </div>
          {benchmarkData && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-400 rounded-full" />
              <span>Industry Average</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}