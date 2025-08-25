import { defineConfig, devices } from '@playwright/test';

/**
 * Optimized Playwright configuration for fast E2E testing
 * Addresses long Next.js compilation times with performance optimizations
 */
export default defineConfig({
  testDir: './playwright-tests',
  
  /* Maximum time one test can run for - increased for slow compilation */
  timeout: 90 * 1000, // 90s to handle Next.js compilation delays

  expect: {
    /* Maximum time expect() should wait for the condition to be met */
    timeout: 15 * 1000, // 15s for element expectations
  },

  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Reduced workers for faster individual test execution */
  workers: process.env.CI ? 1 : 2, // Limit concurrent tests to reduce resource contention
  
  /* Optimized reporter configuration */
  reporter: process.env.CI ? [
    ['github'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ] : [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'on-failure' }]
  ],

  /* Optimized settings for faster execution */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test */
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    
    /* Screenshot only on failure to reduce overhead */
    screenshot: 'only-on-failure',
    
    /* Record video only on failure */
    video: 'retain-on-failure',

    /* Reduced timeouts for faster failure detection */
    navigationTimeout: 45 * 1000, // 45s for page navigation (was 30s)
    actionTimeout: 15 * 1000, // 15s for user actions (was 30s)
  },

  /* Optimized browser configuration - focus on Chromium for development speed */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Optimize Chrome for faster execution
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-extensions',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu', // Disable GPU for faster startup in CI
          ],
        },
      },
    },
    
    // Only test other browsers in CI or when explicitly needed
    ...(process.env.CI ? [
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit', 
        use: { ...devices['Desktop Safari'] },
      },
    ] : []),

    // Mobile testing only in CI
    ...(process.env.CI ? [
      {
        name: 'Mobile Chrome',
        use: { ...devices['Pixel 5'] },
      },
    ] : []),
  ],

  /* Optimized dev server configuration */
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000, // 3 minutes for initial Next.js compilation
    stdout: 'pipe',
    stderr: 'pipe',
  },
});