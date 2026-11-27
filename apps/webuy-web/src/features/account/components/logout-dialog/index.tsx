'use client';

import { useRouter } from 'next/navigation';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Text,
} from '@kiichan/design-system';
import { useLogout } from '@/features/account/hooks/use-session';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

interface LogoutDialogProps {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutDialog = ({
  locale,
  isOpen,
  onClose,
}: LogoutDialogProps) => {
  const t = useTranslations(locale);
  const router = useRouter();
  const logout = useLogout();

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-md"
      backdrop="blur"
      closeOnBackdropClick={!logout.isPending}
    >
      <DialogHeader onClose={logout.isPending ? undefined : onClose}>
        <DialogTitle>{t.account.logoutTitle}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <Text variant="body2" className="text-neutral-600">
          {t.account.logoutSubtitle}
        </Text>
      </DialogBody>
      <DialogActions className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={logout.isPending}
          onClick={onClose}
        >
          {t.account.logoutCancel}
        </Button>
        <Button
          type="button"
          variant="danger"
          leftIcon="mdi:logout"
          disabled={logout.isPending}
          isLoading={logout.isPending}
          onClick={() => {
            logout.mutate(undefined, {
              onSuccess: () => {
                onClose();
                router.push(`/${locale}/login`);
              },
            });
          }}
        >
          {logout.isPending ? t.common.loading : t.shell.logout}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
