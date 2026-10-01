import { getCollection } from 'astro:content';
import { languages, type Lang } from '@/i18n/ui';
import { getLocalizedPath, useTranslations } from '@/i18n/utils';
import { certificates } from '@/lib/certificates';
import { getCompetencies, getEntryPath, getLegalPages } from '@/lib/content';
import { hasAddress, addressLine, site } from '@/site';

// Builds the llms.txt files (https://llmstxt.org): plain Markdown that tells language models
// what the site is about and where the important pages are. Generated from the content
// collections, so they never go out of date.

const languageNames: Record<Lang, string> = { de: 'Deutsch', en: 'English' };

/** Removes soft hyphens and trailing whitespace from Markdown bodies. */
function clean(text: string | undefined): string {
  return (text ?? '').replace(/­/g, '').replace(/[ \t]+$/gm, '').trim();
}

/**
 * Turns a root-relative path into an absolute URL.
 *
 * @param path Root-relative path including `base`.
 * @param siteUrl Absolute site URL (`Astro.site`).
 */
function absolute(path: string, siteUrl: URL): string {
  return new URL(path, siteUrl).href;
}

/** Company facts that are safe to state (no placeholders). */
function companyFacts(): string[] {
  const facts = [
    `Company: ${site.company} (${site.name})`,
    `Location: Dornstetten, Black Forest, Germany`,
    `Email: ${site.email}`,
    `Phone: ${site.phone.display}`,
    `Languages: German, English`,
  ];
  if (hasAddress) facts.splice(2, 0, `Address: ${addressLine}`);
  return facts.map((fact) => `- ${fact}`);
}

/**
 * Builds `llms.txt`: a short summary of AMP plus links to the key pages in every language.
 *
 * @param siteUrl Absolute site URL (`Astro.site`).
 * @returns Markdown in the llms.txt format.
 */
export async function buildLlmsTxt(siteUrl: URL): Promise<string> {
  const lines = [
    `# ${site.company}`,
    '',
    '> AMP is a medium-sized testing service provider from Dornstetten in the Black Forest, Germany. It offers non-destructive testing (radiographic, ultrasonic, penetrant, magnetic particle, visual and leak testing) to DIN, EN, ISO and ASME, 3D dimensional metrology with FARO Laser Tracker and FaroArm, and inspections and acceptance tests for industrial customers, at its own testing center or on site.',
    '',
    ...companyFacts(),
    '',
    `The site is available in German (primary) and English. A full-text version of all pages: ${absolute(`${import.meta.env.BASE_URL.replace(/\/$/, '')}/llms-full.txt`, siteUrl)}`,
  ];

  for (const lang of languages) {
    const t = useTranslations(lang);
    const competencies = await getCompetencies(lang);

    lines.push('', `## ${t('nav.competencies')} (${languageNames[lang]})`, '');
    for (const entry of competencies) {
      lines.push(`- [${entry.data.title}](${absolute(getEntryPath(entry), siteUrl)}): ${entry.data.seoDescription}`);
    }

    lines.push('', `## ${languageNames[lang]}`, '');
    lines.push(`- [${t('breadcrumb.home')}](${absolute(getLocalizedPath(lang), siteUrl)}): ${t('seo.defaultDescription')}`);
    lines.push(`- [${t('certificates.eyebrow')}](${absolute(getLocalizedPath(lang, 'certificates'), siteUrl)}): ${t('certificates.metaDescription')}`);
    lines.push(`- [${t('contact.eyebrow')}](${absolute(getLocalizedPath(lang, 'contact'), siteUrl)}): ${t('contact.metaDescription')}`);

  }

  // "Optional" is the llms.txt section that can be skipped when context is short.
  lines.push('', '## Optional', '');
  for (const lang of languages) {
    for (const entry of await getLegalPages(lang)) {
      lines.push(`- [${entry.data.title}](${absolute(getEntryPath(entry), siteUrl)}): ${entry.data.description}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

/**
 * Builds `llms-full.txt`: the full text content of the home page, all competency pages and
 * the certificates in every language, as one Markdown document.
 *
 * @param siteUrl Absolute site URL (`Astro.site`).
 * @returns Markdown with one section per page, each starting with its URL.
 */
export async function buildLlmsFullTxt(siteUrl: URL): Promise<string> {
  const pages = await getCollection('pages');
  const lines = [`# ${site.company} – full text`, '', ...companyFacts()];

  for (const lang of languages) {
    const t = useTranslations(lang);
    const home = pages.find((entry) => entry.id === `${lang}/home`);

    lines.push('', '---', '', `# ${languageNames[lang]}`);

    if (home) {
      lines.push(
        '',
        `## ${home.data.title}`,
        '',
        `URL: ${absolute(getLocalizedPath(lang), siteUrl)}`,
        '',
        home.data.description,
        '',
        `### ${home.data.aboutTitle}`,
        '',
        clean(home.body),
        '',
        `### ${home.data.qualityTitle}`,
        '',
        `${home.data.qualityCardTitle} ${home.data.qualityCardText}`,
      );
    }

    for (const entry of await getCompetencies(lang)) {
      lines.push(
        '',
        `## ${entry.data.title}`,
        '',
        `URL: ${absolute(getEntryPath(entry), siteUrl)}`,
        '',
        entry.data.seoDescription,
        '',
        // Shift the body's headings one level down, below the page's own `##` heading.
        clean(entry.body).replace(/^(#{2,6}) /gm, '#$1 '),
      );
    }

    lines.push(
      '',
      `## ${t('certificates.eyebrow')}`,
      '',
      `URL: ${absolute(getLocalizedPath(lang, 'certificates'), siteUrl)}`,
      '',
      t('certificates.intro'),
      '',
      ...certificates.map((certificate) => `- ${certificate.title[lang]}: ${certificate.description[lang]} (${certificate.issuer})`),
      '',
      `## ${t('contact.eyebrow')}`,
      '',
      `URL: ${absolute(getLocalizedPath(lang, 'contact'), siteUrl)}`,
      '',
      t('contact.intro'),
    );
  }

  return `${lines.join('\n')}\n`;
}
