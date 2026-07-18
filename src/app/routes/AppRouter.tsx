import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/PageLoader';
import { BuyerLayout } from '@/app/layouts/BuyerLayout';
import { StaffLayout } from '@/app/layouts/StaffLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';

// Lazy-loaded: dev-only tools, never add weight to the real buyer/staff bundle.
const ComponentPreviewPage = lazy(() =>
  import('@/features/dev-components/ComponentPreviewPage').then((m) => ({
    default: m.ComponentPreviewPage,
  })),
);

/**
 * Root route tree.
 *
 * The route tree does not render until AuthContext has resolved its initial
 * auth state (21 - Frontend Architecture.md §2's bootstrap sequence) — a
 * single, brief PageLoader covers this window.
 *
 * Nested routes mirror the layouts (10 - Folder Structure.md §14): a
 * BuyerLayout route wraps public/account routes, a StaffLayout route wraps
 * /admin routes. Only the homepage is real content so far — everything else
 * (Shop, Login, the whole /admin tree) is still a placeholder route,
 * replaced page-by-page in later sprints/milestones without needing to
 * change this nesting shape.
 *
 * /dev/layouts previews StaffLayout and AuthLayout with mock content — real
 * nested <Route> structure, not a fake wrapper, since <Outlet /> only
 * resolves within an actual route match. Removed once M9/M13's real staff
 * and account pages exist to exercise these layouts for real.
 */
export function AppRouter() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Routes>
      <Route element={<BuyerLayout />}>
        <Route
          path={ROUTES.home}
          element={
            <main className="flex min-h-screen flex-col items-center justify-center gap-sm px-md">
              <h1 className="font-display text-display-md text-ink dark:text-paper-dark">
                VESTIGE
              </h1>
              <p className="font-body text-body-md text-ink-muted dark:text-paper-dark-muted">
                Project foundation ready.
              </p>
            </main>
          }
        />
      </Route>

      <Route
        path={ROUTES.devComponents}
        element={
          <Suspense fallback={null}>
            <ComponentPreviewPage />
          </Suspense>
        }
      />

      {/* Dev-only layout preview — see file header. */}
      <Route path={`${ROUTES.devLayouts}/staff`} element={<StaffLayout />}>
        <Route
          index
          element={
            <div className="text-body-md text-ink dark:text-paper-dark">
              StaffLayout preview — mock console content goes here.
            </div>
          }
        />
      </Route>
      <Route path={`${ROUTES.devLayouts}/auth`} element={<AuthLayout />}>
        <Route
          index
          element={
            <div className="rounded border border-stone p-md text-body-md text-ink dark:border-stone-dark dark:text-paper-dark">
              AuthLayout preview — a real Login form goes here (Sprint 16).
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
