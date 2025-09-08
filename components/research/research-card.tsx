import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AboveButton, AboveBadge } from "@/components/ui/above-components";
import { Calendar, Clock, User } from "lucide-react";
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
    dataSources?: string[];
  };
}

interface ResearchCardProps {
  article: ResearchArticle;
  index: number;
  featured?: boolean;
}

// Color schemes for visual variety
const getCardColorScheme = (index: number) => {
  const schemes = [
    { bg: 'bg-above-rose-50', border: 'border-above-rose-200', accent: 'border-l-above-rose-700', hover: 'hover:text-above-rose-700' },
    { bg: 'bg-above-blue-50', border: 'border-above-blue-200', accent: 'border-l-above-blue-700', hover: 'hover:text-above-blue-700' },
    { bg: 'bg-above-peach-50', border: 'border-above-peach-200', accent: 'border-l-above-peach-700', hover: 'hover:text-above-peach-700' },
    { bg: 'bg-above-lavender-50', border: 'border-above-lavender-200', accent: 'border-l-above-lavender-700', hover: 'hover:text-above-lavender-700' },
  ];
  return schemes[index % schemes.length];
};

export function ResearchCard({ article, index, featured = false }: ResearchCardProps) {
  const colorScheme = getCardColorScheme(index);
  const isLatest = index === 0;
  
  // Parse date safely
  const publishDate = article.frontmatter.publishedAt || article.frontmatter.publishDate;
  const formattedDate = publishDate 
    ? new Date(publishDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long',
        day: featured ? 'numeric' : undefined
      })
    : 'Recently published';
  
  const readTime = article.frontmatter.readingTime || article.frontmatter.readTime || '15';
  
  return (
    <Card 
      className={`
        group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 
        ${colorScheme.bg} ${colorScheme.border} border-l-4 ${colorScheme.accent}
        ${isLatest && !featured ? 'lg:col-span-2' : ''}
      `}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {article.frontmatter.category && (
                <AboveBadge variant="secondary">
                  {article.frontmatter.category}
                </AboveBadge>
              )}
              {isLatest && <AboveBadge variant="default">Latest</AboveBadge>}
            </div>
            <CardTitle className={`text-xl group-hover:text-above-rose-700 transition-colors line-clamp-2`}>
              {article.frontmatter.title}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-base leading-relaxed">
          {article.frontmatter.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={publishDate}>{formattedDate}</time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>{readTime} min read</span>
            </div>
            {article.frontmatter.author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" aria-hidden="true" />
                <span>{article.frontmatter.author}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Data Sources */}
        {article.frontmatter.dataSources && article.frontmatter.dataSources.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Data Sources:</p>
            <div className="flex flex-wrap gap-1">
              {article.frontmatter.dataSources.map((source, i) => (
                <AboveBadge key={i} variant="outline" className="text-xs">
                  {source}
                </AboveBadge>
              ))}
            </div>
          </div>
        )}
        
        {/* Tags */}
        {article.frontmatter.tags && article.frontmatter.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {article.frontmatter.tags.slice(0, 5).map((tag, i) => (
                <AboveBadge key={i} variant="secondary" className="text-xs">
                  {tag}
                </AboveBadge>
              ))}
              {article.frontmatter.tags.length > 5 && (
                <AboveBadge variant="secondary" className="text-xs">
                  +{article.frontmatter.tags.length - 5} more
                </AboveBadge>
              )}
            </div>
          </div>
        )}
        
        {/* CTA Button */}
        <Link href={`/research/${article.slug}`}>
          <AboveButton className="w-full" variant="default">
            Read Full Report
          </AboveButton>
        </Link>
      </CardContent>
    </Card>
  );
}