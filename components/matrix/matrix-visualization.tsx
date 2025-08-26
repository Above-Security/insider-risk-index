'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AboveBadge, AboveButton, AboveSkeleton, getCategoryColors } from '@/components/ui/above-components';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Shield, 
  Search, 
  Filter, 
  Grid3X3,
  List,
  Eye,
  Users,
  Key,
  ShieldAlert,
  Mail
} from 'lucide-react';

interface MatrixTechnique {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  contributors: Array<{ name: string; affiliation?: string }>;
  preventions: string[];
  detections: string[];
  platforms: string[];
}

export function MatrixVisualization() {
  const [techniques, setTechniques] = useState<MatrixTechnique[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');

  const fetchTechniques = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedPillar !== 'all') params.set('pillar', selectedPillar);
      params.set('limit', '100');

      const response = await fetch(`/api/matrix/techniques?${params}`);
      const data = await response.json();
      setTechniques(data.elements || []);
    } catch (error) {
      console.error('Failed to fetch techniques:', error);
      setTechniques([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechniques();
  }, [selectedCategory, selectedPillar]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'motive', label: 'Motive' },
    { value: 'coercion', label: 'Coercion' },
    { value: 'manipulation', label: 'Manipulation' }
  ];

  const pillars = [
    { value: 'all', label: 'All Pillars' },
    { value: 'visibility', label: 'Visibility & Monitoring', icon: Eye },
    { value: 'prevention-coaching', label: 'Prevention & Coaching', icon: Users },
    { value: 'investigation-evidence', label: 'Investigation & Evidence', icon: Search },
    { value: 'identity-saas', label: 'Identity & SaaS', icon: Key },
    { value: 'phishing-resilience', label: 'Phishing Resilience', icon: ShieldAlert }
  ];

  // Using centralized color utility
  const getCategoryColorClass = (category: string) => {
    const colors = getCategoryColors(category);
    return `${colors.bg} ${colors.text} ${colors.border}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'motive': return AlertTriangle;
      case 'coercion': return ShieldAlert;
      case 'manipulation': return Mail;
      default: return AlertTriangle;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <AboveSkeleton className="h-96 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Filters:</span>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPillar} onValueChange={setSelectedPillar}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pillars.map(pillar => (
                    <SelectItem key={pillar.value} value={pillar.value}>
                      {pillar.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <AboveButton
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </AboveButton>
              <AboveButton
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </AboveButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {techniques.length} Techniques Found
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <AlertTriangle className="h-4 w-4" />
          Showing {selectedCategory !== 'all' ? selectedCategory : 'all categories'}
          {selectedPillar !== 'all' && ` • ${pillars.find(p => p.value === selectedPillar)?.label}`}
        </div>
      </div>

      {/* Techniques Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techniques.map(technique => (
            <TechniqueCard key={technique.id} technique={technique} getCategoryColor={getCategoryColorClass} getCategoryIcon={getCategoryIcon} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {techniques.map(technique => (
            <TechniqueListItem key={technique.id} technique={technique} getCategoryColor={getCategoryColorClass} getCategoryIcon={getCategoryIcon} />
          ))}
        </div>
      )}

      {techniques.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No Techniques Found
              </h3>
              <p className="text-slate-500">
                Try adjusting your filters to see more results
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TechniqueCard({ 
  technique, 
  getCategoryColor, 
  getCategoryIcon 
}: { 
  technique: MatrixTechnique;
  getCategoryColor: (category: string) => string;
  getCategoryIcon: (category: string) => any;
}) {
  const CategoryIcon = getCategoryIcon(technique.category);
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight line-clamp-2">
            {technique.title}
          </CardTitle>
          <AboveBadge variant={technique.category.toLowerCase() as any}>
            <CategoryIcon className="h-3 w-3 mr-1" />
            {technique.category}
          </AboveBadge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600 line-clamp-3">
          {technique.description}
        </p>
        
        {technique.subcategory && (
          <AboveBadge variant="outline" className="text-xs">
            {technique.subcategory}
          </AboveBadge>
        )}

        <div className="space-y-2">
          {technique.preventions.length > 0 && (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-above-blue-800" />
              <span className="text-xs text-slate-600">
                {technique.preventions.length} preventions
              </span>
            </div>
          )}
          {technique.detections.length > 0 && (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-above-blue-800" />
              <span className="text-xs text-slate-600">
                {technique.detections.length} detections
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <a 
            href={`/matrix/technique/${technique.id}`}
            className="text-xs text-above-rose-700 hover:text-above-rose-900 font-medium transition-colors"
          >
            View Details →
          </a>
        </div>

        {technique.contributors.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Contributors: {technique.contributors.slice(0, 2).map(c => c.name).join(', ')}
              {technique.contributors.length > 2 && ` +${technique.contributors.length - 2} more`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TechniqueListItem({ 
  technique, 
  getCategoryColor, 
  getCategoryIcon 
}: { 
  technique: MatrixTechnique;
  getCategoryColor: (category: string) => string;
  getCategoryIcon: (category: string) => any;
}) {
  const CategoryIcon = getCategoryIcon(technique.category);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-slate-900">{technique.title}</h3>
              <AboveBadge variant={technique.category.toLowerCase() as any}>
                <CategoryIcon className="h-3 w-3 mr-1" />
                {technique.category}
              </AboveBadge>
              {technique.subcategory && (
                <AboveBadge variant="outline" className="text-xs">
                  {technique.subcategory}
                </AboveBadge>
              )}
            </div>
            <p className="text-sm text-slate-600 mb-3">{technique.description}</p>
            
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                {technique.preventions.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-above-blue-800" />
                    {technique.preventions.length} preventions
                  </div>
                )}
                {technique.detections.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Search className="h-3 w-3 text-above-blue-800" />
                    {technique.detections.length} detections
                  </div>
                )}
                {technique.contributors.length > 0 && (
                  <div>
                    {technique.contributors.length} contributor{technique.contributors.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <a 
                href={`/matrix/technique/${technique.id}`}
                className="text-above-rose-700 hover:text-above-rose-900 font-medium transition-colors"
              >
                Details →
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}