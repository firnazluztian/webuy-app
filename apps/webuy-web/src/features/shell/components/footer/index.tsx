import { getMessages } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export const Footer = ({ locale }: { locale: Locale }) => {
  const t = getMessages(locale);
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-black text-white pb-20 sm:pb-0 rounded-t-lg">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-white">
        <p className="font-medium text-white">{t.shell.brand}</p>
        <p>{t.shell.footerTagline}</p>
        <p>{t.shell.footerRights}</p>
      </div>
    </footer>
  );
};
