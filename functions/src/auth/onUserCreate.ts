/**
 * functions/src/auth/onUserCreate.ts
 *
 * Fires whenever a new Firebase Auth account is created (email/password OR
 * Google OAuth — both go through the same underlying Auth user-creation
 * event, 11 - Security.md §1). Two responsibilities:
 *   1. Set the default `buyer` custom claim — the ONLY role ever granted at
 *      account creation (06 - User Roles.md §8: "no self-service path to
 *      any staff role"). This is the sole authorization-relevant write.
 *   2. Create the users/{uid} profile document (08 - Firestore Schema.md §6.1).
 *      Its `roles` field is a read-only DISPLAY MIRROR only — Security Rules
 *      and every Cloud Function authorize against the custom claim above,
 *      never this field (11 - Security.md §2, the single most important
 *      rule in that document).
 *
 * Uses the v1 Auth trigger (functions.auth.user().onCreate) rather than a
 * v2 identity "blocking function" — this is a reactive side-effect after
 * creation, not a gate that needs to block/modify the sign-up itself, so
 * the simpler, well-established v1 pattern is the correct fit, not v2's
 * more complex blocking-function API.
 */
import * as functionsV1 from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const onUserCreate = functionsV1.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const email = user.email ?? '';
  const displayName = user.displayName || (email ? email.split('@')[0] : 'New Buyer');

  // Default role: buyer, always. No other claim is ever set here.
  await admin.auth().setCustomUserClaims(uid, { roles: ['buyer'] });

  const now = admin.firestore.FieldValue.serverTimestamp();
  await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .set({
      uid,
      email,
      displayName,
      // Display mirror only — see file header. Kept in sync with the custom
      // claim by this function and by setUserRole, but never read for authorization.
      roles: ['buyer'],
      defaultShippingAddressId: null,
      emailVerified: user.emailVerified,
      notificationPrefs: {
        orderUpdates: true,
        wishlistAlerts: true,
        marketing: false,
      },
      createdAt: now,
      updatedAt: now,
    });
});
