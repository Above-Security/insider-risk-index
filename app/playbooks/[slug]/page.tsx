import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AboveButton, AboveBadge } from "@/components/ui/above-components";
import { MDXContent } from "@/components/mdx/mdx-content";
import { 
  getContentBySlug, 
  getAllContent, 
  PlaybookFrontmatter,
  getRelatedContent,
  calculateReadingTime 
} from "@/lib/mdx";
import { pageMetadata, getPlaybookJsonLd, getBreadcrumbJsonLd } from "@/lib/seo";
import { 
  ArrowLeft,
  Clock,
  User,
  Target,
  BookOpen,
  ExternalLink,
  Download,
  Share2,
  Eye,
  Shield,
  Search,
  Key,
  ShieldAlert
} from "lucide-react";

const pillarIcons = {
  visibility: Eye,
  "prevention-coaching": Shield,
  "investigation-evidence": Search,
  "identity-saas": Key,
  "phishing-resilience": ShieldAlert,
};

const difficultyColors = {
  Beginner: "bg-above-blue-100 text-above-blue-800 border-above-blue-200",
  Intermediate: "bg-above-peach-100 text-above-peach-800 border-above-peach-200", 
  Advanced: "bg-above-rose-100 text-above-rose-800 border-above-rose-200",
};

const maturityLevels = {
  1: { name: "Ad Hoc", color: "bg-above-blue-100 text-above-blue-800 border-above-blue-200", description: "Basic, reactive approach" },
  2: { name: "Emerging", color: "bg-above-peach-100 text-above-peach-800 border-above-peach-200", description: "Developing capabilities" },
  3: { name: "Managed", color: "bg-above-lavender-100 text-above-lavender-800 border-above-lavender-200", description: "Structured processes" },
  4: { name: "Proactive", color: "bg-above-rose-100 text-above-rose-800 border-above-rose-200", description: "Optimized approach" },
  5: { name: "Optimized", color: "bg-above-blue-100 text-above-blue-800 border-above-blue-200", description: "Continuous improvement" },
};

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const playbook = getContentBySlug<PlaybookFrontmatter>("playbooks", slug);
  
  if (!playbook) {
    return pageMetadata.notFound();
  }

  return pageMetadata.playbook(playbook.frontmatter, slug);
}

// Generate static paths for all playbooks
export async function generateStaticParams() {
  const playbooks = getAllContent<PlaybookFrontmatter>("playbooks");
  
  return playbooks.map((playbook) => ({
    slug: playbook.slug,
  }));
}

