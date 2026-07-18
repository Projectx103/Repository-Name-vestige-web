/**
 * functions/src/auth/onUserCreate.test.ts
 *
 * v1 Auth triggers don't have the .run() shortcut v2 callables do (see
 * setUserRole.test.ts for that pattern instead) — firebase-functions-test's
 * wrap() is the standard way to invoke one directly.
 *
 * Important: the fake UserRecord passed to the wrapped handler must
 * correspond to a REAL user actually created in the Auth emulator first —
 * onUserCreate calls real admin.auth().setCustomUserClaims(uid, ...) against
 * whatever uid it's given, which fails if that uid doesn't exist yet. So
 * each test creates a real emulator user via admin.auth().createUser() and
 * passes that exact UserRecord into the wrapped function, rather than a
 * synthetic/fake one.
 *
 * Run with: npm run test (from functions/), which wraps
 * `firebase emulators:exec` so auth+firestore start automatically.
 */
import { afterAll, describe, expect, it } from 'vitest';
import functionsTest from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { onUserCreate } from './onUserCreate';

const testEnv = functionsTest({ projectId: 'demo-vestige' });
const wrappedOnUserCreate = testEnv.wrap(onUserCreate);

afterAll(() => {
  testEnv.cleanup();
});

describe('onUserCreate', () => {
  it('sets the default buyer role and creates a matching profile document', async () => {
    const uid = `test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const email = `${uid}@example.com`;

    const userRecord = await admin.auth().createUser({ uid, email, emailVerified: false });
    await wrappedOnUserCreate(userRecord);

    const updatedUser = await admin.auth().getUser(uid);
    expect(updatedUser.customClaims?.roles).toEqual(['buyer']);

    const profileSnap = await admin.firestore().collection('users').doc(uid).get();
    expect(profileSnap.exists).toBe(true);
    const profile = profileSnap.data();
    expect(profile?.uid).toBe(uid);
    expect(profile?.email).toBe(email);
    expect(profile?.roles).toEqual(['buyer']);
    expect(profile?.emailVerified).toBe(false);
    expect(profile?.defaultShippingAddressId).toBeNull();
  });

  it('never grants any role beyond buyer, regardless of anything about the account', async () => {
    const uid = `test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const userRecord = await admin.auth().createUser({ uid, email: `${uid}@example.com` });
    await wrappedOnUserCreate(userRecord);

    const updatedUser = await admin.auth().getUser(uid);
    // Exactly ['buyer'] — not a superset, not empty, not anything else.
    expect(updatedUser.customClaims?.roles).toEqual(['buyer']);
  });

  it('derives a displayName from the email local-part when none is provided', async () => {
    const uid = `test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const userRecord = await admin.auth().createUser({ uid, email: `janedoe-${uid}@example.com` });
    await wrappedOnUserCreate(userRecord);

    const profileSnap = await admin.firestore().collection('users').doc(uid).get();
    expect(profileSnap.data()?.displayName).toBe(`janedoe-${uid}`);
  });
});
