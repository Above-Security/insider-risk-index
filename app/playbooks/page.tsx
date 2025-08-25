import { BookOpen, Clock, Target, Tag, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getAllPlaybooks, PILLAR_NAMES, PILLAR_COLORS } from '@/lib/playbooks';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata() {
  return {
    title: 'Implementation Playbooks - Insider Risk Index',
    description: 'Comprehensive, step-by-step implementation guides for building effective insider risk management programs across all five pillars.',
    keywords: 'insider risk playbooks, implementation guides, security playbooks, threat management, risk mitigation',
  };
}

function getDifficultyColor(difficulty: string) {
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
}

export default function PlaybooksPage() {
  const playbooks = getAllPlaybooks();
  const pillarStats = Object.keys(PILLAR_NAMES).map(pillar => ({
    pillar,
    name: PILLAR_NAMES[pillar as keyof typeof PILLAR_NAMES],
    count: playbooks.filter(p => p.frontmatter.pillar === pillar).length,
    color: PILLAR_COLORS[pillar as keyof typeof PILLAR_COLORS]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Implementation Playbooks
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive, step-by-step guides to building effective insider risk management 
            programs. Each playbook provides practical implementation strategies backed by 
            industry best practices and real-world experience.
          </p>
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            {playbooks.length} playbooks available across {pillarStats.filter(p => p.count > 0).length} pillars
          </div>
        </div>

        {/* Pillar Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {pillarStats.map((pillar) => (
            <div key={pillar.pillar} className="text-center">
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${pillar.color}`}>
                <span className="mr-2">{pillar.name}</span>
                <Badge variant="secondary" className="ml-auto">
                  {pillar.count}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Playbooks Grid */}
        {playbooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No playbooks available yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Playbooks are currently being developed. Check back soon for comprehensive implementation guides.
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {playbooks.map((playbook) => (
              <div
                key={playbook.slug}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-8"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {playbook.frontmatter.title}
                      </h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        PILLAR_COLORS[playbook.frontmatter.pillar as keyof typeof PILLAR_COLORS]
                      }`}>
                        {PILLAR_NAMES[playbook.frontmatter.pillar as keyof typeof PILLAR_NAMES]}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getDifficultyColor(playbook.frontmatter.difficulty)
                      }`}>
                        {playbook.frontmatter.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                      {playbook.frontmatter.description}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Estimated time: {playbook.frontmatter.estimatedTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    <span>Version: {playbook.frontmatter.version}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    <span>Updated: {new Date(playbook.frontmatter.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Prerequisites */}
                {playbook.frontmatter.prerequisites.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Prerequisites:
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {playbook.frontmatter.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expected Outcomes */}
                {playbook.frontmatter.outcomes.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Expected Outcomes:
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {playbook.frontmatter.outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {playbook.frontmatter.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <Tag className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {playbook.frontmatter.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`/playbooks/${playbook.slug}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    View Playbook
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}