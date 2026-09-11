import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://luca2409.github.io',
    base: '/schwarz-amp-industrial',
    i18n: {
        locales: ['de', 'en'],
        defaultLocale: 'de',
        routing: {
            prefixDefaultLocale: true,
            redirectToDefaultLocale: true
        }
    }
});