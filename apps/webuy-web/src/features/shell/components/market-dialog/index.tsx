"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Select,
} from "@kiichan/design-system";
import { useMarketStore } from "@/features/shell/hooks/use-market-store";
import { useTranslations } from "@/features/shell/hooks/use-translations";
import { locales } from "@/i18n/config";
import { getMarket, isMarketId, marketIds, markets } from "@/i18n/markets";
import type { Locale, MarketId } from "@/i18n/types";

const LANGUAGE_LABELS: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
  id: "Bahasa",
};

function swapLocale(pathname: string, next: Locale): string {
  const parts = pathname.split("/");
  if (parts.length > 1) {
    parts[1] = next;
  }
  return parts.join("/") || `/${next}`;
}

function isLocaleValue(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

interface MarketDialogProps {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
}

export const MarketDialog = ({
  locale,
  isOpen,
  onClose,
}: MarketDialogProps) => {
  const t = useTranslations(locale);
  const router = useRouter();
  const pathname = usePathname();
  const marketId = useMarketStore((state) => state.marketId);
  const setMarketId = useMarketStore((state) => state.setMarketId);
  const [draftMarket, setDraftMarket] = useState<MarketId>(marketId);
  const [draftLocale, setDraftLocale] = useState<Locale>(locale);

  useEffect(() => {
    if (isOpen) {
      setDraftMarket(marketId);
      setDraftLocale(locale);
    }
  }, [isOpen, locale, marketId]);

  const countryOptions = marketIds.map((id) => ({
    value: id,
    label: markets[id].label,
  }));

  const languageOptions = locales.map((code) => ({
    value: code,
    label: LANGUAGE_LABELS[code],
  }));

  const selectedMarket = getMarket(draftMarket);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-md"
      backdrop="blur"
      closeOnBackdropClick
    >
      <DialogHeader onClose={onClose}>
        <DialogTitle>{t.shell.market}</DialogTitle>
      </DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        <Select
          label={t.shell.language}
          aria-label={t.shell.language}
          options={languageOptions}
          value={draftLocale}
          onChange={(value) => {
            if (isLocaleValue(value)) {
              setDraftLocale(value);
            }
          }}
          fullWidth
        />
        <Select
          label={t.shell.shippingCountry}
          aria-label={t.shell.shippingCountry}
          options={countryOptions}
          value={draftMarket}
          onChange={(value) => {
            if (isMarketId(value)) {
              setDraftMarket(value);
            }
          }}
          fullWidth
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-neutral-700">
            {t.shell.currency}
          </p>
          <p className="text-sm text-neutral-900">{selectedMarket.currency}</p>
        </div>
      </DialogBody>
      <DialogActions className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          {t.shell.cancel}
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            setMarketId(draftMarket);
            onClose();
            // Unlock before locale remount — Dialog exit timer is cleared on
            // unmount and can leave body overflow:hidden stuck.
            document.body.style.overflow = '';
            if (draftLocale !== locale) {
              window.setTimeout(() => {
                router.push(swapLocale(pathname, draftLocale));
              }, 0);
            }
          }}
        >
          {t.shell.saveMarket}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
