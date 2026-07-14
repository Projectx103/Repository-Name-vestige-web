/**
 * Typed shape of import.meta.env. Keep in sync with .env.example — every
 * VITE_-prefixed variable declared there should have a matching entry here so
 * a missing/misspelled env var is a compile-time error, not a runtime `undefined`.
 */
interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';

  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_USE_FIREBASE_EMULATORS: string;

  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
