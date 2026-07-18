/**
 * scripts/bootstrapOwner.ts
 *
 * The one-time, out-of-band script to grant the FIRST Owner (super_admin)
 * role (14 - Development Roadmap.md M3, 06 - User Roles.md §1). This exists
 * because setUserRole itself requires an EXISTING Owner/Admin caller to
 * invoke it — there is no other path to create the very first admin
 * account, by design (06 - User Roles.md §8: "no self-service path to any
 * staff role"). This script uses the Admin SDK directly, bypassing that
 * function's own caller-authorization check, which is exactly why it must
 * stay out-of-band (run manually from a trusted machine) rather than
 * exposed as an API endpoint.
 *
 * Uses firebase-admin's modular API (initializeApp/getAuth/getFirestore from
 * their respective subpaths) rather than a namespace import — this script
 * runs under tsx's real ESM interpreter (unlike functions/, which compiles
 * to CommonJS), and `import * as admin from 'firebase-admin'` doesn't
 * reliably expose methods like initializeApp in that context.
 *
 * Usage:
 *   npx tsx scripts/bootstrapOwner.ts <email>
 *
 * Against the local Emulator Suite (default): just run the command above
 * with the emulator already running (npm run emulators in another terminal).
 *
 * Against a real project (staging/production): set GOOGLE_APPLICATION_CREDENTIALS
 * to a service account JSON path first. I have not tested this path myself —
 * it requires real project credentials I don't have access to; the emulator
 * path above is what I've actually verified structurally.
 */
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const emailArg = process.argv[2];

if (!emailArg) {
  console.error('Usage: npx tsx scripts/bootstrapOwner.ts <email>');
  process.exit(1);
}

if (process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  console.log('Running against the Emulator Suite.');
} else {
  console.log('No emulator host env vars detected — this will target a REAL Firebase project.');
  console.log('Make sure GOOGLE_APPLICATION_CREDENTIALS is set correctly before continuing.\n');
}

initializeApp({ projectId: 'demo-vestige' });
const auth = getAuth();
const db = getFirestore();

async function main() {
  const user = await auth.getUserByEmail(emailArg);
  const currentRoles = (user.customClaims?.roles as string[] | undefined) ?? ['buyer'];

  if (currentRoles.includes('super_admin')) {
    console.log(`${emailArg} already has the super_admin role. Nothing to do.`);
    return;
  }

  const newRoles = [...new Set([...currentRoles, 'super_admin'])];
  await auth.setCustomUserClaims(user.uid, { roles: newRoles });

  const now = FieldValue.serverTimestamp();

  await db.collection('users').doc(user.uid).update({
    roles: newRoles,
    updatedAt: now,
  });

  // Sentinel grantedByUid marks this as an out-of-band bootstrap action, not
  // a normal setUserRole call — distinguishable in the audit trail.
  await db.collection('roleGrants').add({
    subjectUid: user.uid,
    grantedByUid: 'bootstrap-script',
    action: 'granted',
    role: 'super_admin',
    createdAt: now,
  });

  console.log(`Granted super_admin to ${emailArg} (uid: ${user.uid}).`);
  console.log(`New roles: ${newRoles.join(', ')}`);
  console.log(
    '\nThe account must sign out and back in (or wait for its next token refresh) for this to take effect client-side.',
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Bootstrap failed:', err);
    process.exit(1);
  });
