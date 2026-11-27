'use client';

import { Button, Input, Text } from '@kiichan/design-system';
import { useState } from 'react';
import { useProfileForm } from '@/features/account/components/profile/hooks/use-profile-form';
import { useSession } from '@/features/account/hooks/use-session';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { AuthUser } from '@/lib/schemas';
import type { Locale } from '@/i18n/types';

interface AccountProfileProps {
  locale: Locale;
}

interface AccountProfileFormProps {
  locale: Locale;
  user: AuthUser;
}

const AccountProfileForm = ({ locale, user }: AccountProfileFormProps) => {
  const t = useTranslations(locale);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    form,
    setForm,
    fieldErrors,
    clearFieldError,
    successMessage,
    onSubmit,
    isSaving,
    isError,
  } = useProfileForm({
    user,
    messages: {
      emailRequired: t.account.profileEmailRequired,
      emailInvalid: t.account.profileEmailInvalid,
      passwordTooShort: t.account.profilePasswordTooShort,
      passwordMismatch: t.account.profilePasswordMismatch,
      saveSuccess: t.account.profileSaveSuccess,
    },
  });

  return (
    <div className="flex w-full max-w-md flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-1">
        <Text variant="heading3">{t.account.profileTitle}</Text>
        <Text variant="body2" className="text-neutral-500">
          {t.account.profileSubtitle}
        </Text>
      </div>

      <div className="flex flex-col gap-1 text-sm text-neutral-600">
        <Text variant="caption" className="text-neutral-500">
          {t.account.profileNameLabel}
        </Text>
        <Text variant="body1" className="text-neutral-900">
          {user.firstName} {user.lastName}
        </Text>
      </div>

      {successMessage ? (
        <p className="text-sm text-green-700">{successMessage}</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-red-600">{t.account.profileSaveError}</p>
      ) : null}

      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <Input
          label={t.account.profileEmailLabel}
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => {
            setForm((current) => ({ ...current, email: event.target.value }));
            clearFieldError('email');
          }}
          error={Boolean(fieldErrors.email)}
          errorText={fieldErrors.email}
          leftIcon="mdi:email-outline"
          required
          fullWidth
          disabled={isSaving}
        />
        <Input
          label={t.account.profilePasswordLabel}
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={form.password}
          onChange={(event) => {
            setForm((current) => ({
              ...current,
              password: event.target.value,
            }));
            clearFieldError('password');
          }}
          error={Boolean(fieldErrors.password)}
          errorText={fieldErrors.password}
          leftIcon="mdi:lock-outline"
          rightIcon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
          onRightIconClick={() => setShowPassword((visible) => !visible)}
          fullWidth
          disabled={isSaving}
        />
        <Input
          label={t.account.profileConfirmPasswordLabel}
          name="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(event) => {
            setForm((current) => ({
              ...current,
              confirmPassword: event.target.value,
            }));
            clearFieldError('confirmPassword');
          }}
          error={Boolean(fieldErrors.confirmPassword)}
          errorText={fieldErrors.confirmPassword}
          leftIcon="mdi:lock-check-outline"
          rightIcon={showConfirm ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
          onRightIconClick={() => setShowConfirm((visible) => !visible)}
          fullWidth
          disabled={isSaving}
        />
        <Text variant="caption" className="text-neutral-500">
          {t.account.profilePasswordHint}
        </Text>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSaving}
          isLoading={isSaving}
        >
          {isSaving ? t.common.loading : t.account.profileSave}
        </Button>
      </form>
    </div>
  );
};

export const AccountProfile = ({ locale }: AccountProfileProps) => {
  const session = useSession();
  if (!session.data) {
    return null;
  }
  return <AccountProfileForm locale={locale} user={session.data} />;
};
