"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@kiichan/design-system";
import { useLogin, useSession } from "@/features/account/hooks/use-session";
import { useTranslations } from "@/features/shell/hooks/use-translations";
import type { Locale } from "@/i18n/types";

interface FieldErrors {
  username?: string;
  password?: string;
}

export const Login = ({ locale }: { locale: Locale }) => {
  const t = useTranslations(locale);
  const router = useRouter();
  const session = useSession();
  const login = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (session.data) {
      router.replace(`/${locale}/account/dashboard`);
    }
  }, [locale, router, session.data]);

  const goToAccount = () => {
    router.push(`/${locale}/account/dashboard`);
  };

  const signIn = () => {
    login.mutate(undefined, { onSuccess: goToAccount });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!username.trim()) {
      nextErrors.username = t.auth.usernameRequired;
    }
    if (!password) {
      nextErrors.password = t.auth.passwordRequired;
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    signIn();
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const { [field]: _removed, ...rest } = current;
      return rest;
    });
  };

  const isBusy = login.isPending;

  return (
    <Card className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-primary">
          {t.auth.loginTitle}
        </h1>
        <p className="text-sm text-neutral-600">{t.auth.subtitle}</p>
      </div>

      {login.isError ? (
        <p className="text-sm text-red-600">{t.auth.error}</p>
      ) : null}

      <form
        className="flex w-full flex-col gap-4"
        onSubmit={onSubmit}
        noValidate
      >
        <Input
          label={t.auth.username}
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            clearFieldError("username");
          }}
          error={Boolean(fieldErrors.username)}
          errorText={fieldErrors.username}
          leftIcon="mdi:account-outline"
          required
          fullWidth
          disabled={isBusy}
        />
        <Input
          label={t.auth.password}
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            clearFieldError("password");
          }}
          error={Boolean(fieldErrors.password)}
          errorText={fieldErrors.password}
          leftIcon="mdi:lock-outline"
          rightIcon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
          onRightIconClick={() => setShowPassword((visible) => !visible)}
          required
          fullWidth
          disabled={isBusy}
        />
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isBusy}
          isLoading={isBusy}
        >
          {isBusy ? t.common.loading : t.auth.submit}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs text-neutral-500">
          {t.auth.orContinueWith}
        </span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          fullWidth
          leftIcon="mdi:google"
          disabled={isBusy}
          onClick={signIn}
        >
          {t.auth.continueWithGoogle}
        </Button>
        <Button
          type="button"
          variant="outline"
          fullWidth
          leftIcon="mdi:apple"
          disabled={isBusy}
          onClick={signIn}
        >
          {t.auth.continueWithApple}
        </Button>
      </div>
    </Card>
  );
};
