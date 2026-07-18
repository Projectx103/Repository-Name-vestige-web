import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import { Dropdown } from '@/components/ui/Dropdown';
import { ROUTES } from '@/constants/routes';
import { auth } from '@/lib/firebase';

/**
 * Account/logout affordance (18 - Component Inventory.md §7). Signed-out
 * state shows plain Login/Register links — signed-in state shows an
 * ActionMenu-style Dropdown (Account, Logout). Points at ROUTES.account,
 * the one account route declared so far — /account/orders etc. don't exist
 * as routed pages yet (M9).
 */
export function UserMenu() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-sm">
        <Link
          to={ROUTES.login}
          className="text-body-sm text-ink hover:opacity-hover dark:text-paper-dark"
        >
          Log In
        </Link>
        <Link
          to={ROUTES.register}
          className="text-body-sm font-medium text-ink hover:opacity-hover dark:text-paper-dark"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <Dropdown
      triggerLabel={user.displayName || user.email || 'Account'}
      onSelect={(value) => {
        if (value === 'logout') {
          void signOut(auth);
        } else if (value === 'account') {
          navigate(ROUTES.account);
        }
      }}
      options={[
        { value: 'account', label: 'My Account' },
        { value: 'logout', label: 'Log Out', destructive: true },
      ]}
    />
  );
}
