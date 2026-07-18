import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { UserMenu } from './components/UserMenu';
import { ROUTES } from '@/constants/routes';

/**
 * One shared shell for all /admin routes (10 - Folder Structure.md §12) —
 * not one layout per staff role; Sidebar's own nav-item filtering is the
 * only role-conditional logic. Desktop-first per 16 - UI Implementation
 * Roadmap.md §8 — usable but not optimized below the desktop breakpoint.
 */
export function StaffLayout() {
  return (
    <div className="flex min-h-screen bg-paper dark:bg-ink-dark">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-stone px-md py-sm dark:border-stone-dark">
          <Link
            to={ROUTES.admin}
            className="font-display text-heading text-ink dark:text-paper-dark"
          >
            VESTIGE Staff
          </Link>
          <UserMenu />
        </header>
        <main className="flex-1 px-md py-md">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
