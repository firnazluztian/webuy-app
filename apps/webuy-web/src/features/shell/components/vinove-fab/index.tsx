"use client";

import { Button, Popover } from "@kiichan/design-system";
import { useTranslations } from "@/features/shell/hooks/use-translations";
import type { Locale } from "@/i18n/types";

const VINOVE_URL = "https://vinoveai.com/";

interface VinoveFabProps {
  locale: Locale;
}

export const VinoveFab = ({ locale }: VinoveFabProps) => {
  const t = useTranslations(locale);

  return (
    <div className="fixed bottom-24 right-4 z-50 sm:bottom-6 sm:right-6">
      <Popover
        placement="top-end"
        variant="elevated"
        color="light"
        backdrop="blur"
        isDismissable
        shouldBlockScroll
        offset={12}
        className="max-w-2xl w-full overflow-hidden p-0 m-0 rounded-lg"
        content={
          <iframe
            title={t.shell.vinoveTitle}
            src={VINOVE_URL}
            className="h-[min(70vh,560px)] w-full border-0 overflow-hidden"
            referrerPolicy="no-referrer-when-downgrade"
            allow="clipboard-write; microphone; camera"
          />
        }
      >
        <Button
          type="button"
          variant="primary"
          isIconOnly
          leftIcon="mdi:robot-outline"
          aria-label={t.shell.vinoveOpen}
          className="shadow-lg"
        />
      </Popover>
    </div>
  );
};
