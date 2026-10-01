import type { APIRoute } from 'astro';

/**
 * Generates `robots.txt`, allowing all crawlers and pointing to the sitemap. In a prototype
 * build (`PUBLIC_PROTOTYPE=true`) it disallows everything instead.
 * Crawlers only read it at the domain root, so it takes effect once the site
 * runs on its own domain without `base`.
 */
export const GET: APIRoute = ({ site }) => {
  if (import.meta.env.PUBLIC_PROTOTYPE === 'true') {
    return new Response('User-agent: *\nDisallow: /\n');
  }
  const sitemapUrl = new URL(`${import.meta.env.BASE_URL.replace(/\/$/, '')}/sitemap-index.xml`, site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`);
};
