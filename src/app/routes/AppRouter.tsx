import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

/**
 * Root route tree.
 *
 * Sprint 1 scope is routing *structure* only — no page components exist yet
 * (those arrive feature-by-feature starting at M3's auth pages and M5's
 * catalog pages). The single index route below renders an inline placeholder
 * so the app has something to mount, satisfying M0's acceptance criterion
 * ("the Vite dev server renders a blank app shell with Tailwind tokens
 * applied") without pre-building any actual page.
 *
 * As pages land, each route below is replaced with a lazy-loaded page import
 * (route-based code splitting, per 21 - Frontend Architecture.md §9) — the
 * <Routes> structure itself does not need to change shape to accommodate that.
 */
export function AppRouter() {
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
    </Routes>
  );
}
