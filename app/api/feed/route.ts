import { generateJSONFeed } from "@/lib/feeds";

export async function GET() {
  try {
    const feed = await generateJSONFeed();
    
    return Response.json(feed, {
      status: 200,
      headers: {
        'Content-Type': 'application/feed+json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating JSON feed:', error);
    
    // Return empty JSON feed on error
    const emptyFeed = {
      version: "https://jsonfeed.org/version/1.1",
      title: "Insider Risk Index",
      description: "Insider threat research and insights",
      home_page_url: "https://insiderriskindex.com",
      feed_url: "https://insiderriskindex.com/feed.json",
      language: "en-US",
      authors: [
        {
          name: "Insider Risk Index Team",
          url: "https://insiderriskindex.com",
        },
      ],
      items: [],
    };
    
    return Response.json(emptyFeed, {
      status: 200,
      headers: {
        'Content-Type': 'application/feed+json; charset=utf-8',
      },
    });
  }
}