import { z } from 'zod';
import { countryCodeSchema } from './common';

/** Fields submitted via the Addresses form (08 - Firestore Schema.md §6.2). ownerUid is set server-side from the authenticated caller, never client-submitted. */
export const addressInputSchema = z.object({
  label: z.string().min(1),
  fullName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().nullable(),
  city: z.string().min(1),
  region: z.string().min(1),
  postalCode: z.string().min(1),
  country: countryCodeSchema,
  phone: z.string().min(1),
  isDefault: z.boolean(),
});
export type AddressInput = z.infer<typeof addressInputSchema>;

/** Full document shape. */
export interface AddressDocument extends AddressInput {
  ownerUid: string;
}
