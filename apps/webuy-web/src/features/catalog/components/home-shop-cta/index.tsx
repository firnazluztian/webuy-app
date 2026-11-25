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
      size="md"
      rounded="xl"
      onClick={() => router.push(`/${locale}/search`)}
    >
      {label}
    </Button>
  );
};
