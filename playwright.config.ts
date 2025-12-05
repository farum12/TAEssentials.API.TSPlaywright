import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';
import { format } from 'date-fns';

const environment = process.env.ENV || 'local';
dotenv.config({ path: path.resolve(__dirname, `envProfiles/${environment}.env`) });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  workers: 4,
  reporter: [
    ['html', { outputFolder: `test-reports/${format(new Date(), 'yyyy-MM-dd HH-mm')}-${environment}` }],
    ['allure-playwright', { 
      resultsDir: `allure-results/${format(new Date(), 'yyyy-MM-dd HH-mm')}-${environment}`,
      environmentInfo: {
        Environment: environment,
        Framework: 'Playwright',
        Language: 'TypeScript'
      }
    }]
  ],
  use: {
    headless: true,
    screenshot: 'off',
    trace: 'retain-on-failure',
  },
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  projects: [
    {
      name: 'API Tests',
      testDir: './tests/api',
    },
  ],
});
