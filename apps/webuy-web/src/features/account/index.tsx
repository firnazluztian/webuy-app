'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@kiichan/design-system';
import { useLogout, useSession } from '@/features/account/hooks/use-session';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

export const Account = ({ locale }: { locale: Locale }) => {
  const t = useTranslations(locale);
  const router = useRouter();
  const session = useSession();
  const logout = useLogout();

  if (session.isLoading) {
    return <p className="text-sm text-neutral-600">{t.common.loading}</p>;
  }

  if (!session.data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">{t.account.title}</h1>
        <Button
          type="button"
          variant="primary"
          size="md"
          rounded="xl"
          onClick={() => router.push(`/${locale}/login`)}
        >
          {t.shell.login}
        </Button>
      </div>
    );
  }

  const user = session.data;

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <h1 className="text-3xl font-semibold">{t.account.title}</h1>
      <div className="flex flex-col gap-2 text-neutral-700">
        <p>
          {t.account.greeting}{' '}
          <span className="font-medium text-neutral-900">
            {user.firstName} {user.lastName}
          </span>
        </p>
        <p className="text-sm">{user.email}</p>
        <p className="text-sm text-neutral-500">@{user.username}</p>
      </div>
      <p className="text-sm text-neutral-500">{t.account.profileHint}</p>
      <Button
        type="button"
        variant="primary"
        size="md"
        rounded="xl"
        onClick={() => {
          logout.mutate(undefined, {
            onSuccess: () => router.push(`/${locale}/login`),
          });
        }}
      >
        {t.shell.logout}
      </Button>
    </div>
  );
};
