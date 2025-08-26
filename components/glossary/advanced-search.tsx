'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, Sparkles, Brain, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export interface GlossaryTerm {
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

export interface SearchFilters {
  query: string;
  categories: string[];
  difficulties: string[];
  pillars: string[];
  showFeaturedOnly: boolean;
}

interface AdvancedSearchProps {
  terms: GlossaryTerm[];
  onFiltersChange: (filteredTerms: GlossaryTerm[], filters: SearchFilters) => void;
}

// Full-text search with relevance scoring
function searchTerms(terms: GlossaryTerm[], query: string): GlossaryTerm[] {
  if (!query.trim()) return terms;

  const searchQuery = query.toLowerCase().trim();
  const searchWords = searchQuery.split(/\s+/);

  const scoredTerms = terms.map(term => {
    let score = 0;
    const termLower = term.term.toLowerCase();
    const definitionLower = term.definition.toLowerCase();
    const longExplanationLower = term.longExplanation?.toLowerCase() || '';
    const tagsLower = term.tags.join(' ').toLowerCase();

    // Exact match in term name (highest priority)
    if (termLower === searchQuery) score += 100;
    else if (termLower.includes(searchQuery)) score += 50;

    // Word matches in term name
    searchWords.forEach(word => {
      if (termLower.includes(word)) score += 20;
      if (termLower.startsWith(word)) score += 10;
    });

    // Matches in definition
    searchWords.forEach(word => {
      if (definitionLower.includes(word)) score += 15;
      const wordMatches = (definitionLower.match(new RegExp(word, 'g')) || []).length;
      score += Math.min(wordMatches * 3, 12);
    });

    // Matches in long explanation
    searchWords.forEach(word => {
      if (longExplanationLower.includes(word)) score += 8;
      const wordMatches = (longExplanationLower.match(new RegExp(word, 'g')) || []).length;
      score += Math.min(wordMatches * 2, 8);
    });

    // Matches in tags
    searchWords.forEach(word => {
      if (tagsLower.includes(word)) score += 10;
    });

    // Boost featured terms
    if (term.featured) score *= 1.2;

    // Fuzzy matching for typos (simple Levenshtein-inspired)
    if (score === 0) {
      searchWords.forEach(word => {
        if (word.length > 3) {
          const fuzzyMatches = [termLower, definitionLower, tagsLower].some(text =>
            text.includes(word.slice(0, -1)) || text.includes(word.slice(1))
          );
          if (fuzzyMatches) score += 3;
        }
      });
    }

    return { ...term, searchScore: score };
  });

  return scoredTerms
    .filter(term => term.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);
}

