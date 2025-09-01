import { NextRequest, NextResponse } from 'next/server';
import { generateDashboardData, generateIndexNowReport, generateSEOReport } from '@/lib/indexnow-analytics';

/**
 * GET /api/analytics/indexnow
 * Retrieve IndexNow analytics and performance data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // Default to 30 days
    const format = searchParams.get('format') || 'json';
    
    // Calculate date range
    const days = parseInt(period, 10);
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    // Mock data for demonstration (in production, this would come from database/PostHog)
    const mockSubmissions = [
      {
        submission_id: 'idx_1756719832_abc123',
        url: 'https://www.insiderisk.io/',
        endpoint: 'https://www.bing.com/IndexNow',
        status: 'success' as const,
        response_code: 200,
        response_time_ms: 245,
        submitted_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        search_engine: 'bing' as const,
        content_type: 'page' as const,
      },
      {
        submission_id: 'idx_1756719845_def456',
        url: 'https://www.insiderisk.io/assessment',
        endpoint: 'https://www.bing.com/IndexNow',
        status: 'success' as const,
        response_code: 200,
        response_time_ms: 189,
        submitted_at: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        search_engine: 'bing' as const,
        content_type: 'page' as const,
      },
      {
        submission_id: 'idx_1756719856_ghi789',
        url: 'https://www.insiderisk.io/sitemap.xml',
        endpoint: 'https://www.bing.com/IndexNow',
        status: 'success' as const,
        response_code: 200,
        response_time_ms: 342,
        submitted_at: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        search_engine: 'bing' as const,
        content_type: 'sitemap' as const,
      },
    ];

    const mockSEOMetrics = [
      {
        url: 'https://www.insiderisk.io/',
        search_engine: 'google',
        indexed_status: 'indexed' as const,
        last_crawled: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        indexing_speed_hours: 2.5,
        ranking_position: 8,
        impressions: 1250,
        clicks: 89,
        ctr: 7.12,
        measured_at: new Date(),
      },
      {
        url: 'https://www.insiderisk.io/assessment',
        search_engine: 'google',
        indexed_status: 'indexed' as const,
        last_crawled: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        indexing_speed_hours: 3.2,
        ranking_position: 12,
        impressions: 890,
        clicks: 67,
        ctr: 7.53,
        measured_at: new Date(),
      },
      {
        url: 'https://www.insiderisk.io/benchmarks',
        search_engine: 'google',
        indexed_status: 'indexed' as const,
        last_crawled: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        indexing_speed_hours: 1.8,
        ranking_position: 5,
        impressions: 634,
        clicks: 78,
        ctr: 12.30,
        measured_at: new Date(),
      },
    ];

    if (format === 'dashboard') {
      // Generate comprehensive dashboard data
      const dashboardData = await generateDashboardData(mockSubmissions, mockSEOMetrics);
      
      return NextResponse.json({
        success: true,
        data: dashboardData,
        period: {
          days,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        },
      });
    }

    // Generate detailed reports
    const indexnowReport = generateIndexNowReport(mockSubmissions);
    const seoReport = generateSEOReport(mockSEOMetrics);

    return NextResponse.json({
      success: true,
      data: {
        indexnow_performance: indexnowReport,
        seo_performance: seoReport,
        raw_data: {
          submissions: mockSubmissions.length,
          seo_metrics: mockSEOMetrics.length,
        },
      },
      period: {
        days,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      },
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve analytics data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/indexnow
 * Manually trigger analytics data collection or updates
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'refresh_metrics':
        // In production, this would trigger data collection from Google Search Console, etc.
        return NextResponse.json({
          success: true,
          message: 'Metrics refresh initiated',
          timestamp: new Date().toISOString(),
        });

      case 'test_indexnow':
        // Test IndexNow submission with analytics tracking
        const { submitUrlToIndexNow } = await import('@/lib/indexnow');
        const testUrl = body.test_url || 'https://www.insiderisk.io/';
        
        const success = await submitUrlToIndexNow(testUrl);
        
        return NextResponse.json({
          success: true,
          indexnow_result: success,
          test_url: testUrl,
          message: success ? 'Test submission successful' : 'Test submission failed',
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process analytics action',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}