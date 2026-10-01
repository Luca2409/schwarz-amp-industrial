import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { createSitemapSerializer } from './src/i18n/sitemap.ts';

const site = 'https://luca2409.github.io';
const base = '/schwarz-amp-industrial';

export default defineConfig({
    site,
    base,
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
        sitemap({
            // The root URL only redirects to a language.
            filter: (page) => page !== new URL(`${base}/`, site).href,
            serialize: createSitemapSerializer(new URL('./dist/', import.meta.url), site, base),
        }),
    ],
});
