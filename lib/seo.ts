import { Metadata } from "next";

// Base SEO configuration
export const seoConfig = {
  siteName: "Insider Risk Index",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://insiderriskindex.com",
  description: "Measure and improve your organization's insider risk posture with our comprehensive assessment tool. Get actionable insights across 5 critical pillars of insider threat management.",
  keywords: [
    "insider threat",
    "insider risk",
    "security assessment",
    "risk management",
    "cybersecurity",
    "data protection",
    "employee monitoring",
    "security posture",
    "threat detection",
    "compliance",
  ],
  authors: [{ name: "Insider Risk Index Team" }],
  creator: "Insider Risk Index",
  publisher: "Insider Risk Index",
  robots: "index, follow",
  language: "en-US",
  themeColor: "#3B82F6",
  social: {
    twitter: "@InsiderRiskIdx",
    linkedin: "company/insider-risk-index",
  },
  contact: {
    email: "hello@insiderriskindex.com",
  },
};

/**
 * Generate metadata for a page
 */
export function generateMetadata({
  title,
  description,
  path = "",
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  images,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  images?: Array<{
    url: string;
    width: number;
    height: number;
    alt: string;
  }>;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title === seoConfig.siteName ? title : `${title} | ${seoConfig.siteName}`;
  const fullDescription = description || seoConfig.description;
  const url = `${seoConfig.siteUrl}${path}`;
  
  // Default OG image
  const defaultImages = [
    {
      url: `${seoConfig.siteUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: seoConfig.siteName,
    },
  ];

  const ogImages = images || defaultImages;
  const allKeywords = [...seoConfig.keywords, ...keywords];

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    authors: authors ? authors.map(name => ({ name })) : seoConfig.authors,
    creator: seoConfig.creator,
    publisher: seoConfig.publisher,
    robots: noIndex ? "noindex, nofollow" : seoConfig.robots,
    metadataBase: new URL(seoConfig.siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      title: fullTitle,
      description: fullDescription,
      url,
      siteName: seoConfig.siteName,
      images: ogImages,
      locale: seoConfig.language,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      creator: seoConfig.social.twitter,
      images: ogImages.map(img => img.url),
    },
    other: {
      "theme-color": seoConfig.themeColor,
    },
  };
}

/**
 * Generate JSON-LD structured data
 */
export function generateJsonLd(data: Record<string, any>) {
  return {
    "@context": "https://schema.org",
    ...data,
  };
}

/**
 * Organization JSON-LD
 */
export function getOrganizationJsonLd() {
  return generateJsonLd({
    "@type": "Organization",
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/logo.png`,
    description: seoConfig.description,
    foundingDate: "2024",
    sameAs: [
      `https://twitter.com/${seoConfig.social.twitter.replace("@", "")}`,
      `https://linkedin.com/${seoConfig.social.linkedin}`,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: seoConfig.contact.email,
      contactType: "customer support",
    },
  });
}

/**
 * Website JSON-LD
 */
export function getWebsiteJsonLd() {
  return generateJsonLd({
    "@type": "WebSite",
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${seoConfig.siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });
}

/**
 * Assessment tool JSON-LD
 */
export function getAssessmentJsonLd() {
  return generateJsonLd({
    "@type": "WebApplication",
    name: "Insider Risk Index Assessment",
    url: `${seoConfig.siteUrl}/assessment`,
    description: "Comprehensive insider threat risk assessment tool",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Risk Assessment",
      "Benchmark Comparison",
      "Detailed Reporting",
      "PDF Generation",
      "Industry Analysis",
    ],
  });
}

/**
 * Article JSON-LD for blog posts and research
 */
export function getArticleJsonLd({
  title,
  description,
  url,
  publishedDate,
  modifiedDate,
  authors = [],
  imageUrl,
}: {
  title: string;
  description: string;
  url: string;
  publishedDate: string;
  modifiedDate?: string;
  authors?: string[];
  imageUrl?: string;
}) {
  return generateJsonLd({
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished: publishedDate,
    ...(modifiedDate && { dateModified: modifiedDate }),
    author: authors.map(name => ({
      "@type": "Person",
      name,
    })),
    publisher: {
      "@type": "Organization",
      name: seoConfig.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${seoConfig.siteUrl}/logo.png`,
      },
    },
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
      },
    }),
  });
}

/**
 * FAQ JSON-LD
 */
export function getFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return generateJsonLd({
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });
}

/**
 * Breadcrumb JSON-LD
 */
export function getBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return generateJsonLd({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

/**
 * Product JSON-LD for tools/services
 */
export function getProductJsonLd({
  name,
  description,
  url,
  imageUrl,
  price = "0",
  currency = "USD",
}: {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  price?: string;
  currency?: string;
}) {
  return generateJsonLd({
    "@type": "Product",
    name,
    description,
    url,
    ...(imageUrl && {
      image: imageUrl,
    }),
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    },
    brand: {
      "@type": "Brand",
      name: seoConfig.siteName,
    },
  });
}

/**
 * Generate robots meta tag
 */
export function getRobotsMeta(noIndex = false, noFollow = false) {
  const directives = [];
  
  if (noIndex) directives.push("noindex");
  else directives.push("index");
  
  if (noFollow) directives.push("nofollow");
  else directives.push("follow");
  
  return directives.join(", ");
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string) {
  return `${seoConfig.siteUrl}${path}`;
}

/**
 * Generate OG image URL for dynamic content
 */
export function getOgImageUrl({
  title,
  description,
  pillar,
  score,
}: {
  title: string;
  description?: string;
  pillar?: string;
  score?: number;
}) {
  const params = new URLSearchParams({
    title,
    ...(description && { description }),
    ...(pillar && { pillar }),
    ...(score !== undefined && { score: score.toString() }),
  });
  
  return `${seoConfig.siteUrl}/api/og?${params.toString()}`;
}

/**
 * Matrix technique JSON-LD for threat intelligence data
 */
export function getMatrixTechniqueJsonLd({
  id,
  title,
  description,
  category,
  preventions,
  detections,
  contributors,
}: {
  id: string;
  title: string;
  description: string;
  category: string;
  preventions: string[];
  detections: string[];
  contributors: Array<{ name: string; affiliation?: string }>;
}) {
  return generateJsonLd({
    "@type": "TechArticle",
    name: title,
    headline: title,
    description,
    url: `${seoConfig.siteUrl}/matrix/technique/${id}`,
    identifier: id,
    keywords: [category, "insider threat", "cybersecurity", "threat intelligence"],
    author: contributors.map(contributor => ({
      "@type": "Person",
      name: contributor.name,
      ...(contributor.affiliation && { affiliation: contributor.affiliation }),
    })),
    publisher: {
      "@type": "Organization",
      name: "ForScie Community",
      url: "https://forscie.org/",
    },
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "Insider Threat Matrix",
      url: "https://insiderthreatmatrix.org/",
    },
    about: [
      {
        "@type": "Thing",
        name: "Insider Threat",
        description: "Security threats that come from people within the organization",
      },
      {
        "@type": "Thing",
        name: "Cybersecurity",
        description: "Practice of protecting systems, networks, and programs from digital attacks",
      },
    ],
    teaches: [
      ...preventions.map(prevention => ({
        "@type": "Thing",
        name: `Prevention: ${prevention}`,
      })),
      ...detections.map(detection => ({
        "@type": "Thing",
        name: `Detection: ${detection}`,
      })),
    ],
  });
}

/**
 * Glossary term JSON-LD for terminology and definitions
 */
export function getGlossaryTermJsonLd({
  term,
  definition,
  category,
  difficulty,
  pillarRelevance,
  slug,
}: {
  term: string;
  definition: string;
  category: string;
  difficulty: string;
  pillarRelevance: string[];
  slug: string;
}) {
  return generateJsonLd({
    "@type": "DefinedTerm",
    name: term,
    description: definition,
    url: `${seoConfig.siteUrl}/glossary/${slug}`,
    identifier: slug,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Insider Risk Management Glossary",
      description: "Comprehensive glossary of terms related to insider risk management and cybersecurity",
      url: `${seoConfig.siteUrl}/glossary`,
    },
    about: pillarRelevance.map(pillar => ({
      "@type": "Thing",
      name: `${pillar} Security Pillar`,
      description: `Security pillar focused on ${pillar} aspects of insider risk management`,
    })),
    additionalType: category,
    educationalLevel: difficulty,
    keywords: [term, category, difficulty, ...pillarRelevance, "cybersecurity", "insider risk"],
  });
}

/**
 * Playbook JSON-LD for implementation guides
 */
export function getPlaybookJsonLd({
  title,
  description,
  pillar,
  difficulty,
  estimatedTime,
  tags,
  prerequisites,
  outcomes,
  slug,
  lastUpdated,
  version,
}: {
  title: string;
  description: string;
  pillar: string;
  difficulty: string;
  estimatedTime: string;
  tags: string[];
  prerequisites: string[];
  outcomes: string[];
  slug: string;
  lastUpdated: string;
  version: string;
}) {
  return generateJsonLd({
    "@type": "HowTo",
    name: title,
    description,
    url: `${seoConfig.siteUrl}/playbooks/${slug}`,
    dateModified: lastUpdated,
    datePublished: lastUpdated,
    version,
    keywords: tags.join(", "),
    educationalLevel: difficulty,
    timeRequired: estimatedTime,
    about: {
      "@type": "Thing",
      name: `${pillar} Security Implementation`,
      description: `Implementation guide for ${pillar} pillar of insider risk management`,
    },
    audience: {
      "@type": "Audience",
      audienceType: "Security Professionals",
    },
    publisher: {
      "@type": "Organization",
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
    },
    teaches: outcomes.map(outcome => ({
      "@type": "Thing",
      name: outcome,
    })),
    supply: prerequisites.map(prereq => ({
      "@type": "HowToSupply",
      name: prereq,
    })),
    totalTime: estimatedTime,
    difficulty: difficulty,
  });
}

/**
 * Dataset JSON-LD for benchmark and research data
 */
export function getBenchmarkDatasetJsonLd() {
  return generateJsonLd({
    "@type": "Dataset",
    name: "Industry Insider Risk Benchmarks",
    description: "Comprehensive dataset of insider risk benchmarks across industries, based on Ponemon Institute 2025 research and Verizon DBIR 2024 data.",
    url: `${seoConfig.siteUrl}/benchmarks`,
    creator: {
      "@type": "Organization",
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
    },
    dateModified: "2025-01-15",
    datePublished: "2025-01-15",
    keywords: "insider risk, cybersecurity benchmarks, industry data, security metrics, risk assessment",
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    distribution: {
      "@type": "DataDownload",
      contentUrl: `${seoConfig.siteUrl}/benchmarks`,
      encodingFormat: "application/json",
    },
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Insider Risk Index",
        description: "Composite risk score from 0-100",
        minValue: 0,
        maxValue: 100,
      },
      {
        "@type": "PropertyValue",
        name: "Industry Average Cost",
        description: "Average annual cost of insider threats by industry",
        unitCode: "USD",
      },
      {
        "@type": "PropertyValue",
        name: "Incident Frequency",
        description: "Average number of incidents per organization per year",
        unitCode: "incidents per year",
      },
    ],
    citation: [
      "Ponemon Institute. (2025). Cost of Insider Threats Global Report.",
      "Verizon. (2024). Data Breach Investigations Report.",
    ],
  });
}

/**
 * Research article JSON-LD for blog posts and insights
 */
export function getResearchArticleJsonLd({
  title,
  description,
  slug,
  publishDate,
  lastModified,
  tags,
  author,
}: {
  title: string;
  description: string;
  slug: string;
  publishDate: string;
  lastModified: string;
  tags: string[];
  author?: string;
}) {
  return generateJsonLd({
    "@type": "ScholarlyArticle",
    headline: title,
    description,
    url: `${seoConfig.siteUrl}/research/${slug}`,
    datePublished: publishDate,
    dateModified: lastModified,
    author: {
      "@type": "Organization",
      name: author || seoConfig.siteName,
    },
    publisher: {
      "@type": "Organization",
      name: seoConfig.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${seoConfig.siteUrl}/logo.png`,
      },
    },
    articleSection: "Cybersecurity Research",
    keywords: tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${seoConfig.siteUrl}/research/${slug}`,
    },
    about: {
      "@type": "Thing",
      name: "Insider Risk Management",
      description: "Research and insights into insider threat prevention and mitigation strategies",
    },
    genre: "cybersecurity research",
    inLanguage: "en-US",
  });
}

/**
 * Assessment result JSON-LD for structured data about risk assessments
 */
export function getAssessmentResultJsonLd({
  id,
  score,
  level,
  industry,
  companySize,
  pillars,
  createdAt,
}: {
  id: string;
  score: number;
  level: number;
  industry?: string;
  companySize?: string;
  pillars: Array<{ pillarId: string; score: number }>;
  createdAt: Date;
}) {
  return generateJsonLd({
    "@type": "Dataset",
    name: "Insider Risk Assessment Results",
    description: "Organizational insider threat management maturity assessment results",
    url: `${seoConfig.siteUrl}/results/${id}`,
    identifier: id,
    dateCreated: createdAt.toISOString(),
    creator: {
      "@type": "Organization",
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
    },
    about: {
      "@type": "Thing",
      name: "Insider Risk Management",
      description: "Assessment of organizational capability to manage insider threats",
    },
    measurementTechnique: "5-Pillar Insider Risk Framework",
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Overall Risk Score",
        value: score,
        minValue: 0,
        maxValue: 100,
        unitText: "points",
      },
      {
        "@type": "PropertyValue",
        name: "Maturity Level",
        value: level,
        minValue: 1,
        maxValue: 5,
      },
      ...(industry && [{
        "@type": "PropertyValue",
        name: "Industry",
        value: industry,
      }]),
      ...(companySize && [{
        "@type": "PropertyValue",
        name: "Company Size",
        value: companySize,
      }]),
    ],
    distribution: pillars.map(pillar => ({
      "@type": "DataDownload",
      name: `${pillar.pillarId} Score`,
      contentSize: pillar.score.toString(),
      encodingFormat: "application/json",
    })),
    keywords: ["insider threat", "risk assessment", "security maturity", "cybersecurity"],
  });
}

/**
 * Common page-specific metadata generators
 */
export const pageMetadata = {
  home: () => generateMetadata({
    title: seoConfig.siteName,
    description: seoConfig.description,
  }),

  assessment: () => generateMetadata({
    title: "Take the Assessment",
    description: "Evaluate your organization's insider risk posture with our comprehensive 20-question assessment. Get personalized recommendations and benchmark your security controls.",
    path: "/assessment",
    keywords: ["insider threat assessment", "security evaluation", "risk assessment tool"],
  }),

  results: (score: number, level: number) => generateMetadata({
    title: `Assessment Results - Level ${level}`,
    description: `Your Insider Risk Index score is ${score}/100. View detailed analysis, benchmarks, and recommendations to improve your security posture.`,
    path: "/assessment/results",
    keywords: ["assessment results", "security score", "insider risk level"],
    noIndex: true, // Results are private
  }),

  benchmarks: () => generateMetadata({
    title: "Industry Benchmarks",
    description: "Compare your insider risk posture against industry peers. View comprehensive benchmarking data across different sectors and company sizes.",
    path: "/benchmarks",
    keywords: ["industry benchmarks", "security benchmarking", "peer comparison"],
  }),

  playbooks: () => generateMetadata({
    title: "Security Playbooks",
    description: "Access expert-curated playbooks and best practices for insider threat management. Step-by-step guides for improving your security posture.",
    path: "/playbooks",
    keywords: ["security playbooks", "best practices", "implementation guides"],
  }),

  research: () => generateMetadata({
    title: "Research & Insights",
    description: "Latest research, whitepapers, and insights on insider threat trends, technologies, and best practices from security experts.",
    path: "/research",
    keywords: ["insider threat research", "security insights", "cybersecurity trends"],
  }),

  about: () => generateMetadata({
    title: "About",
    description: "Learn about the Insider Risk Index methodology, our team, and mission to help organizations better understand and manage insider threats.",
    path: "/about",
    keywords: ["about us", "methodology", "insider threat experts"],
  }),

  contact: () => generateMetadata({
    title: "Contact Us",
    description: "Get in touch with our team for questions about the assessment, partnership opportunities, or custom security consulting services.",
    path: "/contact",
    keywords: ["contact", "support", "partnership", "consulting"],
  }),

  privacy: () => generateMetadata({
    title: "Privacy Policy",
    description: "Our commitment to protecting your privacy and data. Learn how we collect, use, and protect your information.",
    path: "/privacy",
    noIndex: true,
  }),

  terms: () => generateMetadata({
    title: "Terms of Service",
    description: "Terms and conditions for using the Insider Risk Index assessment and related services.",
    path: "/terms",
    noIndex: true,
  }),

  playbook: (frontmatter: any, slug: string) => generateMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    path: `/playbooks/${slug}`,
    keywords: frontmatter.tags || [],
    publishedTime: frontmatter.lastUpdated,
    authors: [frontmatter.author],
  }),

  notFound: () => generateMetadata({
    title: "Page Not Found",
    description: "The requested page could not be found.",
    noIndex: true,
  }),
};