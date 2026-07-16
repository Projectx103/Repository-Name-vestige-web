import { z } from 'zod';
import type { FirestoreTimestamp } from './common';

/**
 * Mirror of custom claims — read-only display purposes ONLY. Security Rules
 * and Cloud Functions must authorize against request.auth.token.roles (the
 * actual custom claim), NEVER this field (11 - Security.md §11 — this is a
 * spoofable-if-trusted surface, called out as one of the most important
 * rules in the whole schema).
 */
export const userRoleSchema = z.enum(['buyer', 'procurement_staff', 'curator', 'ops_admin', 'super_admin']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const notificationPrefsSchema = z.object({
  orderUpdates: z.boolean(),
  wishlistAlerts: z.boolean(),
  marketing: z.boolean(),
});

/** Fields a user can actually submit (Account Settings form) — excludes server-managed fields (uid, roles, timestamps). */
export const userProfileUpdateSchema = z.object({
  displayName: z.string().min(1),
  defaultShippingAddressId: z.string().nullable(),
  notificationPrefs: notificationPrefsSchema,
});
export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;

/** Full document shape as read from Firestore (08 - Firestore Schema.md §6.1). */
export interface UserDocument {
  uid: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  defaultShippingAddressId: string | null;
  emailVerified: boolean;
  notificationPrefs: z.infer<typeof notificationPrefsSchema>;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}
