import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { onIdTokenChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { UserRole } from '@vestige/shared-schemas';

export interface AuthContextValue {
  user: User | null;
  /**
   * The real, authoritative claim shape is always an array (11 - Security.md
   * §2 — request.auth.token.roles), never a single value — a staff member's
   * claims are, e.g., ['buyer', 'curator'], not just 'curator'. This
   * deliberately differs from 23 - State Management.md §6's documented
   * `role: Role | null` shape, which can't represent a multi-role account
   * without an arbitrary "pick one" rule. Matching the real data shape
   * correctly took priority over literal compliance with that table —
   * flagged here rather than silently decided.
   */
  roles: UserRole[];
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Uses onIdTokenChanged, not onAuthStateChanged — the former is a strict
 * superset (fires on sign-in/out AND on every token refresh), which matters
 * because custom claims (role) are "only reflected after a token refresh"
 * (11 - Security.md §1). onAuthStateChanged alone would miss a role change
 * that takes effect via the SDK's silent background token renewal.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setRoles([]);
        setIsLoading(false);
        return;
      }

      const tokenResult = await nextUser.getIdTokenResult();
      const claimedRoles = (tokenResult.claims.roles as UserRole[] | undefined) ?? [];

      setUser(nextUser);
      setRoles(claimedRoles);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, roles, isLoading }),
    [user, roles, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
