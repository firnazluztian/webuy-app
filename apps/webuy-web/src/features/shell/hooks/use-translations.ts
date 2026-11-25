'use client';

import { getMessages } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export function useTranslations(locale: Locale) {
  return getMessages(locale);
}
