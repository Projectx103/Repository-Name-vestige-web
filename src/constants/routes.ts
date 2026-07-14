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
} as const;
