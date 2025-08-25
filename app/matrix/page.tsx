import { Shield, ExternalLink, Users, Calendar, Database, BarChart3, Network, GitCompare } from 'lucide-react';
import { MatrixAPI } from '@/lib/matrix-api';
import { MatrixVisualization } from '@/components/matrix/matrix-visualization';
import { MatrixHeatmap } from '@/components/matrix/matrix-heatmap';
import { MatrixNetwork } from '@/components/matrix/matrix-network';
import { TechniqueComparison } from '@/components/matrix/technique-comparison';
import { MatrixTechniquesPaginated } from '@/components/matrix/matrix-techniques-paginated';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateJsonLd } from '@/lib/seo';
import Link from 'next/link';

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
    description: 'Explore the comprehensive Insider Threat Matrix with 350+ techniques, preventions, and detection methods based on real-world threat intelligence from the ForScie community.',
    keywords: ['insider threat matrix', 'threat intelligence', 'security techniques', 'prevention strategies', 'detection methods', 'ForScie', 'cybersecurity framework'],
    openGraph: {
      title: 'Insider Threat Matrix - Comprehensive Threat Intelligence',
      description: 'Explore 350+ insider threat techniques with prevention and detection strategies',
      type: 'website',
      url: '/matrix',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Insider Threat Matrix',
      description: 'Comprehensive threat intelligence framework with 350+ techniques',
    },
  };
}

export default async function MatrixPage() {
  const matrixData = await getMatrixData();

  if (!matrixData || !matrixData.techniques || matrixData.techniques.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Matrix Data Unavailable
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The ForScie Insider Threat Matrix data is currently unavailable. This could be due to:
            </p>
            <ul className="text-left text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              <li>• Network connectivity issues</li>
              <li>• External API service downtime</li>
              <li>• Rate limiting on the data source</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400">
              Please try again later or visit{' '}
              <a href="https://insiderthreatmatrix.org/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Insider Threat Matrix
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Comprehensive threat intelligence based on real-world insider threat techniques, 
            prevention strategies, and detection methods from the cybersecurity community.
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Last updated: {new Date(lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 text-center">
            <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metadata.totalTechniques}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Techniques
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {metadata.categories.motive}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Motive Techniques
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {metadata.categories.coercion}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Coercion Techniques
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {metadata.categories.manipulation}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Manipulation Techniques
            </div>
          </div>
        </div>

        {/* Interactive Matrix Visualizations */}
        <div className="mb-12">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Attribution & Contributors
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Data Source:</strong> The Insider Threat Matrix is maintained by the ForScie community 
                (<a href="https://forscie.org/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">forscie.org</a>), 
                providing open-source threat intelligence for the cybersecurity community.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Integration:</strong> This assessment platform integrates Matrix techniques with 
                Ponemon Institute cost data and Gartner implementation insights to provide actionable recommendations.
              </p>
              <div className="flex items-center">
                <Link
                  href="https://insiderthreatmatrix.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  Visit ForScie Insider Threat Matrix
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            {contributors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Contributors:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {contributors.map((contributor, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm"
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
    </div>
  );
}