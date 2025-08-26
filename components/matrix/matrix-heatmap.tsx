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

interface MatrixElement {
  id: string;
  title: string;
  description: string;
  category: 'Motive' | 'Means' | 'Preparation' | 'Infringement' | 'Anti-forensics';
  preventions: any[];
  detections: any[];
  primaryPillar?: string;
  riskLevel?: number; // 1-5 scale
}

// Helper function to get correct terminology for each theme
const getCategoryTerminology = (category: string): string => {
  switch (category) {
    case 'Motive': return 'motivations';
    case 'Means': return 'capabilities'; 
    case 'Preparation': return 'activities';
    case 'Infringement': return 'techniques';
    case 'Anti-forensics': return 'techniques';
    default: return 'elements';
  }
};

interface HeatmapData {
  elements: MatrixElement[];
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
      const response = await fetch('/api/matrix');
      const result = await response.json();
      
      if (result.elements) {
        // Process data for heatmap visualization
        const techniques = result.elements.map((tech: MatrixElement) => ({
          ...tech,
          riskLevel: calculateRiskLevel(tech),
          primaryPillar: determinePrimaryPillar(tech)
        }));

        const pillarCoverage = calculatePillarCoverage(techniques);
        const categoryDistribution = calculateCategoryDistribution(techniques);

        setData({
          elements: techniques,
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
    // Calculate risk based on technique category and characteristics
    const title = technique.title?.toLowerCase() || '';
    const description = technique.description?.toLowerCase() || '';
    const category = technique.category;
    
    // Critical risk techniques (5)
    if (category === 'Infringement') {
      if (title.includes('exfiltration') || title.includes('destruction') || 
          title.includes('sabotage') || description.includes('critical data')) {
        return 5;
      }
      return 4; // Other infringement actions are high risk
    }
    
    // High risk techniques (4)
    if (category === 'Anti-forensics') {
      return 4; // Covering tracks is always high risk
    }
    
    // Medium-High risk (3-4)
    if (category === 'Preparation') {
      if (title.includes('privilege') || title.includes('credential') || 
          description.includes('escalat')) {
        return 4;
      }
      return 3;
    }
    
    // Medium risk (3)
    if (category === 'Means') {
      if (title.includes('admin') || title.includes('bypass') || 
          description.includes('unauthoriz')) {
        return 4;
      }
      return 3;
    }
    
    // Low-Medium risk (2-3)
    if (category === 'Motive') {
      if (title.includes('financial') || title.includes('espionage') || 
          title.includes('revenge')) {
        return 3;
      }
      return 2;
    }
    
    return 2; // Default low risk
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

  const calculatePillarCoverage = (techniques: MatrixElement[]): Record<string, number> => {
    const coverage: Record<string, number> = {};
    pillars.forEach(pillar => {
      coverage[pillar.id] = techniques.filter(tech => tech.primaryPillar === pillar.id).length;
    });
    return coverage;
  };

  const calculateCategoryDistribution = (techniques: MatrixElement[]): Record<string, number> => {
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
    ? data.elements 
    : data.elements.filter(tech => tech.category === selectedCategory);

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
                const percentage = data.elements.length > 0 
                  ? Math.round((coverage / data.elements.length) * 100)
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

        {/* Risk Heatmap Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Risk Distribution by Category
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Showing risk levels across different threat categories
            </p>
          </CardHeader>
          <CardContent>
            {/* Risk Level Legend */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-slate-700">Risk Level:</span>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-above-blue-400 rounded"></div>
                  <span className="text-xs text-slate-600">Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-above-peach-500 rounded"></div>
                  <span className="text-xs text-slate-600">Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-above-rose-500 rounded"></div>
                  <span className="text-xs text-slate-600">High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-above-rose-700 rounded"></div>
                  <span className="text-xs text-slate-600">Critical</span>
                </div>
              </div>
            </div>

            {/* Category Risk Matrix */}
            <div className="space-y-4">
              {categories.map(category => {
                const categoryTechniques = data.elements.filter(t => t.category === category.id);
                const riskDistribution = {
                  critical: categoryTechniques.filter(t => (t.riskLevel || 3) === 5).length,
                  high: categoryTechniques.filter(t => (t.riskLevel || 3) === 4).length,
                  medium: categoryTechniques.filter(t => (t.riskLevel || 3) === 3).length,
                  low: categoryTechniques.filter(t => (t.riskLevel || 3) <= 2).length,
                };
                const total = categoryTechniques.length;
                
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${category.textColor}`}>
                        {category.name} ({total} {getCategoryTerminology(category.id)})
                      </h4>
                    </div>
                    <div className="flex gap-1 h-8">
                      {total > 0 ? (
                        <>
                          {riskDistribution.critical > 0 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className="bg-above-rose-700 rounded transition-all hover:opacity-80"
                                  style={{ width: `${(riskDistribution.critical / total) * 100}%` }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{riskDistribution.critical} Critical Risk</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {riskDistribution.high > 0 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className="bg-above-rose-500 rounded transition-all hover:opacity-80"
                                  style={{ width: `${(riskDistribution.high / total) * 100}%` }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{riskDistribution.high} High Risk</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {riskDistribution.medium > 0 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className="bg-above-peach-500 rounded transition-all hover:opacity-80"
                                  style={{ width: `${(riskDistribution.medium / total) * 100}%` }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{riskDistribution.medium} Medium Risk</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {riskDistribution.low > 0 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className="bg-above-blue-400 rounded transition-all hover:opacity-80"
                                  style={{ width: `${(riskDistribution.low / total) * 100}%` }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{riskDistribution.low} Low Risk</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </>
                      ) : (
                        <div className="bg-slate-100 rounded w-full" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Highest Risk Techniques */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h4 className="font-medium text-slate-700 mb-4">Highest Risk Techniques</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.elements
                  .filter(t => (t.riskLevel || 3) >= 4)
                  .sort((a, b) => (b.riskLevel || 3) - (a.riskLevel || 3))
                  .slice(0, 6)
                  .map(technique => (
                    <Tooltip key={technique.id}>
                      <TooltipTrigger asChild>
                        <div className={`p-3 rounded border ${
                          technique.riskLevel === 5 ? 'bg-above-rose-50 border-above-rose-200' :
                          technique.riskLevel === 4 ? 'bg-above-peach-50 border-above-peach-200' :
                          'bg-above-lavender-50 border-above-lavender-200'
                        } hover:shadow-md transition-all cursor-pointer`}>
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-sm font-medium text-slate-800 line-clamp-1">
                              {technique.title}
                            </span>
                            <Badge variant="outline" className={`ml-2 text-xs ${
                              technique.riskLevel === 5 ? 'text-above-rose-700 border-above-rose-400' :
                              technique.riskLevel === 4 ? 'text-above-peach-700 border-above-peach-400' :
                              'text-above-lavender-700 border-above-lavender-400'
                            }`}>
                              {getRiskLabel(technique.riskLevel || 3)}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {technique.description}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-md">
                        <div className="p-2">
                          <div className="font-semibold mb-1">{technique.title}</div>
                          <div className="text-sm mb-2">{technique.description}</div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="capitalize">{technique.category}</span>
                            <span>{technique.preventions?.length || 0} preventions, {technique.detections?.length || 0} detections</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
              ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}