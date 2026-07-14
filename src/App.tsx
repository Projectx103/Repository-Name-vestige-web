import { AppProviders } from '@/app/providers/AppProviders';
import { AppRouter } from '@/app/routes/AppRouter';

/**
 * Root application component. Deliberately thin: all cross-cutting setup
 * lives in AppProviders, all route structure lives in AppRouter. This file
 * only composes the two.
 */
export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
