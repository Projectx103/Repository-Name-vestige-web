import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

interface SignatureResponse {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
  /** Unix ms — see getCloudinarySignature.ts's header for why this is enforced here, not just Cloudinary-side. */
  expiresAt: number;
}

export interface UploadResult {
  secureUrl: string;
  publicId: string;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];
/** No exact number is given in 09 - Cloudinary Strategy.md §2.2 beyond "a generous but bounded limit" — 15MB is a reasonable choice for high-resolution DSLR/phone camera output, not a value pulled from the spec itself. */
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
/** Must be >= the pdp_zoom_2000 preset's width (lib/cloudinary/presets.ts) so that preset never upscales a source image (§2.2). */
const MIN_WIDTH_PX = 2000;

/**
 * Client-side validation only (09 - Cloudinary Strategy.md §2.2 — "enforced
 * client-side to avoid wasted signed-upload calls on oversized files").
 * This is a UX courtesy, not a security boundary — Cloudinary's own upload
 * preset settings are the real enforcement layer against a client that
 * skips this check entirely.
 */
export async function validateImageFile(file: File): Promise<string | null> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Only JPEG or PNG files are accepted.';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File is too large (max ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB).`;
  }

  const dimensions = await getImageDimensions(file);
  if (dimensions.width < MIN_WIDTH_PX) {
    return `Image is too small — minimum width is ${MIN_WIDTH_PX}px.`;
  }

  return null;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image dimensions.'));
    };
    img.src = url;
  });
}

async function requestSignature(
  payload:
    { target: 'catalog'; listingId: string } | { target: 'branding'; brandingSubfolder: string },
): Promise<SignatureResponse> {
  const getSignature = httpsCallable<typeof payload, SignatureResponse>(
    functions,
    'getCloudinarySignature',
  );
  const result = await getSignature(payload);
  return result.data;
}

async function uploadWithSignature(file: File, sig: SignatureResponse): Promise<UploadResult> {
  if (Date.now() > sig.expiresAt) {
    throw new Error('Upload authorization expired — please try again.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sig.apiKey);
  formData.append('timestamp', String(sig.timestamp));
  formData.append('signature', sig.signature);
  formData.append('folder', sig.folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload to Cloudinary failed.');
  }

  const result: { secure_url: string; public_id: string } = await response.json();
  return { secureUrl: result.secure_url, publicId: result.public_id };
}

/** Photographer-scoped (getCloudinarySignature.ts checks the `curator` claim). */
export async function uploadCatalogPhoto(listingId: string, file: File): Promise<UploadResult> {
  const validationError = await validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }
  const signature = await requestSignature({ target: 'catalog', listingId });
  return uploadWithSignature(file, signature);
}

/** Owner/Admin-scoped (getCloudinarySignature.ts checks ops_admin/super_admin). */
export async function uploadBrandingAsset(subfolder: string, file: File): Promise<UploadResult> {
  const validationError = await validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }
  const signature = await requestSignature({ target: 'branding', brandingSubfolder: subfolder });
  return uploadWithSignature(file, signature);
}
