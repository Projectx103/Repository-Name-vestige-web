import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * The single composition root for every app-wide provider. main.tsx renders
 * only <AppProviders><AppRouter /></AppProviders> — no provider is ever added
 * ad hoc elsewhere in the tree, so "what wraps the whole app" always has one
 * findable answer.
 *
 * AuthContext is deliberately absent here — it's built in M3 alongside the
 * role infrastructure it depends on, and will be added to this nesting at
 * that point rather than stubbed out now.
 *
 * Ordering: Router outermost (nothing here needs routing context itself, but
 * it must wrap everything that will use it) → top-level ErrorBoundary (catches
 * anything below, including provider-init issues) → Theme → Query.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <ErrorBoundary
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-paper px-md text-center font-body text-body-md text-ink dark:bg-ink-dark dark:text-paper-dark">
            Something went wrong. Please refresh the page.
          </div>
        }
      >
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
