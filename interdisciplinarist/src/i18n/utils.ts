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

export const routes = {
  en: { reading: 'reading', about: 'about', contact: 'contact' },
  pt: { reading: 'leitura', about: 'sobre', contact: 'contato' },
} as const;

const enToPt: Record<string, string> = {
  reading: 'leitura', about: 'sobre', contact: 'contato',
};
const ptToEn: Record<string, string> = Object.fromEntries(
  Object.entries(enToPt).map(([k, v]) => [v, k])
);

export function getAlternatePath(pathname: string, targetLang: 'en' | 'pt'): string {
  const parts = pathname.split('/').filter(Boolean);
  const slug = parts[1] ?? '';
  const targetSlug = targetLang === 'pt' ? (enToPt[slug] ?? slug) : (ptToEn[slug] ?? slug);
  return targetSlug ? `/${targetLang}/${targetSlug}` : `/${targetLang}/`;
}
