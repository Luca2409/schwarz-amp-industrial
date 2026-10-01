import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { routes, staticRoutes } from '../i18n/routes';

// Runs in astro.config.mjs, so it must not import Astro virtual modules.

/** Files that may contain `[placeholders]`, relative to the project root. */
const placeholderSources = {
  /** String literals like '[PLZ]'. */
  code: ['src/site.ts', 'src/i18n/ui.ts'],
  /** Bracketed text that isn't a Markdown link, like [Registernummer]. */
  markdown: ['src/content/legal'],
};

const quotedPlaceholder = /(['"`])(\[[^\]\n]+\])\1/g;
const markdownPlaceholder = /\[[^\]\n]+\](?!\()/g;
const htmlComment = /<!--[\s\S]*?-->/g;

/**
 * Finds unfilled `[placeholders]` in company data, UI strings and legal pages.
 *
 * @param root Project root directory.
 * @returns One entry per file with placeholders, e.g. `src/site.ts: [PLZ], [Ort]`.
 */
export function findPlaceholders(root: string): string[] {
  const results: string[] = [];
  const report = (file: string, matches: string[]) => {
    if (matches.length > 0) results.push(`${path.relative(root, file)}: ${[...new Set(matches)].join(', ')}`);
  };

  for (const file of placeholderSources.code.map((rel) => path.join(root, rel))) {
    const source = fs.readFileSync(file, 'utf-8');
    report(file, [...source.matchAll(quotedPlaceholder)].map((match) => match[2]));
  }

  for (const dir of placeholderSources.markdown.map((rel) => path.join(root, rel))) {
    for (const file of listMarkdownFiles(dir)) {
      const source = fs.readFileSync(file, 'utf-8').replace(htmlComment, '');
      report(file, source.match(markdownPlaceholder) ?? []);
    }
  }

  return results;
}

/**
 * Checks that every static route in `staticRoutes` has a page file per language whose
 * name matches the localized segment in `routes`.
 *
 * @param root Project root directory.
 * @returns Expected files that don't exist, e.g. `src/pages/de/kontakt.astro`.
 */
export function findMissingRouteFiles(root: string): string[] {
  return staticRoutes.flatMap((route) =>
    Object.entries(routes[route])
      .filter(([lang, segment]) =>
        [`${segment}.astro`, `${segment}/index.astro`].every(
          (file) => !fs.existsSync(path.join(root, 'src/pages', lang, file)),
        ),
      )
      .map(([lang, segment]) => `src/pages/${lang}/${segment}.astro`),
  );
}

/**
 * Lists all Markdown files below a directory.
 *
 * @param dir Absolute directory path.
 * @returns Absolute paths of all `.md` files, including subfolders.
 */
function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { recursive: true, encoding: 'utf-8' })
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.join(dir, file));
}

/**
 * Astro integration with project-specific build checks:
 *
 * - **Placeholders** (`[PLZ]`, `[Vorname Nachname]`, …) in `src/site.ts`, `src/i18n/ui.ts`
 *   and the legal pages. Fails the build in CI (`CI=true`), so incomplete legal information
 *   is never deployed; only warns locally. Set `ALLOW_PLACEHOLDERS=true` to override.
 * - **Static route files** that don't match `routes` in `src/i18n/routes.ts`. Always fails the build.
 *
 * Both checks also run as warnings when the dev server starts.
 *
 * @returns The integration for `integrations` in astro.config.mjs.
 */
export function siteChecks(): AstroIntegration {
  let root = '';

  return {
    name: 'site-checks',
    hooks: {
      'astro:config:done': ({ config }) => {
        root = fileURLToPath(config.root);
      },
      'astro:server:start': ({ logger }) => {
        for (const entry of findPlaceholders(root)) logger.warn(`Placeholder left: ${entry}`);
        for (const file of findMissingRouteFiles(root)) logger.warn(`Missing route file: ${file}`);
      },
      'astro:build:start': ({ logger }) => {
        const missingRoutes = findMissingRouteFiles(root);
        if (missingRoutes.length > 0) {
          throw new Error(
            `Static route files don't match src/i18n/routes.ts. Missing: ${missingRoutes.join(', ')}`,
          );
        }

        const placeholders = findPlaceholders(root);
        if (placeholders.length === 0) return;

        const message = `Placeholders left:\n  ${placeholders.join('\n  ')}`;
        if (process.env.CI && process.env.ALLOW_PLACEHOLDERS !== 'true') {
          throw new Error(`${message}\nFill them in before deploying (or set ALLOW_PLACEHOLDERS=true).`);
        }
        logger.warn(message);
      },
    },
  };
}
