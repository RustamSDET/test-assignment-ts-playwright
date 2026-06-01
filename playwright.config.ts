import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 60000, 
  expect: {
    timeout: 15000, 
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'], 
    ['allure-playwright', { detail: true, outputFolder: 'allure-results' }]
  ],

  use: {
    testIdAttribute: 'data-test-id',
    
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'MainSite',
      testMatch: /.*signup-checkout\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://freevpnplanet.com',
      },
    },
    {
      name: 'PurchaseRU',
      testMatch: /.*ru-subscription-purchase\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://planetconfig.com',
      },
    },
    {
      name: 'PurchaseEN',
      testMatch: /.*en-subscription-purchase\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://personal.freevpnplanet.com',
      },
    },
  ],
});