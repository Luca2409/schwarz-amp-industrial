import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '@/lib/llms';

/** Serves `llms.txt` (https://llmstxt.org): summary and key links for language models. */
export const GET: APIRoute = async ({ site, url }) =>
  new Response(await buildLlmsTxt(site ?? url), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
