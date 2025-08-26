import { notFound } from "next/navigation";
import { getContentBySlug, getAllContent, getRelatedContent } from "@/lib/mdx";

export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AboveButton, AboveBadge, AboveAlert, AboveAlertDescription } from "@/components/ui/above-components";
import { Separator } from "@/components/ui/separator";
import { MDXContent } from "@/components/mdx/mdx-content";
import { getResearchArticleJsonLd } from "@/lib/seo";
import { Calendar, Clock, User, ArrowLeft, Share2, Download, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllContent('research');
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const content = await getContentBySlug('research', slug);
  
  if (!content) {
    return {
      title: "Research Article Not Found",
      description: "The requested research article could not be found.",
    };
  }

  const { frontmatter } = content;
  
  return {
    title: `${frontmatter.title} | Insider Risk Research`,
    description: frontmatter.description,
    authors: frontmatter.author ? [{ name: frontmatter.author }] : [{ name: "Insider Risk Index Team" }],
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: "article",
      publishedTime: frontmatter.publishDate,
      authors: frontmatter.author ? [frontmatter.author] : ["Insider Risk Index Team"],
      section: "Cybersecurity Research",
      tags: frontmatter.tags,
    },
    keywords: frontmatter.tags?.join(', '),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ResearchArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getContentBySlug('research', slug);
  
  if (!article) {
    notFound();
  }

  const { frontmatter, content: articleContent } = article;
  const relatedArticles = getRelatedContent(slug, 'research', 3);

  // Generate JSON-LD for the article
  const articleUrl = `https://insiderriskindex.com/research/${slug}`;
  const jsonLd = getResearchArticleJsonLd({
    title: frontmatter.title,
    description: frontmatter.description,
    slug,
    publishDate: frontmatter.publishDate,
    lastModified: frontmatter.publishDate,
    tags: frontmatter.tags || [],
    author: frontmatter.author,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-above-gradient-light">
        {/* Hero Section with Gradient */}
        <div className="bg-gradient-to-r from-above-rose-900 via-above-rose-800 to-above-lavender-800 text-white">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Link href="/research">
                <AboveButton variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 mb-6">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Research
                </AboveButton>
              </Link>
              
              <div className="mb-4">
                <AboveBadge variant="secondary" className="mb-2 bg-white/20 text-white border-white/30">Research</AboveBadge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {frontmatter.title}
                </h1>
              </div>
              
              <p className="text-xl leading-relaxed mb-6 text-above-rose-100">
                {frontmatter.description}
              </p>
              
              {/* Article Meta */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-above-rose-100">
                {frontmatter.author && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {frontmatter.author}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(frontmatter.publishDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {frontmatter.readingTime} minute read
                </div>
              </div>

              {/* Tags */}
              {frontmatter.tags && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {frontmatter.tags.map((tag: string, index: number) => (
                    <AboveBadge key={index} variant="outline" className="bg-white/10 border-white/30 text-white">
                      {tag}
                    </AboveBadge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Article Content with Enhanced Styling */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <article className="prose prose-lg max-w-none">
              <MDXContent content={articleContent} />
            </article>
          </div>

          {/* Research Methodology Note */}
          {'dataSources' in frontmatter && (
            <AboveAlert variant="info" className="mb-8">
              <TrendingUp className="h-4 w-4" />
              <AboveAlertDescription>
                <h4 className="font-semibold mb-3 text-above-blue-900">Research Methodology</h4>
                <p className="mb-3">
                  This research is based on comprehensive data analysis from multiple authoritative sources:
                </p>
                <ul className="space-y-1 mb-4 text-sm">
                  <li>• Ponemon Institute 2024/2025 Cost of Insider Threats Global Report</li>
                  <li>• Verizon 2024 Data Breach Investigations Report (DBIR)</li>
                  <li>• Industry-specific incident analysis and security assessments</li>
                  <li>• Expert interviews and organizational surveys</li>
                </ul>
                <p className="text-xs text-above-blue-800">
                  All individual organization data has been anonymized and aggregated to protect participant confidentiality.
                  Statistical methodologies follow industry standards for cybersecurity research.
                </p>
              </AboveAlertDescription>
            </AboveAlert>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Related Research</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((article, index) => {
                  const cardColors = [
                    { bg: 'bg-above-rose-50', border: 'border-above-rose-200', accent: 'border-l-above-rose-700' },
                    { bg: 'bg-above-blue-50', border: 'border-above-blue-200', accent: 'border-l-above-blue-700' },
                    { bg: 'bg-above-peach-50', border: 'border-above-peach-200', accent: 'border-l-above-peach-700' },
                  ];
                  const cardColor = cardColors[index % cardColors.length];
                  
                  return (
                  <Card key={article.slug} className={`group hover:shadow-lg hover:scale-105 transition-all duration-300 ${cardColor.bg} ${cardColor.border} border-l-4 ${cardColor.accent}`}>
                    <CardHeader>
                      <AboveBadge variant="secondary" className="w-fit mb-2">Research</AboveBadge>
                      <CardTitle className="text-lg group-hover:text-above-rose-600 transition-colors line-clamp-2">
                        {article.frontmatter.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                        {article.frontmatter.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <span>{new Date(article.frontmatter.publishDate || article.frontmatter.publishedAt || Date.now()).toLocaleDateString()}</span>
                        <span>{article.frontmatter.readingTime || '5'} min read</span>
                      </div>
                      <Link href={`/research/${article.slug}`}>
                        <AboveButton variant="outline" size="sm" className="w-full">
                          Read Article
                        </AboveButton>
                      </Link>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Call to Action */}
          <Card className="mt-16 bg-gradient-to-r from-above-rose-700 to-above-lavender-700 text-white">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Assess Your Organization's Risk</h3>
              <p className="text-above-rose-100 text-lg mb-6">
                Get a comprehensive evaluation of your insider threat posture and compare against industry benchmarks.
              </p>
              <Link href="/assessment">
                <AboveButton size="lg" variant="secondary" className="bg-white text-above-rose-600 hover:bg-above-rose-50">
                  Start Free Assessment
                </AboveButton>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}