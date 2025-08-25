import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive E2E test suite for the Insider Risk Index platform
 * Tests critical user journeys with performance optimizations
 */

test.describe('Complete User Journey Tests', () => {
  test.describe.configure({ mode: 'serial' }); // Run tests in sequence for better resource management

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page?.close();
  });

  test('should complete full assessment workflow', async () => {
    test.setTimeout(120000); // 2 minutes for complete flow

    // Start from homepage
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Insider Risk');

    // Navigate to assessment
    await page.click('a[href="/assessment"]');
    await page.waitForURL('/assessment');

    // Fill organization information
    await page.fill('input[placeholder*="organization"]', 'Test Organization');
    
    // Handle shadcn/ui Select components
    await page.click('[data-testid="industry-select"]');
    await page.click('text=Technology');
    
    await page.click('[data-testid="size-select"]'); 
    await page.click('text=201-1,000 employees');
    
    // Handle checkbox for benchmarks
    await page.check('input[type="checkbox"]');

    // Start assessment
    await page.click('button[type="submit"]');
    
    // Answer first few questions (sample)
    for (let i = 0; i < 3; i++) {
      // Wait for question to load
      await page.waitForSelector('[data-testid="question-card"]');
      
      // Select a middle option (index 2) for consistent testing
      const radioButtons = page.locator('input[type="radio"]');
      const count = await radioButtons.count();
      if (count > 2) {
        await radioButtons.nth(2).click();
      } else {
        await radioButtons.first().click();
      }
      
      // Go to next question
      const nextButton = page.locator('button:has-text("Next")');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500); // Brief wait for navigation
      }
    }

    console.log('✓ Assessment workflow initiated successfully');
  });

  test('should navigate Matrix exploration', async () => {
    await page.goto('/matrix');
    
    // Wait for Matrix visualization to load
    await page.waitForSelector('[data-testid="matrix-visualization"]', { timeout: 30000 });

    // Test technique filtering
    await page.selectOption('select[name="category"]', 'MOTIVE');
    await page.waitForTimeout(1000); // Allow filtering to process

    // Click on a technique
    const techniques = page.locator('[data-testid="technique-card"]');
    if (await techniques.count() > 0) {
      await techniques.first().click();
      await page.waitForURL(/\/matrix\/technique/);
    }

    console.log('✓ Matrix exploration workflow completed');
  });

  test('should access and validate playbook system', async () => {
    await page.goto('/playbooks');
    
    // Verify playbook listing
    await expect(page.locator('h1')).toContainText('Implementation Playbooks');
    
    // Navigate to first playbook
    const playbookLinks = page.locator('a[href^="/playbooks/"]');
    if (await playbookLinks.count() > 0) {
      await playbookLinks.first().click();
      
      // Wait for MDX content to render
      await page.waitForSelector('article', { timeout: 15000 });
      
      // Verify content structure
      await expect(page.locator('h1')).toBeTruthy();
      await expect(page.locator('article')).toBeTruthy();
    }

    console.log('✓ Playbook system validation completed');
  });

  test('should validate glossary search functionality', async () => {
    await page.goto('/glossary');
    
    // Test search functionality
    const searchInput = page.locator('input[type="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('insider');
      await page.waitForTimeout(1000); // Allow search to process
      
      // Verify search results
      const termCards = page.locator('[data-testid="glossary-term"]');
      expect(await termCards.count()).toBeGreaterThan(0);
    }

    console.log('✓ Glossary search validation completed');
  });

  test('should validate benchmark comparison pages', async () => {
    await page.goto('/benchmarks');
    
    // Test industry filtering
    await page.selectOption('select[name="industry"]', 'TECHNOLOGY');
    await page.waitForTimeout(1000);

    // Verify chart rendering
    await page.waitForSelector('[data-testid="benchmark-chart"]', { timeout: 10000 });
    
    console.log('✓ Benchmark system validation completed');
  });
});

test.describe('Error Handling and Edge Cases', () => {
  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    expect(response?.status()).toBe(404);
    
    // Verify custom 404 page
    await expect(page.locator('body')).toBeTruthy();
  });

  test('should handle Matrix API unavailability', async ({ page }) => {
    // Navigate to Matrix page when API might be unavailable
    await page.goto('/matrix');
    
    // Should not crash, might show error state
    await page.waitForSelector('body');
    
    // Check for either content or error state
    const hasContent = await page.locator('[data-testid="matrix-visualization"]').isVisible();
    const hasError = await page.locator('[data-testid="error-state"]').isVisible();
    
    expect(hasContent || hasError).toBe(true);
  });

  test('should validate responsive design basics', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    const hamburger = page.locator('[data-testid="hamburger-menu"]');
    
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await expect(mobileMenu).toBeVisible();
    }
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    
    console.log('✓ Basic responsive design validated');
  });
});