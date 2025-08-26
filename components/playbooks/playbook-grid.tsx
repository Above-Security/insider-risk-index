'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Target, Star, ArrowRight, BookOpen, Tag, Users, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AboveButton } from '@/components/ui/above-components';
import { PILLAR_NAMES, PILLAR_COLORS, type Playbook } from '@/lib/playbook-constants';
import { PlaybookFilters, PlaybookFilters as PlaybookFiltersComponent } from './playbook-filters';

interface PlaybookGridProps {
  playbooks: Playbook[];
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'bg-above-blue-100 text-above-blue-800 dark:bg-above-blue-900 dark:text-above-blue-200';
    case 'intermediate':
      return 'bg-above-peach-100 text-above-peach-800 dark:bg-above-peach-900 dark:text-above-peach-200';
    case 'advanced':
      return 'bg-above-rose-100 text-above-rose-800 dark:bg-above-rose-900 dark:text-above-rose-200';
    default:
      return 'bg-above-blue-100 text-slate-800 dark:bg-above-blue-900 dark:text-gray-200';
  }
}

function getTimeCategory(timeToImplement: string): string {
  if (!timeToImplement) return '';
  
  const weeks = parseInt(timeToImplement);
  if (weeks <= 4) return '1-4 weeks';
  if (weeks <= 8) return '4-8 weeks';
  if (weeks <= 12) return '8-12 weeks';
  return '12+ weeks';
}

