'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@kiichan/design-system';
import type { Locale } from '@/i18n/types';

export const HomeShopCta = ({ locale, label }: { locale: Locale; label: string }) => {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="primary"
      className="min-h-12 px-8 text-base"
      onClick={() => router.push(`/${locale}/search`)}
    >
      {label}
    </Button>
  );
};
