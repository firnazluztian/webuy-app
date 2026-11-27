"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Icon, Input } from "@kiichan/design-system";
import { useSession } from "@/features/account/hooks/use-session";
import { useCartHydrated } from "@/features/cart/hooks/use-cart-hydrated";
import { useCartStore } from "@/features/cart/hooks/use-cart-store";
import { MarketDialog } from "@/features/shell/components/market-dialog";
import { NavigationProgress } from "@/features/shell/components/navigation-progress";
import { useMarketHydrated } from "@/features/shell/hooks/use-market-hydrated";
import { useMarketStore } from "@/features/shell/hooks/use-market-store";
import { useTranslations } from "@/features/shell/hooks/use-translations";
import { localeFlagIcons } from "@/i18n/config";
import { defaultMarketId, getMarket } from "@/i18n/markets";
import type { Locale } from "@/i18n/types";

const BottomTab = ({
  icon,
  label,
  onClick,
  badge,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  badge?: number;
}) => (
  <Button
    type="button"
    variant="ghost"
    onClick={onClick}
    className="h-auto min-w-0 flex-1 px-1 py-2 text-neutral-600 hover:bg-transparent hover:text-primary active:text-primary"
    aria-label={label}
  >
    <span className="flex w-full flex-col items-center justify-center gap-1 text-center">
      <span className="relative inline-flex items-center justify-center">
        <Icon icon={icon} className="h-5 w-5" />
        {badge !== undefined && badge > 0 ? (
          <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-semibold leading-none text-dark">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </span>
      <span className="max-w-full truncate text-[10px] font-medium leading-tight tracking-wide uppercase">
        {label}
      </span>
    </span>
  </Button>
);

export const Topbar = ({ locale }: { locale: Locale }) => {
  const t = useTranslations(locale);
  const router = useRouter();
  const session = useSession();
  const cartHydrated = useCartHydrated();
  const marketHydrated = useMarketHydrated();
  const qty = useCartStore((state) => state.totalQuantity());
  const persistedMarketId = useMarketStore((state) => state.marketId);
  const safeQty = cartHydrated ? qty : 0;
  const market = getMarket(
    marketHydrated ? persistedMarketId : defaultMarketId,
  );
  const [query, setQuery] = useState("");
  const [marketOpen, setMarketOpen] = useState(false);

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(
      q ? `/${locale}/search?q=${encodeURIComponent(q)}` : `/${locale}/search`,
    );
  }

  const isSignedIn = Boolean(session.data);
  const authHref = isSignedIn ? `/${locale}/account/dashboard` : `/${locale}/login`;
  const authLabel = session.data
    ? `${t.shell.hi} ${session.data.firstName}`
    : t.shell.login;
  const languageFlag = localeFlagIcons[locale];
  const marketLabel = `${market.label} · ${market.currency}`;
  const cartLabel =
    safeQty > 0 ? `${t.shell.cart} (${safeQty})` : t.shell.cart;

  return (
    <>
      <div className="sticky top-0 z-40">
        <header className="border-b border-light/10 bg-dark/95 text-light backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-4">
            {/* Desktop */}
            <div className="hidden h-16 items-center gap-8 sm:grid sm:grid-cols-[auto_minmax(0,1fr)_auto]">
              <Link
                href={`/${locale}`}
                className="shrink-0 text-lg font-semibold tracking-[0.22em] uppercase text-light"
              >
                {t.shell.brand}
              </Link>

              <form onSubmit={onSearch} className="min-w-0">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.shell.searchPlaceholder}
                  aria-label={t.shell.searchPlaceholder}
                  leftIcon="mdi:magnify"
                  fullWidth
                  className="text-dark"
                />
              </form>

              <nav className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  leftIcon={languageFlag}
                  aria-label={t.shell.language}
                  isIconOnly
                  onClick={() => setMarketOpen(true)}
                />

                <Button
                  type="button"
                  variant="ghost"
                  leftIcon="mdi:cart-outline"
                  className="text-white hover:text-primary"
                  aria-label={cartLabel}
                  onClick={() => router.push(`/${locale}/cart`)}
                >
                  {safeQty ? cartLabel : null}
                </Button>
                <Button type="button" onClick={() => router.push(authHref)}>
                  {authLabel}
                </Button>
              </nav>
            </div>

            {/* Mobile top */}
            <div className="flex flex-col gap-3 py-3 sm:hidden">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/${locale}`}
                  className="text-base font-semibold tracking-[0.2em] uppercase text-light"
                >
                  {t.shell.brand}
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  className="text-white"
                  leftIcon={languageFlag}
                  aria-label={t.shell.language}
                  onClick={() => setMarketOpen(true)}
                >
                  {marketLabel}
                </Button>
              </div>
              <form onSubmit={onSearch} className="min-w-0">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.shell.searchPlaceholder}
                  aria-label={t.shell.searchPlaceholder}
                  leftIcon="mdi:magnify"
                  fullWidth
                />
              </form>
            </div>
          </div>
        </header>
        <NavigationProgress />
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 bg-light sm:hidden opacity-90 rounded-t-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label={t.shell.brand}
      >
        <div className="mx-auto flex max-w-6xl items-stretch justify-between px-1 py-2">
          <BottomTab
            icon={languageFlag}
            label={t.shell.market}
            onClick={() => setMarketOpen(true)}
          />
          <BottomTab
            icon="mdi:cart-outline"
            label={t.shell.cart}
            badge={safeQty}
            onClick={() => router.push(`/${locale}/cart`)}
          />
          <BottomTab
            icon={isSignedIn ? "mdi:account-outline" : "mdi:login"}
            label={authLabel}
            onClick={() => router.push(authHref)}
          />
        </div>
      </nav>

      <MarketDialog
        locale={locale}
        isOpen={marketOpen}
        onClose={() => setMarketOpen(false)}
      />
    </>
  );
};
