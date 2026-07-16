import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * Vite configuration.
 * Path aliases mirror tsconfig.app.json exactly (10 - Folder Structure.md §18) so
 * editor/type resolution and the bundler never disagree about where an import points.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/constants': path.resolve(__dirname, './src/constants'),
      '@vestige/shared-schemas': path.resolve(__dirname, './packages/shared-schemas/src'),
    },
  },
  build: {
    target: 'es2022',
    // Vendor chunking per 21 - Frontend Architecture.md §9: large third-party SDKs are
    // split into their own chunks so a route that doesn't need them doesn't pay their cost.
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});
