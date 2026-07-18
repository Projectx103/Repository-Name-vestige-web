import type { FirebaseError } from 'firebase/app';

/**
 * Maps Firebase Auth error codes to the exact inline copy specified in
 * 07 - User Flows.md §13.5 — critically, wrong-password and no-such-account
 * map to the SAME generic message, since revealing which one is wrong lets
 * an attacker enumerate valid emails. Never split these into more specific
 * messages, even though Firebase's own error codes distinguish them.
 */
export function getAuthErrorMessage(error: unknown): string {
  const code = (error as FirebaseError | undefined)?.code;

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';

    case 'auth/account-exists-with-different-credential':
      return 'This account uses Google sign-in — try that instead.';

    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';

    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';

    case 'auth/weak-password':
      return 'Choose a stronger password (at least 6 characters).';

    case 'auth/invalid-email':
      return 'Enter a valid email address.';

    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';

    default:
      return 'Something went wrong. Please try again.';
  }
}
