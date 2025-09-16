'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AboveButton } from "@/components/ui/above-components";
import { 
  Users, 
  AlertTriangle, 
  BarChart3, 
  ExternalLink, 
  ArrowRight,
  Shield,
  Eye,
  Brain,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

interface ResearchArticle {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    publishedAt?: string;
    publishDate?: string;
    author?: string;
    category?: string;
    tags?: string[];
    readingTime?: string;
    readTime?: string;
  };
}

interface FeaturedResearchProps {
  articles: ResearchArticle[];
}

// Icon mapping for different article themes
const getArticleIcon = (title: string, index: number) => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('employee') || titleLower.includes('insider is')) {
    return Users;
  }
  if (titleLower.includes('ai') || titleLower.includes('artificial')) {
    return Brain;
  }
  if (titleLower.includes('shadow')) {
    return AlertTriangle;
  }
  if (titleLower.includes('threat') && index === 0) {
    return Shield;
  }
  if (titleLower.includes('detection') || titleLower.includes('visibility')) {
    return Eye;
  }
  if (titleLower.includes('trend') || titleLower.includes('intelligence')) {
    return TrendingUp;
  }
  
  // Default icons by position
  const defaultIcons = [Shield, AlertTriangle, BarChart3];
  return defaultIcons[index % defaultIcons.length];
};

// Style configurations for each article position
const getArticleStyles = (index: number) => {
  const styles = [
    {
      card: "bg-white/90 border-above-rose-200 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-above-rose-100",
      iconColor: "text-above-rose-600",
      badgeBg: "bg-above-rose-50",
      badgeText: "text-above-rose-700",
      badgeBorder: "border-above-rose-200",
      gradient: "from-above-rose-100 to-above-peach-100",
      hoverColor: "hover:text-above-rose-700"
    },
    {
      card: "bg-white/80 border-above-blue-200 shadow-lg hover:shadow-xl transition-all duration-300",
      iconColor: "text-above-blue-600",
      badgeBg: "bg-above-blue-50",
      badgeText: "text-above-blue-700",
      badgeBorder: "border-above-blue-200",
      gradient: "from-above-blue-100 to-above-lavender-100",
      hoverColor: "hover:text-above-blue-700"
    },
    {
      card: "bg-white/60 border-above-peach-200 shadow-md hover:shadow-lg transition-all duration-300",
      iconColor: "text-above-peach-600",
      badgeBg: "bg-above-peach-50",
      badgeText: "text-above-peach-700",
      badgeBorder: "border-above-peach-200",
      gradient: "from-above-peach-100 to-above-rose-100",
      hoverColor: "hover:text-above-peach-700"
    }
  ];
  
  return styles[Math.min(index, styles.length - 1)];
};

export function FeaturedResearch({ articles }: FeaturedResearchProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No research articles available at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {articles.map((article, index) => {
        const isFeatured = (article.frontmatter as any).featured || false;
        const isNewest = index === 0 && !isFeatured; // Only show "Latest" if not featured
        const style = getArticleStyles(index);
        const IconComponent = getArticleIcon(article.frontmatter.title, index);
        
        // Parse dates safely
        const publishDate = article.frontmatter.publishedAt || article.frontmatter.publishDate;
        const formattedDate = publishDate 
          ? new Date(publishDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })
          : 'Recently published';
        
        const readTime = article.frontmatter.readingTime || article.frontmatter.readTime || '15';
        
        return (
          <Card key={article.slug} className={style.card}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className={`h-5 w-5 ${style.iconColor}`} />
                    {isFeatured && (
                      <Badge
                        variant="outline"
                        className={`${style.badgeBg} ${style.badgeText} ${style.badgeBorder} font-semibold`}
                      >
                        ⭐ Featured
                      </Badge>
                    )}
                    {isNewest && !isFeatured && (
                      <Badge
                        variant="outline"
                        className={`${style.badgeBg} ${style.badgeText} ${style.badgeBorder} font-semibold`}
                      >
                        🆕 Latest Research
                      </Badge>
                    )}
                    {!isNewest && !isFeatured && article.frontmatter.category && (
                      <Badge 
                        variant="outline" 
                        className={`${style.badgeBg} ${style.badgeText} ${style.badgeBorder}`}
                      >
                        {article.frontmatter.category}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-slate-600">
                      {readTime} min read
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 leading-tight">
                    <Link 
                      href={`/research/${article.slug}`}
                      className={`${style.hoverColor} transition-colors`}
                    >
                      {article.frontmatter.title}
                    </Link>
                  </CardTitle>
                  <p className="mt-3 text-slate-700 leading-relaxed">
                    {article.frontmatter.description}
                  </p>
                </div>
                <div className="ml-6 flex-shrink-0 hidden sm:block">
                  <div className={`w-20 h-20 bg-gradient-to-br ${style.gradient} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`h-10 w-10 ${style.badgeText}`} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Tags if available */}
              {article.frontmatter.tags && article.frontmatter.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {article.frontmatter.tags.slice(0, 4).map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {article.frontmatter.tags.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{article.frontmatter.tags.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {/* Footer with date and CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <time dateTime={publishDate}>Published {formattedDate}</time>
                  {article.frontmatter.author && (
                    <>
                      <span aria-hidden="true">•</span>
                      <span>{article.frontmatter.author}</span>
                    </>
                  )}
                </div>
                <AboveButton
                  variant={(isFeatured || isNewest) ? "outline" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link href={`/research/${article.slug}`}>
                    Read {isFeatured ? 'Featured Report' : (isNewest ? 'Latest Report' : 'Report')}
                    {(isFeatured || isNewest) ? (
                      <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    )}
                  </Link>
                </AboveButton>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}