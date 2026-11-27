'use client';

import { Avatar, Button, Input, Text } from '@kiichan/design-system';
import { useProfileForm } from '@/features/account/components/profile/hooks/use-profile-form';
import { useSession } from '@/features/account/hooks/use-session';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';
import type { AuthUser } from '@/lib/schemas';

interface AccountProfileProps {
  locale: Locale;
}

interface AccountProfileFormProps {
  locale: Locale;
  user: AuthUser;
}

interface ProfileFactProps {
  label: string;
  value: string;
}

const EMPTY = '—';

const ProfileFact = ({ label, value }: ProfileFactProps) => (
  <div className="flex min-w-0 flex-col gap-0.5">
    <Text variant="caption" className="text-neutral-500">
      {label}
    </Text>
    <Text variant="body2" className="truncate text-neutral-900">
      {value || EMPTY}
    </Text>
  </div>
);

function formatBirthDate(value: string | undefined, locale: Locale): string {
  if (!value) {
    return EMPTY;
  }
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
  if (!match) {
    return value;
  }
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3])
  );
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date);
}

function genderLabel(
  gender: string | undefined,
  labels: { female: string; male: string }
): string {
  const normalized = gender?.toLowerCase();
  if (normalized === 'female') {
    return labels.female;
  }
  if (normalized === 'male') {
    return labels.male;
  }
  return gender || EMPTY;
}

const AccountProfileForm = ({ locale, user }: AccountProfileFormProps) => {
  const t = useTranslations(locale);
  const fullName = `${user.firstName} ${user.lastName}`.trim();
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
      addressRequired: t.account.profileAddressRequired,
      cityRequired: t.account.profileCityRequired,
      stateRequired: t.account.profileStateRequired,
      postalCodeRequired: t.account.profilePostalCodeRequired,
      countryRequired: t.account.profileCountryRequired,
      saveSuccess: t.account.profileSaveSuccess,
    },
  });

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Text variant="heading3">{t.account.profileTitle}</Text>
        <Text variant="body2" className="text-neutral-500">
          {t.account.profileSubtitle}
        </Text>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            src={user.image}
            alt={fullName || user.username}
            shape="circle"
            variant="cover"
            className="h-16 w-16 shrink-0 ring-1 ring-neutral-200"
          />
          <div className="min-w-0 flex flex-col gap-0.5">
            <Text variant="subtitle1" className="truncate text-neutral-900">
              {fullName || user.username}
            </Text>
            <Text variant="caption" className="truncate text-neutral-500">
              {user.email}
            </Text>
          </div>
        </div>

        <Text variant="subtitle2">{t.account.profileDetailsTitle}</Text>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ProfileFact
            label={t.account.profileFirstNameLabel}
            value={user.firstName}
          />
          <ProfileFact
            label={t.account.profileLastNameLabel}
            value={user.lastName}
          />
          <ProfileFact
            label={t.account.profileBirthdayLabel}
            value={formatBirthDate(user.birthDate, locale)}
          />
          <ProfileFact
            label={t.account.profilePhoneLabel}
            value={user.phone ?? ''}
          />
          <ProfileFact
            label={t.account.profileGenderLabel}
            value={genderLabel(user.gender, {
              female: t.account.profileGenderFemale,
              male: t.account.profileGenderMale,
            })}
          />
          <ProfileFact
            label={t.account.profileEmailLabel}
            value={user.email}
          />
        </div>
      </section>

      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <div className="flex flex-col gap-1">
          <Text variant="subtitle2">{t.account.profileShippingTitle}</Text>
          <Text variant="caption" className="text-neutral-500">
            {t.account.profileShippingHint}
          </Text>
        </div>

        {successMessage ? (
          <p className="text-sm text-green-700">{successMessage}</p>
        ) : null}
        {isError ? (
          <p className="text-sm text-red-600">{t.account.profileSaveError}</p>
        ) : null}

        <Input
          label={t.account.profileAddressLabel}
          name="address"
          autoComplete="street-address"
          value={form.address}
          onChange={(event) => {
            setForm((current) => ({ ...current, address: event.target.value }));
            clearFieldError('address');
          }}
          error={Boolean(fieldErrors.address)}
          errorText={fieldErrors.address}
          required
          fullWidth
          disabled={isSaving}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t.account.profileCityLabel}
            name="city"
            autoComplete="address-level2"
            value={form.city}
            onChange={(event) => {
              setForm((current) => ({ ...current, city: event.target.value }));
              clearFieldError('city');
            }}
            error={Boolean(fieldErrors.city)}
            errorText={fieldErrors.city}
            required
            fullWidth
            disabled={isSaving}
          />
          <Input
            label={t.account.profileStateLabel}
            name="state"
            autoComplete="address-level1"
            value={form.state}
            onChange={(event) => {
              setForm((current) => ({ ...current, state: event.target.value }));
              clearFieldError('state');
            }}
            error={Boolean(fieldErrors.state)}
            errorText={fieldErrors.state}
            required
            fullWidth
            disabled={isSaving}
          />
          <Input
            label={t.account.profilePostalCodeLabel}
            name="postalCode"
            autoComplete="postal-code"
            value={form.postalCode}
            onChange={(event) => {
              setForm((current) => ({
                ...current,
                postalCode: event.target.value,
              }));
              clearFieldError('postalCode');
            }}
            error={Boolean(fieldErrors.postalCode)}
            errorText={fieldErrors.postalCode}
            required
            fullWidth
            disabled={isSaving}
          />
          <Input
            label={t.account.profileCountryLabel}
            name="country"
            autoComplete="country-name"
            value={form.country}
            onChange={(event) => {
              setForm((current) => ({
                ...current,
                country: event.target.value,
              }));
              clearFieldError('country');
            }}
            error={Boolean(fieldErrors.country)}
            errorText={fieldErrors.country}
            required
            fullWidth
            disabled={isSaving}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
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
