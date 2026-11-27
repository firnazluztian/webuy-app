import type { Metadata } from 'next';
import { getMessages, isLocale } from '@/i18n/config';
import type { Messages } from '@/i18n/types';

/** Page title for the active locale. Unknown locales defer to the root default. */
export async function routeMetadata(
  locale: string,
  titleFor: (messages: Messages) => string | Promise<string>,
): Promise<Metadata> {
  if (!isLocale(locale)) {
    return {};
  }

  return { title: await titleFor(getMessages(locale)) };
}
