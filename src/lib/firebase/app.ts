import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator, type Functions } from 'firebase/functions';
import { isSupported, getAnalytics, type Analytics } from 'firebase/analytics';
import { firebaseEnvConfig, useFirebaseEmulators } from '@/utils/env';

/**
 * Single Firebase app instance and its service handles, initialized once at
 * module load. Every other module (typed collection helpers, AuthContext,
 * Cloud Function callable wrappers) imports `auth` / `db` / `functions` from
 * here — nothing outside this file calls `initializeApp`/`getAuth`/etc.
 * directly (00 - Project Constitution.md §5, 21 - Frontend Architecture.md §8).
 *
 * No Firebase Storage import exists here or anywhere in this project — media
 * is Cloudinary-only (08 - Firestore Schema.md §11, 09 - Cloudinary Strategy.md).
 */
export const firebaseApp: FirebaseApp = initializeApp(firebaseEnvConfig);

export const auth: Auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
export const db: Firestore = getFirestore(firebaseApp);
export const functions: Functions = getFunctions(firebaseApp);

/**
 * Codespaces forwards each port to its own subdomain
 * (`<codespace-name>-<port>.app.github.dev`) over HTTPS. Inside a browser
 * tab accessing Codespaces over the web, `127.0.0.1` resolves to the
 * person's own machine, NOT the remote container — a direct
 * `127.0.0.1:PORT` connection from client-side JS silently fails there
 * (ERR_CONNECTION_REFUSED), even though it works perfectly for anyone on an
 * actual local machine. Swapping the current forwarded port for the target
 * one in the hostname routes correctly through Codespaces' own proxy either way.
 */
function getEmulatorHost(targetPort: number): string {
  const { hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '127.0.0.1';
  }
  return hostname.replace(/-\d+\./, `-${targetPort}.`);
}

if (useFirebaseEmulators) {
  const isTunneled =
    window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  if (isTunneled) {
    connectAuthEmulator(auth, `https://${getEmulatorHost(9099)}`, { disableWarnings: true });
    // `ssl` is a real, supported runtime option (confirmed directly in
    // @firebase/firestore's source) — the type error here comes from a
    // stale/duplicate type declaration elsewhere in node_modules, not an
    // actual API gap. Double-assertion through `unknown` to bypass the
    // incorrect structural check, rather than fighting the node_modules layout.
    connectFirestoreEmulator(db, getEmulatorHost(8080), 443, { ssl: true } as unknown as Parameters<
      typeof connectFirestoreEmulator
    >[3]);
    // Cloud Functions aren't called from the frontend yet (nothing wired in
    // through M3) — left on the plain local address since it isn't
    // exercised yet, rather than guessing at a fix for an untested path.
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  } else {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  }
}

/**
 * Firebase Analytics — approved as a stack addition alongside the Constitution's
 * original list (Auth, Firestore, Cloudinary, Hosting), not a silent extra.
 *
 * Deliberately NOT initialized eagerly at module load like the other services:
 * `getAnalytics()` throws in unsupported environments (SSR, some browsers,
 * private-browsing modes) and has nothing meaningful to measure against the
 * Emulator Suite. `initAnalytics()` is called explicitly (e.g. from
 * AppProviders once that's wired up) and resolves to `null` wherever it
 * shouldn't run, rather than the app crashing on load.
 */
let analyticsInstance: Analytics | null = null;

export async function initAnalytics(): Promise<Analytics | null> {
  if (useFirebaseEmulators || !firebaseEnvConfig.measurementId) {
    return null;
  }
  if (analyticsInstance) {
    return analyticsInstance;
  }
  const supported = await isSupported();
  if (!supported) {
    return null;
  }
  analyticsInstance = getAnalytics(firebaseApp);
  return analyticsInstance;
}
