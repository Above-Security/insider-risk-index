import { notFound } from "next/navigation";
import { getContentBySlug, getAllContent, getRelatedContent } from "@/lib/mdx";

// ISR: Revalidate every hour (3600 seconds) for fresh content
export const revalidate = 3600;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AboveButton, AboveBadge, AboveAlert, AboveAlertDescription } from "@/components/ui/above-components";
import { Separator } from "@/components/ui/separator";
import { MDXContent } from "@/components/mdx/mdx-content";
import { getResearchArticleJsonLd } from "@/lib/seo";
import { Calendar, Clock, User, ArrowLeft, Share2, Download, TrendingUp, AlertTriangle, Shield, Eye, Target, Zap, BarChart3, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

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
  const content = getContentBySlug('research', slug);
  
  if (!content || !content.frontmatter || !content.frontmatter.title) {
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
  
  if (!article || !article.frontmatter || !article.frontmatter.title) {
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
        {/* Simple Progress Bar - Always visible at bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-t border-slate-200">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-2 text-xs text-slate-600">
              <span>Reading Progress</span>
              <div className="flex items-center gap-2">
                <span id="progress-percentage">0%</span>
                <span>•</span>
                <span>{frontmatter.readTime || '15'} min read</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                id="reading-progress" 
                className="bg-gradient-to-r from-above-blue-600 to-above-rose-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{width: '0%'}}
              ></div>
            </div>
          </div>
        </div>

        {/* Hero Section with Gradient */}
        <div className="grainy-gradient-hero text-white pt-16">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Link href="/research">
                <AboveButton variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 mb-6">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Research
                </AboveButton>
              </Link>
              
              <div className="mb-4">
                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold mb-2 bg-white/20 text-white border-white/30">
                  Research
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">
                  {frontmatter.title}
                </h1>
              </div>
              
              <p className="text-xl leading-relaxed mb-6 text-white/90">
                {frontmatter.description}
              </p>
              
              {/* Article Meta */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
                {frontmatter.author && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {frontmatter.author}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(frontmatter.publishDate || frontmatter.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {frontmatter.readingTime || '15'} minute read
                </div>
              </div>

              {/* Tags */}
              {frontmatter.tags && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {frontmatter.tags.map((tag: string, index: number) => (
                    <div key={index} className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-white/10 border-white/30 text-white">
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Critical Statistics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-semibold uppercase tracking-wide">Annual Cost</p>
                    <p className="text-3xl font-bold text-red-900">$17.4M</p>
                    <p className="text-red-700 text-xs">+7.4% from 2023</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-red-500" />
                </div>
                <div className="mt-3">
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>Ponemon Institute 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-semibold uppercase tracking-wide">Breach Rate</p>
                    <p className="text-3xl font-bold text-orange-900">68%</p>
                    <p className="text-orange-700 text-xs">Human factor</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
                <div className="mt-3">
                  <Progress value={68} className="h-2" />
                  <div className="flex items-center text-xs text-orange-600 mt-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    <span>Verizon DBIR 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-semibold uppercase tracking-wide">Detection Time</p>
                    <p className="text-3xl font-bold text-yellow-900">81</p>
                    <p className="text-yellow-700 text-xs">Days average</p>
                  </div>
                  <Eye className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="mt-3">
                  <div className="flex items-center text-xs text-yellow-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Containment period</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide">Frequency</p>
                    <p className="text-3xl font-bold text-purple-900">13.5</p>
                    <p className="text-purple-700 text-xs">Events/year</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
                <div className="mt-3">
                  <div className="flex items-center text-xs text-purple-600">
                    <Zap className="h-3 w-3 mr-1" />
                    <span>Per organization</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subtle Research Context Banner */}
          <div className="mb-8 p-4 bg-slate-50 border-l-4 border-l-slate-400 rounded-r-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <BarChart3 className="h-5 w-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium">
                  Research-backed intelligence from Verizon DBIR, Ponemon Institute, Gartner, and ForScie Matrix
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
                  <span>1,400+ organizations analyzed</span>
                  <span>•</span>
                  <span>Real-world threat patterns</span>
                  <span>•</span>
                  <span>Updated August 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Article Content */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
            {/* Article Header */}
            <div className="px-8 py-6 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h2 className="text-lg font-semibold text-slate-900">Intelligence Report</h2>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Comprehensive analysis based on verified threat intelligence and industry research
              </p>
            </div>

            {/* Article Content with Elegant Typography */}
            <article className="px-8 py-8">
              <div className="prose prose-lg prose-slate max-w-none
                           prose-headings:font-semibold
                           prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-3
                           prose-blockquote:border-l-4 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                           prose-table:border-collapse prose-table:border prose-table:border-slate-300 prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-sm
                           prose-thead:bg-slate-100
                           prose-th:border prose-th:border-slate-300 prose-th:p-4 prose-th:font-semibold prose-th:text-slate-900 prose-th:text-sm prose-th:uppercase prose-th:tracking-wide
                           prose-td:border prose-td:border-slate-300 prose-td:p-4 prose-td:text-slate-700
                           prose-tr:hover:bg-slate-50 prose-tr:transition-colors">
                
                
                {/* Simple Scroll Progress Script */}
                <script dangerouslySetInnerHTML={{
                  __html: `
                    (function() {
                      function updateScrollProgress() {
                        const progressBar = document.getElementById('reading-progress');
                        const progressText = document.getElementById('progress-percentage');
                        
                        if (!progressBar || !progressText) return;
                        
                        const windowHeight = window.innerHeight;
                        const documentHeight = document.documentElement.scrollHeight;
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        
                        const scrollableHeight = documentHeight - windowHeight;
                        const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) : 0;
                        const percentage = Math.min(Math.max(Math.round(progress * 100), 0), 100);
                        
                        progressBar.style.width = percentage + '%';
                        progressText.textContent = percentage + '%';
                        
                        // Change color when complete
                        if (percentage === 100) {
                          progressBar.className = 'bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out';
                        } else {
                          progressBar.className = 'bg-gradient-to-r from-above-blue-600 to-above-rose-600 h-2 rounded-full transition-all duration-500 ease-out';
                        }
                      }
                      
                      // Throttled scroll handler
                      let ticking = false;
                      function onScroll() {
                        if (!ticking) {
                          requestAnimationFrame(() => {
                            updateScrollProgress();
                            ticking = false;
                          });
                          ticking = true;
                        }
                      }
                      
                      // Initialize
                      if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', () => {
                          window.addEventListener('scroll', onScroll, { passive: true });
                          updateScrollProgress();
                        });
                      } else {
                        window.addEventListener('scroll', onScroll, { passive: true });
                        updateScrollProgress();
                      }
                    })();
                  `
                }} />

                <MDXContent content={articleContent} />
              </div>
            </article>

            {/* Article Footer with Source Citations */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 rounded-b-xl">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-800">Data Sources</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-1 text-slate-600">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Verizon DBIR 2024</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Ponemon Institute</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Gartner Research</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>ForScie Matrix</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Sources Section */}
          <Card className="mb-8 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-slate-600" />
                <h3 className="text-xl font-bold text-slate-900">Verified Intelligence Sources</h3>
                <Badge className="bg-green-100 text-green-800 border-green-300">AUTHENTICATED</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Ponemon Institute 2024/2025</h4>
                      <p className="text-sm text-slate-600">Global Cost of Insider Threats Report</p>
                      <p className="text-xs text-slate-500 mt-1">$17.4M average annual cost, 1,400+ organizations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Verizon 2024 DBIR</h4>
                      <p className="text-sm text-slate-600">Data Breach Investigations Report</p>
                      <p className="text-xs text-slate-500 mt-1">68% human factor involvement in breaches</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Gartner Market Guide</h4>
                      <p className="text-sm text-slate-600">Insider Risk Management Solutions</p>
                      <p className="text-xs text-slate-500 mt-1">54% of programs less than effective</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">ForScie Insider Threat Matrix</h4>
                      <p className="text-sm text-slate-600">Community-driven threat intelligence</p>
                      <p className="text-xs text-slate-500 mt-1">Real-world attack patterns and techniques</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">Research Integrity</span>
                </div>
                <p className="text-xs text-amber-700">
                  All statistics are sourced from peer-reviewed research institutions and government agencies. 
                  Individual organizational data has been anonymized and aggregated to maintain confidentiality 
                  while preserving statistical validity.
                </p>
              </div>
            </CardContent>
          </Card>

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
          <Card className="mt-16 grainy-gradient-cta">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Assess Your Organization's Risk</h3>
              <p className="text-lg mb-6 text-white/90">
                Get a comprehensive evaluation of your insider threat posture and compare against industry benchmarks.
              </p>
              <Link href="/assessment">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium transition-colors h-10 px-8 bg-white text-above-rose-700 hover:bg-above-rose-50 shadow-sm">
                  Start Free Assessment
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}