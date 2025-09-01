/**
 * IndexNow API implementation for instant search engine indexing
 * Notifies Bing, Yandex, and other search engines when content changes
 */

const INDEXNOW_KEY = "34842cf7adc727f3a275f5a6020aaadb43bff83cb3951b3a07ca3009a232f79b";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://insiderisk.io";

// IndexNow endpoints for major search engines
const INDEXNOW_ENDPOINTS = [
  "https://www.bing.com/IndexNow", // Primary endpoint (Bing/ChatGPT)
  "https://yandex.com/IndexNow",   // Yandex
  // Note: Google doesn't support IndexNow yet, but may in future
];

interface IndexNowSubmission {
  host: string;
  key: string;
  urlList: string[];
}

/**
 * Submit a single URL to IndexNow for immediate indexing
 */
export async function submitUrlToIndexNow(url: string): Promise<boolean> {
  const startTime = Date.now();
  
  try {
    // Ensure URL is absolute
    const absoluteUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
    
    // Submit to primary endpoint (Bing)
    const endpoint = `${INDEXNOW_ENDPOINTS[0]}?url=${encodeURIComponent(absoluteUrl)}&key=${INDEXNOW_KEY}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'User-Agent': 'InsiderRiskIndex/1.0 (+https://insiderisk.io/)',
      },
    });
    
    const responseTime = Date.now() - startTime;
    const success = response.status === 200 || response.status === 202;
    
    // Track analytics
    const { trackIndexNowSubmission } = await import('./indexnow-analytics');
    await trackIndexNowSubmission({
      url: absoluteUrl,
      endpoint: INDEXNOW_ENDPOINTS[0],
      status: success ? 'success' : 'failure',
      responseCode: response.status,
      responseTime,
      errorMessage: success ? undefined : response.statusText,
      searchEngine: 'bing',
      contentType: url.includes('sitemap') ? 'sitemap' : url.includes('rss') || url.includes('feed') ? 'feed' : 'page',
    });
    
    if (!success) {
      console.warn(`IndexNow submission failed for ${absoluteUrl}: ${response.status} ${response.statusText}`);
    } else {
      console.log(`IndexNow: Successfully submitted ${absoluteUrl} to Bing (${responseTime}ms)`);
    }
    
    return success;
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('IndexNow submission error:', error);
    
    // Track failed submission
    try {
      const { trackIndexNowSubmission } = await import('./indexnow-analytics');
      const absoluteUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
      await trackIndexNowSubmission({
        url: absoluteUrl,
        endpoint: INDEXNOW_ENDPOINTS[0],
        status: 'failure',
        responseTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        searchEngine: 'bing',
        contentType: url.includes('sitemap') ? 'sitemap' : url.includes('rss') || url.includes('feed') ? 'feed' : 'page',
      });
    } catch (trackingError) {
      console.error('Failed to track IndexNow error:', trackingError);
    }
    
    return false;
  }
}

/**
 * Submit multiple URLs to IndexNow for immediate indexing
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<boolean> {
  if (urls.length === 0) return true;
  
  const startTime = Date.now();
  
  try {
    // Convert to absolute URLs and limit to 10,000 per IndexNow spec
    const absoluteUrls = urls
      .map(url => url.startsWith('http') ? url : `${SITE_URL}${url}`)
      .slice(0, 10000);
    
    const submission: IndexNowSubmission = {
      host: new URL(SITE_URL).hostname,
      key: INDEXNOW_KEY,
      urlList: absoluteUrls
    };
    
    // Submit to Bing (primary endpoint for ChatGPT)
    const response = await fetch(INDEXNOW_ENDPOINTS[0], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'InsiderRiskIndex/1.0 (+https://insiderisk.io/)',
      },
      body: JSON.stringify(submission)
    });
    
    const responseTime = Date.now() - startTime;
    const success = response.status === 200 || response.status === 202;
    
    // Track analytics for bulk submission
    const { trackIndexNowSubmission } = await import('./indexnow-analytics');
    for (const url of absoluteUrls) {
      await trackIndexNowSubmission({
        url,
        endpoint: INDEXNOW_ENDPOINTS[0],
        status: success ? 'success' : 'failure',
        responseCode: response.status,
        responseTime: responseTime / absoluteUrls.length, // Average time per URL
        errorMessage: success ? undefined : response.statusText,
        searchEngine: 'bing',
        contentType: url.includes('sitemap') ? 'sitemap' : url.includes('rss') || url.includes('feed') ? 'feed' : 'page',
      });
    }
    
    if (!success) {
      console.warn(`IndexNow bulk submission failed: ${response.status} ${response.statusText}`);
    } else {
      console.log(`IndexNow: Successfully submitted ${absoluteUrls.length} URLs to Bing (${responseTime}ms)`);
    }
    
    return success;
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('IndexNow bulk submission error:', error);
    
    // Track failed bulk submission
    try {
      const { trackIndexNowSubmission } = await import('./indexnow-analytics');
      const absoluteUrls = urls.map(url => url.startsWith('http') ? url : `${SITE_URL}${url}`);
      
      for (const url of absoluteUrls) {
        await trackIndexNowSubmission({
          url,
          endpoint: INDEXNOW_ENDPOINTS[0],
          status: 'failure',
          responseTime: responseTime / absoluteUrls.length,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          searchEngine: 'bing',
          contentType: url.includes('sitemap') ? 'sitemap' : url.includes('rss') || url.includes('feed') ? 'feed' : 'page',
        });
      }
    } catch (trackingError) {
      console.error('Failed to track IndexNow bulk error:', trackingError);
    }
    
    return false;
  }
}

/**
 * Notify IndexNow of new research article
 */
export async function notifyNewResearchArticle(slug: string): Promise<void> {
  await submitUrlToIndexNow(`/research/${slug}`);
  
  // Also notify research index page for potential re-crawl
  await submitUrlToIndexNow('/research');
}

/**
 * Notify IndexNow of assessment completion (results page)
 */
export async function notifyAssessmentResult(resultId: string): Promise<void> {
  await submitUrlToIndexNow(`/results/${resultId}`);
}

/**
 * Notify IndexNow of Matrix data updates
 */
export async function notifyMatrixUpdate(): Promise<void> {
  const matrixUrls = [
    '/matrix',
    '/matrix/technique', // Technique listing pages will be re-crawled
  ];
  
  await submitUrlsToIndexNow(matrixUrls);
}

/**
 * Notify IndexNow of content updates (playbooks, glossary, etc.)
 */
export async function notifyContentUpdate(paths: string[]): Promise<void> {
  await submitUrlsToIndexNow(paths);
}

/**
 * Perform bulk IndexNow submission for site-wide updates
 */
export async function performBulkIndexNowSubmission(): Promise<void> {
  const coreUrls = [
    '/',
    '/assessment',
    '/benchmarks', 
    '/matrix',
    '/research',
    '/playbooks',
    '/glossary',
    '/about',
    '/contact'
  ];
  
  await submitUrlsToIndexNow(coreUrls);
  console.log('IndexNow: Completed bulk submission of core pages');
}

/**
 * Submit sitemap URLs to IndexNow (for major updates)
 */
export async function submitSitemapToIndexNow(): Promise<void> {
  const sitemapUrls = [
    '/sitemap.xml',
    '/glossary-sitemap.xml',
    '/matrix-sitemap.xml',
    '/research/feed.xml',
    '/rss.xml'
  ];
  
  await submitUrlsToIndexNow(sitemapUrls);
  console.log('IndexNow: Submitted sitemaps for re-indexing');
}