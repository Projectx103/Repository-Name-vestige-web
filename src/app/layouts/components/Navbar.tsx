import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { UserMenu } from './UserMenu';
import { MobileNav } from './MobileNav';

function MenuIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 5h14M3 10h14M3 15h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Flat, simple category navigation — no Mega Menu (18 - Component
 * Inventory.md §9's explicit exclusion). Category links are placeholders
 * pointing at ROUTES.shop for now; real per-category paths depend on live
 * category data, which doesn't exist until M5 wires up the catalog.
 */
export function Navbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="border-b border-stone bg-paper dark:border-stone-dark dark:bg-ink-dark">
      <div className="mx-auto flex max-w-container-full items-center justify-between gap-md px-md py-sm">
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          className="text-ink tablet:hidden dark:text-paper-dark"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>

        <Link to={ROUTES.home} className="font-display text-heading text-ink dark:text-paper-dark">
          VESTIGE
        </Link>

        <nav className="hidden gap-lg tablet:flex" aria-label="Primary">
          <Link
            to={ROUTES.shop}
            className="text-body-sm text-ink hover:opacity-hover dark:text-paper-dark"
          >
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-md">
          <UserMenu />
        </div>
      </div>

      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </header>
  );
}
