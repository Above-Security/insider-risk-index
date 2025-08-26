import { Shield, ExternalLink, Users, Calendar, Database, BarChart3, Network, GitCompare, AlertTriangle, Eye } from 'lucide-react';
import { MatrixAPI } from '@/lib/matrix-api';
import { MatrixVisualization } from '@/components/matrix/matrix-visualization';
import { MatrixHeatmap } from '@/components/matrix/matrix-heatmap';
import { MatrixNetwork } from '@/components/matrix/matrix-network';
import { TechniqueComparison } from '@/components/matrix/technique-comparison';
import { MatrixTechniquesPaginated } from '@/components/matrix/matrix-techniques-paginated';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { getPageLayout, getSectionLayout, getGridClass } from '@/lib/layout-utils';
import { generateJsonLd } from '@/lib/seo';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

async function getMatrixData() {
  try {
    return await MatrixAPI.getMatrixData();
  } catch (error) {
    console.error('Failed to fetch Matrix data:', error);
    return null;
  }
}

export async function generateMetadata() {
  return {
    title: 'Insider Threat Matrix - Comprehensive Threat Intelligence',
    description: 'Explore the comprehensive Insider Threat Matrix with 350+ motivations, capabilities, activities, and techniques based on real-world threat intelligence from the ForScie community.',
    keywords: ['insider threat matrix', 'threat intelligence', 'security techniques', 'prevention strategies', 'detection methods', 'ForScie', 'cybersecurity framework'],
    openGraph: {
      title: 'Insider Threat Matrix - Comprehensive Threat Intelligence',
      description: 'Explore 350+ insider threat elements: motivations, capabilities, activities, and techniques with prevention and detection strategies',
      type: 'website',
      url: '/matrix',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Insider Threat Matrix',
      description: 'Comprehensive threat intelligence framework with 350+ insider threat elements',
    },
  };
}

