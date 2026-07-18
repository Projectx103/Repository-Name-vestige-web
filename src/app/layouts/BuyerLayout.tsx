import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export interface BuyerLayoutProps {
  /** Checkout uses this — no full nav/footer, to reduce checkout-abandonment distraction (17 - Screen Inventory.md §1.7). */
  minimalChrome?: boolean;
}

/**
 * Header/nav/footer shell for all public + /account routes
 * (10 - Folder Structure.md §12). No business logic — only structural
 * chrome and the outlet for nested route content.
 */
export function BuyerLayout({ minimalChrome = false }: BuyerLayoutProps) {
  if (minimalChrome) {
    return (
      <div className="flex min-h-screen flex-col bg-paper dark:bg-ink-dark">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper dark:bg-ink-dark">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
