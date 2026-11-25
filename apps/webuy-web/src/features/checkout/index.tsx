'use client';

import Link from 'next/link';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button, Input } from '@kiichan/design-system';
import { useCheckout } from '@/features/checkout/hooks/use-checkout';
import type { CheckoutProps } from '@/features/checkout/types';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import { formatMoney } from '@/i18n/markets';

export const Checkout = ({ locale }: CheckoutProps) => {
  const t = useTranslations(locale);
  const { isEmpty, subtotalBase, pending, fieldErrors, clearFieldError, placeOrder } =
    useCheckout(locale);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  if (isEmpty) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">{t.checkout.title}</h1>
        <p className="text-neutral-600">{t.checkout.emptyCart}</p>
        <Link href={`/${locale}/cart`}>
          <Button type="button" variant="outline-primary" size="md" rounded="xl">
            {t.cart.title}
          </Button>
        </Link>
      </div>
    );
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    placeOrder(
      { customerName: name, address, city },
      {
        customerName: t.checkout.errors.nameRequired,
        address: t.checkout.errors.addressRequired,
        city: t.checkout.errors.cityRequired,
      }
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <h1 className="text-3xl font-semibold">{t.checkout.title}</h1>
      <p className="text-neutral-700">
        {t.cart.subtotal}: {formatMoney(subtotalBase, locale)}
      </p>
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <Input
          label={t.checkout.name}
          name="customerName"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            clearFieldError('customerName');
          }}
          error={Boolean(fieldErrors.customerName)}
          errorText={fieldErrors.customerName}
          rounded="xl"
          size="md"
          required
        />
        <Input
          label={t.checkout.address}
          name="address"
          value={address}
          onChange={(event) => {
            setAddress(event.target.value);
            clearFieldError('address');
          }}
          error={Boolean(fieldErrors.address)}
          errorText={fieldErrors.address}
          rounded="xl"
          size="md"
          required
        />
        <Input
          label={t.checkout.city}
          name="city"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            clearFieldError('city');
          }}
          error={Boolean(fieldErrors.city)}
          errorText={fieldErrors.city}
          rounded="xl"
          size="md"
          required
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          rounded="xl"
          disabled={pending}
          isLoading={pending}
        >
          {pending ? t.payment.processing : t.checkout.placeOrder}
        </Button>
      </form>
    </div>
  );
};
