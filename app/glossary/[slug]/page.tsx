import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag, Brain, Calendar, User, ExternalLink } from 'lucide-react';
import { PrismaClient } from '@prisma/client';
import { getGlossaryTermJsonLd } from '@/lib/seo';
import Script from 'next/script';

const prisma = new PrismaClient();

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
  createdAt: Date;
  updatedAt: Date;
  lastReviewed: Date | null;
  reviewedBy: string | null;
}

interface RelatedTerm {
  term: string;
  slug: string;
  definition: string;
  category: string;
  difficulty: string;
}

async function getGlossaryTerm(slug: string): Promise<{
  term: GlossaryTerm;
  relatedTerms: RelatedTerm[];
} | null> {
  try {
    const term = await prisma.glossaryTerm.findUnique({
      where: {
        slug,
        published: true,
      },
    });

    if (!term) {
      return null;
    }

    // Get related terms
    let relatedTermsData: RelatedTerm[] = [];
    if (term.relatedTerms && term.relatedTerms.length > 0) {
      relatedTermsData = await prisma.glossaryTerm.findMany({
        where: {
          slug: { in: term.relatedTerms },
          published: true,
        },
        select: {
          term: true,
          slug: true,
          definition: true,
          category: true,
          difficulty: true,
        },
      });
    }

    return {
      term: term as GlossaryTerm,
      relatedTerms: relatedTermsData,
    };
  } catch (error) {
    console.error('Error fetching glossary term:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getGlossaryTerm(slug);
  
  if (!data) {
    return {
      title: 'Term Not Found',
      robots: 'noindex, nofollow',
    };
  }

  const { term } = data;
  
  return {
    title: `${term.term} - Insider Risk Glossary`,
    description: term.definition.length > 160 ? `${term.definition.substring(0, 157)}...` : term.definition,
    keywords: [term.term, ...term.tags, 'insider risk', 'cybersecurity', 'glossary'],
    openGraph: {
      title: `${term.term} - Security Glossary`,
      description: term.definition.length > 160 ? `${term.definition.substring(0, 157)}...` : term.definition,
      type: 'article',
      url: `/glossary/${slug}`,
      publishedTime: term.createdAt.toISOString(),
      ...(term.updatedAt && { modifiedTime: term.updatedAt.toISOString() }),
    },
    twitter: {
      card: 'summary',
      title: `${term.term} - Security Glossary`,
      description: term.definition.length > 160 ? `${term.definition.substring(0, 157)}...` : term.definition,
    },
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getGlossaryTerm(slug);

  if (!data) {
    notFound();
  }

  const { term, relatedTerms } = data;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-above-blue-100 text-above-blue-800 dark:bg-above-blue-900 dark:text-above-blue-200';
      case 'intermediate':
        return 'bg-above-peach-100 text-above-peach-800 dark:bg-above-peach-900 dark:text-above-peach-200';
      case 'advanced':
        return 'bg-above-rose-100 text-above-rose-800 dark:bg-above-rose-900 dark:text-above-rose-200';
      default:
        return 'bg-above-blue-100 text-slate-800 dark:bg-above-blue-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-above-blue-100 text-above-blue-800 dark:bg-above-blue-900 dark:text-above-blue-200';
      case 'business':
        return 'bg-above-lavender-100 text-above-lavender-800 dark:bg-above-lavender-900 dark:text-above-lavender-200';
      case 'regulatory':
        return 'bg-above-peach-100 text-above-peach-800 dark:bg-above-peach-900 dark:text-above-peach-200';
      case 'legal':
        return 'bg-above-rose-100 text-above-rose-800 dark:bg-above-rose-900 dark:text-above-rose-200';
      default:
        return 'bg-above-blue-100 text-slate-800 dark:bg-above-blue-900 dark:text-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Generate structured data for the glossary term
  const termJsonLd = getGlossaryTermJsonLd({
    term: term.term,
    definition: term.definition,
    category: term.category,
    difficulty: term.difficulty,
    pillarRelevance: term.pillarRelevance,
    slug: term.slug,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/glossary"
            className="inline-flex items-center text-sm text-above-blue-800 dark:text-above-blue-400 hover:text-above-blue-800 dark:hover:text-above-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Glossary
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {term.term}
              </h1>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(term.category)}`}>
                  {term.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(term.difficulty)}`}>
                  {term.difficulty}
                </span>
              </div>
            </div>

            {/* Quick definition */}
            <p className="text-lg text-slate-700 dark:text-gray-300 leading-relaxed">
              {term.definition}
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {/* Long explanation */}
            {term.longExplanation && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Detailed Explanation
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                    {term.longExplanation}
                  </p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Pillar Relevance */}
              {term.pillarRelevance.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-above-blue-800" />
                    Relevant Pillars
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {term.pillarRelevance.map((pillar) => (
                      <span
                        key={pillar}
                        className="px-3 py-1 bg-above-blue-50 dark:bg-above-blue-900 text-above-blue-800 dark:text-above-blue-300 rounded-full text-sm font-medium"
                      >
                        {pillar.charAt(0).toUpperCase() + pillar.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {term.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-above-blue-800" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {term.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-above-blue-100 dark:bg-above-blue-800 text-slate-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sources */}
            {term.sources.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3 flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2 text-above-lavender-800" />
                  Sources & References
                </h3>
                <ul className="space-y-2">
                  {term.sources.map((source, index) => (
                    <li key={index} className="text-slate-600 dark:text-slate-400 text-sm">
                      • {source}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Terms */}
            {relatedTerms.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                  Related Terms
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedTerms.map((relatedTerm) => (
                    <Link
                      key={relatedTerm.slug}
                      href={`/glossary/${relatedTerm.slug}`}
                      className="block p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-above-blue-300 dark:hover:border-above-blue-700 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          {relatedTerm.term}
                        </h4>
                        <div className="flex gap-1">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(relatedTerm.category)}`}>
                            {relatedTerm.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {relatedTerm.definition}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Meta information */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Updated: {formatDate(term.updatedAt)}</span>
                </div>
                {term.lastReviewed && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>Reviewed: {formatDate(term.lastReviewed)}</span>
                    {term.reviewedBy && <span className="ml-1">by {term.reviewedBy}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* JSON-LD structured data */}
      <Script
        id="glossary-term-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getGlossaryTermJsonLd({
            term: term.term,
            definition: term.definition,
            category: term.category,
            difficulty: term.difficulty,
            pillarRelevance: term.pillarRelevance,
            slug: term.slug,
          })),
        }}
      />
    </>
  );
}