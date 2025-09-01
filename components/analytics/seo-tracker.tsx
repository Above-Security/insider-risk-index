'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface SEOTrackerProps {
  /** Page title for tracking */
  title?: string;
  /** Page category (e.g., 'assessment', 'playbook', 'glossary') */
  category?: string;
  /** Whether this is a results page (private) */
  isPrivate?: boolean;
}

/**
 * Client-side SEO event tracking component
 * Automatically tracks page views and SEO metrics
 */
export function SEOTracker({ title, category, isPrivate = false }: SEOTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view with SEO context
    const trackPageView = () => {
      try {
        if (typeof window !== 'undefined' && (window as any).posthog) {
          (window as any).posthog.capture('page_view_seo', {
            page_path: pathname,
            page_title: title || document.title,
            page_category: category || 'general',
            is_private: isPrivate,
            referrer: document.referrer || null,
            timestamp: new Date().toISOString(),
          });
        }

        // Track potential SEO ranking improvements
        if (!isPrivate) {
          const params = new URLSearchParams(window.location.search);
          const utm_source = params.get('utm_source');
          const utm_medium = params.get('utm_medium');
          const utm_campaign = params.get('utm_campaign');
          const gclid = params.get('gclid'); // Google Ads
          const fbclid = params.get('fbclid'); // Facebook Ads

          // Track organic search traffic
          if (document.referrer) {
            const referrerDomain = new URL(document.referrer).hostname;
            const isSearchEngine = [
              'google.com',
              'bing.com',
              'yahoo.com',
              'duckduckgo.com',
              'yandex.com',
              'baidu.com',
            ].some(engine => referrerDomain.includes(engine));

            if (isSearchEngine && typeof window !== 'undefined' && (window as any).posthog) {
              (window as any).posthog.capture('organic_search_visit', {
                page_path: pathname,
                search_engine: referrerDomain,
                page_category: category,
                timestamp: new Date().toISOString(),
              });
            }
          }

          // Track campaign traffic
          if (utm_source && typeof window !== 'undefined' && (window as any).posthog) {
            (window as any).posthog.capture('campaign_visit', {
              page_path: pathname,
              utm_source,
              utm_medium,
              utm_campaign,
              gclid: gclid || null,
              fbclid: fbclid || null,
              timestamp: new Date().toISOString(),
            });
          }
        }

        // Track page engagement for SEO metrics
        const startTime = performance.now();
        let scrollDepth = 0;

        const handleScroll = () => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScrollDepth = Math.round((scrollTop / scrollHeight) * 100);
          
          if (currentScrollDepth > scrollDepth) {
            scrollDepth = currentScrollDepth;
          }
        };

        const handleBeforeUnload = () => {
          const timeOnPage = Math.round(performance.now() - startTime);
          
          if (typeof window !== 'undefined' && (window as any).posthog) {
            (window as any).posthog.capture('page_engagement', {
              page_path: pathname,
              time_on_page_ms: timeOnPage,
              scroll_depth_percent: scrollDepth,
              page_category: category,
              timestamp: new Date().toISOString(),
            });
          }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
          window.removeEventListener('scroll', handleScroll);
          window.removeEventListener('beforeunload', handleBeforeUnload);
          handleBeforeUnload(); // Track engagement when component unmounts
        };
      } catch (error) {
        console.error('SEO tracking error:', error);
      }
    };

    trackPageView();
  }, [pathname, title, category, isPrivate]);

  return null; // This component doesn't render anything
}

/**
 * Utility functions for manual SEO event tracking
 */
export const seoTracking = {
  /**
   * Track search query that led to the site
   */
  trackSearchQuery: (query: string, searchEngine: string, resultPosition?: number) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('search_query_tracked', {
        query,
        search_engine: searchEngine,
        result_position: resultPosition,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
      });
    }
  },

  /**
   * Track when user comes from a featured snippet
   */
  trackFeaturedSnippet: (searchEngine: string, snippetType: 'answer_box' | 'people_also_ask' | 'featured_snippet') => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('featured_snippet_click', {
        search_engine: searchEngine,
        snippet_type: snippetType,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
      });
    }
  },

  /**
   * Track content sharing for backlink potential
   */
  trackContentShare: (platform: string, contentType: string, contentId?: string) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('content_shared', {
        platform,
        content_type: contentType,
        content_id: contentId,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
      });
    }
  },

  /**
   * Track PDF downloads (potential ranking factor)
   */
  trackPDFDownload: (pdfType: string, source: string) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('pdf_downloaded', {
        pdf_type: pdfType,
        source,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
      });
    }
  },

  /**
   * Track assessment completions (high engagement signal)
   */
  trackAssessmentCompletion: (timeToComplete: number, completionRate: number) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('assessment_completed', {
        time_to_complete_ms: timeToComplete,
        completion_rate: completionRate,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
      });
    }
  },

  /**
   * Track external link clicks (UX signal)
   */
  trackExternalLink: (destination: string, linkText: string) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('external_link_clicked', {
        destination,
        link_text: linkText,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
      });
    }
  },

  /**
   * Track internal navigation (site structure understanding)
   */
  trackInternalNavigation: (fromPath: string, toPath: string, linkType: 'menu' | 'content' | 'footer' | 'breadcrumb') => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('internal_navigation', {
        from_path: fromPath,
        to_path: toPath,
        link_type: linkType,
        timestamp: new Date().toISOString(),
      });
    }
  },

  /**
   * Track 404 errors for SEO health monitoring
   */
  track404Error: (attemptedPath: string, referrer?: string) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('404_error', {
        attempted_path: attemptedPath,
        referrer: referrer || document.referrer,
        timestamp: new Date().toISOString(),
      });
    }
  },
};