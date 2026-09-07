import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const base = '/schwarz-amp-industrial';

export default defineConfig({
    site: 'https://luca2409.github.io',
    base,
    integrations: [
        sitemap({
            filter: (page) => {
                const pathname = new URL(page).pathname;
                return pathname !== `${base}/` && !/\/404\/?$/.test(pathname);
            }
        })
    ],
    i18n: {
        locales: ["de", "en"],
        defaultLocale: "de",
        routing: {
            prefixDefaultLocale: true,
            redirectToDefaultLocale: true
        }
    }
});
