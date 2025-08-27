'use server';

import { submitUrlToIndexNow, submitUrlsToIndexNow, notifyContentUpdate } from '@/lib/indexnow';
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