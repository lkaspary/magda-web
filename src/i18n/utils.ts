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