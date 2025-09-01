import { generateRSSFeed } from "@/lib/feeds";

export async function GET() {
  try {
    const feed = await generateRSSFeed();
    
    return new Response(feed, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    // Return empty RSS feed on error
    const emptyFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Insider Risk Index</title>
    <description>Insider threat research and insights</description>
    <link>https://insiderisk.io</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;
    
    return new Response(emptyFeed, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    });
  }
}