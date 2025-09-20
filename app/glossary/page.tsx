import { Suspense } from 'react';
import { BookOpen } from 'lucide-react';
import { PrismaClient } from '@prisma/client';
import { GlossaryClient } from './glossary-client';
import { Metadata } from 'next';
import { generateMetadata as generateSeoMetadata, getFAQJsonLd } from '@/lib/seo';
import Script from 'next/script';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Security Glossary - Insider Risk Terms & Definitions',
  description: 'Comprehensive glossary of insider risk management, cybersecurity, and threat intelligence terms. Over 100 expertly curated definitions with citations from authoritative sources.',
  path: '/glossary',
  keywords: [
    'cybersecurity glossary',
    'insider risk terms',
    'security definitions',
    'threat intelligence glossary',
    'security terminology',
    'risk management definitions'
  ],
});

interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  definition: string;
  longExplanation?: string;
  category: string;
  tags: string[];
  difficulty: string;
  relatedTerms: string[];
  pillarRelevance: string[];
  sources: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FilterCategory {
  id: string;
  name: string;
  count: number;
}

interface GlossaryData {
  terms: GlossaryTerm[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  filters: {
    categories: FilterCategory[];
    difficulties: FilterCategory[];
  };
}

const prisma = new PrismaClient();

async function getGlossaryData() {
  try {
    // Get initial data (similar to API route)
    const [terms, totalCount] = await Promise.all([
      prisma.glossaryTerm.findMany({
        where: { published: true },
        orderBy: [
          { featured: 'desc' },
          { term: 'asc' }
        ],
        take: 50, // Initial load
        select: {
          id: true,
          term: true,
          slug: true,
          definition: true,
          longExplanation: true,
          category: true,
          tags: true,
          difficulty: true,
          relatedTerms: true,
          pillarRelevance: true,
          sources: true,
          featured: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.glossaryTerm.count({ where: { published: true } }),
    ]);

    // Get category counts for filtering
    const categoryCounts = await prisma.glossaryTerm.groupBy({
      by: ['category'],
      where: { published: true },
      _count: true,
    });

    const difficultyLevels = await prisma.glossaryTerm.groupBy({
      by: ['difficulty'],
      where: { published: true },
      _count: true,
    });

    return {
      terms: terms.map(term => ({
        ...term,
        longExplanation: term.longExplanation || undefined,
        createdAt: term.createdAt.toISOString(),
        updatedAt: term.updatedAt.toISOString(),
      })),
      pagination: {
        total: totalCount,
        limit: 50,
        offset: 0,
        hasMore: totalCount > 50,
      },
      filters: {
        categories: [
          { id: 'all', name: 'All Categories', count: totalCount },
          ...categoryCounts.map(c => ({
            id: c.category,
            name: c.category.charAt(0).toUpperCase() + c.category.slice(1),
            count: c._count,
          })),
        ],
        difficulties: [
          { id: 'all', name: 'All Levels', count: totalCount },
          ...difficultyLevels.map(d => ({
            id: d.difficulty,
            name: d.difficulty.charAt(0).toUpperCase() + d.difficulty.slice(1),
            count: d._count,
          })),
        ],
      },
    };
  } catch (error) {
    console.error('Error fetching glossary data:', error);
    return null;
  }
}

export default async function GlossaryPage() {
  const initialData = await getGlossaryData();

  // Generate FAQ schema for glossary
  const glossaryFAQs = [
    {
      question: "What insider risk terms should I know?",
      answer: "You should know key terms across 5 categories: Visibility (monitoring threats), Coaching (training programs), Evidence (investigation methods), Identity (access controls), and Phishing (social engineering defense). Our glossary covers 100+ expert-curated definitions with NIST framework citations."
    },
    {
      question: "How can I find specific security definitions?",
      answer: "Use our advanced search to find terms by name, definition, or tags. Filter by Business, Technical, Legal, or Regulatory categories. Each term shows difficulty level (Beginner to Advanced) and relevance to the 5 insider risk pillars."
    },
    {
      question: "Who validates these security definitions?",
      answer: "Cybersecurity experts validate all definitions using NIST frameworks, regulatory guidance, and peer-reviewed research. Sources include Ponemon Institute studies, Verizon DBIR analysis, and current industry standards for accuracy."
    },
    {
      question: "How often are new terms added?",
      answer: "New terms are added monthly based on emerging threats, regulatory changes, and user feedback. We continuously update existing definitions to reflect evolving cybersecurity threats and industry best practices."
    },
    {
      question: "Can I learn insider risk terminology by difficulty?",
      answer: "Yes, each term has a difficulty rating from Beginner to Advanced. Start with foundational concepts like 'insider threat' and 'privileged access,' then progress to advanced topics like 'behavioral analytics' and 'zero trust architecture.'"
    }
  ];

  const faqJsonLd = getFAQJsonLd(glossaryFAQs);

  if (!initialData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-above-rose-600 mr-3" />
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Insider Risk Glossary
              </h1>
            </div>
            <div className="bg-above-rose-50 dark:bg-above-rose-900/20 border border-above-rose-200 dark:border-above-rose-700 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-above-rose-100 dark:bg-above-rose-900/40 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-above-rose-800 dark:text-above-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-above-rose-900 dark:text-above-rose-100 mb-2">
                Database Connection Error
              </h3>
              <p className="text-above-rose-800 dark:text-above-rose-200 mb-4">
                Unable to load glossary terms. The database may be unavailable or not properly configured.
              </p>
              <div className="space-y-2 text-sm text-above-rose-800 dark:text-above-rose-200">
                <p><strong>For developers:</strong></p>
                <ul className="text-left space-y-1 ml-4">
                  <li>• Ensure PostgreSQL is running and accessible</li>
                  <li>• Check DATABASE_URL environment variable</li>
                  <li>• Run `npm run db:setup` to initialize the database</li>
                  <li>• Verify Prisma client is properly generated</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-above-rose-600 mr-3" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              What insider risk terms should I know?
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore over 100 expert-curated definitions covering insider risk management, cybersecurity, and threat intelligence.
            Get clear explanations with sources from NIST frameworks and industry research.
          </p>
          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            {initialData.pagination.total} terms available
          </div>
        </div>

        {/* Client-side Interactive Content */}
        <Suspense fallback={
          <div className="animate-pulse">
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
              ))}
            </div>
          </div>
        }>
          <GlossaryClient initialData={initialData} />
        </Suspense>
      </div>

      {/* FAQ Schema for SEO */}
      <Script
        id="glossary-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}