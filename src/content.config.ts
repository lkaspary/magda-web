import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Essay body text needs its own translation, not just title/excerpt, so each
// language gets its own collection/directory — matching how every other page
// on this site already splits EN and PT into separate files.
const writingSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  publishDate: z.coerce.date(),
  featured: z.boolean().default(false),
  // Escape hatch: when set, the essay's canonical home is Interdisciplinarist.com
  // and the essay list links out there instead of to a local /writing/[slug]/ page.
  externalUrl: z.string().url().nullable().default(null),
});

const writingEn = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing/en' }),
  schema: writingSchema,
});

const writingPt = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing/pt' }),
  schema: writingSchema,
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    publishDate: z.coerce.date(),
    tier: z.enum(['free', 'preview', 'premium']).default('free'),
    featured: z.boolean().default(false),
  }),
});

export const collections = { writingEn, writingPt, articles };
