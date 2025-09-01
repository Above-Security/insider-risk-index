import { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo';
import { getAllContent } from '@/lib/mdx';
import { PrismaClient } from '@prisma/client';

interface ContentFrontmatter {
  title: string;
  description?: string;
  publishedAt?: string;
  publishDate?: string;
  updatedAt?: string;
  lastUpdated?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = new URL(seoConfig.siteUrl.trim());
  const prisma = new PrismaClient();
  
  try {
    // Get dynamic content
    const research = getAllContent('research');
    const playbooks = getAllContent('playbooks');
    
    // Get glossary terms
    let glossaryTerms: Array<{ slug: string; updatedAt: Date }> = [];
    try {
      glossaryTerms = await prisma.glossaryTerm.findMany({
        where: { published: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.warn('Could not fetch glossary terms for sitemap:', error);
    }
    
    // Static routes with proper priorities and change frequencies
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl.toString(),
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: new URL('/assessment', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: new URL('/benchmarks', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: new URL('/matrix', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: new URL('/playbooks', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: new URL('/research', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: new URL('/glossary', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: new URL('/about', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: new URL('/contact', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.4,
      },
    ];
    
    // Dynamic research routes
    const researchRoutes: MetadataRoute.Sitemap = research.map((item) => ({
      url: new URL(`/research/${item.slug}`, baseUrl).toString(),
      lastModified: new Date(
        (item.frontmatter as ContentFrontmatter).publishedAt || 
        (item.frontmatter as ContentFrontmatter).publishDate || 
        Date.now()
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    
    // Dynamic playbook routes
    const playbookRoutes: MetadataRoute.Sitemap = playbooks.map((item) => ({
      url: new URL(`/playbooks/${item.slug}`, baseUrl).toString(),
      lastModified: new Date(
        (item.frontmatter as ContentFrontmatter).updatedAt || 
        (item.frontmatter as ContentFrontmatter).lastUpdated || 
        Date.now()
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    
    // Dynamic glossary routes
    const glossaryRoutes: MetadataRoute.Sitemap = glossaryTerms.map((term) => ({
      url: new URL(`/glossary/${term.slug}`, baseUrl).toString(),
      lastModified: term.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
    
    return [...staticRoutes, ...researchRoutes, ...playbookRoutes, ...glossaryRoutes];
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to static routes only
    return [
      {
        url: baseUrl.toString(),
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: new URL('/assessment', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: new URL('/benchmarks', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: new URL('/matrix', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: new URL('/about', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: new URL('/contact', baseUrl).toString(),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.4,
      },
    ];
  }
}