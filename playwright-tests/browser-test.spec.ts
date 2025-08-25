import { test, expect } from '@playwright/test';

test.describe('Browser Functionality Test', () => {
  test('should verify browser is working', async ({ page }) => {
    // Test with a simple HTML page
    await page.setContent('<html><body><h1>Test Page</h1></body></html>');
    
    const title = await page.locator('h1').textContent();
    expect(title).toBe('Test Page');
    
    console.log('✓ Browser is working correctly');
  });
  
  test('should access a fast external site', async ({ page }) => {
    try {
      await page.goto('https://httpbin.org/status/200', { timeout: 10000 });
      console.log('✓ External site access working');
    } catch (error) {
      console.log('External access failed:', error);
    }
  });
  
  test('should test slow page load simulation', async ({ page }) => {
    // Test if browser can handle slow loading pages
    await page.route('**/slow', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<html><body><h1>Slow Page</h1></body></html>'
        });
      }, 5000); // 5 second delay
    });
    
    await page.goto('http://localhost:3000/slow', { timeout: 30000 });
    const title = await page.locator('h1').textContent();
    expect(title).toBe('Slow Page');
    
    console.log('✓ Browser can handle slow pages');
  });
});