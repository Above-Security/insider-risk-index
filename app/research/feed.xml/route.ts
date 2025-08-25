import { getAllContent } from '@/lib/content';

export async function GET() {
  const articles = getAllContent('research');
  const siteUrl = 'https://insiderriskindex.com';

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Insider Risk Index - Research & Insights</title>
    <link>${siteUrl}/research</link>
    <description>Latest research and insights on insider threat management, cybersecurity trends, and risk assessment.</description>
    <language>en-US</language>
    <copyright>© 2024 Insider Risk Index</copyright>
    <managingEditor>research@insiderriskindex.com (Insider Risk Index Team)</managingEditor>
    <webMaster>webmaster@insiderriskindex.com (Web Team)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/research/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/favicon-32x32.png</url>
      <title>Insider Risk Index</title>
      <link>${siteUrl}</link>
      <width>32</width>
      <height>32</height>
    </image>
    ${articles
      .map(
        (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/research/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/research/${article.slug}</guid>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <author>research@insiderriskindex.com (${article.author || 'Insider Risk Index Team'})</author>
      <category>Cybersecurity Research</category>
      ${article.tags?.map(tag => `<category>${tag}</category>`).join('\n      ') || ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}