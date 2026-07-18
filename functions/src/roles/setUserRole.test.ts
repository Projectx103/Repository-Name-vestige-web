/**
 * functions/src/roles/setUserRole.test.ts
 *
 * Uses the v2 callable function's built-in `.run(request)` method — the
 * documented, intentional testing API for firebase-functions v2 callables —
 * rather than firebase-functions-test's wrap(), which is really aimed at v1
 * triggers (see onUserCreate.test.ts for that pattern instead).
 *
 * Run with: npm run test (from functions/), which wraps
 * `firebase emulators:exec` so auth+firestore start automatically.
 */
import { describe, expect, it } from 'vitest';
import * as admin from 'firebase-admin';
import { setUserRole } from './setUserRole';

if (admin.apps.length === 0) {
  admin.initializeApp({ projectId: 'demo-vestige' });
}

/** Creates a real emulator Auth user with the given roles as custom claims, plus a matching users/{uid} doc. */
async function createTestUser(roles: string[]) {
  const uid = `test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await admin.auth().createUser({ uid, email: `${uid}@example.com` });
  await admin.auth().setCustomUserClaims(uid, { roles });
  await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .set({
      uid,
      email: `${uid}@example.com`,
      displayName: 'Test User',
      roles,
      defaultShippingAddressId: null,
      emailVerified: false,
      notificationPrefs: { orderUpdates: true, wishlistAlerts: true, marketing: false },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  return uid;
}

describe('setUserRole', () => {
  it('Owner (super_admin) can grant curator to a buyer', async () => {
    const ownerUid = await createTestUser(['buyer', 'super_admin']);
    const subjectUid = await createTestUser(['buyer']);

    const result = await setUserRole.run({
      data: { subjectUid, role: 'curator', action: 'granted' },
      auth: { uid: ownerUid, token: { roles: ['buyer', 'super_admin'] } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    expect((result as { roles: string[] }).roles).toContain('curator');
    const subjectRecord = await admin.auth().getUser(subjectUid);
    expect(subjectRecord.customClaims?.roles).toContain('curator');
  });

  it('Admin (ops_admin) CANNOT grant super_admin — the conservative scoping decision', async () => {
    const adminUid = await createTestUser(['buyer', 'ops_admin']);
    const subjectUid = await createTestUser(['buyer']);

    await expect(
      setUserRole.run({
        data: { subjectUid, role: 'super_admin', action: 'granted' },
        auth: { uid: adminUid, token: { roles: ['buyer', 'ops_admin'] } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any),
    ).rejects.toThrow();
  });

  it('Admin (ops_admin) CAN grant curator — within their allowed scope', async () => {
    const adminUid = await createTestUser(['buyer', 'ops_admin']);
    const subjectUid = await createTestUser(['buyer']);

    const result = await setUserRole.run({
      data: { subjectUid, role: 'curator', action: 'granted' },
      auth: { uid: adminUid, token: { roles: ['buyer', 'ops_admin'] } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    expect((result as { roles: string[] }).roles).toContain('curator');
  });

  it('a buyer cannot call setUserRole at all', async () => {
    const buyerUid = await createTestUser(['buyer']);
    const subjectUid = await createTestUser(['buyer']);

    await expect(
      setUserRole.run({
        data: { subjectUid, role: 'curator', action: 'granted' },
        auth: { uid: buyerUid, token: { roles: ['buyer'] } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any),
    ).rejects.toThrow();
  });

  it('an unauthenticated call is rejected', async () => {
    const subjectUid = await createTestUser(['buyer']);

    await expect(
      setUserRole.run({
        data: { subjectUid, role: 'curator', action: 'granted' },
        auth: undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any),
    ).rejects.toThrow();
  });

  it('revoking a role removes it but keeps buyer as the baseline', async () => {
    const ownerUid = await createTestUser(['buyer', 'super_admin']);
    const subjectUid = await createTestUser(['buyer', 'curator']);

    const result = await setUserRole.run({
      data: { subjectUid, role: 'curator', action: 'revoked' },
      auth: { uid: ownerUid, token: { roles: ['buyer', 'super_admin'] } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    expect((result as { roles: string[] }).roles).not.toContain('curator');
    expect((result as { roles: string[] }).roles).toContain('buyer');
  });

  it('an invalid role value is rejected', async () => {
    const ownerUid = await createTestUser(['buyer', 'super_admin']);
    const subjectUid = await createTestUser(['buyer']);

    await expect(
      setUserRole.run({
        data: { subjectUid, role: 'not_a_real_role', action: 'granted' },
        auth: { uid: ownerUid, token: { roles: ['buyer', 'super_admin'] } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any),
    ).rejects.toThrow();
  });
});
