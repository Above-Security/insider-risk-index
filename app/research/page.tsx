import { getAllContent } from "@/lib/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AboveButton, AboveBadge } from "@/components/ui/above-components";
import { Calendar, Clock, User, TrendingUp, FileText, BarChart3 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Research & Insights | Insider Risk Index",
  description: "Latest research, trends, and insights on insider threat management, based on comprehensive industry analysis and real-world data.",
  openGraph: {
    title: "Research & Insights - Insider Risk Index",
    description: "Industry-leading research on insider threat trends, costs, and mitigation strategies based on comprehensive data analysis.",
    type: "website",
  },
};

export default function ResearchPage() {
  const researchArticles = getAllContent('research');
  
  return (
    <div className="min-h-screen bg-above-gradient-light">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-above-rose-900 via-above-rose-800 to-above-lavender-800 text-above-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-above-white/10 p-3">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Research & Insights
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-above-rose-100">
              Industry-leading research on insider threat trends, costs, and mitigation strategies. 
              Our analysis is based on comprehensive data from thousands of organizations worldwide.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-above-white/10 px-4 py-2">
                <BarChart3 className="h-4 w-4" />
                1,400+ Organizations Analyzed
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-above-white/10 px-4 py-2">
                <FileText className="h-4 w-4" />
                Ponemon Institute Data
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-above-white/10 px-4 py-2">
                <TrendingUp className="h-4 w-4" />
                Verizon DBIR Analysis
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Key Statistics */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">2024 Key Findings</h2>
            <p className="text-lg text-slate-600 mt-2">Critical insights from our latest research</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-l-4 border-l-above-rose-700 bg-above-rose-50 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-3xl font-bold text-above-rose-900">$17.4M</CardTitle>
                <CardDescription className="text-above-rose-800">Average annual cost per organization</CardDescription>
              </CardHeader>
              <CardContent>
                <AboveBadge variant="error" className="text-xs">7.4% increase from 2023</AboveBadge>
              </CardContent>
            </Card>
            
            <Card className="text-center border-l-4 border-l-above-peach-700 bg-above-peach-50 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-3xl font-bold text-above-peach-900">68%</CardTitle>
                <CardDescription className="text-above-peach-800">Of breaches involve human element</CardDescription>
              </CardHeader>
              <CardContent>
                <AboveBadge variant="warning" className="text-xs">Non-malicious actors dominant</AboveBadge>
              </CardContent>
            </Card>
            
            <Card className="text-center border-l-4 border-l-above-blue-700 bg-above-blue-50 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-3xl font-bold text-above-blue-900">81</CardTitle>
                <CardDescription className="text-above-blue-800">Days average containment time</CardDescription>
              </CardHeader>
              <CardContent>
                <AboveBadge variant="secondary" className="text-xs">$676,517 cost per incident</AboveBadge>
              </CardContent>
            </Card>
            
            <Card className="text-center border-l-4 border-l-above-lavender-700 bg-above-lavender-50 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-3xl font-bold text-above-lavender-900">13.5</CardTitle>
                <CardDescription className="text-above-lavender-800">Average incidents per year</CardDescription>
              </CardHeader>
              <CardContent>
                <AboveBadge variant="secondary" className="text-xs">Per organization baseline</AboveBadge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Research Articles */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Latest Research</h2>
            <p className="text-lg text-slate-600 mt-2">Comprehensive analysis and industry insights</p>
          </div>

          {researchArticles.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Research Articles Found</h3>
                <p className="text-slate-600">Research content is being prepared. Check back soon for the latest insights.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {researchArticles.map((article, index) => {
                const cardColors = [
                  { bg: 'bg-above-rose-50', border: 'border-above-rose-200', accent: 'border-l-above-rose-700' },
                  { bg: 'bg-above-blue-50', border: 'border-above-blue-200', accent: 'border-l-above-blue-700' },
                  { bg: 'bg-above-peach-50', border: 'border-above-peach-200', accent: 'border-l-above-peach-700' },
                  { bg: 'bg-above-lavender-50', border: 'border-above-lavender-200', accent: 'border-l-above-lavender-700' },
                ];
                const cardColor = cardColors[index % cardColors.length];
                
                return (
                <Card key={article.slug} className={`group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${cardColor.bg} ${cardColor.border} border-l-4 ${cardColor.accent} ${index === 0 ? 'lg:col-span-2' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AboveBadge variant="secondary">Research</AboveBadge>
                          {index === 0 && <AboveBadge variant="default">Latest</AboveBadge>}
                        </div>
                        <CardTitle className="text-xl group-hover:text-above-rose-700 transition-colors line-clamp-2">
                          {article.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readingTime} min read
                        </div>
                        {article.author && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {article.author}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {'dataSources' in article && article.dataSources && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-slate-700 mb-2">Data Sources:</p>
                        <div className="flex flex-wrap gap-1">
                          {article.dataSources.map((source, i) => (
                            <AboveBadge key={i} variant="outline" className="text-xs">
                              {source}
                            </AboveBadge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {article.tags && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map((tag, i) => (
                            <AboveBadge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </AboveBadge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Link href={`/research/${article.slug}`}>
                      <AboveButton className="w-full" variant="default">
                        Read Full Report
                      </AboveButton>
                    </Link>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-above-rose-700 to-above-lavender-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Get Your Organization's Risk Assessment</h3>
          <p className="text-xl text-above-blue-100 mb-6">
            See how your insider risk posture compares to industry benchmarks with our comprehensive assessment.
          </p>
          <Link href="/assessment">
            <AboveButton size="lg" variant="secondary" className="bg-white text-above-rose-700 hover:bg-above-rose-50">
              Start Free Assessment
            </AboveButton>
          </Link>
        </div>
      </div>
    </div>
  );
}