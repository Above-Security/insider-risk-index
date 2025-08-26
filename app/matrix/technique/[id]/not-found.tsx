import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TechniqueNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Matrix Element Not Found
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            The Matrix element you're looking for doesn't exist or may have been moved.
            Please check the element ID or browse our complete Matrix.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild>
              <Link href="/matrix">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Matrix
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/glossary">
                Browse Glossary
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}