'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    const logMetric = (metric: any) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        // Web Vital metric collected
      }

      // Send to analytics
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('web_vital', {
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          navigationType: metric.navigationType,
        });
      }

      // Send to custom analytics endpoint if needed
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'web-vital',
            metric: metric.name,
            value: metric.value,
            timestamp: Date.now(),
            url: window.location.href,
          }),
        }).catch(() => {
          // Silently fail analytics
        });
      }
    };

    // Core Web Vitals
    onCLS(logMetric); // Cumulative Layout Shift
    onFID(logMetric); // First Input Delay
    onLCP(logMetric); // Largest Contentful Paint
    
    // Additional metrics
    onFCP(logMetric); // First Contentful Paint
    onTTFB(logMetric); // Time to First Byte
    onINP(logMetric); // Interaction to Next Paint

    // Custom performance marks
    if (typeof window !== 'undefined' && window.performance) {
      // Mark when app becomes interactive
      window.addEventListener('load', () => {
        performance.mark('app-interactive');
        
        // Measure time to interactive
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          const tti = performance.now() - navigationEntry.fetchStart;
          logMetric({
            name: 'TTI',
            value: tti,
            rating: tti < 3800 ? 'good' : tti < 7300 ? 'needs-improvement' : 'poor',
          });
        }
      });
    }
  }, []);

  return null;
}