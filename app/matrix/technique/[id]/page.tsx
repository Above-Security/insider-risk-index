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
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { MatrixAPI } from '@/lib/matrix-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMatrixTechniqueJsonLd, getBreadcrumbJsonLd } from '@/lib/seo';
import Script from 'next/script';

// Helper function to get correct element type terminology
const getElementType = (category: string): string => {
  switch (category) {
    case 'Motive': return 'motivation';
    case 'Means': return 'capability'; 
    case 'Preparation': return 'activity';
    case 'Infringement': return 'technique';
    case 'Anti-forensics': return 'technique';
    default: return 'element';
  }
};

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
    { id: 'visibility', name: 'Visibility', icon: Eye, color: '#7AB7FF' },
    { id: 'prevention-coaching', name: 'Prevention & Coaching', icon: Users, color: '#FF89A1' },
    { id: 'investigation-evidence', name: 'Investigation & Evidence', icon: Search, color: '#FF9C7A' },
    { id: 'identity-saas', name: 'Identity & SaaS', icon: Key, color: '#C8B3FF' },
    { id: 'phishing-resilience', name: 'Phishing Resilience', icon: ShieldAlert, color: '#FF5D78' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Motive':
        return 'bg-above-rose-100 text-above-rose-800 border-above-rose-200';
      case 'Coercion':
        return 'bg-above-peach-100 text-above-peach-800 border-above-peach-200';
      case 'Manipulation':
        return 'bg-above-lavender-100 text-above-lavender-800 border-above-lavender-200';
      default:
        return 'bg-above-blue-100 text-above-blue-800 border-above-blue-200';
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

  const getDifficultyColor = (difficulty: string | number) => {
    if (typeof difficulty !== 'string') {
      return 'bg-above-blue-100 text-above-blue-800';
    }
    
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-above-blue-100 text-above-blue-800';
      case 'moderate':
        return 'bg-above-peach-100 text-above-peach-800';
      case 'difficult':
        return 'bg-above-rose-100 text-above-rose-800';
      default:
        return 'bg-above-blue-100 text-above-blue-800';
    }
  };

  const getFalsePositiveColor = (rate: number | string) => {
    const numRate = typeof rate === 'string' ? parseFloat(rate) : rate;
    if (isNaN(numRate)) return 'bg-above-blue-100 text-above-blue-800';
    
    if (numRate <= 0.05) return 'bg-above-blue-100 text-above-blue-800'; // Low false positive rate
    if (numRate <= 0.15) return 'bg-above-peach-100 text-above-peach-800'; // Medium false positive rate
    return 'bg-above-rose-100 text-above-rose-800'; // High false positive rate
  };

  const getCostLevelColor = (costLevel: string | number) => {
    if (typeof costLevel !== 'string') {
      return 'bg-above-blue-100 text-above-blue-800';
    }
    
    switch (costLevel.toLowerCase()) {
      case 'low':
        return 'bg-above-blue-100 text-above-blue-800';
      case 'medium':
        return 'bg-above-peach-100 text-above-peach-800';
      case 'high':
        return 'bg-above-rose-100 text-above-rose-800';
      default:
        return 'bg-above-blue-100 text-above-blue-800';
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
    <div className="min-h-screen bg-above-gradient-subtle py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-4 border-above-blue-200 text-slate-700 hover:bg-above-blue-50">
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
                <CategoryIcon className="h-8 w-8 text-above-rose-700" />
                <h1 className="text-4xl font-bold text-slate-900">
                  {technique.title}
                </h1>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <Badge className={`${getCategoryColor(technique.category)} border`}>
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {technique.category}
                  </Badge>
                  <div className="text-xs text-slate-500 ml-1">
                    {getElementType(technique.category)}
                  </div>
                </div>
                {technique.lastUpdated && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Updated {new Date(technique.lastUpdated).toLocaleDateString()}
                  </div>
                )}
              </div>
              <p className="text-lg text-slate-700 max-w-4xl">
                {technique.description}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-above-white border-above-blue-100/50 shadow-soft">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-above-blue-700">
                      {technique.preventions?.length || 0}
                    </div>
                    <div className="text-sm text-slate-700">Prevention Strategies</div>
                  </div>
                  <Shield className="h-8 w-8 text-above-blue-700" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-above-white border-above-peach-100/50 shadow-soft">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-above-peach-700">
                      {technique.detections?.length || 0}
                    </div>
                    <div className="text-sm text-slate-700">Detection Methods</div>
                  </div>
                  <Search className="h-8 w-8 text-above-peach-700" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-above-white border-above-lavender-100/50 shadow-soft">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-above-lavender-700">
                      {technique.tactics?.length || 0}
                    </div>
                    <div className="text-sm text-slate-700">Tactics</div>
                  </div>
                  <Target className="h-8 w-8 text-above-lavender-700" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-above-white border-above-rose-100/50 shadow-soft">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-above-rose-700">
                      {technique.contributors?.length || 0}
                    </div>
                    <div className="text-sm text-slate-700">Contributors</div>
                  </div>
                  <Users className="h-8 w-8 text-above-rose-700" />
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
              <Card className="bg-above-white border-above-blue-100/50 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-900">
                    <Shield className="h-5 w-5 mr-2 text-above-blue-700" />
                    Prevention Strategies ({technique.preventions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {technique.preventions.map((prevention, index) => (
                    <div key={prevention.id || index} className="border-l-4 border-above-blue-700 pl-4">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        {prevention.title}
                      </h4>
                      <p className="text-slate-700 mb-3">
                        {prevention.description}
                      </p>
                      
                      {prevention.implementation && (
                        <div className="bg-above-blue-50 p-3 rounded">
                          <h5 className="text-sm font-medium text-above-blue-900 mb-1">
                            Implementation:
                          </h5>
                          <p className="text-sm text-above-blue-800">
                            {prevention.implementation}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3">
                        {prevention.costLevel && (
                          <Badge variant="outline" className={getCostLevelColor(prevention.costLevel)}>
                            Cost: {prevention.costLevel}
                          </Badge>
                        )}
                        {prevention.difficulty && (
                          <Badge variant="outline" className={getDifficultyColor(prevention.difficulty)}>
                            Difficulty: {prevention.difficulty}
                          </Badge>
                        )}
                        {prevention.effectiveness && (
                          <div className="flex items-center text-sm text-slate-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Effectiveness: {prevention.effectiveness}/10
                          </div>
                        )}
                      </div>
                      
                      {prevention.primaryPillar && (
                        <div className="mt-2">
                          <span className="text-xs text-slate-500">Primary Pillar: </span>
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
              <Card className="bg-above-white border-above-peach-100/50 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-900">
                    <Search className="h-5 w-5 mr-2 text-above-peach-700" />
                    Detection Methods ({technique.detections.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {technique.detections.map((detection, index) => (
                    <div key={detection.id || index} className="border-l-4 border-above-peach-700 pl-4">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        {detection.title}
                      </h4>
                      <p className="text-slate-700 mb-3">
                        {detection.description}
                      </p>
                      
                      {detection.dataSource && (
                        <div className="bg-above-peach-50 p-3 rounded mb-3">
                          <h5 className="text-sm font-medium text-above-peach-900 mb-1">
                            Data Source:
                          </h5>
                          <p className="text-sm text-above-peach-800">
                            {detection.dataSource}
                          </p>
                        </div>
                      )}
                      
                      {detection.queryExample && (
                        <div className="bg-above-blue-100 p-3 rounded mb-3">
                          <h5 className="text-sm font-medium text-above-blue-900 mb-1">
                            Query Example:
                          </h5>
                          <code className="text-sm text-above-blue-800 block whitespace-pre-wrap">
                            {detection.queryExample}
                          </code>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3">
                        {detection.falsePositiveRate && (
                          <Badge variant="outline" className={getFalsePositiveColor(detection.falsePositiveRate)}>
                            False Positives: {typeof detection.falsePositiveRate === 'number' 
                              ? `${(detection.falsePositiveRate * 100).toFixed(1)}%` 
                              : detection.falsePositiveRate}
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
                              <span className="text-xs text-slate-500">Required Tools: </span>
                              {detection.requiredTools?.map(tool => (
                                <Badge key={tool} variant="outline" className="mr-1">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {(detection.alternativeTools?.length || 0) > 0 && (
                            <div>
                              <span className="text-xs text-slate-500">Alternative Tools: </span>
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
              <Card className="bg-above-white border-above-lavender-100/50 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-900">
                    <Target className="h-5 w-5 mr-2 text-above-lavender-700" />
                    Tactics & Techniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {technique.tactics.map((tactic, index) => (
                      <Badge key={index} variant="outline" className="text-above-lavender-700 border-above-lavender-300">
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
              <Card className="bg-above-white border-above-rose-100/50 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-900">
                    <Users className="h-5 w-5 mr-2 text-above-rose-700" />
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
            <Card className="bg-above-white border-above-blue-100/50 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <BookOpen className="h-5 w-5 mr-2 text-above-blue-700" />
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
                              <CheckCircle className="h-4 w-4 text-above-blue-700" />
                            </>
                          ) : (
                            <XCircle className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Attribution */}
            <Card className="bg-above-white border-above-peach-100/50 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <ExternalLink className="h-5 w-5 mr-2 text-above-peach-700" />
                  Attribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    This technique is part of the ForScie Insider Threat Matrix, 
                    a community-driven knowledge base for insider threat intelligence.
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full border-above-peach-200 text-above-peach-700 hover:bg-above-peach-50">
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
      <Script
        id="technique-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(techniqueJsonLd),
        }}
      />
      <Script
        id="technique-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
    </div>
  );
}