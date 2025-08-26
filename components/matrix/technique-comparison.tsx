'use client';

import { useState, useEffect } from 'react';
import { MatrixElement } from '@/lib/matrix-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  GitCompare, 
  Search, 
  Shield, 
  Eye, 
  Users, 
  Key, 
  ShieldAlert,
  Plus,
  X,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface TechniqueComparison {
  id: string;
  title: string;
  description: string;
  category: string;
  preventions: any[];
  detections: any[];
  riskScore: number;
  controlGaps: string[];
  strengths: string[];
}

export function TechniqueComparison() {
  const [techniques, setTechniques] = useState<any[]>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const pillars = [
    { id: 'visibility', name: 'Visibility', icon: Eye, color: '#7AB7FF' },
    { id: 'prevention-coaching', name: 'Prevention & Coaching', icon: Users, color: '#FF89A1' },
    { id: 'investigation-evidence', name: 'Investigation & Evidence', icon: Search, color: '#FF9C7A' },
    { id: 'identity-saas', name: 'Identity & SaaS', icon: Key, color: '#C8B3FF' },
    { id: 'phishing-resilience', name: 'Phishing Resilience', icon: ShieldAlert, color: '#FF5D78' }
  ];

  useEffect(() => {
    fetchTechniques();
  }, []);

  const fetchTechniques = async () => {
    try {
      const response = await fetch('/api/matrix/techniques');
      const data = await response.json();
      
      if (data.elements) {
        const processedTechniques = data.elements.map((tech: MatrixElement) => ({
          ...tech,
          riskScore: calculateRiskScore(tech),
          controlGaps: identifyControlGaps(tech),
          strengths: identifyStrengths(tech)
        }));
        setTechniques(processedTechniques);
      }
    } catch (error) {
      console.error('Failed to fetch techniques:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskScore = (technique: any): number => {
    // Calculate risk based on prevention/detection coverage
    const preventionCount = technique.preventions?.length || 0;
    const detectionCount = technique.detections?.length || 0;
    const totalControls = preventionCount + detectionCount;
    
    // Risk score from 1-10 (10 being highest risk)
    if (totalControls === 0) return 10;
    if (totalControls <= 2) return 8;
    if (totalControls <= 4) return 6;
    if (totalControls <= 6) return 4;
    return 2;
  };

  const identifyControlGaps = (technique: any): string[] => {
    const gaps: string[] = [];
    const preventionCount = technique.preventions?.length || 0;
    const detectionCount = technique.detections?.length || 0;
    
    if (preventionCount === 0) gaps.push('No prevention strategies');
    if (detectionCount === 0) gaps.push('No detection methods');
    if (preventionCount < 3) gaps.push('Limited prevention coverage');
    if (detectionCount < 3) gaps.push('Limited detection coverage');
    
    return gaps;
  };

  const identifyStrengths = (technique: any): string[] => {
    const strengths: string[] = [];
    const preventionCount = technique.preventions?.length || 0;
    const detectionCount = technique.detections?.length || 0;
    
    if (preventionCount >= 5) strengths.push('Comprehensive prevention strategies');
    if (detectionCount >= 5) strengths.push('Robust detection methods');
    if (preventionCount + detectionCount >= 8) strengths.push('Well-covered technique');
    
    return strengths;
  };

  const toggleTechnique = (techniqueId: string) => {
    if (selectedTechniques.includes(techniqueId)) {
      setSelectedTechniques(selectedTechniques.filter(id => id !== techniqueId));
    } else if (selectedTechniques.length < 3) {
      setSelectedTechniques([...selectedTechniques, techniqueId]);
    }
  };

  const getSelectedTechniqueData = (): TechniqueComparison[] => {
    return selectedTechniques.map(id => {
      const technique = techniques.find(t => t.id === id);
      return technique || null;
    }).filter(Boolean);
  };

  const getPillarCoverage = (technique: any, pillarId: string): number => {
    const preventions = technique.preventions?.filter((p: any) => p.primaryPillar === pillarId) || [];
    const detections = technique.detections?.filter((d: any) => d.primaryPillar === pillarId) || [];
    return preventions.length + detections.length;
  };

  const filteredTechniques = techniques.filter(technique =>
    technique.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    technique.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-above-blue-800" />
          <h2 className="text-xl font-semibold text-slate-900">Technique Comparison</h2>
        </div>
        <Badge variant="outline">
          {selectedTechniques.length}/3 selected
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Technique Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search elements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selected Techniques */}
            {selectedTechniques.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Selected for comparison:</h4>
                {selectedTechniques.map(id => {
                  const technique = techniques.find(t => t.id === id);
                  return technique ? (
                    <div key={id} className="flex items-center justify-between p-2 bg-above-blue-50 rounded">
                      <span className="text-sm font-medium">{technique.title}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleTechnique(id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {/* Available Techniques */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredTechniques.slice(0, 20).map(technique => (
                <div
                  key={technique.id}
                  className={`p-3 rounded border cursor-pointer transition-colors ${
                    selectedTechniques.includes(technique.id)
                      ? 'border-above-blue-500 bg-above-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => toggleTechnique(technique.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-900">{technique.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {technique.description.substring(0, 100)}...
                      </p>
                    </div>
                    {selectedTechniques.includes(technique.id) ? (
                      <X className="h-4 w-4 text-above-blue-800" />
                    ) : selectedTechniques.length < 3 ? (
                      <Plus className="h-4 w-4 text-slate-400" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <div className="lg:col-span-2">
          {selectedTechniques.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <GitCompare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Select Elements to Compare
                  </h3>
                  <p className="text-slate-500">
                    Choose up to 3 techniques from the list to compare their controls and risk profiles.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Aspect</th>
                          {getSelectedTechniqueData().map(technique => (
                            <th key={technique.id} className="text-left p-2 font-medium min-w-48">
                              {technique.title}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-medium text-slate-600">Category</td>
                          {getSelectedTechniqueData().map(technique => (
                            <td key={technique.id} className="p-2">
                              <Badge variant="outline">{technique.category}</Badge>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium text-slate-600">Risk Score</td>
                          {getSelectedTechniqueData().map(technique => (
                            <td key={technique.id} className="p-2">
                              <div className="flex items-center">
                                <span className={`font-bold ${
                                  technique.riskScore >= 8 ? 'text-above-rose-800' :
                                  technique.riskScore >= 6 ? 'text-above-peach-800' :
                                  technique.riskScore >= 4 ? 'text-above-peach-800' :
                                  'text-above-blue-800'
                                }`}>
                                  {technique.riskScore}/10
                                </span>
                                <div className={`ml-2 w-12 h-2 rounded-full ${
                                  technique.riskScore >= 8 ? 'bg-above-rose-200' :
                                  technique.riskScore >= 6 ? 'bg-above-peach-200' :
                                  technique.riskScore >= 4 ? 'bg-above-peach-200' :
                                  'bg-above-blue-200'
                                }`}>
                                  <div 
                                    className={`h-full rounded-full ${
                                      technique.riskScore >= 8 ? 'bg-above-rose-700' :
                                      technique.riskScore >= 6 ? 'bg-above-peach-700' :
                                      technique.riskScore >= 4 ? 'bg-above-peach-700' :
                                      'bg-above-blue-800'
                                    }`}
                                    style={{ width: `${(technique.riskScore / 10) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium text-slate-600">Preventions</td>
                          {getSelectedTechniqueData().map(technique => (
                            <td key={technique.id} className="p-2">
                              <span className="font-semibold">{technique.preventions?.length || 0}</span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-2 font-medium text-slate-600">Detections</td>
                          {getSelectedTechniqueData().map(technique => (
                            <td key={technique.id} className="p-2">
                              <span className="font-semibold">{technique.detections?.length || 0}</span>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Pillar Coverage */}
              <Card>
                <CardHeader>
                  <CardTitle>Pillar Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pillars.map(pillar => {
                      const PillarIcon = pillar.icon;
                      return (
                        <div key={pillar.id} className="flex items-center gap-4">
                          <div className="flex items-center gap-2 w-48">
                            <PillarIcon className="h-4 w-4" style={{ color: pillar.color }} />
                            <span className="text-sm font-medium">{pillar.name}</span>
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            {getSelectedTechniqueData().map(technique => {
                              const coverage = getPillarCoverage(technique, pillar.id);
                              return (
                                <div key={technique.id} className="text-center">
                                  <div className={`w-full h-2 rounded-full bg-slate-200`}>
                                    <div 
                                      className="h-full rounded-full"
                                      style={{ 
                                        backgroundColor: pillar.color,
                                        width: `${Math.min(coverage * 20, 100)}%`
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-slate-600 mt-1">{coverage} controls</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Control Gaps and Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Control Gaps */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center">
                        <AlertTriangle className="h-4 w-4 text-above-rose-500 mr-1" />
                        Control Gaps
                      </h4>
                      <div className="space-y-3">
                        {getSelectedTechniqueData().map(technique => (
                          <div key={technique.id}>
                            <h5 className="text-xs font-medium text-slate-700">{technique.title}</h5>
                            {technique.controlGaps.length > 0 ? (
                              <ul className="text-xs text-above-rose-800 space-y-1">
                                {technique.controlGaps.map((gap, index) => (
                                  <li key={index}>• {gap}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-above-blue-800">No significant gaps identified</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center">
                        <TrendingUp className="h-4 w-4 text-above-blue-500 mr-1" />
                        Strengths
                      </h4>
                      <div className="space-y-3">
                        {getSelectedTechniqueData().map(technique => (
                          <div key={technique.id}>
                            <h5 className="text-xs font-medium text-slate-700">{technique.title}</h5>
                            {technique.strengths.length > 0 ? (
                              <ul className="text-xs text-above-blue-800 space-y-1">
                                {technique.strengths.map((strength, index) => (
                                  <li key={index}>• {strength}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-slate-500">Limited coverage identified</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}