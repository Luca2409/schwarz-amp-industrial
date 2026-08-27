import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({
    base: './src/content/pages',
    pattern: '**/*.md',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),

    heroEyebrow: z.string(),
    heroTitlePrefix: z.string(),
    heroTitleHighlight: z.string(),
    heroText: z.string(),
    heroImage: z.string(),
    heroImageLabel: z.string(),

    showcaseImage: z.string(),
    showcaseImageAlt: z.string(),
    showcaseEyebrow: z.string().optional(),
    showcaseCaption: z.string().optional(),

    primaryCtaLabel: z.string(),
    primaryCtaHref: z.string(),
    secondaryCtaLabel: z.string(),
    secondaryCtaHref: z.string(),

    aboutEyebrow: z.string(),
    aboutTitle: z.string(),

    competenciesEyebrow: z.string(),
    competenciesTitle: z.string(),

    qualityEyebrow: z.string(),
    qualityTitle: z.string(),
    qualityCardTitle: z.string(),
    qualityCardText: z.string(),

    contactTitle: z.string(),
    contactLabel: z.string(),
    contactHref: z.string(),
  }),
});

const competencies = defineCollection({
  loader: glob({
    base: './src/content/competencies',
    pattern: '**/*.md',
  }),
  schema: z.object({
    number: z.string(),
    title: z.string(),
    teaser: z.string(),
    order: z.number(),
    seoDescription: z.string(),
  }),
});

export const collections = {
  pages,
  competencies,
};
