'use client';

import { useState, useEffect } from 'react';
import { Filter, Search, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PILLAR_NAMES, PILLAR_COLORS } from '@/lib/playbook-constants';

export interface PlaybookFilters {
  search: string;
  pillar: string[];
  difficulty: string[];
  estimatedTime: string[];
  tags: string[];
}

interface PlaybookFiltersProps {
  filters: PlaybookFilters;
  onFiltersChange: (filters: PlaybookFilters) => void;
  availableTags: string[];
}

const DIFFICULTY_OPTIONS = [
  { value: 'Beginner', label: 'Beginner', color: 'bg-above-blue-100 text-above-blue-800' },
  { value: 'Intermediate', label: 'Intermediate', color: 'bg-above-peach-100 text-above-peach-800' },
  { value: 'Advanced', label: 'Advanced', color: 'bg-above-rose-100 text-above-rose-800' },
];

const TIME_ESTIMATE_OPTIONS = [
  { value: '1-4 weeks', label: '1-4 weeks' },
  { value: '4-8 weeks', label: '4-8 weeks' },
  { value: '8-12 weeks', label: '8-12 weeks' },
  { value: '12+ weeks', label: '12+ weeks' },
];

function FilterDropdown({ 
  label, 
  options, 
  selectedValues, 
  onSelectionChange, 
  renderOption 
}: {
  label: string;
  options: Array<{ value: string; label: string; color?: string }>;
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  renderOption?: (option: { value: string; label: string; color?: string }) => React.ReactNode;
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
        className="w-full justify-between"
      >
        <span>
          {label} {selectedValues.length > 0 && `(${selectedValues.length})`}
        </span>
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
                className="w-full px-3 py-2 text-left hover:bg-above-blue-50 dark:hover:bg-slate-700 flex items-center justify-between"
              >
                {renderOption ? renderOption(option) : (
                  <span className={option.color || ''}>{option.label}</span>
                )}
                {selectedValues.includes(option.value) && (
                  <div className="w-4 h-4 bg-above-blue-800 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function PlaybookFilters({ filters, onFiltersChange, availableTags }: PlaybookFiltersProps) {
  const [showAllFilters, setShowAllFilters] = useState(false);

  const updateFilter = <K extends keyof PlaybookFilters>(
    key: K, 
    value: PlaybookFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      pillar: [],
      difficulty: [],
      estimatedTime: [],
      tags: [],
    });
  };

  const hasActiveFilters = filters.search || 
    filters.pillar.length > 0 || 
    filters.difficulty.length > 0 || 
    filters.estimatedTime.length > 0 || 
    filters.tags.length > 0;

  const pillarOptions = Object.entries(PILLAR_NAMES).map(([value, label]) => ({
    value,
    label,
    color: PILLAR_COLORS[value as keyof typeof PILLAR_COLORS]
  }));

  const tagOptions = availableTags.map(tag => ({ value: tag, label: tag }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search playbooks by title, description, or content..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAllFilters(!showAllFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {[
                filters.pillar.length,
                filters.difficulty.length,
                filters.estimatedTime.length,
                filters.tags.length
              ].reduce((a, b) => a + b, 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAllFilters && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <FilterDropdown
              label="Pillar"
              options={pillarOptions}
              selectedValues={filters.pillar}
              onSelectionChange={(values) => updateFilter('pillar', values)}
              renderOption={(option) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                  {option.label}
                </span>
              )}
            />
            
            <FilterDropdown
              label="Difficulty"
              options={DIFFICULTY_OPTIONS}
              selectedValues={filters.difficulty}
              onSelectionChange={(values) => updateFilter('difficulty', values)}
              renderOption={(option) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                  {option.label}
                </span>
              )}
            />
            
            <FilterDropdown
              label="Time Estimate"
              options={TIME_ESTIMATE_OPTIONS}
              selectedValues={filters.estimatedTime}
              onSelectionChange={(values) => updateFilter('estimatedTime', values)}
            />
            
            <FilterDropdown
              label="Tags"
              options={tagOptions}
              selectedValues={filters.tags}
              onSelectionChange={(values) => updateFilter('tags', values)}
            />
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                Active filters:
              </span>
              
              {filters.pillar.map((pillar) => (
                <Badge key={pillar} variant="secondary" className="flex items-center gap-1">
                  {PILLAR_NAMES[pillar as keyof typeof PILLAR_NAMES]}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('pillar', filters.pillar.filter(p => p !== pillar))}
                  />
                </Badge>
              ))}
              
              {filters.difficulty.map((diff) => (
                <Badge key={diff} variant="secondary" className="flex items-center gap-1">
                  {diff}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('difficulty', filters.difficulty.filter(d => d !== diff))}
                  />
                </Badge>
              ))}
              
              {filters.estimatedTime.map((time) => (
                <Badge key={time} variant="secondary" className="flex items-center gap-1">
                  {time}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('estimatedTime', filters.estimatedTime.filter(t => t !== time))}
                  />
                </Badge>
              ))}
              
              {filters.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('tags', filters.tags.filter(t => t !== tag))}
                  />
                </Badge>
              ))}
              
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