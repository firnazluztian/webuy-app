import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BRAND_DESCRIPTION, BRAND_NAME } from '@/config/brand';
import { GtmScript } from '@/features/shell';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: BRAND_NAME,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GtmScript />
        {children}
        <div
          id="webuy-ai-assistant-root"
          className="pointer-events-none fixed bottom-4 right-4 z-50"
        />
      </body>
    </html>
  );
}