export default async function MatrixPage() {
  const matrixData = await getMatrixData();

  if (!matrixData || !matrixData.techniques || matrixData.techniques.length === 0) {
    return (
      <div className={`min-h-screen bg-above-blue-50 ${getSectionLayout('md')}`}>
        <div className={getPageLayout()}>
          <div className="text-center">
            <Shield className="h-12 w-12 text-above-rose-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Matrix Data Unavailable
            </h1>
            <p className="text-slate-600 mb-4">
              The ForScie Insider Threat Matrix data is currently unavailable. This could be due to:
            </p>
            <ul className="text-left text-slate-600 max-w-md mx-auto mb-6">
              <li>• Network connectivity issues</li>
              <li>• External API service downtime</li>
              <li>• Rate limiting on the data source</li>
            </ul>
            <p className="text-slate-600">
              Please try again later or visit{' '}
              <a href="https://insiderthreatmatrix.org/" className="text-above-blue-800 hover:text-above-blue-800" target="_blank" rel="noopener noreferrer">
                insiderthreatmatrix.org
              </a>{' '}
              directly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { techniques, metadata, contributors, lastUpdated } = matrixData;

  return (
    <div className={`min-h-screen bg-above-gradient-subtle ${getSectionLayout('md')}`}>
      <div className={getPageLayout()}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-above-rose-700 mr-3" />
            <h1 className="text-4xl font-bold text-slate-900">
              Insider Threat Matrix
            </h1>
          </div>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto mb-6">
            Comprehensive threat intelligence covering motivations, capabilities, activities, and techniques from real-world insider threats, with prevention strategies and detection methods from the cybersecurity community.
          </p>
          <div className="flex items-center justify-center text-sm text-slate-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Last updated: {new Date(lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Database className="h-8 w-8 text-above-blue-800 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900">
                {metadata.totalTechniques}
              </div>
              <div className="text-sm font-medium text-slate-600">
                Total Elements
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-above-rose-700 mx-auto mb-2" />
              <div className="text-3xl font-bold text-above-rose-700">
                {metadata.categories.motive}
              </div>
              <div className="text-sm font-medium text-slate-600">
                Motive
              </div>
              <div className="text-xs text-slate-500">
                Motivations
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-above-peach-700 mx-auto mb-2" />
              <div className="text-3xl font-bold text-above-peach-700">
                {metadata.categories.means}
              </div>
              <div className="text-sm font-medium text-slate-600">
                Means
              </div>
              <div className="text-xs text-slate-500">
                Capabilities
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Network className="h-8 w-8 text-above-lavender-700 mx-auto mb-2" />
              <div className="text-3xl font-bold text-above-lavender-700">
                {metadata.categories.preparation}
              </div>
              <div className="text-sm font-medium text-slate-600">
                Preparation
              </div>
              <div className="text-xs text-slate-500">
                Activities
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-amber-600">
                {metadata.categories.infringement}
              </div>
              <div className="text-sm font-medium text-slate-600">
                Infringement
              </div>
              <div className="text-xs text-slate-500">
                Techniques
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-600">
                {metadata.categories.antiForensics}
              </div>
              <div className="text-sm font-medium text-slate-600">
                Anti-forensics
              </div>
              <div className="text-xs text-slate-500">
                Techniques
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Matrix Visualizations */}
        <div className="mb-12">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="visualization" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Visualization
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Risk Heatmap
              </TabsTrigger>
              <TabsTrigger value="network" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                Network
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-2">
                <GitCompare className="h-4 w-4" />
                Compare
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Threat Techniques Overview
                </h2>
                <MatrixTechniquesPaginated techniques={techniques} itemsPerPage={20} />
              </div>
            </TabsContent>
            
            <TabsContent value="visualization" className="mt-6">
              <MatrixVisualization />
            </TabsContent>
            
            <TabsContent value="heatmap" className="mt-6">
              <MatrixHeatmap />
            </TabsContent>
            
            <TabsContent value="network" className="mt-6">
              <MatrixNetwork />
            </TabsContent>
            
            <TabsContent value="compare" className="mt-6">
              <TechniqueComparison />
            </TabsContent>
          </Tabs>
        </div>

        {/* Attribution */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Attribution & Contributors
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-slate-600 dark:text-gray-300 mb-2">
                <strong>Data Source:</strong> The Insider Threat Matrix is maintained by the ForScie community 
                (<a href="https://forscie.org/" className="text-above-blue-800 hover:text-above-blue-800" target="_blank" rel="noopener noreferrer">forscie.org</a>), 
                providing open-source threat intelligence for the cybersecurity community.
              </p>
              <p className="text-slate-600 dark:text-gray-300 mb-2">
                <strong>Integration:</strong> This assessment platform integrates Matrix techniques with 
                Ponemon Institute cost data and Gartner implementation insights to provide actionable recommendations.
              </p>
              <div className="flex items-center">
                <Link
                  href="https://insiderthreatmatrix.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-above-blue-800 dark:text-above-blue-400 hover:text-above-blue-800 dark:hover:text-above-blue-300 transition-colors"
                >
                  Visit ForScie Insider Threat Matrix
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            {contributors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Contributors:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {contributors.map((contributor, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-above-blue-50 dark:bg-above-blue-900 text-above-blue-800 dark:text-above-blue-300 rounded text-sm"
                    >
                      {contributor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Matrix JSON-LD structured data */}
      <Script
        id="matrix-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLd({
            "@type": "Dataset",
            name: "Insider Threat Matrix",
            description: "Comprehensive threat intelligence framework with 350+ insider threat techniques, prevention strategies, and detection methods",
            url: "https://insiderriskindex.com/matrix",
            creator: {
              "@type": "Organization",
              name: "ForScie Community",
              url: "https://forscie.org/",
            },
            publisher: {
              "@type": "Organization",
              name: "ForScie Community",
              url: "https://forscie.org/",
            },
            dateModified: lastUpdated,
            keywords: "insider threat, threat intelligence, cybersecurity, security framework, threat matrix",
            license: "https://github.com/forscie/insider-threat-matrix/blob/main/LICENSE",
            distribution: {
              "@type": "DataDownload",
              contentUrl: "https://raw.githubusercontent.com/forscie/insider-threat-matrix/refs/heads/main/insider-threat-matrix.json",
              encodingFormat: "application/json",
            },
            variableMeasured: [
              {
                "@type": "PropertyValue",
                name: "Technique Count",
                description: "Number of documented threat techniques",
                value: techniques?.length || 0,
              },
              {
                "@type": "PropertyValue",
                name: "Categories",
                description: "Threat technique categories",
                value: "Motive, Coercion, Manipulation",
              },
            ],
            citation: "ForScie Community. Insider Threat Matrix. https://insiderthreatmatrix.org/",
          })),
        }}
      />
    </div>
  );
}