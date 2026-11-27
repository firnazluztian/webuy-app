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

interface ProfileFormState {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface UseProfileFormOptions {
  user: AuthUser;
  messages: {
    emailRequired: string;
    emailInvalid: string;
    passwordTooShort: string;
    passwordMismatch: string;
    saveSuccess: string;
  };
}

function persistUserUpdate(next: AuthUser) {
  const token = getStoredToken() ?? 'local-session';
  const { accessToken: _a, refreshToken: _r, ...safe } = next;
  setStoredSession(token, JSON.stringify(safe));
  return safe;
}

export function useProfileForm({ user, messages }: UseProfileFormOptions) {
  const client = useQueryClient();
  const [form, setForm] = useState<ProfileFormState>({
    email: user.email,
    password: '',
    confirmPassword: '',
  });
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
        email: form.email.trim(),
      };
      return persistUserUpdate(next);
    },
    onSuccess: (safeUser) => {
      client.setQueryData(queryKeys.me, safeUser);
      setForm((current) => ({
        ...current,
        password: '',
        confirmPassword: '',
      }));
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
    const email = form.email.trim();

    if (!email) {
      nextErrors.email = messages.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = messages.emailInvalid;
    }

    if (form.password || form.confirmPassword) {
      if (form.password.length < 6) {
        nextErrors.password = messages.passwordTooShort;
      }
      if (form.password !== form.confirmPassword) {
        nextErrors.confirmPassword = messages.passwordMismatch;
      }
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
