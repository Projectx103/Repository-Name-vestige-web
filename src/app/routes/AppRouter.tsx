import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/PageLoader';

// Lazy-loaded: this is a dev-only tool, not a real feature — it should never
// add weight to the main bundle that real buyers/staff download.
const ComponentPreviewPage = lazy(() =>
  import('@/features/dev-components/ComponentPreviewPage').then((m) => ({
    default: m.ComponentPreviewPage,
  })),
);

/**
 * Root route tree.
 *
 * The route tree does not render until AuthContext has resolved its initial
 * auth state (21 - Frontend Architecture.md §2's bootstrap sequence) — this
 * prevents a flash of unauthenticated content or an incorrect ProtectedRoute
 * redirect firing before the real auth state is known. A single, brief
 * PageLoader covers this window, never a longer/more elaborate splash screen.
 *
 * As pages land, each route below is replaced with a lazy-loaded page import
 * (route-based code splitting, per 21 - Frontend Architecture.md §9) — the
 * <Routes> structure itself does not need to change shape to accommodate that.
 */
export function AppRouter() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Routes>
      <Route
        path={ROUTES.home}
        element={
          <main className="flex min-h-screen flex-col items-center justify-center gap-sm bg-paper px-md dark:bg-ink-dark">
            <h1 className="font-display text-display-md text-ink dark:text-paper-dark">VESTIGE</h1>
            <p className="font-body text-body-md text-ink-muted dark:text-paper-dark-muted">
              Project foundation ready.
            </p>
          </main>
        }
      />
      <Route
        path={ROUTES.devComponents}
        element={
          <Suspense fallback={null}>
            <ComponentPreviewPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
