'use client';

import { ToastProvider } from '@kiichan/design-system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { SessionExpiryGuard } from '@/features/account/components/session-expiry-guard';
import { staleTimes } from '@/lib/query-keys';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: staleTimes.products,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );
  const [toastsReady, setToastsReady] = useState(false);

  useEffect(() => {
    setToastsReady(true);
  }, []);

  return (
    <QueryClientProvider client={client}>
      {children}
      {toastsReady ? (
        <ToastProvider>
          <SessionExpiryGuard />
        </ToastProvider>
      ) : null}
    </QueryClientProvider>
  );
};
