import { test, expect } from '@playwright/test';

const routes = [
  // Static routes
  '/',
  '/about',
  '/contact',
  '/assessment',
  '/benchmarks',
  '/matrix',
  '/playbooks',
  '/glossary',
  '/research',
  
  // Playbook routes
  '/playbooks/visibility-pillar-implementation',
  '/playbooks/prevention-coaching-program', 
  '/playbooks/investigation-evidence-framework',
  '/playbooks/identity-saas-framework',
  '/playbooks/phishing-resilience-program',
  
  // Sample assessment result (will be dynamic but testing structure)
  '/results/test-id',
  
  // Matrix technique (testing with a common technique ID)
  '/matrix/technique/T1001',
  
  // Sample glossary term
  '/glossary/insider-threat'
];

test.describe('Page Rendering Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up error collection
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(`Console Error: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', (error) => {
      errors.push(`Page Error: ${error.message}`);
    });
    
    // Store errors in page context for access in tests
    await page.addInitScript(() => {
      (window as any).testErrors = [];
    });
  });

  routes.forEach((route) => {
    test(`should render ${route} without errors`, async ({ page }) => {
      console.log(`Testing route: ${route}`);
      
      const response = await page.goto(`http://localhost:3000${route}`);
      
      // Check if page loaded successfully
      expect(response?.status()).toBeLessThan(400);
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      // Check for basic page structure
      const bodyContent = await page.locator('body').textContent();
      expect(bodyContent).toBeTruthy();
      expect(bodyContent?.length).toBeGreaterThan(10);
      
      // Check for Next.js hydration errors
      const nextErrors = await page.locator('[data-nextjs-dialog]').count();
      expect(nextErrors).toBe(0);
      
      // Take a screenshot for visual verification
      await page.screenshot({ 
        path: `test-results/${route.replace(/\//g, '_').replace(/^_/, '') || 'home'}.png`,
        fullPage: true 
      });
      
      console.log(`✓ ${route} rendered successfully`);
    });
  });
  
  test('should test responsive design on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 } // iPhone SE dimensions
    });
    const page = await context.newPage();
    
    const criticalRoutes = ['/', '/assessment', '/results/test-id', '/matrix'];
    
    for (const route of criticalRoutes) {
      await page.goto(`http://localhost:3000${route}`);
      await page.waitForLoadState('networkidle');
      
      // Check if content is visible on mobile
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Take mobile screenshot
      await page.screenshot({ 
        path: `test-results/mobile_${route.replace(/\//g, '_').replace(/^_/, '') || 'home'}.png`,
        fullPage: true 
      });
    }
    
    await context.close();
  });
  
  test('should test assessment flow', async ({ page }) => {
    await page.goto('http://localhost:3000/assessment');
    await page.waitForLoadState('networkidle');
    
    // Check if assessment form loads
    const assessmentForm = page.locator('form');
    await expect(assessmentForm).toBeVisible();
    
    // Try to fill out organization info if present
    const industrySelect = page.locator('select[name="industry"]');
    if (await industrySelect.count() > 0) {
      await industrySelect.selectOption('TECHNOLOGY');
    }
    
    const sizeSelect = page.locator('select[name="size"]');
    if (await sizeSelect.count() > 0) {
      await sizeSelect.selectOption('MEDIUM');
    }
    
    // Look for start button or next button
    const startButton = page.locator('button:has-text("Start"), button:has-text("Next"), button:has-text("Begin")');
    if (await startButton.count() > 0) {
      await startButton.first().click();
      await page.waitForTimeout(2000);
      
      // Take screenshot of assessment questions
      await page.screenshot({ 
        path: 'test-results/assessment_questions.png',
        fullPage: true 
      });
    }
  });
  
  test('should test Matrix visualization', async ({ page }) => {
    await page.goto('http://localhost:3000/matrix');
    await page.waitForLoadState('networkidle');
    
    // Wait for Matrix data to load (it might take time)
    await page.waitForTimeout(5000);
    
    // Check if Matrix content is present
    const matrixContent = page.locator('main');
    await expect(matrixContent).toBeVisible();
    
    // Check for tabs or visualization elements
    const tabs = page.locator('[role="tab"], .tab, button:has-text("Heatmap"), button:has-text("Network")');
    const tabCount = await tabs.count();
    
    console.log(`Found ${tabCount} Matrix tabs/buttons`);
    
    // Try clicking on different tabs if they exist
    if (tabCount > 0) {
      for (let i = 0; i < Math.min(tabCount, 3); i++) {
        try {
          await tabs.nth(i).click();
          await page.waitForTimeout(1000);
          await page.screenshot({ 
            path: `test-results/matrix_tab_${i}.png`,
            fullPage: true 
          });
        } catch (error) {
          console.log(`Could not click tab ${i}: ${error}`);
        }
      }
    }
  });
  
  test('should test playbooks navigation', async ({ page }) => {
    await page.goto('http://localhost:3000/playbooks');
    await page.waitForLoadState('networkidle');
    
    // Check for playbook links
    const playbookLinks = page.locator('a[href*="/playbooks/"]');
    const linkCount = await playbookLinks.count();
    
    console.log(`Found ${linkCount} playbook links`);
    
    if (linkCount > 0) {
      // Click on first playbook
      const firstPlaybook = playbookLinks.first();
      const href = await firstPlaybook.getAttribute('href');
      
      if (href) {
        await firstPlaybook.click();
        await page.waitForLoadState('networkidle');
        
        // Check if playbook content loaded
        const content = page.locator('main, article, .content');
        await expect(content).toBeVisible();
        
        await page.screenshot({ 
          path: 'test-results/playbook_detail.png',
          fullPage: true 
        });
      }
    }
  });
});