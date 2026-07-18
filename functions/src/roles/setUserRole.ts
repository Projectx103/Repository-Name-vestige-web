/**
 * functions/src/roles/setUserRole.ts
 *
 * The ONLY way any staff role is ever granted or revoked (06 - User Roles.md
 * §8: "no self-service path to any staff role exists anywhere in the UI or
 * API"). Callable, admin-gated, defense-in-depth re-verified independently
 * of Firestore Security Rules (11 - Security.md §2 — "every Cloud Function
 * independently re-verifies the caller's role... since callable functions
 * execute under the Admin SDK and bypass Security Rules entirely").
 *
 * ── Privilege-scoping judgment call (flagged, not silently decided) ────────
 * 17 - Screen Inventory.md §7.2 says Admin's grant scope is "Inventory
 * Staff/Photographer/Customer Service only." But Inventory Staff and
 * Photographer both share the `curator` claim, and — per an earlier
 * reconciliation note — Customer Service shares the `ops_admin` claim with
 * Admin itself. Taken literally, that would let an Admin grant someone else
 * the exact same `ops_admin` claim Admin has: a privilege-escalation path.
 *
 * This function implements the CONSERVATIVE reading instead: `ops_admin`
 * (Admin) may only grant/revoke `procurement_staff` and `curator`. Only
 * `super_admin` (Owner) may grant/revoke `ops_admin` or `super_admin`
 * itself. If the "Admin can grant Customer Service" framing was meant to
 * permit Admin to hand out `ops_admin`, that needs an explicit, deliberate
 * decision from whoever owns this spec — not something to infer silently
 * here, given the security stakes.
 */
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const GRANTABLE_ROLES = ['procurement_staff', 'curator', 'ops_admin', 'super_admin'] as const;
type GrantableRole = (typeof GRANTABLE_ROLES)[number];

/** Roles an ops_admin (Admin) caller may grant/revoke — never ops_admin or super_admin itself. */
const OPS_ADMIN_GRANTABLE: GrantableRole[] = ['procurement_staff', 'curator'];

interface SetUserRoleRequest {
  subjectUid: string;
  role: GrantableRole;
  action: 'granted' | 'revoked';
}

export const setUserRole = onCall<SetUserRoleRequest>(async (request) => {
  const callerUid = request.auth?.uid;
  const callerRoles = (request.auth?.token?.roles as string[] | undefined) ?? [];

  if (!callerUid) {
    throw new HttpsError('unauthenticated', 'Must be signed in.');
  }

  const callerIsSuperAdmin = callerRoles.includes('super_admin');
  const callerIsOpsAdmin = callerRoles.includes('ops_admin');

  if (!callerIsSuperAdmin && !callerIsOpsAdmin) {
    throw new HttpsError('permission-denied', 'Only Owner or Admin may change roles.');
  }

  const { subjectUid, role, action } = request.data;

  if (!subjectUid || typeof subjectUid !== 'string') {
    throw new HttpsError('invalid-argument', 'subjectUid is required.');
  }
  if (!GRANTABLE_ROLES.includes(role)) {
    throw new HttpsError('invalid-argument', `role must be one of: ${GRANTABLE_ROLES.join(', ')}`);
  }
  if (action !== 'granted' && action !== 'revoked') {
    throw new HttpsError('invalid-argument', "action must be 'granted' or 'revoked'.");
  }

  // Conservative scoping — see file header.
  if (callerIsOpsAdmin && !callerIsSuperAdmin && !OPS_ADMIN_GRANTABLE.includes(role)) {
    throw new HttpsError('permission-denied', `Admin may not grant or revoke the "${role}" role.`);
  }

  const subjectUser = await admin.auth().getUser(subjectUid);
  const currentRoles = (subjectUser.customClaims?.roles as string[] | undefined) ?? ['buyer'];

  let newRoles: string[];
  if (action === 'granted') {
    newRoles = currentRoles.includes(role) ? currentRoles : [...currentRoles, role];
  } else {
    // 'buyer' is the baseline and is never removed by this function.
    newRoles = currentRoles.filter((r) => r !== role);
    if (!newRoles.includes('buyer')) {
      newRoles.push('buyer');
    }
  }

  await admin.auth().setCustomUserClaims(subjectUid, { roles: newRoles });

  const now = admin.firestore.FieldValue.serverTimestamp();

  // Keep the read-only display mirror on users/{uid} in sync (11 - Security.md §2).
  await admin.firestore().collection('users').doc(subjectUid).update({
    roles: newRoles,
    updatedAt: now,
  });

  // Append-only audit trail (08 - Firestore Schema.md §6.12).
  await admin.firestore().collection('roleGrants').add({
    subjectUid,
    grantedByUid: callerUid,
    action,
    role,
    createdAt: now,
  });

  return { success: true, roles: newRoles };
});