function FilterDropdown({ 
  label, 
  icon: Icon,
  options, 
  selectedValues, 
  onSelectionChange,
  showCount = true
}: {
  label: string;
  icon: any;
  options: Array<{ value: string; label: string; count?: number }>;
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  showCount?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newValues);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between h-10"
      >
        <div className="flex items-center">
          <Icon className="h-4 w-4 mr-2" />
          <span>{label}</span>
          {selectedValues.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedValues.length}
            </Badge>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className="w-full px-3 py-2 text-left hover:bg-above-blue-50 dark:hover:bg-slate-700 flex items-center justify-between text-sm"
              >
                <span>{option.label}</span>
                <div className="flex items-center gap-2">
                  {showCount && option.count && (
                    <span className="text-xs text-slate-500">({option.count})</span>
                  )}
                  {selectedValues.includes(option.value) && (
                    <div className="w-4 h-4 bg-above-blue-800 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function AdvancedSearch({ terms, onFiltersChange }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    difficulties: [],
    pillars: [],
    showFeaturedOnly: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Generate filter options from available terms
  const filterOptions = useMemo(() => {
    const categories = [...new Set(terms.map(t => t.category))].map(cat => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: terms.filter(t => t.category === cat).length
    }));

    const difficulties = [...new Set(terms.map(t => t.difficulty))].map(diff => ({
      value: diff,
      label: diff.charAt(0).toUpperCase() + diff.slice(1),
      count: terms.filter(t => t.difficulty === diff).length
    }));

    const pillars = [...new Set(terms.flatMap(t => t.pillarRelevance))].map(pillar => ({
      value: pillar,
      label: pillar.charAt(0).toUpperCase() + pillar.slice(1).replace('-', ' '),
      count: terms.filter(t => t.pillarRelevance.includes(pillar)).length
    }));

    return { categories, difficulties, pillars };
  }, [terms]);

  // Apply filters and search
  const filteredTerms = useMemo(() => {
    let result = terms;

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(term => filters.categories.includes(term.category));
    }

    // Apply difficulty filter
    if (filters.difficulties.length > 0) {
      result = result.filter(term => filters.difficulties.includes(term.difficulty));
    }

    // Apply pillar filter
    if (filters.pillars.length > 0) {
      result = result.filter(term => 
        term.pillarRelevance.some(pillar => filters.pillars.includes(pillar))
      );
    }

    // Apply featured filter
    if (filters.showFeaturedOnly) {
      result = result.filter(term => term.featured);
    }

    // Apply search query (this handles relevance scoring)
    if (filters.query.trim()) {
      result = searchTerms(result, filters.query);
    }

    return result;
  }, [terms, filters]);

  // Notify parent of changes
  useEffect(() => {
    onFiltersChange(filteredTerms, filters);
  }, [filteredTerms, filters, onFiltersChange]);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K, 
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      query: '',
      categories: [],
      difficulties: [],
      pillars: [],
      showFeaturedOnly: false,
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.difficulties.length > 0 || 
    filters.pillars.length > 0 || 
    filters.showFeaturedOnly;

  const totalActiveFilters = filters.categories.length + 
    filters.difficulties.length + 
    filters.pillars.length + 
    (filters.showFeaturedOnly ? 1 : 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search terms, definitions, concepts, or tags..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="pl-10 h-12 text-base"
          />
          {filters.query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateFilter('query', '')}
              className="absolute right-2 top-2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 h-12"
        >
          <Filter className="h-4 w-4" />
          Advanced
          {totalActiveFilters > 0 && (
            <Badge variant="secondary" className="ml-1">
              {totalActiveFilters}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <FilterDropdown
              label="Category"
              icon={Target}
              options={filterOptions.categories}
              selectedValues={filters.categories}
              onSelectionChange={(values) => updateFilter('categories', values)}
            />
            
            <FilterDropdown
              label="Difficulty"
              icon={Brain}
              options={filterOptions.difficulties}
              selectedValues={filters.difficulties}
              onSelectionChange={(values) => updateFilter('difficulties', values)}
            />
            
            <FilterDropdown
              label="Pillar"
              icon={Target}
              options={filterOptions.pillars}
              selectedValues={filters.pillars}
              onSelectionChange={(values) => updateFilter('pillars', values)}
            />

            <div className="flex items-center justify-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.showFeaturedOnly}
                  onChange={(e) => updateFilter('showFeaturedOnly', e.target.checked)}
                  className="rounded border-slate-300 text-above-blue-800 focus:ring-blue-500 mr-2"
                />
                <Sparkles className="h-4 w-4 mr-1 text-above-peach-500" />
                <span className="text-sm font-medium">Featured Only</span>
              </label>
            </div>
          </div>

          {/* Search Results Info */}
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-4">
            <span>
              {filteredTerms.length} of {terms.length} terms
              {filters.query && ` matching "${filters.query}"`}
            </span>
            <div className="flex items-center gap-4">
              {filters.query && (
                <span className="text-above-blue-800 dark:text-above-blue-400">
                  Relevance-ranked results
                </span>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                Active filters:
              </span>
              
              {filters.categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="flex items-center gap-1">
                  {cat}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('categories', filters.categories.filter(c => c !== cat))}
                  />
                </Badge>
              ))}
              
              {filters.difficulties.map((diff) => (
                <Badge key={diff} variant="secondary" className="flex items-center gap-1">
                  {diff}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('difficulties', filters.difficulties.filter(d => d !== diff))}
                  />
                </Badge>
              ))}
              
              {filters.pillars.map((pillar) => (
                <Badge key={pillar} variant="secondary" className="flex items-center gap-1">
                  {pillar.replace('-', ' ')}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('pillars', filters.pillars.filter(p => p !== pillar))}
                  />
                </Badge>
              ))}
              
              {filters.showFeaturedOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Featured
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('showFeaturedOnly', false)}
                  />
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}