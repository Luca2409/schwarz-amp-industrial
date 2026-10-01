import { defineConfig, devices } from '@playwright/test';
import { base } from './deploy.config.mjs';

const port = 4399;

/**
 * Site under test, with trailing slash. Tests use URLs relative to it (e.g. `de/kontakt/`).
 *
 * - `E2E_BASE_URL` set: an already deployed site, e.g.
 *   `E2E_BASE_URL=https://luca2409.github.io/schwarz-amp-industrial/ npm run test:e2e`.
 *   No local server is started.
 * - Otherwise: a local production build, served under the base path from deploy.config.mjs.
 */
const externalUrl = process.env.E2E_BASE_URL;
const baseURL = externalUrl
  ? externalUrl.replace(/\/?$/, '/')
  : `http://localhost:${port}${base.replace(/\/$/, '')}/`;

/**
 * End-to-end tests. Locally they run against a production build in `dist-e2e/` (separate
 * from `dist/`, which gets deployed) with a fake form endpoint. The tests intercept the
 * form service and Google in every environment, so nothing external is contacted.
 * Runs in the locally installed Google Chrome.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  // More parallel Chrome instances caused startup timeouts.
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: externalUrl
    ? undefined
    : {
        command: `astro build --outDir dist-e2e && astro preview --outDir dist-e2e --port ${port}`,
        url: `${baseURL}de/`,
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          PUBLIC_CONTACT_FORM_ENDPOINT: 'https://forms.example.test/submit',
          // The test build is never deployed, so placeholders don't block it.
          ALLOW_PLACEHOLDERS: 'true',
        },
      },
});
