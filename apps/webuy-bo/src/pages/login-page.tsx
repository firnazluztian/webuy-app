import { Button } from '@kiichan/design-system';

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-primary">WeBuy</h1>
          <p className="text-sm text-neutral-600">Backoffice sign in</p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label className="flex flex-col gap-1.5 text-sm text-neutral-700">
            Email
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="you@webuy.com"
              className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-neutral-700">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-primary"
            />
          </label>

          <Button type="submit" variant="primary" size="md" rounded="xl" fullWidth>
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}
