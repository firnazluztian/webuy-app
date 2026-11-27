'use client';

import { NegativeCase } from '@kiichan/design-system';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';
import { getNegativeCaseImage } from '@/lib/kiichan/images';

interface LoginGateProps {
  locale: Locale;
  onNavigateAway?: () => void;
}

export const LoginGate = ({ locale, onNavigateAway }: LoginGateProps) => {
  const t = useTranslations(locale);
  const router = useRouter();

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-8">
      <NegativeCase
        variant="help-desk"
        customImage={getNegativeCaseImage('help-desk')}
        customMessage={t.shell.assistantLoginRequired}
        reloadText={t.shell.assistantLoginCta}
        reload={() => {
          onNavigateAway?.();
          router.push(`/${locale}/login`);
        }}
        className="max-w-xs"
      />
    </div>
  );
};
