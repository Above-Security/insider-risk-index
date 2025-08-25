import { MetadataRoute } from "next";
import { ContentDB } from "./db";
import { seoConfig } from "./seo";

/**
 * Generate sitemap for Next.js
 */
export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const research = await ContentDB.getResearch({ limit: 1000 });
    const playbooks = await ContentDB.getPlaybooks({ limit: 1000 });

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: seoConfig.siteUrl,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${seoConfig.siteUrl}/assessment`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${seoConfig.siteUrl}/benchmarks`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${seoConfig.siteUrl}/playbooks`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${seoConfig.siteUrl}/research`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${seoConfig.siteUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: `${seoConfig.siteUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${seoConfig.siteUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
      },
      {
        url: `${seoConfig.siteUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
      },
    ];

    const researchRoutes: MetadataRoute.Sitemap = research.map(article => ({
      url: `${seoConfig.siteUrl}/research/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const playbookRoutes: MetadataRoute.Sitemap = playbooks.map(playbook => ({
      url: `${seoConfig.siteUrl}/playbooks/${playbook.slug}`,
      lastModified: playbook.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...researchRoutes, ...playbookRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    // Return minimal sitemap on error
    return [
      {
        url: seoConfig.siteUrl,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      },
    ];
  }
}

/**
 * Generate robots.txt for Next.js
 */
export function generateRobots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";
  
  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/assessment/results/",
          "/_next/",
          "/admin/",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: [
          "/",
          "/research/",
          "/playbooks/",
          "/benchmarks/",
          "/llm.txt",
          "/ai.txt",
        ],
        disallow: [
          "/assessment/",
          "/api/",
          "/_next/",
        ],
      },
      {
        userAgent: "ChatGPT-User",
        allow: [
          "/",
          "/research/",
          "/playbooks/",
          "/benchmarks/",
          "/llm.txt",
          "/ai.txt",
        ],
        disallow: [
          "/assessment/",
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: [
      `${seoConfig.siteUrl}/sitemap.xml`,
      `${seoConfig.siteUrl}/research-sitemap.xml`,
      `${seoConfig.siteUrl}/playbooks-sitemap.xml`,
    ],
    host: seoConfig.siteUrl,
  };
}

/**
 * Generate research-specific sitemap
 */
export async function generateResearchSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const research = await ContentDB.getResearch({ limit: 1000 });

    const routes: MetadataRoute.Sitemap = [
      {
        url: `${seoConfig.siteUrl}/research`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      ...research.map(article => ({
        url: `${seoConfig.siteUrl}/research/${article.slug}`,
        lastModified: article.publishedAt,
        changeFrequency: "monthly" as const,
        priority: article.featured ? 0.9 : 0.7,
      })),
    ];

    return routes;
  } catch (error) {
    console.error("Error generating research sitemap:", error);
    return [
      {
        url: `${seoConfig.siteUrl}/research`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];
  }
}

/**
 * Generate playbooks-specific sitemap
 */
export async function generatePlaybooksSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const playbooks = await ContentDB.getPlaybooks({ limit: 1000 });

    const routes: MetadataRoute.Sitemap = [
      {
        url: `${seoConfig.siteUrl}/playbooks`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      ...playbooks.map(playbook => ({
        url: `${seoConfig.siteUrl}/playbooks/${playbook.slug}`,
        lastModified: playbook.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];

    return routes;
  } catch (error) {
    console.error("Error generating playbooks sitemap:", error);
    return [
      {
        url: `${seoConfig.siteUrl}/playbooks`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];
  }
}

/**
 * Generate manifest.json for PWA
 */
export function generateManifest(): MetadataRoute.Manifest {
  return {
    name: seoConfig.siteName,
    short_name: "IRI",
    description: seoConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: seoConfig.themeColor,
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["security", "business", "productivity"],
    shortcuts: [
      {
        name: "Take Assessment",
        short_name: "Assessment",
        description: "Start the Insider Risk Index assessment",
        url: "/assessment",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "View Benchmarks",
        short_name: "Benchmarks",
        description: "Compare with industry benchmarks",
        url: "/benchmarks",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Browse Playbooks",
        short_name: "Playbooks",
        description: "Access security playbooks",
        url: "/playbooks",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}

/**
 * Utility function to validate sitemap entries
 */
export function validateSitemapEntry(entry: MetadataRoute.Sitemap[0]): boolean {
  try {
    new URL(entry.url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate XML sitemap index for multiple sitemaps
 */
export async function generateSitemapIndex(): Promise<string> {
  const sitemaps = [
    {
      loc: `${seoConfig.siteUrl}/sitemap.xml`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${seoConfig.siteUrl}/research-sitemap.xml`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${seoConfig.siteUrl}/playbooks-sitemap.xml`,
      lastmod: new Date().toISOString(),
    },
  ];

  const sitemapEntries = sitemaps
    .map(
      sitemap => `
  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapEntries}
</sitemapindex>`;
}

/**
 * Generate news sitemap for recent content
 */
export async function generateNewsSitemap(): Promise<string> {
  try {
    const recentContent = await ContentDB.getResearch({ 
      limit: 100,
    });

    // Filter for content from last 2 days for news sitemap
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const newsItems = recentContent
      .filter(item => item.publishedAt >= twoDaysAgo)
      .slice(0, 1000); // Google News limit

    if (newsItems.length === 0) {
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`;
    }

    const newsEntries = newsItems
      .map(
        item => `
  <url>
    <loc>${seoConfig.siteUrl}/research/${item.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${seoConfig.siteName}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${item.publishedAt.toISOString()}</news:publication_date>
      <news:title><![CDATA[${item.title}]]></news:title>
    </news:news>
  </url>`
      )
      .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${newsEntries}
</urlset>`;
  } catch (error) {
    console.error("Error generating news sitemap:", error);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`;
  }
}

/**
 * Generate image sitemap for rich media content
 */
export async function generateImageSitemap(): Promise<string> {
  const staticImages = [
    {
      url: `${seoConfig.siteUrl}/og-image.png`,
      title: `${seoConfig.siteName} - Insider Risk Assessment`,
      caption: "Comprehensive insider threat risk assessment platform",
    },
    {
      url: `${seoConfig.siteUrl}/assessment-preview.png`,
      title: "Assessment Preview",
      caption: "Interactive assessment interface preview",
    },
    {
      url: `${seoConfig.siteUrl}/radar-chart.png`,
      title: "Risk Assessment Radar Chart",
      caption: "Visual representation of risk assessment results",
    },
  ];

  const imageEntries = staticImages
    .map(
      img => `
  <url>
    <loc>${seoConfig.siteUrl}</loc>
    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title><![CDATA[${img.title}]]></image:title>
      <image:caption><![CDATA[${img.caption}]]></image:caption>
    </image:image>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${imageEntries}
</urlset>`;
}

export {
  generateSitemap as default,
  generateRobots,
  generateManifest,
};