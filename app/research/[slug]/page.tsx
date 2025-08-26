import { notFound } from "next/navigation";
import { getContentBySlug, getAllContent, getRelatedContent } from "@/lib/mdx";

export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/research">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Research
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">Research</Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {frontmatter.title}
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              {frontmatter.description}
            </p>
            
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
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
              <div className="mt-4 flex flex-wrap gap-2">
                {frontmatter.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <div className="text-sm text-gray-500">
                Share: <span className="font-mono text-xs">{articleUrl}</span>
              </div>
            </div>
          </header>

          <Separator className="mb-8" />

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <MDXContent content={articleContent} />
          </article>

          <Separator className="mt-12 mb-8" />

          {/* Research Methodology Note */}
          {'dataSources' in frontmatter && (
            <Card className="mb-8 bg-above-rose-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-above-rose-900">Research Methodology</CardTitle>
              </CardHeader>
              <CardContent className="text-above-rose-800">
                <p className="mb-3">
                  This research is based on comprehensive data analysis from multiple authoritative sources:
                </p>
                <ul className="space-y-1 mb-4">
                  <li>• Ponemon Institute 2024/2025 Cost of Insider Threats Global Report</li>
                  <li>• Verizon 2024 Data Breach Investigations Report (DBIR)</li>
                  <li>• Industry-specific incident analysis and security assessments</li>
                  <li>• Expert interviews and organizational surveys</li>
                </ul>
                <p className="text-sm">
                  All individual organization data has been anonymized and aggregated to protect participant confidentiality.
                  Statistical methodologies follow industry standards for cybersecurity research.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Research</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((article) => (
                  <Card key={article.slug} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2">Research</Badge>
                      <CardTitle className="text-lg group-hover:text-above-rose-600 transition-colors line-clamp-2">
                        {article.frontmatter.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.frontmatter.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>{new Date(article.frontmatter.publishDate || article.frontmatter.publishedAt || Date.now()).toLocaleDateString()}</span>
                        <span>{article.frontmatter.readingTime || '5'} min read</span>
                      </div>
                      <Link href={`/research/${article.slug}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Read Article
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
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
                <Button size="lg" variant="secondary" className="bg-white text-above-rose-600 hover:bg-above-rose-50">
                  Start Free Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}