'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, BookOpen, Tag, Brain, Star } from 'lucide-react';
import Link from 'next/link';

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

export default function GlossaryPage() {
  const [data, setData] = useState<GlossaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const pillars = [
    { id: 'all', name: 'All Pillars' },
    { id: 'visibility', name: 'Visibility' },
    { id: 'coaching', name: 'Coaching' },
    { id: 'evidence', name: 'Evidence' },
    { id: 'identity', name: 'Identity' },
    { id: 'phishing', name: 'Phishing' },
  ];

  const [error, setError] = useState<string | null>(null);

  const fetchGlossary = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
      if (selectedPillar !== 'all') params.set('pillar', selectedPillar);
      if (showFeaturedOnly) params.set('featured', 'true');

      const response = await fetch(`/api/glossary?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setData(result);
    } catch (error) {
      console.error('Error fetching glossary:', error);
      setError(error instanceof Error ? error.message : 'Failed to load glossary data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlossary();
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedPillar, showFeaturedOnly]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-100 text-above-rose-800 dark:bg-blue-900 dark:text-above-rose-200';
      case 'business':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'regulatory':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'legal':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredTerms = useMemo(() => {
    if (!data) return [];
    return data.terms;
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-above-rose-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Insider Risk Glossary
              </h1>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                Database Connection Error
              </h3>
              <p className="text-red-700 dark:text-red-200 mb-4">
                Unable to load glossary terms. The database may be unavailable or not properly configured.
              </p>
              <div className="bg-red-100 dark:bg-red-900/40 rounded p-3 mb-4">
                <p className="text-sm font-mono text-red-800 dark:text-red-200">
                  Error: {error}
                </p>
              </div>
              <div className="space-y-2 text-sm text-red-700 dark:text-red-200">
                <p><strong>For developers:</strong></p>
                <ul className="text-left space-y-1 ml-4">
                  <li>• Ensure PostgreSQL is running and accessible</li>
                  <li>• Check DATABASE_URL environment variable</li>
                  <li>• Run `npm run db:setup` to initialize the database</li>
                  <li>• Verify Prisma client is properly generated</li>
                </ul>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Retry
              </button>
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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Insider Risk Glossary
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive definitions and explanations of insider risk, cybersecurity, and related terms.
            Build your knowledge with expert-reviewed content.
          </p>
          {data && (
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              {data.pagination.total} terms available
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search terms, definitions, or topics..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-above-rose-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-above-rose-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {data?.filters.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-above-rose-500"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {data?.filters.difficulties.map((diff) => (
                  <option key={diff.id} value={diff.id}>
                    {diff.name} ({diff.count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pillar
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-above-rose-500"
                value={selectedPillar}
                onChange={(e) => setSelectedPillar(e.target.value)}
              >
                {pillars.map((pillar) => (
                  <option key={pillar.id} value={pillar.id}>
                    {pillar.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-above-rose-600 focus:ring-above-rose-500"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Featured only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid gap-6">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No terms found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            filteredTerms.map((term) => (
              <div
                key={term.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Link
                      href={`/glossary/${term.slug}`}
                      className="text-xl font-semibold text-gray-900 dark:text-white hover:text-above-rose-600 dark:hover:text-above-rose-400 transition-colors"
                    >
                      {term.term}
                    </Link>
                    {term.featured && (
                      <Star className="h-4 w-4 text-yellow-500 ml-2" fill="currentColor" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(term.category)}`}>
                      {term.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(term.difficulty)}`}>
                      {term.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {term.definition}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {term.pillarRelevance.length > 0 && (
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 mr-1" />
                      <span>Pillars: {term.pillarRelevance.join(', ')}</span>
                    </div>
                  )}
                  {term.tags.length > 0 && (
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>Tags: {term.tags.slice(0, 3).join(', ')}</span>
                      {term.tags.length > 3 && <span> +{term.tags.length - 3} more</span>}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination could be added here if needed */}
      </div>
    </div>
  );
}