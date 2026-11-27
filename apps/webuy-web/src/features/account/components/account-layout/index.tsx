"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Button, Card, Text } from "@kiichan/design-system";
import { AccountNav } from "@/features/account/components/account-nav";
import { AccountSummary } from "@/features/account/components/account-summary";
import { LogoutDialog } from "@/features/account/components/logout-dialog";
import { accountSectionFromPathname } from "@/features/account/constants";
import { useSession } from "@/features/account/hooks/use-session";
import { useTranslations } from "@/features/shell/hooks/use-translations";
import type { Locale } from "@/i18n/types";

interface AccountLayoutProps {
  locale: Locale;
  children: ReactNode;
}

export const AccountLayout = ({ locale, children }: AccountLayoutProps) => {
  const t = useTranslations(locale);
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const active = accountSectionFromPathname(pathname);

  if (session.isLoading) {
    return (
      <Text variant="body2" className="text-neutral-600">
        {t.common.loading}
      </Text>
    );
  }

  if (!session.data) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
        <Text variant="heading2" as="h1">
          {t.account.title}
        </Text>
        <Text variant="body2" className="text-neutral-500">
          {t.account.signInPrompt}
        </Text>
        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={() => router.push(`/${locale}/login`)}
        >
          {t.shell.login}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-1">
        <Text variant="heading2" as="h1" className="text-2xl sm:text-3xl">
          {t.account.title}
        </Text>
        <Text variant="body2" className="hidden text-neutral-500 sm:block">
          {t.account.profileHint}
        </Text>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <Card
            variant="outline"
            padding="md"
            className="flex flex-col gap-3 sm:gap-4"
          >
            <AccountSummary user={session.data} />
            <div className="h-px w-full bg-neutral-200 lg:block" />
            <AccountNav
              locale={locale}
              active={active}
              onLogoutClick={() => setLogoutOpen(true)}
            />
          </Card>
        </aside>

        <Card variant="ghost" className="min-w-0 overflow-hidden p-0">
          {children}
        </Card>
      </div>

      <LogoutDialog
        locale={locale}
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
      />
    </div>
  );
};
