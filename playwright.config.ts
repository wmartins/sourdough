import { defineConfig } from '@playwright/test';

const port = 4173;
const origin = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `${origin}/sourdough/`,
    permissions: ['clipboard-read', 'clipboard-write'],
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npm run preview:pages -- --host 127.0.0.1 --port ${port}`,
    url: `${origin}/sourdough/`,
    reuseExistingServer: !process.env.CI,
  },
});
