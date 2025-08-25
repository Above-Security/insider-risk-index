import { test, expect } from '@playwright/test';

test.describe('Simple Page Access Tests', () => {
  test('should access homepage without crashing', async ({ page }) => {
    // Set longer timeout
    test.setTimeout(60000);
    
    try {
      console.log('Testing homepage access...');
      
      // Navigate with longer timeout
      const response = await page.goto('http://localhost:3000/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      console.log(`Homepage response status: ${response?.status()}`);
      
      // Just check if we get a response
      expect(response?.status()).toBeLessThan(400);
      
      // Wait for basic DOM to load
      await page.waitForSelector('body', { timeout: 10000 });
      
      // Take a screenshot
      await page.screenshot({ 
        path: 'test-results/homepage-simple.png',
        fullPage: false
      });
      
      console.log('✓ Homepage loaded successfully');
    } catch (error) {
      console.error('Homepage failed to load:', error);
      throw error;
    }
  });
  
  test('should access about page', async ({ page }) => {
    test.setTimeout(60000);
    
    try {
      console.log('Testing about page access...');
      
      const response = await page.goto('http://localhost:3000/about', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      console.log(`About page response status: ${response?.status()}`);
      expect(response?.status()).toBeLessThan(400);
      
      await page.waitForSelector('body', { timeout: 10000 });
      
      await page.screenshot({ 
        path: 'test-results/about-simple.png',
        fullPage: false
      });
      
      console.log('✓ About page loaded successfully');
    } catch (error) {
      console.error('About page failed to load:', error);
      throw error;
    }
  });
  
  test('should access assessment page', async ({ page }) => {
    test.setTimeout(60000);
    
    try {
      console.log('Testing assessment page access...');
      
      const response = await page.goto('http://localhost:3000/assessment', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      console.log(`Assessment page response status: ${response?.status()}`);
      expect(response?.status()).toBeLessThan(400);
      
      await page.waitForSelector('body', { timeout: 10000 });
      
      await page.screenshot({ 
        path: 'test-results/assessment-simple.png',
        fullPage: false
      });
      
      console.log('✓ Assessment page loaded successfully');
    } catch (error) {
      console.error('Assessment page failed to load:', error);
      throw error;
    }
  });

  test('should access playbook page', async ({ page }) => {
    test.setTimeout(60000);
    
    try {
      console.log('Testing playbook page access...');
      
      const response = await page.goto('http://localhost:3000/playbooks/visibility-pillar-implementation', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      console.log(`Playbook page response status: ${response?.status()}`);
      expect(response?.status()).toBeLessThan(400);
      
      await page.waitForSelector('body', { timeout: 10000 });
      
      await page.screenshot({ 
        path: 'test-results/playbook-simple.png',
        fullPage: false
      });
      
      console.log('✓ Playbook page loaded successfully');
    } catch (error) {
      console.error('Playbook page failed to load:', error);
      throw error;
    }
  });
});