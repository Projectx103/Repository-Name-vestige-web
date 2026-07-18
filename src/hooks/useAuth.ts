import { useAuthContext } from '@/contexts';

/**
 * Current user + role, backed by AuthContext (10 - Folder Structure.md §6).
 * This is the hook every feature actually imports — components reach for
 * `useAuth()`, not `useAuthContext()` directly, keeping the Context
 * implementation detail out of feature code.
 */
export function useAuth() {
  return useAuthContext();
}
