import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
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
export const db: Firestore = getFirestore(firebaseApp);
export const functions: Functions = getFunctions(firebaseApp);

if (useFirebaseEmulators) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
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
