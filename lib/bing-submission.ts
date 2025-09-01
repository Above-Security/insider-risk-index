/**
 * Bing URL Submission API Integration
 * Automatically submits URLs to Bing for instant crawling and indexing
 * Complements IndexNow API for comprehensive search engine coverage
 */

interface BingSubmissionPayload {
  siteUrl: string;
  urlList: string[];
}

interface BingSubmissionResponse {
  d?: {
    __type?: string;
    ErrorCode?: number;
    ErrorDetails?: string;
  };
}

export class BingURLSubmissionService {
  private readonly apiKey: string;
  private readonly siteUrl: string;
  private readonly apiEndpoint = 'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch';
  private readonly dailyQuota = 10000; // URLs per day
  private submittedToday = 0;

  constructor(apiKey?: string, siteUrl?: string) {
    this.apiKey = apiKey || process.env.BING_WEBMASTER_API_KEY || '';
    this.siteUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://insiderisk.io';
    
    if (!this.apiKey) {
      console.warn('Bing Webmaster API key not configured. URL submission disabled.');
    }
  }

  /**
   * Submit URLs to Bing for immediate crawling
   */
  async submitUrls(urls: string[], options: {
    priority?: 'high' | 'normal' | 'low';
    contentType?: 'new' | 'updated' | '404' | 'redirect';
  } = {}): Promise<boolean> {
    if (!this.apiKey) {
      console.log('Bing URL submission skipped: No API key configured');
      return false;
    }

    if (this.submittedToday >= this.dailyQuota) {
      console.warn(`Bing URL submission skipped: Daily quota of ${this.dailyQuota} URLs reached`);
      return false;
    }

    // Ensure URLs are absolute and belong to our site
    const validUrls = urls
      .filter(url => url.startsWith(this.siteUrl))
      .slice(0, Math.min(urls.length, this.dailyQuota - this.submittedToday));

    if (validUrls.length === 0) {
      console.warn('No valid URLs to submit to Bing');
      return false;
    }

    const payload: BingSubmissionPayload = {
      siteUrl: this.siteUrl,
      urlList: validUrls
    };

    try {
      console.log(`Submitting ${validUrls.length} URLs to Bing API...`);
      
      const response = await fetch(`${this.apiEndpoint}?apikey=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'InsiderRiskIndex/1.0 (+https://insiderisk.io)'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Bing API request failed: ${response.status} ${response.statusText}`);
      }

      const result: BingSubmissionResponse = await response.json();

      // Check for API errors
      if (result.d?.ErrorCode && result.d.ErrorCode !== 0) {
        throw new Error(`Bing API error: ${result.d.ErrorCode} - ${result.d.ErrorDetails}`);
      }

      this.submittedToday += validUrls.length;
      
      console.log(`Successfully submitted ${validUrls.length} URLs to Bing:`, validUrls);
      
      // Log analytics event
      this.trackSubmission(validUrls, options);
      
      return true;

    } catch (error) {
      console.error('Bing URL submission failed:', error);
      return false;
    }
  }

  /**
   * Submit a single URL to Bing
   */
  async submitUrl(url: string, options?: {
    priority?: 'high' | 'normal' | 'low';
    contentType?: 'new' | 'updated' | '404' | 'redirect';
  }): Promise<boolean> {
    return this.submitUrls([url], options);
  }

  /**
   * Submit multiple types of URLs with different priorities
   */
  async submitBatch(batch: {
    newUrls?: string[];
    updatedUrls?: string[];
    highPriorityUrls?: string[];
  }): Promise<{
    newSubmitted: boolean;
    updatedSubmitted: boolean;
    highPrioritySubmitted: boolean;
  }> {
    const results = {
      newSubmitted: false,
      updatedSubmitted: false,
      highPrioritySubmitted: false
    };

    // Submit high priority URLs first
    if (batch.highPriorityUrls?.length) {
      results.highPrioritySubmitted = await this.submitUrls(
        batch.highPriorityUrls, 
        { priority: 'high', contentType: 'new' }
      );
    }

    // Submit new URLs
    if (batch.newUrls?.length) {
      results.newSubmitted = await this.submitUrls(
        batch.newUrls, 
        { priority: 'normal', contentType: 'new' }
      );
    }

    // Submit updated URLs
    if (batch.updatedUrls?.length) {
      results.updatedSubmitted = await this.submitUrls(
        batch.updatedUrls, 
        { priority: 'normal', contentType: 'updated' }
      );
    }

    return results;
  }

  /**
   * Get current quota usage
   */
  getQuotaUsage(): { used: number; available: number; total: number } {
    return {
      used: this.submittedToday,
      available: this.dailyQuota - this.submittedToday,
      total: this.dailyQuota
    };
  }

  /**
   * Reset daily quota counter (called automatically at midnight)
   */
  resetDailyQuota(): void {
    this.submittedToday = 0;
    console.log('Bing URL submission quota reset for new day');
  }

  /**
   * Track submission analytics
   */
  private trackSubmission(urls: string[], options: {
    priority?: string;
    contentType?: string;
  }): void {
    try {
      // Track with PostHog if available
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('bing_url_submission', {
          url_count: urls.length,
          priority: options.priority || 'normal',
          content_type: options.contentType || 'unknown',
          quota_remaining: this.dailyQuota - this.submittedToday,
          timestamp: new Date().toISOString()
        });
      }

      // Console logging for server-side tracking
      console.log('Bing URL Submission Analytics:', {
        submitted_urls: urls.length,
        priority: options.priority || 'normal',
        content_type: options.contentType || 'unknown',
        quota_used: this.submittedToday,
        quota_remaining: this.dailyQuota - this.submittedToday
      });

    } catch (error) {
      console.error('Failed to track Bing submission analytics:', error);
    }
  }
}

// Singleton instance
let bingService: BingURLSubmissionService;

export function getBingSubmissionService(): BingURLSubmissionService {
  if (!bingService) {
    bingService = new BingURLSubmissionService();
  }
  return bingService;
}

/**
 * Utility functions for common submission scenarios
 */
export const bingSubmission = {
  /**
   * Submit new content immediately after publication
   */
  submitNewContent: async (urls: string[]): Promise<boolean> => {
    const service = getBingSubmissionService();
    return service.submitUrls(urls, { 
      priority: 'high', 
      contentType: 'new' 
    });
  },

  /**
   * Submit updated content after modifications
   */
  submitUpdatedContent: async (urls: string[]): Promise<boolean> => {
    const service = getBingSubmissionService();
    return service.submitUrls(urls, { 
      priority: 'normal', 
      contentType: 'updated' 
    });
  },

  /**
   * Submit assessment results (if public)
   */
  submitAssessmentResults: async (resultId: string): Promise<boolean> => {
    const service = getBingSubmissionService();
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/results/${resultId}`;
    return service.submitUrl(url, { 
      priority: 'normal', 
      contentType: 'new' 
    });
  },

  /**
   * Submit sitemap and core pages
   */
  submitCorePages: async (): Promise<boolean> => {
    const service = getBingSubmissionService();
    const coreUrls = [
      `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      `${process.env.NEXT_PUBLIC_SITE_URL}/assessment`,
      `${process.env.NEXT_PUBLIC_SITE_URL}/benchmarks`,
      `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
      `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL}/rss.xml`
    ];
    
    return service.submitUrls(coreUrls, { 
      priority: 'high', 
      contentType: 'updated' 
    });
  }
};

export default getBingSubmissionService;