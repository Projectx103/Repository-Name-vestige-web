import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, AuthProvider } from '@/contexts';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { ToastProvider } from '@/components/ui/Toast';
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
 * Ordering: Router outermost (ProtectedRoute needs routing context, and Auth
 * needs to be available to anything Router renders) → top-level ErrorBoundary
 * → Auth (foundational — the bootstrap sequence in 21 - Frontend
 * Architecture.md §2 requires auth state to resolve before the route tree
 * itself renders, which AppRouter checks via useAuth()) → Theme → Query →
 * Toast (innermost — doesn't depend on the others).
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
        <AuthProvider>
          <ThemeProvider>
            <QueryProvider>
              <ToastProvider>{children}</ToastProvider>
            </QueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
