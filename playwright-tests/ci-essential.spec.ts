import { test, expect } from '@playwright/test';

/**
 * Essential CI tests - minimal set for fast validation
 * Only critical functionality to prevent 30+ minute CI runs
 */

test.describe('CI Essential Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    test.setTimeout(60000); // 1 minute max
    
    const response = await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    console.log('✓ Homepage loaded successfully');
  });

  test('should load assessment page', async ({ page }) => {
    test.setTimeout(60000);
    
    const response = await page.goto('/assessment', {
      waitUntil: 'domcontentloaded', 
      timeout: 30000
    });
    
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✓ Assessment page loaded successfully');
  });

  test('should load Matrix page without crashing', async ({ page }) => {
    test.setTimeout(60000);
    
    const response = await page.goto('/matrix', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✓ Matrix page loaded successfully');
  });

  test('should load playbooks page', async ({ page }) => {
    test.setTimeout(60000);
    
    const response = await page.goto('/playbooks', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toBeVisible();
    
    console.log('✓ Playbooks page loaded successfully');
  });

  test('should handle 404 gracefully', async ({ page }) => {
    test.setTimeout(30000);
    
    const response = await page.goto('/non-existent-page', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    expect(response?.status()).toBe(404);
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✓ 404 handling validated');
  });
});

test.describe('API Endpoints Validation', () => {
  test('should validate critical API endpoints', async ({ request }) => {
    test.setTimeout(30000);

    // Test sitemap
    const sitemapResponse = await request.get('/sitemap.xml');
    expect(sitemapResponse.status()).toBe(200);
    
    // Test robots.txt
    const robotsResponse = await request.get('/robots.txt');
    expect(robotsResponse.status()).toBe(200);
    
    console.log('✓ Critical API endpoints validated');
  });
});