export default async function PlaybookPage({ params }: Props) {
  const { slug } = await params;
  const playbook = getContentBySlug<PlaybookFrontmatter>("playbooks", slug);
  
  if (!playbook) {
    notFound();
  }

  const { frontmatter, content } = playbook;
  const readingTime = calculateReadingTime(content);
  const relatedPlaybooks = getRelatedContent<PlaybookFrontmatter>(slug, "playbooks", 3);
  
  const IconComponent = pillarIcons[frontmatter.pillar as keyof typeof pillarIcons] || BookOpen;
  const maturityLevel = maturityLevels[frontmatter.maturityLevel] || maturityLevels[1];

  // Generate JSON-LD structured data
  const playbookJsonLd = getPlaybookJsonLd({
    title: frontmatter.title,
    description: frontmatter.description,
    pillar: frontmatter.pillar,
    difficulty: frontmatter.difficulty,
    estimatedTime: frontmatter.timeToImplement,
    tags: frontmatter.tags || [],
    prerequisites: frontmatter.prerequisites || [],
    outcomes: frontmatter.outcomes || [],
    slug,
    lastUpdated: frontmatter.lastUpdated,
    version: frontmatter.version,
  });

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: "https://insiderriskindex.com" },
    { name: "Playbooks", url: "https://insiderriskindex.com/playbooks" },
    { name: frontmatter.title, url: `https://insiderriskindex.com/playbooks/${slug}` }
  ]);

  return (
    <div className="min-h-screen bg-above-gradient-light">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-above-rose-900 via-above-rose-800 to-above-lavender-800 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <Link 
              href="/playbooks"
              className="inline-flex items-center text-sm font-medium text-above-rose-100 hover:text-white mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Playbooks
            </Link>

            <div className="mb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-full mr-3">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <AboveBadge 
                    variant="outline" 
                    className="bg-white/20 border-white/30 text-white"
                  >
                    {frontmatter.difficulty}
                  </AboveBadge>
                  <AboveBadge 
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white"
                  >
                    Level {frontmatter.maturityLevel} - {maturityLevel.name}
                  </AboveBadge>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                {frontmatter.title}
              </h1>
              
              <p className="text-xl leading-relaxed mb-6 text-above-rose-100 max-w-3xl mx-auto">
                {frontmatter.description}
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-above-rose-100">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {frontmatter.timeToImplement} to implement
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {readingTime} min read
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {frontmatter.author}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <AboveButton variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </AboveButton>
              <AboveButton variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </AboveButton>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content with Enhanced Styling */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <article>
                <MDXContent content={content} />
              </article>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Playbook Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Playbook Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Target Maturity</div>
                    <div className="text-sm text-slate-900">{maturityLevel.description}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Pillar Focus</div>
                    <div className="text-sm text-slate-900 capitalize">
                      {frontmatter.pillar.replace("-", " & ")}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Version</div>
                    <div className="text-sm text-slate-900">v{frontmatter.version}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Last Updated</div>
                    <div className="text-sm text-slate-900">
                      {new Date(frontmatter.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {frontmatter.tags && frontmatter.tags.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-slate-500 mb-2">Tags</div>
                      <div className="flex flex-wrap gap-1">
                        {frontmatter.tags.map((tag) => (
                          <AboveBadge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </AboveBadge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resources */}
              {frontmatter.resources && frontmatter.resources.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {frontmatter.resources.map((resource, index) => (
                      <div key={index}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-above-blue-800 hover:text-above-blue-800 font-medium flex items-start"
                        >
                          {resource.title}
                          <ExternalLink className="h-3 w-3 ml-1 mt-0.5 flex-shrink-0" />
                        </a>
                        <div className="text-xs text-slate-500 capitalize mt-1">
                          {resource.type}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Action CTA */}
              <Card className="bg-gradient-to-br from-above-rose-50 to-above-lavender-50 border-above-rose-200">
                <CardContent className="p-6 text-center">
                  <Target className="h-10 w-10 text-above-rose-700 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Ready to Implement?
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Take our assessment to see how this playbook fits your current maturity level.
                  </p>
                  <Link href="/assessment">
                    <AboveButton size="sm" className="w-full">
                      Start Assessment
                    </AboveButton>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Playbooks */}
        {relatedPlaybooks.length > 0 && (
          <div className="mt-16 pt-8 border-t border-above-rose-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Playbooks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPlaybooks.map((related, index) => {
                const RelatedIcon = pillarIcons[related.frontmatter.pillar as keyof typeof pillarIcons] || BookOpen;
                const cardColors = [
                  { bg: 'bg-above-rose-50', border: 'border-above-rose-200', accent: 'border-l-above-rose-700' },
                  { bg: 'bg-above-blue-50', border: 'border-above-blue-200', accent: 'border-l-above-blue-700' },
                  { bg: 'bg-above-peach-50', border: 'border-above-peach-200', accent: 'border-l-above-peach-700' },
                ];
                const cardColor = cardColors[index % cardColors.length];
                
                return (
                  <Card key={related.slug} className={`hover:shadow-xl hover:scale-105 transition-all duration-300 ${cardColor.bg} ${cardColor.border} border-l-4 ${cardColor.accent}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base line-clamp-2">
                          {related.frontmatter.title}
                        </CardTitle>
                        <div className="bg-white/50 p-2 rounded-lg ml-2 flex-shrink-0">
                          <RelatedIcon className="h-5 w-5 text-above-rose-700" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                        {related.frontmatter.description}
                      </p>
                      <Link href={`/playbooks/${related.slug}`}>
                        <AboveButton variant="outline" size="sm" className="w-full">
                          View Playbook →
                        </AboveButton>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(playbookJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}