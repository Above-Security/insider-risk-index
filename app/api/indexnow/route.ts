import { NextRequest, NextResponse } from 'next/server';
import { submitUrlToIndexNow, submitUrlsToIndexNow, performBulkIndexNowSubmission } from '@/lib/indexnow';

// Rate limiting for IndexNow API calls
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 100; // Max requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

/**
 * POST /api/indexnow
 * Submit URLs to IndexNow for immediate search engine indexing
 */
export async function POST(request: NextRequest) {
  try {
    // Check if IndexNow is enabled
    if (process.env.INDEXNOW_ENABLED !== 'true') {
      return NextResponse.json(
        { error: 'IndexNow is disabled' },
        { status: 503 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { urls, type = 'single' } = body;

    if (type === 'bulk' && Array.isArray(urls)) {
      // Submit multiple URLs
      const success = await submitUrlsToIndexNow(urls);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: `Successfully submitted ${urls.length} URLs to IndexNow`,
          urls: urls.length
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to submit URLs to IndexNow' },
          { status: 500 }
        );
      }
    } else if (type === 'single' && typeof urls === 'string') {
      // Submit single URL
      const success = await submitUrlToIndexNow(urls);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Successfully submitted URL to IndexNow',
          url: urls
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to submit URL to IndexNow' },
          { status: 500 }
        );
      }
    } else if (type === 'core-pages') {
      // Submit all core pages
      await performBulkIndexNowSubmission();
      
      return NextResponse.json({
        success: true,
        message: 'Successfully submitted core pages to IndexNow'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('IndexNow API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/indexnow
 * Health check and status endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    indexnow_enabled: process.env.INDEXNOW_ENABLED === 'true',
    endpoints: [
      'https://www.bing.com/IndexNow',
      'https://yandex.com/IndexNow'
    ],
    key_verification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${process.env.INDEXNOW_KEY}.txt`
  });
}