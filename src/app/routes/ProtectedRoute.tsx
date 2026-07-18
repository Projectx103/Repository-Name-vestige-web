import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/PageLoader';
import { ErrorState } from '@/components/ui/ErrorState';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@vestige/shared-schemas';

export interface ProtectedRouteProps {
  children: ReactNode;
  /** Omit to require only "signed in, any role." Provide to require the user's roles to intersect this set. */
  allowedRoles?: UserRole[];
}

/**
 * 10 - Folder Structure.md §14 doesn't pin an exact file location for this
 * component — placed here in app/routes/ since it's routing infrastructure,
 * not a page or a shared UI component. Flagging the placement choice the
 * same way scripts/seed.ts's location was flagged in Sprint 11.
 *
 * A UI convenience only (§14) — the real authorization guarantee always
 * comes from Firestore Security Rules and Cloud Function checks, never this
 * client-side guard alone. Its job is a better user experience (an
 * immediate, correct redirect/message) on top of a boundary that's already
 * enforced server-side regardless of whether this component exists.
 *
 * Per 17 - Screen Inventory.md §8.2 ("Access Denied"): an under-permissioned
 * authenticated user sees an explanation in place, in whichever layout the
 * attempted route would have used — never a silent redirect with no
 * explanation. So this renders ErrorState directly rather than navigating
 * to a separate URL for the denied case.
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, roles, isLoading } = useAuth();
  const location = useLocation();

  // 21 - Frontend Architecture.md §2's bootstrap sequence: never redirect or
  // render denied-state before auth has actually resolved.
  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.some((role) => roles.includes(role))) {
    return (
      <ErrorState
        variant="page"
        message="You don't have access to this page with your current account."
      />
    );
  }

  return <>{children}</>;
}
