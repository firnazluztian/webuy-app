import { getMessages } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export const Footer = ({ locale }: { locale: Locale }) => {
  const t = getMessages(locale);
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-neutral-600">
        <p className="font-medium text-neutral-800">{t.shell.brand}</p>
        <p>{t.shell.footerTagline}</p>
        <p>{t.shell.footerRights}</p>
      </div>
    </footer>
  );
};
