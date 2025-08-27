import { NextRequest, NextResponse } from 'next/server';
import { performBulkIndexNowSubmission, submitSitemapToIndexNow } from '@/lib/indexnow';

/**
 * POST /api/admin/indexnow-submit
 * Admin endpoint to manually trigger IndexNow submissions
 * This can be called after major site updates or content changes
 */
export async function POST(request: NextRequest) {
  try {
    // Simple API key check (in production, use proper authentication)
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (process.env.INDEXNOW_ENABLED !== 'true') {
      return NextResponse.json(
        { error: 'IndexNow is disabled' },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { type = 'core-pages' } = body;

    let result;
    switch (type) {
      case 'core-pages':
        await performBulkIndexNowSubmission();
        result = { message: 'Submitted core pages to IndexNow', type: 'core-pages' };
        break;
        
      case 'sitemaps':
        await submitSitemapToIndexNow();
        result = { message: 'Submitted sitemaps to IndexNow', type: 'sitemaps' };
        break;
        
      case 'all':
        await performBulkIndexNowSubmission();
        await submitSitemapToIndexNow();
        result = { message: 'Submitted all pages and sitemaps to IndexNow', type: 'all' };
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid submission type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Admin IndexNow submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/indexnow-submit
 * Get IndexNow status and available actions
 */
export async function GET() {
  return NextResponse.json({
    indexnow_enabled: process.env.INDEXNOW_ENABLED === 'true',
    key_file_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${process.env.INDEXNOW_KEY}.txt`,
    available_types: ['core-pages', 'sitemaps', 'all'],
    description: 'POST with { "type": "core-pages|sitemaps|all" } to submit to IndexNow'
  });
}