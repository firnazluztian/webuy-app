'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import {
  getStoredToken,
  getStoredUserJson,
  setStoredSession,
} from '@/lib/commerce-api';
import { queryKeys } from '@/lib/query-keys';
import { authUserSchema, type AuthUser } from '@/lib/schemas';

interface ShippingFormState {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface FieldErrors {
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface UseProfileFormOptions {
  user: AuthUser;
  messages: {
    addressRequired: string;
    cityRequired: string;
    stateRequired: string;
    postalCodeRequired: string;
    countryRequired: string;
    saveSuccess: string;
  };
}

function shippingFromUser(user: AuthUser): ShippingFormState {
  return {
    address: user.address?.address ?? '',
    city: user.address?.city ?? '',
    state: user.address?.state ?? '',
    postalCode: user.address?.postalCode ?? '',
    country: user.address?.country ?? '',
  };
}

function persistUserUpdate(next: AuthUser) {
  const token = getStoredToken() ?? 'local-session';
  const { accessToken: _accessToken, refreshToken: _refreshToken, ...safe } =
    next;
  setStoredSession(token, JSON.stringify(safe));
  return safe;
}

export function useProfileForm({ user, messages }: UseProfileFormOptions) {
  const client = useQueryClient();
  const [form, setForm] = useState<ShippingFormState>(() =>
    shippingFromUser(user)
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: async () => {
      const cached = getStoredUserJson();
      const current = cached
        ? authUserSchema.parse(JSON.parse(cached))
        : user;
      const next: AuthUser = {
        ...current,
        address: {
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country.trim(),
        },
      };
      return persistUserUpdate(next);
    },
    onSuccess: (safeUser) => {
      client.setQueryData(queryKeys.me, safeUser);
      setSuccessMessage(messages.saveSuccess);
    },
  });

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const { [field]: _removed, ...rest } = current;
      return rest;
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);

    const nextErrors: FieldErrors = {};
    if (!form.address.trim()) {
      nextErrors.address = messages.addressRequired;
    }
    if (!form.city.trim()) {
      nextErrors.city = messages.cityRequired;
    }
    if (!form.state.trim()) {
      nextErrors.state = messages.stateRequired;
    }
    if (!form.postalCode.trim()) {
      nextErrors.postalCode = messages.postalCodeRequired;
    }
    if (!form.country.trim()) {
      nextErrors.country = messages.countryRequired;
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    save.mutate();
  };

  return {
    form,
    setForm,
    fieldErrors,
    clearFieldError,
    successMessage,
    onSubmit,
    isSaving: save.isPending,
    isError: save.isError,
  };
}
