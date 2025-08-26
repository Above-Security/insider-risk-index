import { BookOpen } from 'lucide-react';
import { getAllPlaybooks } from '@/lib/playbooks';
import { PlaybookGrid } from '@/components/playbooks/playbook-grid';
import { pageMetadata, generateJsonLd } from '@/lib/seo';

export const metadata = pageMetadata.playbooks();

export default function PlaybooksPage() {
  const playbooks = getAllPlaybooks();

  // Generate structured data for playbooks collection
  const playbooksJsonLd = generateJsonLd({
    "@type": "CreativeWorkSeries",
    name: "Insider Risk Management Implementation Playbooks",
    description: "Comprehensive collection of step-by-step implementation guides for building effective insider risk management programs across all security pillars.",
    url: "https://insiderriskindex.com/playbooks",
    inLanguage: "en-US",
    audience: {
      "@type": "Audience",
      audienceType: "Security Professionals"
    },
    about: {
      "@type": "Thing",
      name: "Insider Risk Management",
      description: "Comprehensive approach to managing insider threats through policy, technology, and process improvements"
    },
    hasPart: playbooks.map((playbook) => ({
      "@type": "HowTo",
      name: playbook.frontmatter.title,
      description: playbook.frontmatter.description,
      url: `https://insiderriskindex.com/playbooks/${playbook.slug}`,
      educationalLevel: playbook.frontmatter.difficulty,
      timeRequired: playbook.frontmatter.timeToImplement,
    })),
    publisher: {
      "@type": "Organization",
      name: "Insider Risk Index",
      url: "https://insiderriskindex.com"
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(playbooksJsonLd) }}
      />
      <div className="min-h-screen grainy-gradient-subtle py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-above-rose-700 mr-3" />
            <h1 className="text-4xl font-bold text-slate-900">
              Implementation Playbooks
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Comprehensive, step-by-step guides to building effective insider risk management 
            programs. Each playbook provides practical implementation strategies backed by 
            industry best practices and real-world experience.
          </p>
        </div>

        {/* Playbook Grid with Advanced Filtering */}
        <PlaybookGrid playbooks={playbooks} />
      </div>
      </div>
    </>
  );
}