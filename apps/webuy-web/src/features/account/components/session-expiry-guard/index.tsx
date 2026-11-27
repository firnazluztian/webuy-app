'use client';

import { useToast } from '@kiichan/design-system';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { resetSessionCache, useSession } from '@/features/account/hooks/use-session';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import { defaultLocale, isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';
import { SessionExpiredError } from '@/lib/client-api';

function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split('/').find(Boolean);
  return segment && isLocale(segment) ? segment : defaultLocale;
}

/** Clears a rejected session, tells the user, and leaves protected pages. */
export const SessionExpiryGuard = () => {
  const session = useSession();
  const client = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const t = useTranslations(locale);
  const { showToast } = useToast();
  const handledError = useRef<unknown>(null);

  useEffect(() => {
    if (!(session.error instanceof SessionExpiredError)) {
      handledError.current = null;
      return;
    }
    if (handledError.current === session.error) {
      return;
    }
    handledError.current = session.error;

    resetSessionCache(client);
    showToast({
      variant: 'warning',
      title: t.auth.sessionExpiredTitle,
      description: t.auth.sessionExpiredBody,
      position: 'top-center',
    });

    const loginPath = `/${locale}/login`;
    if (pathname !== loginPath) {
      router.replace(loginPath);
    }
  }, [
    client,
    locale,
    pathname,
    router,
    session.error,
    showToast,
    t.auth.sessionExpiredBody,
    t.auth.sessionExpiredTitle,
  ]);

  return null;
};
