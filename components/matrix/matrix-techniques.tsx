'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  Shield, 
  Search, 
  ExternalLink, 
  Users,
  Calendar,
  Globe
} from 'lucide-react';

interface MatrixTechnique {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  contributors: Array<{ 
    name: string; 
    affiliation?: string; 
    email?: string; 
  }>;
  preventions: string[];
  detections: string[];
  platforms: string[];
  references: Array<{
    title: string;
    url: string;
    date?: string;
    author?: string;
  }>;
  created?: string;
  updated?: string;
}

export function MatrixTechniques() {
  const [techniques, setTechniques] = useState<MatrixTechnique[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState<MatrixTechnique | null>(null);

  const fetchTechniques = async () => {
    try {
      const response = await fetch('/api/matrix/techniques?limit=100');
      const data = await response.json();
      setTechniques(data.techniques || []);
    } catch (error) {
      console.error('Failed to fetch techniques:', error);
      setTechniques([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechniques();
  }, []);

  const filteredTechniques = techniques.filter(technique =>
    technique.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technique.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technique.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (technique.subcategory && technique.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'motive': return 'bg-red-100 text-red-800 border-red-200';
      case 'coercion': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'manipulation': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (selectedTechnique) {
    return <TechniqueDetail technique={selectedTechnique} onBack={() => setSelectedTechnique(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search techniques by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredTechniques.length} Technique{filteredTechniques.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
          </h3>
        </div>

        {filteredTechniques.map(technique => (
          <Card key={technique.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6" onClick={() => setSelectedTechnique(technique)}>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{technique.title}</h3>
                      <Badge className={getCategoryColor(technique.category)}>
                        {technique.category}
                      </Badge>
                      {technique.subcategory && (
                        <Badge variant="outline" className="text-xs">
                          {technique.subcategory}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{technique.description}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  {technique.preventions.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-green-600" />
                      {technique.preventions.length} prevention{technique.preventions.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  {technique.detections.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Search className="h-3 w-3 text-blue-600" />
                      {technique.detections.length} detection{technique.detections.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  {technique.contributors.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {technique.contributors.length} contributor{technique.contributors.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  {technique.platforms.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {technique.platforms.length} platform{technique.platforms.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTechniques.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Techniques Found
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? `No techniques match "${searchTerm}". Try a different search term.`
                    : 'No techniques are currently available.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function TechniqueDetail({ 
  technique, 
  onBack 
}: { 
  technique: MatrixTechnique; 
  onBack: () => void; 
}) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'motive': return 'bg-red-100 text-red-800 border-red-200';
      case 'coercion': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'manipulation': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        Back to Techniques
      </Button>

      {/* Technique Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">{technique.title}</CardTitle>
                <Badge className={getCategoryColor(technique.category)}>
                  {technique.category}
                </Badge>
                {technique.subcategory && (
                  <Badge variant="outline">
                    {technique.subcategory}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{technique.description}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preventions */}
          {technique.preventions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Prevention Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {technique.preventions.map((prevention, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{prevention}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Detections */}
          {technique.detections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Detection Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {technique.detections.map((detection, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{detection}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* References */}
          {technique.references && technique.references.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-purple-600" />
                  References
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {technique.references.map((ref, index) => (
                    <div key={index} className="border-l-2 border-purple-200 pl-4">
                      <a 
                        href={ref.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-purple-700 hover:text-purple-800"
                      >
                        {ref.title}
                      </a>
                      {(ref.author || ref.date) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {ref.author && `by ${ref.author}`}
                          {ref.author && ref.date && ` • `}
                          {ref.date}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">ID</p>
                <p className="text-sm text-gray-600 font-mono">{technique.id}</p>
              </div>
              
              {technique.platforms.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Platforms</p>
                  <div className="flex flex-wrap gap-1">
                    {technique.platforms.map((platform, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(technique.created || technique.updated) && (
                <div className="space-y-2">
                  {technique.created && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      Created: {new Date(technique.created).toLocaleDateString()}
                    </div>
                  )}
                  {technique.updated && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      Updated: {new Date(technique.updated).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contributors */}
          {technique.contributors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {technique.contributors.map((contributor, index) => (
                    <div key={index}>
                      <p className="text-sm font-medium text-gray-900">{contributor.name}</p>
                      {contributor.affiliation && (
                        <p className="text-xs text-gray-600">{contributor.affiliation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}