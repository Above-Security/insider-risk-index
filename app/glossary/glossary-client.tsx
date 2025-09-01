'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Tag, Brain, Star, BookOpen } from 'lucide-react';
import { AboveButton } from '@/components/ui/above-components';
import Link from 'next/link';

interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  definition: string;
  longExplanation?: string | null;
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

interface GlossaryClientProps {
  initialData: GlossaryData;
}

export function GlossaryClient({ initialData }: GlossaryClientProps) {
  const [data, setData] = useState<GlossaryData>(initialData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pillars = [
    { id: 'all', name: 'All Pillars' },
    { id: 'visibility', name: 'Visibility' },
    { id: 'coaching', name: 'Coaching' },
    { id: 'evidence', name: 'Evidence' },
    { id: 'identity', name: 'Identity' },
    { id: 'phishing', name: 'Phishing' },
  ];

  const fetchGlossary = useCallback(async () => {
    // Skip if no filters are active (use initial data)
    if (!searchQuery && selectedCategory === 'all' && selectedDifficulty === 'all' && 
        selectedPillar === 'all' && !showFeaturedOnly) {
      setData(initialData);
      return;
    }

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
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedPillar, showFeaturedOnly, initialData]);

  useEffect(() => {
    fetchGlossary();
  }, [fetchGlossary]);

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
        return 'bg-above-blue-100 text-above-rose-800 dark:bg-above-blue-900 dark:text-above-rose-200';
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

  const filteredTerms = useMemo(() => {
    if (!data) return [];
    return data.terms;
  }, [data]);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-above-rose-50 dark:bg-above-rose-900/20 border border-above-rose-200 dark:border-above-rose-700 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-above-rose-100 dark:bg-above-rose-900/40 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-above-rose-800 dark:text-above-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-above-rose-900 dark:text-above-rose-100 mb-2">
            Search Error
          </h3>
          <p className="text-above-rose-800 dark:text-above-rose-200 mb-4">
            Unable to search glossary terms. Please try again or refresh the page.
          </p>
          <div className="bg-above-rose-100 dark:bg-above-rose-900/40 rounded p-3 mb-4">
            <p className="text-sm font-mono text-above-rose-800 dark:text-above-rose-200">
              Error: {error}
            </p>
          </div>
          <AboveButton
            onClick={() => {
              setError(null);
              fetchGlossary();
            }}
            variant="default"
            className="mt-4"
          >
            Try Again
          </AboveButton>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Search and Filters */}
      <div className="mb-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search terms, definitions, or topics..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-above-rose-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-above-rose-500"
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
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Difficulty
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-above-rose-500"
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
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Pillar
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-above-rose-500"
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
                className="rounded border-slate-300 text-above-rose-600 focus:ring-above-rose-500"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              />
              <span className="ml-2 text-sm text-slate-700 dark:text-gray-300">
                Featured only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mb-4 text-center">
          <div className="inline-flex items-center px-4 py-2 text-sm text-above-blue-800 bg-above-blue-50 dark:bg-above-blue-900/20 dark:text-above-blue-200 rounded-lg">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-above-blue-800 dark:text-above-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </div>
        </div>
      )}

      {/* Terms Grid */}
      <div className="grid gap-6">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No terms found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
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
                    className="text-xl font-semibold text-slate-900 dark:text-white hover:text-above-rose-600 dark:hover:text-above-rose-400 transition-colors"
                  >
                    {term.term}
                  </Link>
                  {term.featured && (
                    <Star className="h-4 w-4 text-above-peach-500 ml-2" fill="currentColor" />
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

              <p className="text-slate-600 dark:text-gray-300 mb-4">
                {term.definition}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
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
    </>
  );
}