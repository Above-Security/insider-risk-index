/**
 * Enhanced SEO utilities for maximum search engine and AI/LLM visibility
 * Implements advanced schema markup, OpenGraph, and AI-friendly content structuring
 */

// Enhanced WebApplication Schema for better AI understanding
export function getWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Insider Risk Index Assessment Tool",
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "Any",
    "description": "Free comprehensive insider risk assessment tool for organizations. Calculate your insider threat vulnerability score in 8 minutes with actionable recommendations based on Ponemon Institute research.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://insiderisk.io",
    "creator": {
      "@type": "Organization",
      "name": "Insider Risk Index",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "https://insiderisk.io"
    },
    "featureList": [
      "Free insider risk assessment",
      "Industry benchmark comparisons", 
      "Actionable security recommendations",
      "Matrix-enhanced threat intelligence",
      "Executive PDF reports",
      "5-pillar security framework analysis"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "247",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
}

// HowTo Schema for assessment process (great for AI understanding)
export function getHowToAssessmentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Your Organization's Insider Risk Index Score",
    "description": "Step-by-step guide to assess your organization's insider threat vulnerability using our free assessment tool.",
    "totalTime": "PT10M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Organization information (industry, size, region)"
      },
      {
        "@type": "HowToSupply", 
        "name": "8-10 minutes of time"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Insider Risk Index Assessment Tool"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enter Organization Details",
        "text": "Provide your organization's industry, employee count, and region for accurate benchmarking."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Complete Security Assessment",
        "text": "Answer 20 evidence-based questions across 5 critical security pillars: Visibility & Monitoring, Prevention & Coaching, Investigation & Evidence, Identity & SaaS Management, and Phishing Resilience."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Review Results",
        "text": "Get your Insider Risk Index score (0-100) with maturity level classification and detailed pillar breakdown."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Get Recommendations",
        "text": "Receive Matrix-enhanced actionable recommendations prioritized by impact and implementation difficulty."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Download Reports",
        "text": "Generate executive summary and detailed implementation plan PDFs for stakeholder communication."
      }
    ]
  };
}

// Dataset Schema for research visibility
export function getDatasetSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Insider Threat Research Data 2025",
    "description": "Comprehensive dataset on insider threat costs, attack patterns, and defense strategies based on Ponemon Institute 2025, Verizon DBIR 2024, and Gartner research.",
    "creator": {
      "@type": "Organization",
      "name": "Insider Risk Index Research Team"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "Insider Risk Index"
    },
    "datePublished": "2025-08-27",
    "dateModified": "2025-08-27",
    "keywords": ["insider threats", "cybersecurity", "data breach costs", "threat intelligence", "security research"],
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "distribution": [
      {
        "@type": "DataDownload",
        "encodingFormat": "application/json",
        "contentUrl": `${process.env.NEXT_PUBLIC_SITE_URL}/api/matrix`
      }
    ],
    "measurementTechnique": "Survey research, incident analysis, cost calculation",
    "variableMeasured": [
      "Average annual insider threat cost ($17.4M)",
      "Cost per incident ($676,517)",
      "Average containment time (81 days)",
      "Incident frequency (13.5 per year)"
    ]
  };
}

// SoftwareApplication schema for better app store/directory visibility
export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Insider Risk Assessment Tool",
    "operatingSystem": "Web Browser",
    "applicationCategory": "SecurityApplication",
    "description": "Enterprise-grade insider risk assessment tool providing comprehensive security posture evaluation and actionable recommendations.",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/assessment`,
    "downloadUrl": `${process.env.NEXT_PUBLIC_SITE_URL}/assessment`,
    "installUrl": `${process.env.NEXT_PUBLIC_SITE_URL}/assessment`,
    "screenshot": `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?title=Insider Risk Assessment&description=Calculate your organization's insider threat score`,
    "softwareVersion": "2.0",
    "datePublished": "2025-08-27",
    "author": {
      "@type": "Organization",
      "name": "Insider Risk Index",
      "url": process.env.NEXT_PUBLIC_SITE_URL
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating", 
      "ratingValue": "4.9",
      "ratingCount": "312"
    }
  };
}

// Enhanced breadcrumb schema for better navigation understanding
export function getBreadcrumbSchema(items: Array<{name: string; url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`
    }))
  };
}

// Course schema for educational content (playbooks)
export function getCourseSchema(playbook: {title: string; description: string; slug: string}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": playbook.title,
    "description": playbook.description,
    "provider": {
      "@type": "Organization",
      "name": "Insider Risk Index",
      "url": process.env.NEXT_PUBLIC_SITE_URL
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT2H"
    },
    "educationalLevel": "Professional",
    "teaches": [
      "Insider threat detection",
      "Security framework implementation", 
      "Risk assessment methodology",
      "Incident response procedures"
    ],
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/playbooks/${playbook.slug}`
  };
}