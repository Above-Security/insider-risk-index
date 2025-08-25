import { BookOpen } from 'lucide-react';
import { getAllPlaybooks } from '@/lib/playbooks';
import { PlaybookGrid } from '@/components/playbooks/playbook-grid';

export async function generateMetadata() {
  return {
    title: 'Implementation Playbooks - Insider Risk Index',
    description: 'Comprehensive, step-by-step implementation guides for building effective insider risk management programs across all five pillars.',
    keywords: 'insider risk playbooks, implementation guides, security playbooks, threat management, risk mitigation',
  };
}

export default function PlaybooksPage() {
  const playbooks = getAllPlaybooks();

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
        </div>

        {/* Playbook Grid with Advanced Filtering */}
        <PlaybookGrid playbooks={playbooks} />
      </div>
    </div>
  );
}