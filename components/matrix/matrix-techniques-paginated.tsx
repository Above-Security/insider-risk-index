'use client';

import { useState, useMemo } from 'react';
import { MatrixElement } from '@/lib/matrix-types';
import { ChevronLeft, ChevronRight, Shield, AlertCircle, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

interface MatrixTechniquesPaginatedProps {
  techniques: MatrixElement[];
  itemsPerPage?: number;
}

export function MatrixTechniquesPaginated({ 
  techniques, 
  itemsPerPage = 20 
}: MatrixTechniquesPaginatedProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Motive' | 'Coercion' | 'Manipulation'>('all');

  // Filter techniques based on search and category
  const filteredTechniques = useMemo(() => {
    return techniques.filter(technique => {
      const matchesSearch = searchTerm === '' || 
        technique.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        technique.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        technique.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || technique.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [techniques, searchTerm, categoryFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTechniques.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTechniques = filteredTechniques.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value as 'all' | 'Motive' | 'Coercion' | 'Manipulation');
    setCurrentPage(1);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Motive':
        return 'bg-above-rose-100 text-above-rose-800 border border-above-rose-200';
      case 'Coercion':
        return 'bg-above-peach-100 text-above-peach-800 border border-above-peach-200';
      case 'Manipulation':
        return 'bg-above-lavender-100 text-above-lavender-800 border border-above-lavender-200';
      default:
        return 'bg-above-blue-100 text-above-blue-800 border border-above-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-above-white rounded-lg shadow-soft p-4 border border-above-rose-100/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search techniques by name, ID, or description..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 border-above-blue-200 focus:border-above-rose-400 focus:ring-above-rose-200"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Motive">Motive</SelectItem>
              <SelectItem value="Coercion">Coercion</SelectItem>
              <SelectItem value="Manipulation">Manipulation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Results count */}
        <div className="mt-4 text-sm text-slate-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredTechniques.length)} of {filteredTechniques.length} techniques
          {searchTerm && ` matching "${searchTerm}"`}
          {categoryFilter !== 'all' && ` in ${categoryFilter} category`}
        </div>
      </div>

      {/* Techniques List */}
      <div className="space-y-4">
        {currentTechniques.map((technique) => (
          <div
            key={technique.id}
            className="bg-above-white rounded-lg shadow-soft p-4 sm:p-6 hover:shadow-soft-lg transition-all duration-300 border border-above-rose-100/30"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight">
                    {technique.title}
                  </h3>
                  <span className="text-xs sm:text-sm text-slate-600 font-mono self-start">
                    {technique.id}
                  </span>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(technique.category)}`}>
                  {technique.category}
                </span>
              </div>
              <div className="flex-shrink-0">
                <Link href={`/matrix/technique/${technique.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 text-sm">
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">Details</span>
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <p className="text-slate-700 mb-4 line-clamp-3">
              {technique.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
              {/* Preventions Count */}
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-above-blue-700 flex-shrink-0" />
                <span className="text-slate-700">
                  {technique.preventions?.length || 0} Prevention{(technique.preventions?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Detections Count */}
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-above-peach-700 flex-shrink-0" />
                <span className="text-slate-700">
                  {technique.detections?.length || 0} Detection{(technique.detections?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Last Updated */}
              <div className="flex items-center text-slate-600 sm:col-span-2 lg:col-span-1">
                <span className="text-xs">
                  Updated: {technique.lastUpdated && !isNaN(new Date(technique.lastUpdated).getTime()) 
                    ? new Date(technique.lastUpdated).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: '2-digit'
                      })
                    : 'recently'}
                </span>
              </div>
            </div>

            {/* Preview of preventions and detections */}
            {(technique.preventions?.length > 0 || technique.detections?.length > 0) && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {technique.preventions?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                        Top Preventions:
                      </h4>
                      <ul className="space-y-1">
                        {technique.preventions.slice(0, 2).map((prevention, idx) => (
                          <li key={idx} className="text-sm text-slate-600 dark:text-slate-400">
                            • {prevention.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {technique.detections?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                        Top Detections:
                      </h4>
                      <ul className="space-y-1">
                        {technique.detections.slice(0, 2).map((detection, idx) => (
                          <li key={idx} className="text-sm text-slate-600 dark:text-slate-400">
                            • {detection.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No results message */}
      {currentTechniques.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-12 text-center">
          <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No techniques found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-full sm:w-auto h-10"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page
              </span>
              <Select
                value={currentPage.toString()}
                onValueChange={(value) => setCurrentPage(parseInt(value))}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <SelectItem key={page} value={page.toString()}>
                      {page}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                of {totalPages}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto h-10"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}