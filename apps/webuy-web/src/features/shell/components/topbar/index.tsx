'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button, Input, Select } from '@kiichan/design-system';
import { useCartStore } from '@/features/cart/hooks/use-cart-store';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import { locales } from '@/i18n/config';
import { markets } from '@/i18n/markets';
import type { Locale } from '@/i18n/types';

function swapLocale(pathname: string, next: Locale): string {
  const parts = pathname.split('/');
  if (parts.length > 1) {
    parts[1] = next;
  }
  return parts.join('/') || `/${next}`;
}

export const Topbar = ({ locale }: { locale: Locale }) => {
  const t = useTranslations(locale);
  const pathname = usePathname();
  const router = useRouter();
  const qty = useCartStore((state) => state.totalQuantity());
  const [query, setQuery] = useState('');

  const marketOptions = locales.map((code) => ({
    value: code,
    label: markets[code].label,
  }));

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/${locale}/search?q=${encodeURIComponent(q)}` : `/${locale}/search`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-light/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center justify-between gap-3">
          <Link href={`/${locale}`} className="text-xl font-semibold tracking-tight text-primary">
            {t.shell.brand}
          </Link>
          <div className="flex items-center gap-2 sm:hidden">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              rounded="xl"
              onClick={() => router.push(`/${locale}/cart`)}
            >
              {t.shell.cart}
              {qty > 0 ? ` (${qty})` : ''}
            </Button>
          </div>
        </div>

        <form onSubmit={onSearch} className="flex flex-1 items-center gap-2">
          <div className="min-w-0 flex-1">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.shell.searchPlaceholder}
              aria-label={t.shell.searchPlaceholder}
              rounded="xl"
              size="md"
            />
          </div>
          <Button type="submit" variant="primary" size="md" rounded="xl">
            {t.search.title}
          </Button>
        </form>

        <nav className="flex flex-wrap items-center gap-2">
          <Select
            aria-label={t.shell.language}
            options={marketOptions}
            value={locale}
            onChange={(value) => {
              router.push(swapLocale(pathname, value as Locale));
            }}
            size="sm"
            rounded="xl"
          />
          <div className="hidden sm:contents">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              rounded="xl"
              onClick={() => router.push(`/${locale}/account`)}
            >
              {t.shell.account}
            </Button>
            <Button
              type="button"
              variant="outline-primary"
              size="sm"
              rounded="xl"
              onClick={() => router.push(`/${locale}/cart`)}
            >
              {t.shell.cart}
              {qty > 0 ? ` (${qty})` : ''}
            </Button>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            rounded="xl"
            onClick={() => router.push(`/${locale}/login`)}
          >
            {t.shell.login}
          </Button>
        </nav>
      </div>
    </header>
  );
};
