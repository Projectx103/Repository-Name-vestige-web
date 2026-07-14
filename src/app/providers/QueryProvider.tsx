import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_QUERY_STALE_TIME_MS } from '@/constants/config';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * TanStack Query is the sole mechanism for server state (listings, orders,
 * wishlists, etc.) per 15 - Coding Standards & AI Development Rules.md §6 —
 * real-time state uses Firestore onSnapshot instead (bridged via a dedicated
 * hook, built alongside the features that need it).
 *
 * The QueryClient is created inside useState rather than as a module-level
 * singleton so each app instance (relevant for testing) gets its own cache.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: DEFAULT_QUERY_STALE_TIME_MS,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
