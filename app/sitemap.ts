import { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo';
import { getAllContent } from '@/lib/mdx';

interface ContentFrontmatter {
  title: string;
  description?: string;
  publishedAt?: string;
  publishDate?: string;
  updatedAt?: string;
  lastUpdated?: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = seoConfig.siteUrl.trim();
  
  try {
    // Get dynamic content
    const research = getAllContent('research');
    const playbooks = getAllContent('playbooks');
    
    // Static routes with proper priorities and change frequencies
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/assessment`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/benchmarks`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/matrix`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/playbooks`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/research`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/glossary`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.4,
      },
    ];
    
    // Dynamic research routes
    const researchRoutes: MetadataRoute.Sitemap = research.map((item) => ({
      url: `${baseUrl}/research/${item.slug}`,
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
      url: `${baseUrl}/playbooks/${item.slug}`,
      lastModified: new Date(
        (item.frontmatter as ContentFrontmatter).updatedAt || 
        (item.frontmatter as ContentFrontmatter).lastUpdated || 
        Date.now()
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    
    return [...staticRoutes, ...researchRoutes, ...playbookRoutes];
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to static routes only
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/assessment`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/benchmarks`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/matrix`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.4,
      },
    ];
  }
}