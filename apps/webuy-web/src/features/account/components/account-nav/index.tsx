"use client";

import Link from "next/link";
import { Button, Icon, buttonVariants, cn } from "@kiichan/design-system";
import { ACCOUNT_NAV_ITEMS, accountPath } from "@/features/account/constants";
import { useTranslations } from "@/features/shell/hooks/use-translations";
import type { AccountSection } from "@/features/account/types";
import type { Locale } from "@/i18n/types";

interface AccountNavProps {
  locale: Locale;
  active: AccountSection | null;
  onLogoutClick: () => void;
}

export const AccountNav = ({
  locale,
  active,
  onLogoutClick,
}: AccountNavProps) => {
  const t = useTranslations(locale);

  return (
    <nav
      aria-label={t.account.navLabel}
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
    >
      {ACCOUNT_NAV_ITEMS.map((item) => {
        const isActive = item.id === active;
        return (
          <Link
            key={item.id}
            href={accountPath(locale, item.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              buttonVariants({
                variant: isActive ? "primary" : "ghost",
              }),
              "shrink-0 whitespace-nowrap justify-start lg:w-full rounded-full",
            )}
          >
            <Icon icon={item.icon} />
            <span className="text-sm font-medium">
              {t.account[item.labelKey]}
            </span>
          </Link>
        );
      })}
      <Button
        type="button"
        variant="ghost"
        leftIcon="mdi:logout"
        className="shrink-0 whitespace-nowrap justify-start lg:w-full"
        onClick={onLogoutClick}
      >
        {t.account.navLogout}
      </Button>
    </nav>
  );
};
