import { cloudinaryEnvConfig } from '@/utils/env';

/**
 * Cloudinary client configuration — cloud name and unsigned upload preset only.
 *
 * This is intentionally minimal for Sprint 1: no upload client, no signature
 * fetching, no transformation-preset helpers yet. Those are M4's scope
 * (09 - Cloudinary Strategy.md §2, 14 - Development Roadmap.md M4) and depend on
 * the auth/role infrastructure built in M3. Building them now would be getting
 * ahead of the milestone sequence.
 *
 * Per 11 - Security.md §11 and 21 - Frontend Architecture.md §10: the Cloudinary
 * API secret never appears in this file, or anywhere in the frontend bundle.
 */
export const cloudinaryConfig = {
  cloudName: cloudinaryEnvConfig.cloudName,
  uploadPreset: cloudinaryEnvConfig.uploadPreset,
  baseDeliveryUrl: `https://res.cloudinary.com/${cloudinaryEnvConfig.cloudName}`,
} as const;
