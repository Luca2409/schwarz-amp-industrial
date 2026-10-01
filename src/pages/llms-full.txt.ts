import type { APIRoute } from 'astro';
import { buildLlmsFullTxt } from '@/lib/llms';

/** Serves `llms-full.txt`: the full text of the main pages in Markdown, for language models. */
export const GET: APIRoute = async ({ site, url }) =>
  new Response(await buildLlmsFullTxt(site ?? url), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
