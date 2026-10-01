import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { createSitemapSerializer } from './src/i18n/sitemap.ts';
import { siteChecks } from './src/integrations/site-checks.ts';
import { base, site } from './deploy.config.mjs';

// Astro configuration. Documentation: README.md (deployment), docs/i18n-seo.md (i18n, sitemap),
// docs/quality-checks.md (siteChecks integration). Domain and base path: deploy.config.mjs.

export default defineConfig({
    site,
    base: base || undefined,
    trailingSlash: 'always',
    i18n: {
        locales: ['de', 'en'],
        defaultLocale: 'de',
        routing: {
            prefixDefaultLocale: true,
            // src/pages/index.astro redirects to the visitor's language instead.
            redirectToDefaultLocale: false
        }
    },
    integrations: [
        siteChecks(),
        sitemap({
            // The root URL only redirects to a language.
            filter: (page) => page !== new URL(`${base}/`, site).href,
            serialize: createSitemapSerializer(new URL('./dist/', import.meta.url), site, base),
        }),
    ],
});
