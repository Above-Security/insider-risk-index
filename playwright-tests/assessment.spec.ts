import { test, expect } from '@playwright/test';

test.describe('Assessment Flow', () => {
  test('should complete full assessment workflow', async ({ page }) => {
    // Navigate to assessment page
    await page.goto('/assessment');

    // Fill out organization form
    await page.fill('input[name="organizationName"]', 'Test Organization');
    await page.selectOption('select[name="industry"]', 'technology');
    await page.selectOption('select[name="employeeCount"]', '201-1000');
    await page.fill('input[name="contactEmail"]', 'test@example.com');
    
    // Start assessment
    await page.click('button[type="submit"]');

    // Wait for first question to load
    await expect(page.locator('h1')).toContainText('Assessment for Test Organization');

    // Answer all questions with middle values
    for (let i = 0; i < 20; i++) {
      // Select a middle option (usually value 50)
      await page.click('input[type="radio"][value="50"]');
      
      // Click next (or complete on last question)
      const isLast = i === 19;
      const buttonText = isLast ? 'Complete Assessment' : 'Next';
      await page.click(`button:has-text("${buttonText}")`);
      
      if (!isLast) {
        // Wait for next question to load
        await page.waitForTimeout(500);
      }
    }

    // Should redirect to results page
    await expect(page).toHaveURL(/\/assessment\/results/);
    
    // Verify results page elements
    await expect(page.locator('h1')).toContainText('Assessment Results');
    await expect(page.locator('text=Your organization achieved')).toBeVisible();
    
    // Check for score display
    await expect(page.locator('[data-testid="total-score"]')).toBeVisible();
    
    // Check for pillar breakdown
    await expect(page.locator('[data-testid="pillar-breakdown"]')).toBeVisible();
    
    // Check for recommendations
    await expect(page.locator('text=Priority Recommendations')).toBeVisible();
  });

  test('should validate organization form', async ({ page }) => {
    await page.goto('/assessment');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Organization name is required')).toBeVisible();
    await expect(page.locator('text=Please select an industry')).toBeVisible();
  });

  test('should show progress indicator', async ({ page }) => {
    await page.goto('/assessment');

    // Fill out organization form
    await page.fill('input[name="organizationName"]', 'Test Organization');
    await page.selectOption('select[name="industry"]', 'technology');
    await page.selectOption('select[name="employeeCount"]', '201-1000');
    await page.click('button[type="submit"]');

    // Check progress indicator
    await expect(page.locator('text=Question 1 of 20')).toBeVisible();
    
    // Answer first question and go to next
    await page.click('input[type="radio"][value="50"]');
    await page.click('button:has-text("Next")');
    
    // Progress should update
    await expect(page.locator('text=Question 2 of 20')).toBeVisible();
  });

  test('should allow navigation between questions', async ({ page }) => {
    await page.goto('/assessment');

    // Fill out organization form and start assessment
    await page.fill('input[name="organizationName"]', 'Test Organization');
    await page.selectOption('select[name="industry"]', 'technology');
    await page.selectOption('select[name="employeeCount"]', '201-1000');
    await page.click('button[type="submit"]');

    // Answer first question
    await page.click('input[type="radio"][value="75"]');
    await page.click('button:has-text("Next")');

    // Go to second question
    await expect(page.locator('text=Question 2 of 20')).toBeVisible();
    
    // Go back to first question
    await page.click('button:has-text("Previous")');
    await expect(page.locator('text=Question 1 of 20')).toBeVisible();
    
    // Previous answer should be preserved
    await expect(page.locator('input[type="radio"][value="75"]')).toBeChecked();
  });
});