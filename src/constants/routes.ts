/**
 * Route path constants. No feature page imports a raw string literal path —
 * every <Route path> and every navigate()/Link call references these, so a
 * typo in a path is a compile-time error, not a silent broken link
 * (10 - Folder Structure.md §10 — "no magic strings for status/enum/route values").
 *
 * Only top-level route groups are declared in Sprint 1; individual page paths
 * are added milestone-by-milestone as their features are built (M5+).
 */
export const ROUTES = {
  home: '/',
  shop: '/shop',
  account: '/account',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  admin: '/admin',
  /** Staff console routes — not yet wired into AppRouter (their pages are built in M10-M13); declared now so Sidebar's nav items have a real target to point at rather than a placeholder string. */
  adminProcurement: '/admin/procurement',
  adminCuration: '/admin/curation',
  adminPhotography: '/admin/photography',
  adminOrders: '/admin/orders',
  adminSupport: '/admin/support',
  adminReports: '/admin/reports',
  adminRoles: '/admin/settings/roles',
  /** Internal-only, not a real feature route — never linked from real navigation. */
  devComponents: '/dev/components',
  devLayouts: '/dev/layouts',
} as const;
