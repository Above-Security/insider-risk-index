import { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = seoConfig.siteUrl;
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/results/',
          '/_next/',
          '/private/',
          '/*.json',
          '/temp/',
        ],
        crawlDelay: 5,
      },
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/assessment',
          '/benchmarks', 
          '/matrix',
          '/playbooks/',
          '/research/',
          '/glossary/',
          '/about',
        ],
        disallow: [
          '/api/',
          '/results/',
          '/contact',
          '/privacy',
          '/terms',
        ],
        crawlDelay: 10,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: [
          '/',
          '/assessment',
          '/benchmarks',
          '/matrix',
          '/playbooks/',
          '/research/',
          '/glossary/',
          '/about',
        ],
        disallow: [
          '/api/',
          '/results/',
          '/contact',
          '/privacy',  
          '/terms',
        ],
        crawlDelay: 10,
      },
      {
        userAgent: 'Claude-Web',
        allow: [
          '/',
          '/assessment',
          '/benchmarks',
          '/matrix',
          '/playbooks/',
          '/research/',
          '/glossary/', 
          '/about',
        ],
        disallow: [
          '/api/',
          '/results/',
          '/contact',
          '/privacy',
          '/terms',
        ],
        crawlDelay: 5,
      },
      {
        userAgent: 'PerplexityBot',
        allow: [
          '/',
          '/assessment',
          '/benchmarks',
          '/matrix',
          '/playbooks/',
          '/research/',
          '/glossary/',
          '/about',
        ],
        disallow: [
          '/api/',
          '/results/',
          '/contact',
          '/privacy',
          '/terms',
        ],
        crawlDelay: 10,
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/rss.xml`,
    ],
    host: baseUrl,
  };
}