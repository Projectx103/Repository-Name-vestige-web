/**
 * functions/src/media/getCloudinarySignature.ts
 *
 * Issues a short-lived, folder-scoped signed upload credential
 * (09 - Cloudinary Strategy.md §2.1). The Cloudinary API secret never
 * leaves this function — it's used only to compute a signature over the
 * upload params, which is all the client ever receives (11 - Security.md §11).
 *
 * ── Folder scoping ──────────────────────────────────────────────────────
 * `catalog/{listingId}/` — requires the `curator` claim (Photographer and
 * Inventory Staff currently share this single claim, per 06 - User Roles.md's
 * reconciliation note).
 * `branding/{subfolder}/` — requires `ops_admin` or `super_admin`
 * (09 - Cloudinary Strategy.md §1.1: "the only folder writable by roles
 * other than Photographer").
 *
 * ── A flagged spec gap, not silently resolved ──────────────────────────
 * 11 - Security.md §3's note on the Photographer/Inventory-Staff boundary
 * says enforcement here should check "a finer-grained permission profile
 * passed at call time" to distinguish Photographer from Inventory Staff
 * specifically — but no document I have access to defines what that
 * profile actually is (no separate claim/field exists in the schema for
 * it). This function checks the `curator` claim only, the same boundary
 * Security Rules themselves can enforce — it does NOT distinguish
 * Photographer from Inventory Staff within that claim, because I don't have
 * a defined mechanism to do so. If a stricter distinction is actually
 * needed here, that requires a deliberate decision (a new claim field or
 * an explicit convention) from whoever owns this spec, not an invented one.
 *
 * ── 60-second expiry ────────────────────────────────────────────────────
 * Cloudinary's own signature-timestamp tolerance is an account-level
 * setting I don't have access to configure or verify. This function
 * returns an explicit `expiresAt`, and the frontend upload client
 * (lib/cloudinary/uploadClient.ts) refuses to attempt an upload past that
 * window — application-layer enforcement of the 60-second requirement,
 * regardless of how loose/tight Cloudinary's own server-side tolerance
 * happens to be configured.
 */
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { v2 as cloudinary } from 'cloudinary';

const cloudinaryApiSecret = defineSecret('CLOUDINARY_API_SECRET');

const SIGNATURE_TTL_SECONDS = 60;

interface GetCloudinarySignatureRequest {
  /** Required for a catalog upload; omitted for a branding upload. */
  listingId?: string;
  target: 'catalog' | 'branding';
  /** Required only when target === 'branding' — e.g. 'logo' or 'marketing' (09 - Cloudinary Strategy.md §1). */
  brandingSubfolder?: string;
}

export const getCloudinarySignature = onCall<GetCloudinarySignatureRequest>(
  { secrets: [cloudinaryApiSecret] },
  (request) => {
    const callerRoles = (request.auth?.token?.roles as string[] | undefined) ?? [];

    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in.');
    }

    const { target, listingId, brandingSubfolder } = request.data;

    let folder: string;

    if (target === 'catalog') {
      if (!callerRoles.includes('curator')) {
        throw new HttpsError(
          'permission-denied',
          'Only staff with catalog curation access may upload listing photos.',
        );
      }
      if (!listingId) {
        throw new HttpsError('invalid-argument', 'listingId is required for a catalog upload.');
      }
      folder = `catalog/${listingId}`;
    } else if (target === 'branding') {
      const isAdminOrOwner =
        callerRoles.includes('ops_admin') || callerRoles.includes('super_admin');
      if (!isAdminOrOwner) {
        throw new HttpsError(
          'permission-denied',
          'Only Admin or Owner may upload branding assets.',
        );
      }
      if (!brandingSubfolder) {
        throw new HttpsError(
          'invalid-argument',
          'brandingSubfolder is required for a branding upload.',
        );
      }
      folder = `branding/${brandingSubfolder}`;
    } else {
      throw new HttpsError('invalid-argument', "target must be 'catalog' or 'branding'.");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = { folder, timestamp };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudinaryApiSecret.value());

    return {
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      expiresAt: (timestamp + SIGNATURE_TTL_SECONDS) * 1000, // ms, for direct comparison against Date.now() client-side
    };
  },
);
