import { Metadata } from 'next';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function generateFAQJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

export function generateHowToJsonLd({
  name,
  description,
  totalTime,
  steps,
  image
}: {
  name: string;
  description: string;
  totalTime: string;
  steps: { name: string; text: string; url?: string }[];
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "totalTime": totalTime,
    "image": image,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": step.url
    }))
  };
}

export function generateArticleJsonLd({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url
}: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified: string;
  image?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "image": image,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "Insider Risk Index",
      "logo": {
        "@type": "ImageObject",
        "url": "https://insiderriskindex.com/logo.png"
      }
    }
  };
}

export function generateVideoJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  embedUrl
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  embedUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "duration": duration,
    "embedUrl": embedUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Insider Risk Index",
      "logo": {
        "@type": "ImageObject",
        "url": "https://insiderriskindex.com/logo.png"
      }
    }
  };
}

export function generateCourseJsonLd({
  name,
  description,
  provider,
  courseMode,
  duration,
  topics
}: {
  name: string;
  description: string;
  provider: string;
  courseMode: string;
  duration: string;
  topics: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": provider
    },
    "courseMode": courseMode,
    "timeRequired": duration,
    "educationalLevel": "Professional",
    "about": topics.map(topic => ({
      "@type": "Thing",
      "name": topic
    }))
  };
}

export function generateLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Insider Risk Index",
    "description": "Comprehensive insider risk assessment and management platform",
    "url": "https://insiderriskindex.com",
    "logo": "https://insiderriskindex.com/logo.png",
    "sameAs": [
      "https://twitter.com/insiderriskindex",
      "https://linkedin.com/company/insider-risk-index",
      "https://github.com/above-security/insider-risk-index"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@insiderriskindex.com",
      "url": "https://insiderriskindex.com/contact"
    }
  };
}

export function generateRatingJsonLd({
  ratingValue,
  ratingCount,
  bestRating = 5,
  worstRating = 1
}: {
  ratingValue: number;
  ratingCount: number;
  bestRating?: number;
  worstRating?: number;
}) {
  return {
    "@type": "AggregateRating",
    "ratingValue": ratingValue,
    "ratingCount": ratingCount,
    "bestRating": bestRating,
    "worstRating": worstRating
  };
}

// Meta tag generators for better SEO
export function generateMetaTags({
  title,
  description,
  keywords,
  author = "Insider Risk Index",
  robots = "index, follow",
  canonical,
  ogImage = "/og-image.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  jsonLd
}: {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  robots?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  jsonLd?: any;
}): Metadata {
  const url = canonical || "https://insiderriskindex.com";
  
  return {
    title,
    description,
    keywords: keywords?.join(", "),
    authors: [{ name: author }],
    robots,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Insider Risk Index",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: ogType as any,
    },
    twitter: {
      card: twitterCard as any,
      title,
      description,
      images: [ogImage],
      creator: "@insiderriskindex",
    },
    other: jsonLd ? {
      "script:ld+json": JSON.stringify(jsonLd)
    } : {},
  };
}

// Sitemap priority calculator
export function calculateSitemapPriority(path: string): number {
  if (path === '/') return 1.0;
  if (path === '/assessment') return 0.9;
  if (path.startsWith('/results/')) return 0.3;
  if (path === '/benchmarks') return 0.8;
  if (path === '/glossary') return 0.7;
  if (path.startsWith('/glossary/')) return 0.6;
  if (path === '/playbooks') return 0.7;
  if (path.startsWith('/playbooks/')) return 0.6;
  if (path === '/matrix') return 0.7;
  if (path.startsWith('/matrix/')) return 0.6;
  if (path === '/about') return 0.5;
  if (path === '/contact') return 0.5;
  return 0.4;
}

// Change frequency calculator
export function calculateChangeFrequency(path: string): string {
  if (path === '/') return 'weekly';
  if (path === '/assessment') return 'monthly';
  if (path.startsWith('/results/')) return 'never';
  if (path === '/benchmarks') return 'weekly';
  if (path === '/glossary' || path.startsWith('/glossary/')) return 'monthly';
  if (path === '/playbooks' || path.startsWith('/playbooks/')) return 'monthly';
  if (path === '/matrix' || path.startsWith('/matrix/')) return 'weekly';
  if (path === '/about' || path === '/contact') return 'yearly';
  return 'monthly';
}