import { Metadata } from 'next';
import { IndexNowDashboard } from '@/components/analytics/indexnow-dashboard';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Analytics Dashboard',
  description: 'IndexNow performance metrics, SEO analytics, and search ranking monitoring for the Insider Risk Index platform.',
  path: '/analytics',
  keywords: ['analytics', 'seo metrics', 'indexnow performance', 'search rankings'],
  noIndex: true, // Keep analytics private
});

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="border-b border-gray-200 pb-5">
            <h1 className="text-3xl font-bold leading-6 text-gray-900">
              SEO Analytics Dashboard
            </h1>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              Monitor IndexNow submission performance, search engine indexing metrics, and SEO impact across all pages and content.
            </p>
          </div>
        </div>
        
        <IndexNowDashboard />
      </div>
    </div>
  );
}