import { ui as en } from './en';
import { ui as pt } from './pt';

export function useTranslations(lang: 'en' | 'pt') {
  return lang === 'pt' ? pt : en;
}

export function getLangFromUrl(url: URL): 'en' | 'pt' {
  const [, lang] = url.pathname.split('/');
  if (lang === 'pt') return 'pt';
  return 'en';
}

// Per-language page slugs (PT uses localised URL slugs)
export const routes = {
  en: { about: 'about', work: 'work', speaking: 'speaking', writing: 'writing', contact: 'contact', tools: 'tools', privacy: 'privacy' },
  pt: { about: 'sobre', work: 'trabalho', speaking: 'palestras', writing: 'escrita', contact: 'contato', tools: 'ferramentas', privacy: 'privacidade' },
} as const;

const enToPt: Record<string, string> = {
  about: 'sobre', work: 'trabalho', speaking: 'palestras', writing: 'escrita', contact: 'contato',
  tools: 'ferramentas', privacy: 'privacidade',
};
// Derived reverse map so we maintain a single source of truth
const ptToEn: Record<string, string> = Object.fromEntries(
  Object.entries(enToPt).map(([k, v]) => [v, k])
);

/** Returns the equivalent URL in the target language, translating the page slug. */
export function getAlternatePath(pathname: string, targetLang: 'en' | 'pt'): string {
  const parts = pathname.split('/').filter(Boolean); // ['en', 'about'] or ['pt', 'sobre']
  const slug = parts[1] ?? '';
  const targetSlug = targetLang === 'pt' ? (enToPt[slug] ?? slug) : (ptToEn[slug] ?? slug);
  return targetSlug ? `/${targetLang}/${targetSlug}` : `/${targetLang}/`;
}