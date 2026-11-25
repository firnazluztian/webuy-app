import { HomeCta } from '@/components/home-cta';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-5xl font-semibold tracking-tight text-primary">WeBuy</h1>
      <p className="max-w-md text-center text-neutral-600">
        Ecommerce storefront skeleton — kiichan design system wired.
      </p>
      <HomeCta />
    </main>
  );
}
