import { InlineSpinner } from './InlineSpinner';

/**
 * Full-page/full-view loading indicator (04 - Design System.md §16.2) — a
 * small, centered, understated mark, never a large animated brand moment.
 * Used for initial app load and route-level transitions (19 - Component-to-
 * Screen Mapping.md §2 — cross-cutting, appears on every screen's initial load).
 */
export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-ink-dark">
      <div className="flex flex-col items-center gap-xs">
        <InlineSpinner className="h-6 w-6 text-ink dark:text-paper-dark" />
        {/* Plain, factual copy only (§16.3) — no personality ("Just a moment..."). */}
        <p className="text-body-sm text-ink-muted dark:text-paper-dark-muted">Loading...</p>
      </div>
    </div>
  );
}
