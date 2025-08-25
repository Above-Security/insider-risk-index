import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
import { 
  Shield, 
  ArrowLeft, 
  Eye, 
  Search, 
  AlertTriangle,
  Users,
  Key,
  ShieldAlert,
  Calendar,
  ExternalLink,
  BookOpen,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { MatrixAPI } from '@/lib/matrix-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMatrixTechniqueJsonLd, getBreadcrumbJsonLd } from '@/lib/seo';

interface TechniquePageProps {
  params: Promise<{ id: string }>;
}

async function getTechniqueData(id: string) {
  try {
    return await MatrixAPI.getTechniqueById(id);
  } catch (error) {
    console.error('Failed to fetch technique:', error);
    return null;
  }
}

export async function generateMetadata({ params }: TechniquePageProps) {
  const { id } = await params;
  const technique = await getTechniqueData(id);
  
  if (!technique) {
    return {
      title: 'Technique Not Found - Insider Threat Matrix',
    };
  }
  
  return {
    title: `${technique.title} - Insider Threat Matrix`,
    description: technique.description,
    keywords: `insider threat, ${technique.category.toLowerCase()}, cybersecurity, ${technique.title.toLowerCase()}`,
  };
}

export default async function TechniquePage({ params }: TechniquePageProps) {
  const { id } = await params;
  const technique = await getTechniqueData(id);

  if (!technique) {
    notFound();
  }

  const pillars = [
    { id: 'visibility', name: 'Visibility', icon: Eye, color: '#3B82F6' },
    { id: 'prevention-coaching', name: 'Prevention & Coaching', icon: Users, color: '#10B981' },
    { id: 'investigation-evidence', name: 'Investigation & Evidence', icon: Search, color: '#F59E0B' },
    { id: 'identity-saas', name: 'Identity & SaaS', icon: Key, color: '#8B5CF6' },
    { id: 'phishing-resilience', name: 'Phishing Resilience', icon: ShieldAlert, color: '#EF4444' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Motive':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Coercion':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Manipulation':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Motive': return AlertTriangle;
      case 'Coercion': return ShieldAlert;
      case 'Manipulation': return Target;
      default: return AlertTriangle;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'difficult':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const CategoryIcon = getCategoryIcon(technique.category);

  // Generate JSON-LD structured data
  const techniqueJsonLd = getMatrixTechniqueJsonLd({
    id: technique.id,
    title: technique.title,
    description: technique.description,
    category: technique.category,
    preventions: (technique.preventions || []).map(p => p.title),
    detections: (technique.detections || []).map(d => d.title),
    contributors: (technique.contributors || []).map(c => ({
      name: c,
      affiliation: undefined
    }))
  });

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: "https://insiderriskindex.com" },
    { name: "Matrix", url: "https://insiderriskindex.com/matrix" },
    { name: technique.title, url: `https://insiderriskindex.com/matrix/technique/${id}` }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-4">
            <Link href="/matrix" className="inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Matrix
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <CategoryIcon className="h-8 w-8 text-gray-600" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {technique.title}
                </h1>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Badge className={`${getCategoryColor(technique.category)} border`}>
                  <CategoryIcon className="h-3 w-3 mr-1" />
                  {technique.category}
                </Badge>
                {technique.lastUpdated && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    Updated {new Date(technique.lastUpdated).toLocaleDateString()}
                  </div>
                )}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl">
                {technique.description}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {technique.preventions?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Prevention Strategies</div>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {technique.detections?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Detection Methods</div>
                  </div>
                  <Search className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {technique.tactics?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Tactics</div>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {technique.contributors?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Contributors</div>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Prevention Strategies */}
            {technique.preventions && technique.preventions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    Prevention Strategies ({technique.preventions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {technique.preventions.map((prevention, index) => (
                    <div key={prevention.id || index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {prevention.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {prevention.description}
                      </p>
                      
                      {prevention.implementation && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                          <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Implementation:
                          </h5>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {prevention.implementation}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3">
                        {prevention.costLevel && (
                          <Badge variant="outline" className={getDifficultyColor(prevention.costLevel)}>
                            Cost: {prevention.costLevel}
                          </Badge>
                        )}
                        {prevention.difficulty && (
                          <Badge variant="outline" className={getDifficultyColor(prevention.difficulty)}>
                            Difficulty: {prevention.difficulty}
                          </Badge>
                        )}
                        {prevention.effectiveness && (
                          <div className="flex items-center text-sm text-gray-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Effectiveness: {prevention.effectiveness}/10
                          </div>
                        )}
                      </div>
                      
                      {prevention.primaryPillar && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Primary Pillar: </span>
                          <Badge variant="outline">
                            {pillars.find(p => p.id === prevention.primaryPillar)?.name || prevention.primaryPillar}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Detection Methods */}
            {technique.detections && technique.detections.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2 text-green-600" />
                    Detection Methods ({technique.detections.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {technique.detections.map((detection, index) => (
                    <div key={detection.id || index} className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {detection.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {detection.description}
                      </p>
                      
                      {detection.dataSource && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded mb-3">
                          <h5 className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                            Data Source:
                          </h5>
                          <p className="text-sm text-green-800 dark:text-green-200">
                            {detection.dataSource}
                          </p>
                        </div>
                      )}
                      
                      {detection.queryExample && (
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-3">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                            Query Example:
                          </h5>
                          <code className="text-sm text-gray-800 dark:text-gray-200 block whitespace-pre-wrap">
                            {detection.queryExample}
                          </code>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3">
                        {detection.falsePositiveRate && (
                          <Badge variant="outline" className={getDifficultyColor(detection.falsePositiveRate)}>
                            False Positives: {detection.falsePositiveRate}
                          </Badge>
                        )}
                        {detection.difficulty && (
                          <Badge variant="outline" className={getDifficultyColor(detection.difficulty)}>
                            Difficulty: {detection.difficulty}
                          </Badge>
                        )}
                      </div>
                      
                      {((detection.requiredTools?.length || 0) > 0 || (detection.alternativeTools?.length || 0) > 0) && (
                        <div className="mt-3 space-y-2">
                          {(detection.requiredTools?.length || 0) > 0 && (
                            <div>
                              <span className="text-xs text-gray-500">Required Tools: </span>
                              {detection.requiredTools?.map(tool => (
                                <Badge key={tool} variant="outline" className="mr-1">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {(detection.alternativeTools?.length || 0) > 0 && (
                            <div>
                              <span className="text-xs text-gray-500">Alternative Tools: </span>
                              {detection.alternativeTools?.map(tool => (
                                <Badge key={tool} variant="secondary" className="mr-1">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tactics */}
            {technique.tactics && technique.tactics.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-purple-600" />
                    Tactics & Techniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {technique.tactics.map((tactic, index) => (
                      <Badge key={index} variant="outline" className="text-purple-700 border-purple-300">
                        {tactic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contributors */}
            {technique.contributors && technique.contributors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {technique.contributors.map((contributor, index) => (
                      <div key={index} className="text-sm">
                        {contributor}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pillar Mapping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Pillar Relevance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pillars.map(pillar => {
                    const PillarIcon = pillar.icon;
                    const preventionCount = technique.preventions?.filter(
                      p => p.primaryPillar === pillar.id
                    ).length || 0;
                    const detectionCount = technique.detections?.filter(
                      d => d.primaryPillar === pillar.id
                    ).length || 0;
                    const totalCount = preventionCount + detectionCount;
                    
                    return (
                      <div key={pillar.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PillarIcon className="h-4 w-4" style={{ color: pillar.color }} />
                          <span className="text-sm font-medium">{pillar.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {totalCount > 0 ? (
                            <>
                              <span className="text-sm font-semibold">{totalCount}</span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </>
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Attribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Attribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This technique is part of the ForScie Insider Threat Matrix, 
                    a community-driven knowledge base for insider threat intelligence.
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link
                      href="https://insiderthreatmatrix.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                    >
                      View on ForScie Matrix
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techniqueJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}