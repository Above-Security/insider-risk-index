import { NextRequest, NextResponse } from 'next/server';

/**
 * RSS Cloud ping endpoint for instant feed updates
 * Notifies RSS aggregators when new content is published
 */

const RSS_CLOUD_SERVICES = [
  'https://rpc.rsscloud.io:5337/ping',
  // Add more RSS cloud services as needed
];

interface PingPayload {
  url: string;
  feedUrl: string;
  title: string;
  description?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, feedUrl, title, description } = body as PingPayload;

    if (!url || !feedUrl || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: url, feedUrl, title' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insiderisk.io';
    const pingPayload = {
      url: url.startsWith('http') ? url : `${baseUrl}${url}`,
      feedUrl: feedUrl.startsWith('http') ? feedUrl : `${baseUrl}${feedUrl}`,
      title,
      description: description || `New content published: ${title}`
    };

    const results = await Promise.allSettled(
      RSS_CLOUD_SERVICES.map(async (service) => {
        const response = await fetch(service, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'InsiderRiskIndex/1.0 (+https://insiderisk.io/)',
          },
          body: JSON.stringify(pingPayload)
        });
        
        return {
          service,
          status: response.status,
          success: response.ok
        };
      })
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;

    return NextResponse.json({
      success: true,
      pinged: successful,
      total: RSS_CLOUD_SERVICES.length,
      url: pingPayload.url,
      message: `Successfully pinged ${successful}/${RSS_CLOUD_SERVICES.length} RSS cloud services`
    });

  } catch (error) {
    console.error('RSS ping error:', error);
    return NextResponse.json(
      { error: 'Failed to ping RSS cloud services' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'RSS Cloud ping service active',
    services: RSS_CLOUD_SERVICES.length,
    usage: 'POST { "url": "/new-content", "feedUrl": "/feed.xml", "title": "New Article" }'
  });
}