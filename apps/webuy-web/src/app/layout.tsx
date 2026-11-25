import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { GtmScript } from '@/features/shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'WeBuy',
  description: 'WeBuy ecommerce storefront',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GtmScript />
        {children}
        <div id="webuy-ai-assistant-root" className="pointer-events-none fixed bottom-4 right-4 z-50" />
      </body>
    </html>
  );
}
