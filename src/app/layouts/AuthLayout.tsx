import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

/**
 * Bare shell for /login, /register, /forgot-password, /reset-password
 * (10 - Folder Structure.md §12) — no navigation dependency, just a logo
 * mark (16 - UI Implementation Roadmap.md §7's Phase C note).
 */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-md py-lg dark:bg-ink-dark">
      <Link
        to={ROUTES.home}
        className="mb-lg font-display text-heading text-ink dark:text-paper-dark"
      >
        VESTIGE
      </Link>
      <div className="w-full max-w-container-form">
        <Outlet />
      </div>
    </div>
  );
}
