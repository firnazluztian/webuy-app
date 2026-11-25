import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button, Input } from '@kiichan/design-system';

interface LoginProps {
  onLogin: (email: string, password: string) => boolean;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      nextErrors.email = 'Enter your email.';
    }
    if (!password) {
      nextErrors.password = 'Enter your password.';
    }
    if (nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors);
      setError(false);
      return;
    }

    setFieldErrors({});
    const ok = onLogin(email.trim(), password);
    setError(!ok);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-primary">WeBuy</h1>
          <p className="text-sm text-neutral-600">Backoffice sign in</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="username"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setFieldErrors((current) => ({ ...current, email: undefined }));
            }}
            placeholder="you@webuy.com"
            rounded="xl"
            size="md"
            error={Boolean(fieldErrors.email)}
            errorText={fieldErrors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setFieldErrors((current) => ({ ...current, password: undefined }));
            }}
            placeholder="••••••••"
            rounded="xl"
            size="md"
            error={Boolean(fieldErrors.password)}
            errorText={fieldErrors.password}
            required
          />

          {error ? (
            <p className="text-sm text-red-600">Unable to sign in. Check your credentials.</p>
          ) : null}

          <Button type="submit" variant="primary" size="md" rounded="xl">
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
};
