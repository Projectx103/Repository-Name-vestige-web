import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/PageLoader';
import { BuyerLayout } from '@/app/layouts/BuyerLayout';
import { StaffLayout } from '@/app/layouts/StaffLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';

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
 * BuyerLayout route wraps public/account routes, an AuthLayout route wraps
 * the three real auth pages built this sprint, a StaffLayout route wraps
 * /admin routes (still all placeholder — those pages land in M10-M13).
 *
 * /dev/layouts/staff still previews StaffLayout with mock content, since no
 * real staff page exists yet to exercise it. The equivalent auth preview is
 * gone — /login, /register, /forgot-password are real pages now.
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

      <Route element={<AuthLayout />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
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
    </Routes>
  );
}
