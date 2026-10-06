import { defineConfig, devices } from '@playwright/test';

const ci = Boolean(process.env.CI);

/**
 * End to end against production builds of both apps. WebGL runs on SwiftShader, so it works on
 * machines without a GPU (CI included). PW_CHROMIUM_PATH points at a preinstalled Chromium when
 * the one Playwright expects is not there.
 */
export default defineConfig({
  testDir: 'e2e',
  forbidOnly: ci,
  retries: 0,
  reporter: ci ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
    launchOptions: {
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
      ...(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {}),
    },
  },
  webServer: [
    {
      command: 'yarn workspace @metaverso/api build && yarn workspace @metaverso/api start',
      url: 'http://localhost:3001/agents',
      reuseExistingServer: !ci,
      timeout: 120_000,
    },
    {
      command: 'yarn build && yarn start',
      url: 'http://localhost:3000',
      reuseExistingServer: !ci,
      timeout: 240_000,
    },
  ],
});
