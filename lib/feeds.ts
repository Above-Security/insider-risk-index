import { getAllContent, ContentItem } from "./mdx";
import { seoConfig } from "./seo";

interface ContentFrontmatter {
  title: string;
  description?: string;
  abstract?: string;
  publishedAt?: string;
  publishDate?: string;
  updatedAt?: string;
  lastUpdated?: string;
  author?: string;
  authors?: string[];
  tags?: string[];
}

/**
 * Generate RSS feed for research articles and blog posts
 */
export async function generateRSSFeed(): Promise<string> {
  try {
    const research = getAllContent('research').slice(0, 50);
    const playbooks = getAllContent('playbooks').slice(0, 50);

    // Combine and sort by date
    const allContent = [
      ...research.map((r: ContentItem<ContentFrontmatter>) => ({
        title: r.frontmatter.title,
        description: r.frontmatter.description || r.frontmatter.abstract,
        url: `${seoConfig.siteUrl}/research/${r.slug}`,
        date: new Date(r.frontmatter.publishedAt || r.frontmatter.publishDate || Date.now()),
        category: "Research",
        authors: r.frontmatter.authors || [r.frontmatter.author || "Insider Risk Index Team"],
      })),
      ...playbooks.map((p: ContentItem<ContentFrontmatter>) => ({
        title: p.frontmatter.title,
        description: p.frontmatter.description,
        url: `${seoConfig.siteUrl}/playbooks/${p.slug}`,
        date: new Date(p.frontmatter.updatedAt || p.frontmatter.lastUpdated || Date.now()),
        category: "Playbook",
        authors: [p.frontmatter.author || "Insider Risk Index Team"],
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    const rssItems = allContent
      .map(
        item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.url}</link>
      <guid>${item.url}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <category>${item.category}</category>
      ${item.authors.map((author: string) => `<author>${author}</author>`).join("")}
    </item>`
      )
      .join("");

    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${seoConfig.siteName}</title>
    <description>${seoConfig.description}</description>
    <link>${seoConfig.siteUrl}</link>
    <atom:link href="${seoConfig.siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`;
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return generateEmptyRSSFeed();
  }
}

/**
 * Generate Atom feed
 */
export async function generateAtomFeed(): Promise<string> {
  try {
    const research = getAllContent('research').slice(0, 50);
    const playbooks = getAllContent('playbooks').slice(0, 50);

    const allContent = [
      ...research.map((r: ContentItem<ContentFrontmatter>) => ({
        title: r.frontmatter.title,
        description: r.frontmatter.description || r.frontmatter.abstract,
        url: `${seoConfig.siteUrl}/research/${r.slug}`,
        date: new Date(r.frontmatter.publishedAt || r.frontmatter.publishDate || Date.now()),
        category: "Research",
        id: `research-${r.slug}`,
      })),
      ...playbooks.map((p: ContentItem<ContentFrontmatter>) => ({
        title: p.frontmatter.title,
        description: p.frontmatter.description,
        url: `${seoConfig.siteUrl}/playbooks/${p.slug}`,
        date: new Date(p.frontmatter.updatedAt || p.frontmatter.lastUpdated || Date.now()),
        category: "Playbook",
        id: `playbook-${p.slug}`,
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    const atomEntries = allContent
      .map(
        item => `
  <entry>
    <title type="html">${escapeXml(item.title)}</title>
    <link href="${item.url}" />
    <id>${seoConfig.siteUrl}/${item.id}</id>
    <updated>${item.date.toISOString()}</updated>
    <summary type="html">${escapeXml(item.description || '')}</summary>
    <category term="${item.category}" />
  </entry>`
      )
      .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${seoConfig.siteName}</title>
  <subtitle>${seoConfig.description}</subtitle>
  <link href="${seoConfig.siteUrl}/atom.xml" rel="self" />
  <link href="${seoConfig.siteUrl}" />
  <id>${seoConfig.siteUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>${seoConfig.creator}</name>
    <email>${seoConfig.contact.email}</email>
  </author>
  ${atomEntries}
</feed>`;
  } catch (error) {
    console.error("Error generating Atom feed:", error);
    return generateEmptyAtomFeed();
  }
}

/**
 * Generate JSON Feed
 */
export async function generateJSONFeed(): Promise<object> {
  try {
    const research = getAllContent('research').slice(0, 50);
    const playbooks = getAllContent('playbooks').slice(0, 50);

    const allContent = [
      ...research.map((r: ContentItem<ContentFrontmatter>) => ({
        id: `research-${r.slug}`,
        title: r.frontmatter.title,
        content_text: r.frontmatter.description || r.frontmatter.abstract || '',
        url: `${seoConfig.siteUrl}/research/${r.slug}`,
        date_published: new Date(r.frontmatter.publishedAt || r.frontmatter.publishDate || Date.now()).toISOString(),
        tags: r.frontmatter.tags || [],
        authors: (r.frontmatter.authors || [r.frontmatter.author || 'Insider Risk Index Team']).map(name => ({ name })),
      })),
      ...playbooks.map((p: ContentItem<ContentFrontmatter>) => ({
        id: `playbook-${p.slug}`,
        title: p.frontmatter.title,
        content_text: p.frontmatter.description || '',
        url: `${seoConfig.siteUrl}/playbooks/${p.slug}`,
        date_published: new Date(p.frontmatter.updatedAt || p.frontmatter.lastUpdated || Date.now()).toISOString(),
        tags: p.frontmatter.tags || [],
        authors: [{ name: "Insider Risk Index Team" }],
      })),
    ].sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime());

    return {
      version: "https://jsonfeed.org/version/1.1",
      title: seoConfig.siteName,
      description: seoConfig.description,
      home_page_url: seoConfig.siteUrl,
      feed_url: `${seoConfig.siteUrl}/feed.json`,
      language: "en-US",
      authors: [
        {
          name: seoConfig.creator,
          url: seoConfig.siteUrl,
        },
      ],
      items: allContent,
    };
  } catch (error) {
    console.error("Error generating JSON feed:", error);
    return {
      version: "https://jsonfeed.org/version/1.1",
      title: seoConfig.siteName,
      description: seoConfig.description,
      home_page_url: seoConfig.siteUrl,
      feed_url: `${seoConfig.siteUrl}/feed.json`,
      items: [],
    };
  }
}

/**
 * Generate research-specific RSS feed
 */
export async function generateResearchFeed(): Promise<string> {
  try {
    const research = getAllContent('research').slice(0, 50);

    const rssItems = research
      .map(
        (item: ContentItem<ContentFrontmatter>) => `
    <item>
      <title><![CDATA[${item.frontmatter.title}]]></title>
      <description><![CDATA[${item.frontmatter.description || item.frontmatter.abstract || ''}]]></description>
      <link>${seoConfig.siteUrl}/research/${item.slug}</link>
      <guid>${seoConfig.siteUrl}/research/${item.slug}</guid>
      <pubDate>${new Date(item.frontmatter.publishedAt || item.frontmatter.publishDate || Date.now()).toUTCString()}</pubDate>
      <category>Research</category>
      ${(item.frontmatter.authors || [item.frontmatter.author || "Insider Risk Index Team"]).map((author: string) => `<author>${author}</author>`).join("")}
      ${(item.frontmatter.tags || []).map((tag: string) => `<category>${tag}</category>`).join("")}
    </item>`
      )
      .join("");

    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${seoConfig.siteName} - Research</title>
    <description>Latest research and insights on insider threats and security</description>
    <link>${seoConfig.siteUrl}/research</link>
    <atom:link href="${seoConfig.siteUrl}/research/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`;
  } catch (error) {
    console.error("Error generating research feed:", error);
    return generateEmptyRSSFeed("Research");
  }
}

/**
 * Generate playbooks-specific RSS feed
 */
export async function generatePlaybooksFeed(): Promise<string> {
  try {
    const playbooks = getAllContent('playbooks').slice(0, 50);

    const rssItems = playbooks
      .map(
        (item: ContentItem<ContentFrontmatter>) => `
    <item>
      <title><![CDATA[${item.frontmatter.title}]]></title>
      <description><![CDATA[${item.frontmatter.description || ''}]]></description>
      <link>${seoConfig.siteUrl}/playbooks/${item.slug}</link>
      <guid>${seoConfig.siteUrl}/playbooks/${item.slug}</guid>
      <pubDate>${new Date(item.frontmatter.updatedAt || item.frontmatter.lastUpdated || Date.now()).toUTCString()}</pubDate>
      <category>Playbook</category>
      <author>${item.frontmatter.author || "Insider Risk Index Team"}</author>
      ${(item.frontmatter.tags || []).map((tag: string) => `<category>${tag}</category>`).join("")}
    </item>`
      )
      .join("");

    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${seoConfig.siteName} - Playbooks</title>
    <description>Security playbooks and best practices for insider threat management</description>
    <link>${seoConfig.siteUrl}/playbooks</link>
    <atom:link href="${seoConfig.siteUrl}/playbooks/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`;
  } catch (error) {
    console.error("Error generating playbooks feed:", error);
    return generateEmptyRSSFeed("Playbooks");
  }
}

/**
 * Generate sitemap feed for search engines
 */
export async function generateSitemapFeed(): Promise<string> {
  try {
    // During build time, use static content
    const research = getAllContent('research').slice(0, 1000);
    const playbooks = getAllContent('playbooks').slice(0, 1000);

    const staticPages = [
      { url: "", priority: "1.0", changefreq: "weekly" },
      { url: "/assessment", priority: "0.9", changefreq: "monthly" },
      { url: "/benchmarks", priority: "0.8", changefreq: "weekly" },
      { url: "/playbooks", priority: "0.8", changefreq: "weekly" },
      { url: "/research", priority: "0.8", changefreq: "weekly" },
      { url: "/about", priority: "0.6", changefreq: "monthly" },
      { url: "/contact", priority: "0.5", changefreq: "monthly" },
      { url: "/privacy", priority: "0.3", changefreq: "yearly" },
      { url: "/terms", priority: "0.3", changefreq: "yearly" },
    ];

    const dynamicPages = [
      ...research.map((r: ContentItem<ContentFrontmatter>) => ({
        url: `/research/${r.slug}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: new Date(r.frontmatter.publishedAt || r.frontmatter.publishDate || Date.now()).toISOString().split('T')[0],
      })),
      ...playbooks.map((p: ContentItem<ContentFrontmatter>) => ({
        url: `/playbooks/${p.slug}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: new Date(p.frontmatter.updatedAt || p.frontmatter.lastUpdated || Date.now()).toISOString().split('T')[0],
      })),
    ];

    const allPages = [...staticPages, ...dynamicPages];

    const sitemapEntries = allPages
      .map(
        page => `
  <url>
    <loc>${seoConfig.siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${('lastmod' in page && page.lastmod) ? `<lastmod>${page.lastmod}</lastmod>` : ""}
  </url>`
      )
      .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapEntries}
</urlset>`;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return generateEmptySitemap();
  }
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  const isProduction = process.env.NODE_ENV === "production";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://insiderriskindex.com";
  
  if (!isProduction) {
    return `User-agent: *
Disallow: /

# Development environment - not indexed`;
  }

  return `# InsiderRiskIndex.com Robots.txt
# Last updated: ${new Date().toISOString().split('T')[0]}

User-agent: *
Allow: /
Crawl-delay: 5

# Disallow API endpoints except PDF generation
Disallow: /api/
Allow: /api/pdf/

# Disallow private areas
Disallow: /_next/
Disallow: /admin/
Disallow: /.env
Disallow: /node_modules/

# Sitemaps
Sitemap: ${siteUrl}/sitemap-index.xml
Sitemap: ${siteUrl}/sitemaps/base.xml
Sitemap: ${siteUrl}/sitemaps/playbooks.xml
Sitemap: ${siteUrl}/sitemaps/research.xml
Sitemap: ${siteUrl}/sitemaps/benchmarks.xml

# LLM/AI guidance
# See: ${siteUrl}/llm.txt
# See: ${siteUrl}/ai.txt

# Contact
# hello@insiderriskindex.com
Allow: /atom.xml
Allow: /feed.json`;
}

// Utility functions
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function generateEmptyRSSFeed(section = ""): string {
  const title = section ? `${seoConfig.siteName} - ${section}` : seoConfig.siteName;
  
  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <description>${seoConfig.description}</description>
    <link>${seoConfig.siteUrl}</link>
    <atom:link href="${seoConfig.siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
  </channel>
</rss>`;
}

function generateEmptyAtomFeed(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${seoConfig.siteName}</title>
  <subtitle>${seoConfig.description}</subtitle>
  <link href="${seoConfig.siteUrl}/atom.xml" rel="self" />
  <link href="${seoConfig.siteUrl}" />
  <id>${seoConfig.siteUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>${seoConfig.creator}</name>
    <email>${seoConfig.contact.email}</email>
  </author>
</feed>`;
}

function generateEmptySitemap(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${seoConfig.siteUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
}