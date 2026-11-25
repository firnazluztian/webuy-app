import type { Locale, Messages } from './types';
import en from './messages/en';
import ko from './messages/ko';
import id from './messages/id';

export const locales = ['en', 'ko', 'id'] as const satisfies readonly Locale[];

export const defaultLocale: Locale = 'en';

/** Iconify flag icons for the language control (MDI has no country flags). */
export const localeFlagIcons = {
  en: 'circle-flags:sg',
  ko: 'circle-flags:kr',
  id: 'circle-flags:id',
} as const satisfies Record<Locale, string>;

const catalogs: Record<Locale, Messages> = { en, ko, id };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getMessages(locale: Locale): Messages {
  return catalogs[locale];
}
