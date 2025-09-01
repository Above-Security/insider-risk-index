/**
 * IndexNow Analytics and Performance Tracking
 * Tracks submission success rates, response times, and SEO impact
 */

import { AnalyticsEvent } from '@prisma/client';

export interface IndexNowAnalytics {
  submission_id: string;
  url: string;
  endpoint: string;
  status: 'success' | 'failure' | 'pending';
  response_code?: number;
  response_time_ms?: number;
  error_message?: string;
  submitted_at: Date;
  search_engine: 'bing' | 'yandex' | 'google_indirect';
  content_type: 'page' | 'sitemap' | 'feed';
}

export interface SEOMetrics {
  url: string;
  search_engine: string;
  indexed_status: 'indexed' | 'not_indexed' | 'pending' | 'blocked';
  last_crawled?: Date;
  indexing_speed_hours?: number; // Hours from submission to indexing
  ranking_position?: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  measured_at: Date;
}

/**
 * Track IndexNow submission analytics
 */
export async function trackIndexNowSubmission({
  url,
  endpoint,
  status,
  responseCode,
  responseTime,
  errorMessage,
  searchEngine = 'bing',
  contentType = 'page',
}: {
  url: string;
  endpoint: string;
  status: 'success' | 'failure';
  responseCode?: number;
  responseTime?: number;
  errorMessage?: string;
  searchEngine?: 'bing' | 'yandex';
  contentType?: 'page' | 'sitemap' | 'feed';
}) {
  const analytics: IndexNowAnalytics = {
    submission_id: `idx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    url,
    endpoint,
    status,
    response_code: responseCode,
    response_time_ms: responseTime,
    error_message: errorMessage,
    submitted_at: new Date(),
    search_engine: searchEngine,
    content_type: contentType,
  };

  try {
    // Store in PostHog for analytics dashboard
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('indexnow_submission', {
        url,
        endpoint,
        status,
        response_code: responseCode,
        response_time_ms: responseTime,
        search_engine: searchEngine,
        content_type: contentType,
        error_message: errorMessage,
      });
    }

    // Also log for server-side tracking
    console.log('IndexNow Analytics:', {
      submission_id: analytics.submission_id,
      url: analytics.url,
      status: analytics.status,
      response_code: analytics.response_code,
      response_time_ms: analytics.response_time_ms,
      search_engine: analytics.search_engine,
    });

    return analytics;
  } catch (error) {
    console.error('Failed to track IndexNow submission:', error);
    return null;
  }
}

/**
 * Track SEO performance metrics
 */
export async function trackSEOMetrics({
  url,
  searchEngine,
  indexedStatus,
  lastCrawled,
  indexingSpeedHours,
  rankingPosition,
  impressions,
  clicks,
  ctr,
}: {
  url: string;
  searchEngine: string;
  indexedStatus: 'indexed' | 'not_indexed' | 'pending' | 'blocked';
  lastCrawled?: Date;
  indexingSpeedHours?: number;
  rankingPosition?: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
}) {
  const metrics: SEOMetrics = {
    url,
    search_engine: searchEngine,
    indexed_status: indexedStatus,
    last_crawled: lastCrawled,
    indexing_speed_hours: indexingSpeedHours,
    ranking_position: rankingPosition,
    impressions,
    clicks,
    ctr,
    measured_at: new Date(),
  };

  try {
    // Track in PostHog for analytics
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('seo_metrics', {
        url,
        search_engine: searchEngine,
        indexed_status: indexedStatus,
        indexing_speed_hours: indexingSpeedHours,
        ranking_position: rankingPosition,
        impressions,
        clicks,
        ctr,
      });
    }

    console.log('SEO Metrics:', {
      url: metrics.url,
      search_engine: metrics.search_engine,
      indexed_status: metrics.indexed_status,
      indexing_speed_hours: metrics.indexing_speed_hours,
      ranking_position: metrics.ranking_position,
    });

    return metrics;
  } catch (error) {
    console.error('Failed to track SEO metrics:', error);
    return null;
  }
}

/**
 * Generate IndexNow performance report
 */
export function generateIndexNowReport(submissions: IndexNowAnalytics[]) {
  const total = submissions.length;
  const successful = submissions.filter(s => s.status === 'success').length;
  const failed = submissions.filter(s => s.status === 'failure').length;
  
  const avgResponseTime = submissions
    .filter(s => s.response_time_ms)
    .reduce((sum, s) => sum + (s.response_time_ms || 0), 0) / 
    submissions.filter(s => s.response_time_ms).length;

  const successRate = (successful / total) * 100;
  
  const bingSubmissions = submissions.filter(s => s.search_engine === 'bing').length;
  const yandexSubmissions = submissions.filter(s => s.search_engine === 'yandex').length;

  const pageSubmissions = submissions.filter(s => s.content_type === 'page').length;
  const sitemapSubmissions = submissions.filter(s => s.content_type === 'sitemap').length;
  const feedSubmissions = submissions.filter(s => s.content_type === 'feed').length;

  return {
    total_submissions: total,
    successful_submissions: successful,
    failed_submissions: failed,
    success_rate_percent: Math.round(successRate * 100) / 100,
    average_response_time_ms: Math.round(avgResponseTime * 100) / 100,
    breakdown: {
      by_search_engine: {
        bing: bingSubmissions,
        yandex: yandexSubmissions,
      },
      by_content_type: {
        pages: pageSubmissions,
        sitemaps: sitemapSubmissions,
        feeds: feedSubmissions,
      },
    },
    period: {
      from: submissions.length > 0 ? submissions[0].submitted_at : null,
      to: submissions.length > 0 ? submissions[submissions.length - 1].submitted_at : null,
    },
  };
}

/**
 * Generate SEO performance report
 */
export function generateSEOReport(metrics: SEOMetrics[]) {
  const totalUrls = metrics.length;
  const indexedUrls = metrics.filter(m => m.indexed_status === 'indexed').length;
  const pendingUrls = metrics.filter(m => m.indexed_status === 'pending').length;
  const blockedUrls = metrics.filter(m => m.indexed_status === 'blocked').length;

  const indexingRates = metrics
    .filter(m => m.indexing_speed_hours && m.indexing_speed_hours > 0)
    .map(m => m.indexing_speed_hours!);
  
  const avgIndexingSpeed = indexingRates.length > 0 
    ? indexingRates.reduce((sum, speed) => sum + speed, 0) / indexingRates.length
    : 0;

  const avgPosition = metrics
    .filter(m => m.ranking_position && m.ranking_position > 0)
    .reduce((sum, m, _, arr) => sum + (m.ranking_position! / arr.length), 0);

  const totalImpressions = metrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
  const totalClicks = metrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return {
    total_urls: totalUrls,
    indexed_urls: indexedUrls,
    pending_urls: pendingUrls,
    blocked_urls: blockedUrls,
    indexing_rate_percent: totalUrls > 0 ? Math.round((indexedUrls / totalUrls) * 100 * 100) / 100 : 0,
    average_indexing_speed_hours: Math.round(avgIndexingSpeed * 100) / 100,
    average_ranking_position: Math.round(avgPosition * 100) / 100,
    total_impressions: totalImpressions,
    total_clicks: totalClicks,
    average_ctr_percent: Math.round(avgCTR * 100) / 100,
    by_search_engine: metrics.reduce((acc, m) => {
      acc[m.search_engine] = (acc[m.search_engine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}

/**
 * Utility functions for tracking key SEO events
 */
export const seoEvents = {
  /**
   * Track when a page gets indexed after IndexNow submission
   */
  pageIndexed: (url: string, searchEngine: string, hoursFromSubmission?: number) => {
    trackSEOMetrics({
      url,
      searchEngine,
      indexedStatus: 'indexed',
      indexingSpeedHours: hoursFromSubmission,
      lastCrawled: new Date(),
    });
  },

  /**
   * Track ranking improvements
   */
  rankingImproved: (url: string, searchEngine: string, newPosition: number, oldPosition: number) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('ranking_improved', {
        url,
        search_engine: searchEngine,
        new_position: newPosition,
        old_position: oldPosition,
        improvement: oldPosition - newPosition,
      });
    }
  },

  /**
   * Track organic traffic increases
   */
  trafficIncrease: (url: string, newClicks: number, oldClicks: number, period: string) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('organic_traffic_increase', {
        url,
        new_clicks: newClicks,
        old_clicks: oldClicks,
        increase_percent: oldClicks > 0 ? ((newClicks - oldClicks) / oldClicks) * 100 : 0,
        period,
      });
    }
  },

  /**
   * Track search console improvements
   */
  searchConsoleMetrics: (data: {
    totalImpressions: number;
    totalClicks: number;
    avgCTR: number;
    avgPosition: number;
    period: string;
  }) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('search_console_metrics', {
        total_impressions: data.totalImpressions,
        total_clicks: data.totalClicks,
        average_ctr: data.avgCTR,
        average_position: data.avgPosition,
        period: data.period,
      });
    }
  },
};

/**
 * Dashboard data aggregation for analytics UI
 */
export interface AnalyticsDashboardData {
  indexnow_stats: {
    success_rate: number;
    total_submissions: number;
    avg_response_time: number;
    last_24h_submissions: number;
  };
  seo_performance: {
    indexed_pages: number;
    avg_indexing_speed: number;
    avg_ranking_position: number;
    total_organic_clicks: number;
  };
  trending_urls: Array<{
    url: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }>;
  indexing_timeline: Array<{
    date: string;
    submissions: number;
    successes: number;
    indexed: number;
  }>;
}

/**
 * Generate dashboard data for analytics UI
 */
export async function generateDashboardData(
  submissions: IndexNowAnalytics[],
  seoMetrics: SEOMetrics[]
): Promise<AnalyticsDashboardData> {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // IndexNow stats
  const recent24hSubmissions = submissions.filter(s => s.submitted_at > yesterday);
  const indexnowReport = generateIndexNowReport(submissions);
  
  // SEO performance
  const seoReport = generateSEOReport(seoMetrics);
  
  // Trending URLs (top performing pages)
  const trendingUrls = seoMetrics
    .filter(m => m.clicks && m.clicks > 0)
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 10)
    .map(m => ({
      url: m.url,
      impressions: m.impressions || 0,
      clicks: m.clicks || 0,
      ctr: m.ctr || 0,
      position: m.ranking_position || 0,
    }));

  // Indexing timeline (last 30 days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const timelineData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const daySubmissions = submissions.filter(s => 
      s.submitted_at >= dayStart && s.submitted_at <= dayEnd
    );
    
    const daySuccesses = daySubmissions.filter(s => s.status === 'success').length;
    
    const dayIndexed = seoMetrics.filter(m => 
      m.last_crawled && m.last_crawled >= dayStart && m.last_crawled <= dayEnd &&
      m.indexed_status === 'indexed'
    ).length;

    return {
      date: dayStart.toISOString().split('T')[0],
      submissions: daySubmissions.length,
      successes: daySuccesses,
      indexed: dayIndexed,
    };
  });

  return {
    indexnow_stats: {
      success_rate: indexnowReport.success_rate_percent,
      total_submissions: indexnowReport.total_submissions,
      avg_response_time: indexnowReport.average_response_time_ms,
      last_24h_submissions: recent24hSubmissions.length,
    },
    seo_performance: {
      indexed_pages: seoReport.indexed_urls,
      avg_indexing_speed: seoReport.average_indexing_speed_hours,
      avg_ranking_position: seoReport.average_ranking_position,
      total_organic_clicks: seoReport.total_clicks,
    },
    trending_urls: trendingUrls,
    indexing_timeline: timelineData,
  };
}