function PlaybookCard({ playbook }: { playbook: Playbook }) {
  const maturityLevelLabels = {
    1: 'Initial',
    2: 'Developing',
    3: 'Defined',
    4: 'Managed',
    5: 'Optimized'
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-8 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {playbook.frontmatter.title}
            </h2>
            <Badge 
              variant="secondary" 
              className={`${PILLAR_COLORS[playbook.frontmatter.pillar as keyof typeof PILLAR_COLORS]} font-medium`}
            >
              {PILLAR_NAMES[playbook.frontmatter.pillar as keyof typeof PILLAR_NAMES]}
            </Badge>
            <Badge 
              variant="outline" 
              className={getDifficultyColor(playbook.frontmatter.difficulty)}
            >
              {playbook.frontmatter.difficulty}
            </Badge>
          </div>
          <p className="text-slate-600 dark:text-gray-300 text-lg leading-relaxed">
            {playbook.frontmatter.description}
          </p>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-above-blue-800" />
          <span>Time: {playbook.frontmatter.timeToImplement || playbook.frontmatter.estimatedTime}</span>
        </div>
        <div className="flex items-center">
          <Target className="h-4 w-4 mr-2 text-above-blue-800" />
          <span>Version: {playbook.frontmatter.version}</span>
        </div>
        <div className="flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-above-lavender-800" />
          <span>Maturity: Level {playbook.frontmatter.maturityLevel} ({maturityLevelLabels[playbook.frontmatter.maturityLevel as keyof typeof maturityLevelLabels]})</span>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 mr-2 text-above-peach-800" />
          <span>Updated: {new Date(playbook.frontmatter.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Prerequisites */}
      {playbook.frontmatter.prerequisites && playbook.frontmatter.prerequisites.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Prerequisites:
          </h4>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            {playbook.frontmatter.prerequisites.slice(0, 3).map((prereq, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 text-above-blue-800">•</span>
                <span>{prereq}</span>
              </li>
            ))}
            {playbook.frontmatter.prerequisites.length > 3 && (
              <li className="text-xs text-slate-500">
                +{playbook.frontmatter.prerequisites.length - 3} more...
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Expected Outcomes */}
      {playbook.frontmatter.outcomes && playbook.frontmatter.outcomes.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Expected Outcomes:
          </h4>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            {playbook.frontmatter.outcomes.slice(0, 3).map((outcome, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 text-above-blue-800">•</span>
                <span>{outcome}</span>
              </li>
            ))}
            {playbook.frontmatter.outcomes.length > 3 && (
              <li className="text-xs text-slate-500">
                +{playbook.frontmatter.outcomes.length - 3} more outcomes...
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Tags */}
      {playbook.frontmatter.tags && playbook.frontmatter.tags.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Tag className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-900 dark:text-white">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {playbook.frontmatter.tags.slice(0, 6).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag.replace(/-/g, ' ')}
              </Badge>
            ))}
            {playbook.frontmatter.tags.length > 6 && (
              <Badge variant="secondary" className="text-xs">
                +{playbook.frontmatter.tags.length - 6}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        <Link href={`/playbooks/${playbook.slug}`}>
          <AboveButton variant="secondary">
            View Playbook
            <ArrowRight className="h-4 w-4 ml-2" />
          </AboveButton>
        </Link>
      </div>
    </div>
  );
}

export function PlaybookGrid({ playbooks }: PlaybookGridProps) {
  const [filters, setFilters] = useState<PlaybookFilters>({
    search: '',
    pillar: [],
    difficulty: [],
    estimatedTime: [],
    tags: [],
  });

  // Get all unique tags from playbooks
  const availableTags = Array.from(new Set(
    playbooks.flatMap(p => p.frontmatter.tags || [])
  )).sort();

  // Filter playbooks based on current filters
  const filteredPlaybooks = playbooks.filter(playbook => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        playbook.frontmatter.title,
        playbook.frontmatter.description,
        ...(playbook.frontmatter.tags || []),
        ...(playbook.frontmatter.prerequisites || []),
        ...(playbook.frontmatter.outcomes || [])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) return false;
    }

    // Pillar filter
    if (filters.pillar.length > 0 && !filters.pillar.includes(playbook.frontmatter.pillar)) {
      return false;
    }

    // Difficulty filter
    if (filters.difficulty.length > 0 && !filters.difficulty.includes(playbook.frontmatter.difficulty)) {
      return false;
    }

    // Time estimate filter
    if (filters.estimatedTime.length > 0) {
      const timeCategory = getTimeCategory(playbook.frontmatter.timeToImplement || playbook.frontmatter.estimatedTime || '');
      if (!filters.estimatedTime.includes(timeCategory)) return false;
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const playbookTags = playbook.frontmatter.tags || [];
      if (!filters.tags.some(tag => playbookTags.includes(tag))) return false;
    }

    return true;
  });

  // Calculate pillar statistics
  const pillarStats = Object.keys(PILLAR_NAMES).map(pillar => ({
    pillar,
    name: PILLAR_NAMES[pillar as keyof typeof PILLAR_NAMES],
    totalCount: playbooks.filter(p => p.frontmatter.pillar === pillar).length,
    filteredCount: filteredPlaybooks.filter(p => p.frontmatter.pillar === pillar).length,
    color: PILLAR_COLORS[pillar as keyof typeof PILLAR_COLORS]
  }));

  return (
    <>
      {/* Filters Component */}
      <PlaybookFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        availableTags={availableTags}
      />

      {/* Results Summary */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {filteredPlaybooks.length === playbooks.length 
              ? `All Playbooks (${playbooks.length})`
              : `${filteredPlaybooks.length} of ${playbooks.length} playbooks`}
          </h2>
          {filters.search && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Search results for "{filters.search}"
            </p>
          )}
        </div>

        {/* Pillar Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          {pillarStats.map((pillar) => (
            <div key={pillar.pillar} className="text-center">
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${pillar.color}`}>
                <span className="mr-2">{pillar.name}</span>
                <Badge variant="secondary" className="ml-auto">
                  {pillar.filteredCount}/{pillar.totalCount}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Playbooks Grid */}
      {filteredPlaybooks.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            {playbooks.length === 0 ? "No playbooks available yet" : "No playbooks match your filters"}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {playbooks.length === 0 
              ? "Playbooks are currently being developed. Check back soon for comprehensive implementation guides."
              : "Try adjusting your search terms or filters to find relevant playbooks."
            }
          </p>
          {filteredPlaybooks.length !== playbooks.length && (
            <AboveButton variant="outline" onClick={() => setFilters({
              search: '',
              pillar: [],
              difficulty: [],
              estimatedTime: [],
              tags: [],
            })}>
              Clear All Filters
            </AboveButton>
          )}
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredPlaybooks.map((playbook) => (
            <PlaybookCard key={playbook.slug} playbook={playbook} />
          ))}
        </div>
      )}
    </>
  );
}