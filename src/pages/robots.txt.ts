import type { APIRoute } from 'astro';

/**
 * AI crawlers that are explicitly welcome: search and answer engines that cite the site
 * (OpenAI, Anthropic, Perplexity, Google, Apple, Microsoft). `User-agent: *` already allows
 * them; naming them makes the intent unambiguous. Add or remove agents here.
 */
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
];

/**
 * Generates `robots.txt`: allows all crawlers (with AI crawlers listed explicitly), points to
 * the sitemap and to `llms.txt`. In a prototype build (`PUBLIC_PROTOTYPE=true`) it disallows
 * everything instead. Crawlers only read it at the domain root, so it takes effect once the
 * site runs on its own domain without `base`.
 */
export const GET: APIRoute = ({ site }) => {
  if (import.meta.env.PUBLIC_PROTOTYPE === 'true') {
    return new Response('User-agent: *\nDisallow: /\n');
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const sitemapUrl = new URL(`${base}/sitemap-index.xml`, site);
  const llmsUrl = new URL(`${base}/llms.txt`, site);
  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI search and answer engines are welcome.',
    ...aiCrawlers.map((agent) => `User-agent: ${agent}`),
    'Allow: /',
    '',
    `# Summary for language models: ${llmsUrl.href}`,
    `Sitemap: ${sitemapUrl.href}`,
  ];
  return new Response(`${lines.join('\n')}\n`);
};
