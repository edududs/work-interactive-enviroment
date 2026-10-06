'use client';

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { reportError } from '@/shared/adapters/report-error';

/** The screen shows a friendly message; the failure itself goes to reportError. */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        reportError(error, `query ${JSON.stringify(query.queryKey)}`);
      },
    }),
  });
}

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(createQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
