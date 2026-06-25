import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

export type Locale = 'en' | 'ar';

export const defaultLocale: Locale = 'en';

export const isRTL = (locale: Locale) => locale === 'ar';

export type Dictionary = Record<string, string>;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  ar,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function t(dict: Dictionary, key: string): string {
  return dict[key] ?? key;
}
