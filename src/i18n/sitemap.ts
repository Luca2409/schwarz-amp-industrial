import fs from 'node:fs';
import path from 'node:path';
import type { SitemapItem } from '@astrojs/sitemap';

type Link = NonNullable<SitemapItem['links']>[number];

const hreflangLink = /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g;
const updatedTime = /<meta property="og:updated_time" content="([^"]+)"/;

/**
 * Creates the `serialize` hook for `@astrojs/sitemap`.
 *
 * For each sitemap URL it reads the built HTML page and copies the hreflang links and
 * `og:updated_time` that `BaseLayout.astro` rendered into its `<head>` into the sitemap
 * entry (as `xhtml:link` alternates and `lastmod`). This keeps the sitemap identical to
 * the page headers. The integration's built-in `i18n` option can't be used, because it
 * only pairs pages with identical paths, which doesn't work with localized slugs.
 *
 * Runs in `astro.config.mjs`, so it must not import Astro virtual modules.
 *
 * @param outDir Build output directory (`dist/`), as a file URL ending in `/`.
 * @param site Value of `site` in the Astro config, e.g. `https://luca2409.github.io`.
 * @param base Value of `base` in the Astro config, e.g. `/schwarz-amp-industrial`.
 * @returns A serializer that enriches each sitemap item; items without a built page are returned unchanged.
 */
export function createSitemapSerializer(outDir: URL, site: string, base: string) {
  const sitePrefix = new URL(base.replace(/\/?$/, '/'), site).href;

  return (item: SitemapItem): SitemapItem => {
    const relativePath = item.url.startsWith(sitePrefix) ? item.url.slice(sitePrefix.length) : '';
    const file = path.join(new URL(relativePath, outDir).pathname, 'index.html');
    if (!fs.existsSync(file)) return item;

    const html = fs.readFileSync(file, 'utf-8');
    const links: Link[] = [...html.matchAll(hreflangLink)].map(([, lang, url]) => ({ lang, url }));
    const lastmod = html.match(updatedTime)?.[1];
    return {
      ...item,
      ...(links.length > 0 && { links }),
      ...(lastmod && { lastmod }),
    };
  };
}
