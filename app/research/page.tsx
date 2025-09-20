import { getAllContent } from "@/lib/mdx";
import type { ResearchFrontmatter } from "@/lib/mdx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AboveBadge } from "@/components/ui/above-components";
import { TrendingUp, FileText, BarChart3, BookOpen } from "lucide-react";
import Link from "next/link";
import { getPageLayout, getSectionLayout, getGridClass } from "@/lib/layout-utils";
import { ResearchCard } from "@/components/research/research-card";
import { getFAQJsonLd } from "@/lib/seo";
import Script from "next/script";

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
  // Load and sort research articles by date (newest first)
  const researchArticles = getAllContent<ResearchFrontmatter>('research')
    .filter(article => article && article.frontmatter && article.frontmatter.title)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.publishedAt || a.frontmatter.publishDate || '');
      const dateB = new Date(b.frontmatter.publishedAt || b.frontmatter.publishDate || '');
      return dateB.getTime() - dateA.getTime(); // Sort by newest first
    });

  // FAQ data for research page AI optimization
  const researchFAQs = [
    {
      question: "What do the latest insider threat research findings reveal?",
      answer: "2025 research shows organizations face $17.4M in annual insider threat costs (Ponemon Institute), but containment times improved to 81 days. 68% of breaches involve human elements (Verizon DBIR), with negligent insiders causing 55% of total costs ($8.8M per organization)."
    },
    {
      question: "Which research sources validate insider risk management strategies?",
      answer: "Our analysis draws from Ponemon Institute 2025 Global Report (1,400+ organizations), Gartner Market Guide G00805757 (48% attack increase data), Verizon DBIR 2024 (68% human element breaches), and Gurucul behavioral analytics research across multiple industries."
    },
    {
      question: "How much do insider threats cost organizations annually?",
      answer: "The average organization spends $17.4 million annually on insider threat incidents (Ponemon 2025). North America faces highest costs at $22.2M, while negligent insiders account for $8.8M (55%) of total costs with 13.5 incidents per organization yearly."
    },
    {
      question: "What insider threat prevention strategies show the highest ROI?",
      answer: "User training delivers the highest ROI at $5.2M in cost savings. Organizations with early detection (under 31 days) save $8.1M compared to delayed response. AI-enhanced detection reduces investigation times by 70% with 99.8% accuracy for email threats."
    },
    {
      question: "How can organizations measure insider risk management success?",
      answer: "Key metrics include containment time (target: under 31 days), cost per incident (industry average: $676,517), prevention effectiveness (45% reduction through security training), and detection accuracy (99.8% with AI). 65% of organizations with insider risk programs successfully pre-empt breaches."
    }
  ];

  const faqJsonLd = getFAQJsonLd(researchFAQs);

  return (
    <div className="min-h-screen bg-above-gradient-light">
      {/* Hero Section */}
      <div className="grainy-gradient-subtle">
        <div className={`${getPageLayout()} py-16 lg:py-20`}>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-above-rose-100 p-4">
                <BookOpen size={32} className="text-above-rose-700" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              What do the latest insider threat research findings reveal?
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-slate-700">
              Discover critical insights from Ponemon Institute 2025 ($17.4M cost study), Gartner Market Guide G00805757 (48% attack increase), and Verizon DBIR 2024 (68% breaches involve humans). Get evidence-based strategies from analysis of 1,400+ organizations worldwide.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-above-blue-100 px-4 py-2">
                <BarChart3 className="h-4 w-4 text-above-blue-800" />
                <span className="text-slate-700 font-medium">1,400+ Organizations Analyzed</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-above-peach-100 px-4 py-2">
                <FileText className="h-4 w-4 text-above-peach-800" />
                <span className="text-slate-700 font-medium">Ponemon Institute Data</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-above-lavender-100 px-4 py-2">
                <TrendingUp className="h-4 w-4 text-above-lavender-800" />
                <span className="text-slate-700 font-medium">Verizon DBIR Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${getPageLayout()} ${getSectionLayout('lg')}`}>
        {/* Key Statistics */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">What are the most critical insider threat statistics for 2025?</h2>
            <p className="text-lg text-slate-600 mt-2">Key data points from Ponemon Institute, Gartner, and Verizon research</p>
          </div>
          <div className={getGridClass('cards', '1-2-4')}>
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
            <h2 className="text-3xl font-bold text-slate-900">How can organizations use research to improve insider risk management?</h2>
            <p className="text-lg text-slate-600 mt-2">Evidence-based analysis with actionable implementation guidance</p>
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
              {researchArticles.map((article, index) => (
                <ResearchCard 
                  key={article.slug} 
                  article={article} 
                  index={index}
                  featured={false}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 grainy-gradient-cta rounded-2xl p-6 lg:p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">Get Your Organization's Risk Assessment</h3>
          <p className="text-xl mb-6 text-white/90">
            See how your insider risk posture compares to industry benchmarks with our comprehensive assessment.
          </p>
          <Link href="/assessment">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-8 bg-white text-above-rose-700 hover:bg-above-rose-50 shadow-sm">
              Start Free Assessment
            </button>
          </Link>
        </div>
      </div>

      {/* FAQ Schema for AI platforms */}
      <Script
        id="research-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}