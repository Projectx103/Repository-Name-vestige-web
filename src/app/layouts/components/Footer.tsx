import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

/**
 * 18 - Component Inventory.md §7. FAQ/Help/About routes are declared in
 * 17 - Screen Inventory.md §1.9-1.11 but not yet added to ROUTES/AppRouter —
 * those pages are content-only (Tier 3, 25 - Testing Strategy.md §3) and
 * land whenever convenient relative to feature milestones, not gating
 * anything. Linking only to what's actually routed today (Shop) rather than
 * inventing placeholder hrefs for pages that don't exist yet.
 */
export function Footer() {
  return (
    <footer className="border-t border-stone bg-paper px-md py-lg dark:border-stone-dark dark:bg-ink-dark">
      <div className="mx-auto flex max-w-container-full flex-col items-center gap-sm text-center">
        <Link to={ROUTES.home} className="font-display text-body-lg text-ink dark:text-paper-dark">
          VESTIGE
        </Link>
        <nav className="flex gap-md" aria-label="Footer">
          <Link
            to={ROUTES.shop}
            className="text-body-sm text-ink-muted hover:text-ink dark:text-paper-dark-muted dark:hover:text-paper-dark"
          >
            Shop
          </Link>
        </nav>
        <p className="text-body-sm text-ink-muted dark:text-paper-dark-muted">
          &copy; {new Date().getFullYear()} VESTIGE
        </p>
      </div>
    </footer>
  );
}
