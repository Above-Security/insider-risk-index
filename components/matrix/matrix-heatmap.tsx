'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  TrendingUp, 
  Shield, 
  Search,
  Eye,
  Users,
  Key,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';

interface MatrixTechnique {
  id: string;
  title: string;
  description: string;
  category: 'Motive' | 'Coercion' | 'Manipulation';
  preventions: any[];
  detections: any[];
  primaryPillar?: string;
  riskLevel?: number; // 1-5 scale
}

interface HeatmapData {
  techniques: MatrixTechnique[];
  pillarCoverage: Record<string, number>;
  categoryDistribution: Record<string, number>;
}

export function MatrixHeatmap() {
  const [data, setData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const pillars = [
    { id: 'visibility', name: 'Visibility', icon: Eye, color: 'bg-above-blue-500' },
    { id: 'prevention-coaching', name: 'Prevention & Coaching', icon: Users, color: 'bg-above-blue-500' },
    { id: 'investigation-evidence', name: 'Investigation & Evidence', icon: Search, color: 'bg-above-peach-500' },
    { id: 'identity-saas', name: 'Identity & SaaS', icon: Key, color: 'bg-above-lavender-500' },
    { id: 'phishing-resilience', name: 'Phishing Resilience', icon: ShieldAlert, color: 'bg-above-rose-500' }
  ];

  const categories = [
    { id: 'Motive', name: 'Motive', color: 'bg-above-rose-100 border-above-rose-300', textColor: 'text-above-rose-800' },
    { id: 'Means', name: 'Means', color: 'bg-above-peach-100 border-above-peach-300', textColor: 'text-above-peach-800' },
    { id: 'Preparation', name: 'Preparation', color: 'bg-above-lavender-100 border-above-lavender-300', textColor: 'text-above-lavender-800' },
    { id: 'Infringement', name: 'Infringement', color: 'bg-above-blue-100 border-above-blue-300', textColor: 'text-above-blue-800' },
    { id: 'Anti-forensics', name: 'Anti-forensics', color: 'bg-gray-100 border-gray-300', textColor: 'text-gray-800' }
  ];

  useEffect(() => {
    fetchMatrixData();
  }, []);

  const fetchMatrixData = async () => {
    try {
      const response = await fetch('/api/matrix/techniques');
      const result = await response.json();
      
      if (result.techniques) {
        // Process data for heatmap visualization
        const techniques = result.techniques.map((tech: any) => ({
          ...tech,
          riskLevel: calculateRiskLevel(tech),
          primaryPillar: determinePrimaryPillar(tech)
        }));

        const pillarCoverage = calculatePillarCoverage(techniques);
        const categoryDistribution = calculateCategoryDistribution(techniques);

        setData({
          techniques,
          pillarCoverage,
          categoryDistribution
        });
      }
    } catch (error) {
      console.error('Failed to fetch matrix data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskLevel = (technique: any): number => {
    // Risk level based on number of preventions/detections (fewer = higher risk)
    const preventionCount = technique.preventions?.length || 0;
    const detectionCount = technique.detections?.length || 0;
    const totalControls = preventionCount + detectionCount;
    
    if (totalControls === 0) return 5; // Critical
    if (totalControls <= 2) return 4; // High  
    if (totalControls <= 4) return 3; // Medium
    if (totalControls <= 6) return 2; // Low
    return 1; // Minimal
  };

  const determinePrimaryPillar = (technique: any): string => {
    // Simple logic to determine primary pillar based on preventions/detections
    const pillarCounts: Record<string, number> = {};
    
    technique.preventions?.forEach((prev: any) => {
      if (prev.primaryPillar) {
        pillarCounts[prev.primaryPillar] = (pillarCounts[prev.primaryPillar] || 0) + 1;
      }
    });

    technique.detections?.forEach((det: any) => {
      if (det.primaryPillar) {
        pillarCounts[det.primaryPillar] = (pillarCounts[det.primaryPillar] || 0) + 1;
      }
    });

    const entries = Object.entries(pillarCounts);
    if (entries.length === 0) {
      return 'visibility'; // Default fallback
    }

    return entries.reduce((a, b) => 
      pillarCounts[a[0]] > pillarCounts[b[0]] ? a : b
    )[0];
  };

  const calculatePillarCoverage = (techniques: MatrixTechnique[]): Record<string, number> => {
    const coverage: Record<string, number> = {};
    pillars.forEach(pillar => {
      coverage[pillar.id] = techniques.filter(tech => tech.primaryPillar === pillar.id).length;
    });
    return coverage;
  };

  const calculateCategoryDistribution = (techniques: MatrixTechnique[]): Record<string, number> => {
    const distribution: Record<string, number> = {};
    categories.forEach(category => {
      distribution[category.id] = techniques.filter(tech => tech.category === category.id).length;
    });
    return distribution;
  };

  const getRiskColor = (riskLevel: number): string => {
    switch (riskLevel) {
      case 5: return 'bg-above-rose-700'; // Critical
      case 4: return 'bg-above-rose-500'; // High
      case 3: return 'bg-above-peach-500'; // Medium
      case 2: return 'bg-above-blue-500'; // Low
      case 1: return 'bg-above-blue-800'; // Minimal
      default: return 'bg-above-blue-400';
    }
  };

  const getRiskLabel = (riskLevel: number): string => {
    switch (riskLevel) {
      case 5: return 'Critical Risk';
      case 4: return 'High Risk';
      case 3: return 'Medium Risk';
      case 2: return 'Low Risk';
      case 1: return 'Minimal Risk';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">Unable to load matrix data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredTechniques = selectedCategory === 'all' 
    ? data.techniques 
    : data.techniques.filter(tech => tech.category === selectedCategory);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </Badge>
          {categories.map(category => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className={`cursor-pointer ${category.textColor}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} ({data.categoryDistribution[category.id] || 0})
            </Badge>
          ))}
        </div>

        {/* Pillar Coverage Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Pillar Coverage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {pillars.map(pillar => {
                const PillarIcon = pillar.icon;
                const coverage = data.pillarCoverage[pillar.id] || 0;
                const percentage = data.techniques.length > 0 
                  ? Math.round((coverage / data.techniques.length) * 100)
                  : 0;
                
                return (
                  <div key={pillar.id} className="text-center">
                    <div className={`w-16 h-16 ${pillar.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <PillarIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{coverage}</div>
                    <div className="text-sm text-slate-600 mb-1">{pillar.name}</div>
                    <div className="text-xs text-slate-500">{percentage}%</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Risk Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Technique Risk Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {filteredTechniques.map((technique, index) => (
                <Tooltip key={technique.id}>
                  <TooltipTrigger>
                    <div
                      className={`
                        w-full h-16 ${getRiskColor(technique.riskLevel || 3)} 
                        rounded border-2 border-white hover:border-slate-300 
                        transition-all cursor-pointer opacity-80 hover:opacity-100
                        flex items-center justify-center
                      `}
                    >
                      <span className="text-xs text-white font-medium text-center px-1">
                        {technique.title.length > 12 
                          ? technique.title.substring(0, 12) + '...'
                          : technique.title
                        }
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="p-2">
                      <div className="font-semibold mb-1">{technique.title}</div>
                      <div className="text-sm mb-2">{technique.description}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="capitalize">{technique.category}</span>
                        <span className={`font-medium ${
                          technique.riskLevel === 5 ? 'text-above-rose-800' :
                          technique.riskLevel === 4 ? 'text-above-rose-500' :
                          technique.riskLevel === 3 ? 'text-above-peach-800' :
                          'text-above-blue-800'
                        }`}>
                          {getRiskLabel(technique.riskLevel || 3)}
                        </span>
                      </div>
                      <div className="text-xs mt-1 text-slate-600">
                        {technique.preventions?.length || 0} preventions, {technique.detections?.length || 0} detections
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center mt-6 space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-above-rose-700 rounded mr-2"></div>
                Critical Risk
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-above-rose-500 rounded mr-2"></div>
                High Risk
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-above-peach-500 rounded mr-2"></div>
                Medium Risk
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-above-blue-500 rounded mr-2"></div>
                Low Risk
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-above-blue-800 rounded mr-2"></div>
                Minimal Risk
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}