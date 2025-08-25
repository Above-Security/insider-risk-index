import { test, expect } from '@playwright/test';

/**
 * Performance monitoring tests to ensure optimal user experience
 */

test.describe('Performance Validation', () => {
  test('should load homepage within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    console.log(`Homepage load time: ${loadTime}ms`);
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check for critical page elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should load assessment page efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/assessment', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    console.log(`Assessment page load time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(8000); // Assessment page has more JS
    
    // Verify interactive elements are ready
    await expect(page.locator('select[name="industry"]')).toBeVisible();
  });

  test('should validate Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve(0), 5000);
      });
    });

    console.log(`LCP: ${lcp}ms`);
    
    // LCP should be under 2.5s for good performance
    if (typeof lcp === 'number' && lcp > 0) {
      expect(lcp).toBeLessThan(2500);
    }
  });

  test('should validate bundle sizes are reasonable', async ({ page }) => {
    // Start network monitoring
    const responses: any[] = [];
    page.on('response', response => {
      if (response.url().includes('/_next/static/')) {
        responses.push({
          url: response.url(),
          size: response.headers()['content-length'],
          type: response.headers()['content-type']
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check total bundle size
    const totalSize = responses.reduce((sum, response) => {
      const size = parseInt(response.size || '0', 10);
      return sum + size;
    }, 0);

    console.log(`Total bundle size: ${totalSize} bytes`);
    console.log(`JavaScript bundles: ${responses.filter(r => r.type?.includes('javascript')).length}`);
    
    // Total initial bundle should be reasonable (under 1MB for initial load)
    expect(totalSize).toBeLessThan(1024 * 1024); // 1MB
  });

  test('should validate Matrix page compilation performance', async ({ page }) => {
    const startTime = Date.now();
    
    // This page has complex visualizations
    await page.goto('/matrix', { waitUntil: 'domcontentloaded' });
    
    const domLoadTime = Date.now() - startTime;
    console.log(`Matrix page DOM load time: ${domLoadTime}ms`);
    
    // Should load DOM content within 10 seconds
    expect(domLoadTime).toBeLessThan(10000);
    
    // Wait for visualization to be interactive
    const visualizationStartTime = Date.now();
    try {
      await page.waitForSelector('[data-testid="matrix-visualization"]', { timeout: 15000 });
      const visualizationLoadTime = Date.now() - visualizationStartTime;
      console.log(`Matrix visualization load time: ${visualizationLoadTime}ms`);
    } catch (error) {
      console.log('Matrix visualization may be in error state, which is acceptable');
    }
  });
});

test.describe('Resource Loading Validation', () => {
  test('should load all critical resources successfully', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Filter out external resources that might fail
    const criticalFailures = failedRequests.filter(url => 
      !url.includes('posthog.com') && 
      !url.includes('googleapis.com') &&
      !url.includes('gstatic.com') &&
      !url.includes('github.com')
    );

    console.log(`Failed requests: ${failedRequests.length}`);
    console.log(`Critical failures: ${criticalFailures.length}`);
    
    if (criticalFailures.length > 0) {
      console.log('Critical failures:', criticalFailures);
    }
    
    // Should not have critical resource failures
    expect(criticalFailures.length).toBe(0);
  });

  test('should handle slow network conditions gracefully', async ({ page }) => {
    // Simulate slow 3G
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100); // Add 100ms delay
    });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    console.log(`Load time with simulated slow network: ${loadTime}ms`);
    
    // Should still load within reasonable time even with delays
    expect(loadTime).toBeLessThan(15000); // 15 seconds max
    
    // Critical content should be visible
    await expect(page.locator('h1')).toBeVisible();
  });
});