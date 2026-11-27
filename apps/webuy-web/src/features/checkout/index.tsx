'use client';

import { Button, Input, Skeleton, Text } from '@kiichan/design-system';
import Link from 'next/link';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useCartHydrated } from '@/features/cart/hooks/use-cart-hydrated';
import { useCheckout } from '@/features/checkout/hooks/use-checkout';
import type { CheckoutProps } from '@/features/checkout/types';
import { useFormatMoney } from '@/features/shell/hooks/use-format-money';
import { useTranslations } from '@/features/shell/hooks/use-translations';

export const Checkout = ({ locale }: CheckoutProps) => {
  const t = useTranslations(locale);
  const cartHydrated = useCartHydrated();
  const { isEmpty, subtotalBase, pending, fieldErrors, clearFieldError, placeOrder } =
    useCheckout(locale);
  const { format } = useFormatMoney();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  if (!cartHydrated) {
    return (
      <div
        className="mx-auto flex w-full max-w-lg flex-col gap-6"
        role="status"
        aria-busy="true"
        aria-label={t.checkout.title}
      >
        <Text variant="heading2" as="h1">
          {t.checkout.title}
        </Text>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-11 w-full" fullWidth />
        <Skeleton className="h-11 w-full" fullWidth />
        <Skeleton className="h-11 w-full" fullWidth />
        <Skeleton className="h-11 w-full" fullWidth />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">{t.checkout.title}</h1>
        <p className="text-neutral-600">{t.checkout.emptyCart}</p>
        <Link href={`/${locale}/cart`}>
          <Button type="button" variant="outline-primary">
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
        {t.cart.subtotal}: {format(subtotalBase)}
      </p>
      <form className="flex w-full flex-col gap-4" onSubmit={onSubmit} noValidate>
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
          required
          fullWidth
        />
        <Input
          label={t.checkout.address}
          name="address"
          value={address}
          fullWidth
          onChange={(event) => {
            setAddress(event.target.value);
            clearFieldError('address');
          }}
          error={Boolean(fieldErrors.address)}
          errorText={fieldErrors.address}
          required
        />
        <Input
          label={t.checkout.city}
          name="city"
          fullWidth
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            clearFieldError('city');
          }}
          error={Boolean(fieldErrors.city)}
          errorText={fieldErrors.city}
          required
        />
        <Button
          type="submit"
          variant="primary"
          disabled={pending}
          isLoading={pending}
        >
          {pending ? t.payment.processing : t.checkout.placeOrder}
        </Button>
      </form>
    </div>
  );
};
