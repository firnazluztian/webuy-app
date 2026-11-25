'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@kiichan/design-system';
import { useLogin, useSession } from '@/features/account/hooks/use-session';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

export const Login = ({ locale }: { locale: Locale }) => {
  const t = useTranslations(locale);
  const router = useRouter();
  const session = useSession();
  const login = useLogin();

  useEffect(() => {
    if (session.data) {
      router.replace(`/${locale}/account`);
    }
  }, [locale, router, session.data]);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-primary">{t.auth.loginTitle}</h1>
        <p className="text-sm text-neutral-600">{t.auth.subtitle}</p>
      </div>

      {login.isError ? <p className="text-sm text-red-600">{t.auth.error}</p> : null}

      <Button
        type="button"
        variant="primary"
        disabled={login.isPending}
        isLoading={login.isPending}
        onClick={() => {
          login.mutate(undefined, {
            onSuccess: () => router.push(`/${locale}/account`),
          });
        }}
      >
        {login.isPending ? t.common.loading : t.auth.submit}
      </Button>
    </div>
  );
};
