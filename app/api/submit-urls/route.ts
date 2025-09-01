import { NextRequest, NextResponse } from 'next/server';
import { getBingSubmissionService, bingSubmission } from '@/lib/bing-submission';
import { submitUrlToIndexNow } from '@/app/actions/indexnow';

interface SubmissionRequest {
  urls: string[];
  type: 'new' | 'updated' | 'core';
  priority?: 'high' | 'normal' | 'low';
  services?: ('bing' | 'indexnow')[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmissionRequest = await request.json();
    const { urls, type, priority = 'normal', services = ['bing', 'indexnow'] } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    const results: {
      bing?: boolean;
      indexnow?: Array<{ url: string; success: boolean }>;
    } = {};

    // Submit to Bing if requested
    if (services.includes('bing')) {
      const bingService = getBingSubmissionService();
      
      switch (type) {
        case 'new':
          results.bing = await bingSubmission.submitNewContent(urls);
          break;
        case 'updated':
          results.bing = await bingSubmission.submitUpdatedContent(urls);
          break;
        case 'core':
          results.bing = await bingSubmission.submitCorePages();
          break;
        default:
          results.bing = await bingService.submitUrls(urls, { priority, contentType: type });
      }
    }

    // Submit to IndexNow if requested
    if (services.includes('indexnow')) {
      results.indexnow = [];
      
      for (const url of urls) {
        try {
          const success = await submitUrlToIndexNow(url);
          results.indexnow.push({ url, success });
        } catch (error) {
          console.error(`IndexNow submission failed for ${url}:`, error);
          results.indexnow.push({ url, success: false });
        }
      }
    }

    // Get quota information
    const bingService = getBingSubmissionService();
    const quotaInfo = bingService.getQuotaUsage();

    return NextResponse.json({
      success: true,
      results,
      quota: quotaInfo,
      submitted_urls: urls.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('URL submission API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to submit URLs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check quota status
export async function GET() {
  try {
    const bingService = getBingSubmissionService();
    const quotaInfo = bingService.getQuotaUsage();

    return NextResponse.json({
      service: 'Bing URL Submission API',
      quota: quotaInfo,
      indexnow_enabled: !!process.env.INDEXNOW_KEY,
      bing_enabled: !!process.env.BING_WEBMASTER_API_KEY,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    );
  }
}