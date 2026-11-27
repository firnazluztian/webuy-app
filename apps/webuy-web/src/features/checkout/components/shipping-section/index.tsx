'use client';

import { Button, Input, Text } from '@kiichan/design-system';
import type { CheckoutFieldErrors } from '@/features/checkout/hooks/use-checkout';
import type { Messages } from '@/i18n/types';

export interface AddressFormState {
  customerName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface ShippingSectionProps {
  copy: Messages['checkout'];
  form: AddressFormState;
  fieldErrors: CheckoutFieldErrors;
  hasSavedSnapshot: boolean;
  showProfileHint: boolean;
  onEdit: () => void;
  onChange: <K extends keyof AddressFormState>(
    key: K,
    value: AddressFormState[K]
  ) => void;
}

export const ShippingSection = ({
  copy,
  form,
  fieldErrors,
  hasSavedSnapshot,
  showProfileHint,
  onEdit,
  onChange,
}: ShippingSectionProps) => (
  <section className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white/90 p-5 sm:p-6">
    <div className="flex flex-col gap-1">
      <Text
        variant="caption"
        className="uppercase tracking-[0.2em] text-neutral-500"
      >
        {copy.shippingTitle}
      </Text>
      <Text variant="body2" className="text-neutral-500">
        {copy.shippingHint}
      </Text>
    </div>

    {hasSavedSnapshot ? (
      <div className="flex flex-col gap-3 rounded-2xl bg-primary-50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex flex-col gap-1">
            <span className="w-fit rounded-full bg-white px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
              {copy.savedAddressBadge}
            </span>
            <Text variant="subtitle1" className="text-neutral-900">
              {form.customerName}
            </Text>
            <Text variant="body2" className="text-neutral-600">
              {form.address}
            </Text>
            <Text variant="body2" className="text-neutral-600">
              {[form.city, form.state, form.postalCode].filter(Boolean).join(', ')}
            </Text>
            <Text variant="body2" className="text-neutral-600">
              {form.country}
            </Text>
            {form.phone ? (
              <Text variant="caption" className="text-neutral-500">
                {form.phone}
              </Text>
            ) : null}
          </div>
          <Button type="button" variant="ghost" onClick={onEdit}>
            {copy.editAddress}
          </Button>
        </div>
        <Text variant="caption" className="text-neutral-500">
          {copy.savedAddressHint}
        </Text>
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {showProfileHint ? (
          <Text variant="caption" className="text-neutral-500">
            {copy.savedAddressHint}
          </Text>
        ) : null}
        <Input
          label={copy.name}
          name="customerName"
          autoComplete="name"
          value={form.customerName}
          onChange={(event) => onChange('customerName', event.target.value)}
          error={Boolean(fieldErrors.customerName)}
          errorText={fieldErrors.customerName}
          required
          fullWidth
        />
        <Input
          label={copy.address}
          name="address"
          autoComplete="street-address"
          value={form.address}
          onChange={(event) => onChange('address', event.target.value)}
          error={Boolean(fieldErrors.address)}
          errorText={fieldErrors.address}
          required
          fullWidth
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={copy.city}
            name="city"
            autoComplete="address-level2"
            value={form.city}
            onChange={(event) => onChange('city', event.target.value)}
            error={Boolean(fieldErrors.city)}
            errorText={fieldErrors.city}
            required
            fullWidth
          />
          <Input
            label={copy.state}
            name="state"
            autoComplete="address-level1"
            value={form.state}
            onChange={(event) => onChange('state', event.target.value)}
            error={Boolean(fieldErrors.state)}
            errorText={fieldErrors.state}
            required
            fullWidth
          />
          <Input
            label={copy.postalCode}
            name="postalCode"
            autoComplete="postal-code"
            value={form.postalCode}
            onChange={(event) => onChange('postalCode', event.target.value)}
            error={Boolean(fieldErrors.postalCode)}
            errorText={fieldErrors.postalCode}
            required
            fullWidth
          />
          <Input
            label={copy.country}
            name="country"
            autoComplete="country-name"
            value={form.country}
            onChange={(event) => onChange('country', event.target.value)}
            error={Boolean(fieldErrors.country)}
            errorText={fieldErrors.country}
            required
            fullWidth
          />
        </div>
        <Input
          label={copy.phone}
          name="phone"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => onChange('phone', event.target.value)}
          fullWidth
        />
      </div>
    )}
  </section>
);
