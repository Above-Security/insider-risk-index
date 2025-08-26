import { generateAtomFeed } from "@/lib/feeds";

export async function GET() {
  try {
    const feed = await generateAtomFeed();
    
    return new Response(feed, {
      status: 200,
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating Atom feed:', error);
    
    // Return empty Atom feed on error
    const emptyFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Insider Risk Index</title>
  <subtitle>Insider threat research and insights</subtitle>
  <link href="https://insiderriskindex.com/atom.xml" rel="self" />
  <link href="https://insiderriskindex.com" />
  <id>https://insiderriskindex.com/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>Insider Risk Index Team</name>
    <email>hello@insiderriskindex.com</email>
  </author>
</feed>`;
    
    return new Response(emptyFeed, {
      status: 200,
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
      },
    });
  }
}