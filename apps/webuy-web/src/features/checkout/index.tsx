"use client";

import { NegativeCase, Skeleton, Text } from "@kiichan/design-system";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useSession } from "@/features/account/hooks/use-session";
import { useCartHydrated } from "@/features/cart/hooks/use-cart-hydrated";
import { OrderSummary } from "@/features/checkout/components/order-summary";
import {
  ShippingSection,
  type AddressFormState,
} from "@/features/checkout/components/shipping-section";
import { VoucherSection } from "@/features/checkout/components/voucher-section";
import { useCheckout } from "@/features/checkout/hooks/use-checkout";
import type { CheckoutProps } from "@/features/checkout/types";
import {
  discountFromVoucher,
  findVoucher,
  type CheckoutVoucher,
} from "@/features/checkout/vouchers";
import { useFormatMoney } from "@/features/shell/hooks/use-format-money";
import { useTranslations } from "@/features/shell/hooks/use-translations";
import { getNegativeCaseImage } from "@/lib/kiichan/images";

const EMPTY_FORM: AddressFormState = {
  customerName: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
};

export const Checkout = ({ locale }: CheckoutProps) => {
  const t = useTranslations(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartHydrated = useCartHydrated();
  const session = useSession();
  const {
    lines,
    subtotalBase,
    pending,
    paymentError,
    isEmpty,
    fieldErrors,
    clearFieldError,
    startPayment,
    cancelPendingOrder,
  } = useCheckout(locale);
  const { format } = useFormatMoney();

  const [form, setForm] = useState<AddressFormState>(EMPTY_FORM);
  const [prefilledFromProfile, setPrefilledFromProfile] = useState(false);
  const [addressExpanded, setAddressExpanded] = useState(false);
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<CheckoutVoucher | null>(
    null,
  );
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [cancelledNotice, setCancelledNotice] = useState(false);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const orderId = searchParams.get("orderId");
    if (checkout === "cancel") {
      if (orderId) {
        cancelPendingOrder(orderId);
      }
      setCancelledNotice(true);
      router.replace(`/${locale}/checkout`, { scroll: false });
    }
  }, [cancelPendingOrder, locale, router, searchParams]);

  useEffect(() => {
    const user = session.data;
    if (!user || prefilledFromProfile) {
      return;
    }
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    const shipping = user.address;
    setForm({
      customerName: fullName || user.username || "",
      address: shipping?.address ?? "",
      city: shipping?.city ?? "",
      state: shipping?.state ?? "",
      postalCode: shipping?.postalCode ?? "",
      country: shipping?.country ?? "",
      phone: user.phone ?? "",
    });
    setPrefilledFromProfile(true);
    setAddressExpanded(!(shipping?.address && shipping.city));
  }, [prefilledFromProfile, session.data]);

  if (!cartHydrated || session.isLoading) {
    return (
      <div
        className="mx-auto flex w-full max-w-5xl flex-col gap-8"
        role="status"
        aria-busy="true"
        aria-label={t.checkout.title}
      >
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-40 w-full rounded-2xl" fullWidth />
            <Skeleton className="h-36 w-full rounded-2xl" fullWidth />
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" fullWidth />
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-2">
        <Text variant="heading2" as="h1" className="text-center">
          {t.checkout.title}
        </Text>
        <NegativeCase
          variant="no-order"
          customImage={getNegativeCaseImage("no-order")}
          customMessage={
            <span className="flex flex-col gap-1">
              <Text variant="subtitle1">{t.checkout.emptyCart}</Text>
              <Text variant="body2" className="text-neutral-500">
                {t.checkout.emptyHint}
              </Text>
            </span>
          }
          reloadText={t.cart.title}
          reload={() => router.push(`/${locale}/cart`)}
          className="w-full px-0"
        />
      </div>
    );
  }

  const discountBase = discountFromVoucher(subtotalBase, appliedVoucher);
  const totalBase = Math.max(0, subtotalBase - discountBase);
  const hasSavedSnapshot =
    prefilledFromProfile &&
    Boolean(form.address && form.city && form.country) &&
    !addressExpanded;

  function patchField<K extends keyof AddressFormState>(
    key: K,
    value: AddressFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key !== "phone") {
      clearFieldError(key as keyof typeof fieldErrors);
    }
  }

  function applyVoucherCode(code: string) {
    const voucher = findVoucher(code);
    if (!voucher) {
      setAppliedVoucher(null);
      setVoucherError(t.checkout.vouchers.invalid);
      return;
    }
    setAppliedVoucher(voucher);
    setVoucherInput(voucher.code);
    setVoucherError(null);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await startPayment({
      values: form,
      voucher: appliedVoucher,
      customerEmail: session.data?.email,
      phone: form.phone.trim() || undefined,
      errorMessages: {
        customerName: t.checkout.errors.nameRequired,
        address: t.checkout.errors.addressRequired,
        city: t.checkout.errors.cityRequired,
        state: t.checkout.errors.stateRequired,
        postalCode: t.checkout.errors.postalCodeRequired,
        country: t.checkout.errors.countryRequired,
      },
    });
  }

  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-8 -z-10 h-64 bg-[radial-gradient(ellipse_at_top,var(--color-primary-50),transparent_70%)]"
      />

      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Text variant="heading2" as="h1">
            {t.checkout.title}
          </Text>
          <Text variant="body2" className="text-neutral-500">
            {t.checkout.subtitle}
          </Text>
        </div>
        <ol className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
          <li className="text-primary">{t.checkout.stepShipping}</li>
          <li aria-hidden className="text-neutral-300">
            /
          </li>
          <li>{t.checkout.stepPayment}</li>
          <li aria-hidden className="text-neutral-300">
            /
          </li>
          <li>{t.checkout.stepConfirmed}</li>
        </ol>
      </header>

      {cancelledNotice ? (
        <p className="rounded-2xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-800">
          {t.checkout.cancelledNotice}
        </p>
      ) : null}

      <form
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="flex min-w-0 flex-col gap-5">
          <ShippingSection
            copy={t.checkout}
            form={form}
            fieldErrors={fieldErrors}
            hasSavedSnapshot={hasSavedSnapshot}
            showProfileHint={Boolean(prefilledFromProfile && form.address)}
            onEdit={() => setAddressExpanded(true)}
            onChange={patchField}
          />

          <VoucherSection
            copy={t.checkout.vouchers}
            voucherInput={voucherInput}
            appliedVoucher={appliedVoucher}
            voucherError={voucherError}
            onInputChange={(value) => {
              setVoucherInput(value);
              setVoucherError(null);
            }}
            onApply={applyVoucherCode}
            onRemove={() => {
              setAppliedVoucher(null);
              setVoucherInput("");
              setVoucherError(null);
            }}
          />

          <ul className="flex min-w-0 flex-col gap-3">
            {lines.map((line) => (
              <li
                key={line.productId}
                className="flex min-w-0 gap-3 rounded-2xl bg-primary-50/80 p-3 sm:gap-4 sm:p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white sm:h-24 sm:w-24">
                  <Image
                    src={line.imageUrl}
                    alt={line.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                  <Link
                    href={`/${locale}/products/${line.productId}`}
                    className="truncate text-sm font-medium text-neutral-900 sm:text-base"
                  >
                    {line.title}
                  </Link>
                  <Text variant="caption" className="text-neutral-500">
                    × {line.quantity} · {format(line.basePrice)}
                  </Text>
                </div>
                <Text
                  variant="subtitle1"
                  className="shrink-0 self-center text-primary"
                >
                  {format(line.basePrice * line.quantity)}
                </Text>
              </li>
            ))}
          </ul>
        </div>

        <OrderSummary
          locale={locale}
          copy={t.checkout}
          cartTitle={t.cart.title}
          processingLabel={t.payment.processing}
          subtotalBase={subtotalBase}
          discountBase={discountBase}
          totalBase={totalBase}
          appliedVoucher={appliedVoucher}
          pending={pending}
          paymentError={paymentError}
          format={format}
        />
      </form>
    </div>
  );
};
