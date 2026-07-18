import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@vestige/shared-schemas';

const STAFF_ROLES: UserRole[] = ['procurement_staff', 'curator', 'ops_admin', 'super_admin'];

/**
 * 07 - User Flows.md §5 — staff accounts route to their role-appropriate
 * console, not the buyer-facing account page; Customers return to wherever
 * they were before being sent to /login, or /account by default. Staff
 * accounts always go to ROUTES.admin regardless of `fromPath`, since a
 * staff member landing on /login was never mid-checkout the way a buyer
 * might be — there's no meaningful "prior buyer page" for them to return to.
 */
export function getPostAuthRedirect(roles: UserRole[], fromPath?: string): string {
  const isStaff = roles.some((role) => STAFF_ROLES.includes(role));
  if (isStaff) {
    return ROUTES.admin;
  }
  return fromPath || ROUTES.account;
}
