/**
 * Typed, single source of truth for reading environment configuration.
 * No component or service reads `import.meta.env` directly elsewhere — every
 * access goes through this module, so a missing env var fails fast and loudly
 * in one place rather than surfacing as a scattered runtime bug.
 */

export type AppEnv = 'development' | 'staging' | 'production';

function requireEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const appEnv: AppEnv = import.meta.env.VITE_APP_ENV;

export const useFirebaseEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

export const firebaseEnvConfig = {
  apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requireEnv('VITE_FIREBASE_APP_ID'),
  // Optional: Analytics is only enabled when this is present, so environments
  // without it (e.g. a future staging project) don't need to configure it.
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

export const cloudinaryEnvConfig = {
  // Not using requireEnv here: Cloudinary isn't configured until M4, so this
  // must not throw at module-import time — that would crash any page that
  // imports CloudinaryImage before M4 exists. CloudinaryImage itself checks
  // for an empty cloudName and renders its "not configured" state instead of
  // attempting a request.
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
};
