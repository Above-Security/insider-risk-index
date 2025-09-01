'use server';

import { submitUrlToIndexNow, submitUrlsToIndexNow, notifyContentUpdate } from '@/lib/indexnow';
import { bingSubmission } from '@/lib/bing-submission';
import { revalidatePath } from 'next/cache';

/**
 * Server action to notify IndexNow of URL changes
 */
export async function notifyIndexNowAction(urls: string | string[]) {
  try {
    if (process.env.INDEXNOW_ENABLED !== 'true') {
      return { success: false, error: 'IndexNow disabled' };
    }

    if (typeof urls === 'string') {
      const success = await submitUrlToIndexNow(urls);
      return { success, url: urls };
    } else if (Array.isArray(urls)) {
      const success = await submitUrlsToIndexNow(urls);
      return { success, urls: urls.length };
    }

    return { success: false, error: 'Invalid URL format' };
  } catch (error) {
    console.error('IndexNow server action error:', error);
    return { success: false, error: 'Failed to notify IndexNow' };
  }
}

/**
 * Server action to notify IndexNow when new research is published
 */
export async function notifyNewContentAction(contentType: 'research' | 'playbook' | 'matrix', slug?: string) {
  try {
    if (process.env.INDEXNOW_ENABLED !== 'true') {
      return { success: false, error: 'IndexNow disabled' };
    }

    const urls: string[] = [];

    switch (contentType) {
      case 'research':
        if (slug) {
          urls.push(`/research/${slug}`);
          urls.push('/research'); // Re-index listing page
          urls.push('/'); // Re-index homepage with new research
        }
        break;
      case 'playbook':
        if (slug) {
          urls.push(`/playbooks/${slug}`);
          urls.push('/playbooks'); // Re-index listing page
        }
        break;
      case 'matrix':
        urls.push('/matrix');
        urls.push('/'); // Re-index homepage
        break;
    }

    if (urls.length > 0) {
      const success = await submitUrlsToIndexNow(urls);
      
      // Revalidate Next.js cache for these paths
      urls.forEach(url => {
        try {
          revalidatePath(url);
        } catch (e) {
          console.warn(`Failed to revalidate ${url}:`, e);
        }
      });

      return { success, urls: urls.length };
    }

    return { success: false, error: 'No URLs to submit' };
  } catch (error) {
    console.error('Content notification error:', error);
    return { success: false, error: 'Failed to notify content update' };
  }
}

/**
 * Server action for bulk IndexNow submission (admin use)
 */
export async function bulkIndexNowSubmissionAction() {
  try {
    if (process.env.INDEXNOW_ENABLED !== 'true') {
      return { success: false, error: 'IndexNow disabled' };
    }

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

    const success = await submitUrlsToIndexNow(coreUrls);
    
    // Revalidate all core paths
    coreUrls.forEach(url => {
      try {
        revalidatePath(url);
      } catch (e) {
        console.warn(`Failed to revalidate ${url}:`, e);
      }
    });

    return { success, urls: coreUrls.length };
  } catch (error) {
    console.error('Bulk IndexNow submission error:', error);
    return { success: false, error: 'Failed to perform bulk submission' };
  }
}

/**
 * Comprehensive URL submission to both Bing and IndexNow
 */
export async function submitUrlsToAllServices(
  urls: string[],
  options: {
    type?: 'new' | 'updated' | 'core';
    priority?: 'high' | 'normal' | 'low';
  } = {}
) {
  try {
    const { type = 'updated', priority = 'normal' } = options;
    const results: {
      indexnow: boolean;
      bing: boolean;
      urls: number;
    } = {
      indexnow: false,
      bing: false,
      urls: urls.length
    };

    // Submit to IndexNow
    if (process.env.INDEXNOW_ENABLED === 'true') {
      results.indexnow = await submitUrlsToIndexNow(urls);
    }

    // Submit to Bing URL Submission API
    if (process.env.BING_WEBMASTER_API_KEY) {
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
      }
    }

    // Revalidate Next.js cache
    urls.forEach(url => {
      try {
        const path = new URL(url).pathname;
        revalidatePath(path);
      } catch (e) {
        console.warn(`Failed to revalidate ${url}:`, e);
      }
    });

    console.log('Comprehensive URL submission completed:', results);
    return results;

  } catch (error) {
    console.error('Comprehensive URL submission error:', error);
    return { 
      indexnow: false, 
      bing: false, 
      urls: urls.length, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}