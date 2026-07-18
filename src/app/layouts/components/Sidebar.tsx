import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';
import type { UserRole } from '@vestige/shared-schemas';

interface StaffNavItem {
  label: string;
  path: string;
  allowedRoles: UserRole[];
}

/**
 * One shared shell for every staff role (10 - Folder Structure.md §12) —
 * role-aware nav item visibility is the only role-conditional logic here,
 * never a separate Sidebar per role. Target routes aren't wired into
 * AppRouter yet (their pages are built in M10-M13) — this establishes the
 * intended navigation shape ahead of that, same reasoning as constants/routes.ts.
 */
const STAFF_NAV_ITEMS: StaffNavItem[] = [
  {
    label: 'Procurement',
    path: ROUTES.adminProcurement,
    allowedRoles: ['procurement_staff', 'ops_admin', 'super_admin'],
  },
  {
    label: 'Curation',
    path: ROUTES.adminCuration,
    allowedRoles: ['curator', 'ops_admin', 'super_admin'],
  },
  {
    label: 'Photography',
    path: ROUTES.adminPhotography,
    allowedRoles: ['curator', 'ops_admin', 'super_admin'],
  },
  { label: 'Orders', path: ROUTES.adminOrders, allowedRoles: ['ops_admin', 'super_admin'] },
  { label: 'Support', path: ROUTES.adminSupport, allowedRoles: ['ops_admin', 'super_admin'] },
  {
    label: 'Reports',
    path: ROUTES.adminReports,
    allowedRoles: ['curator', 'ops_admin', 'super_admin'],
  },
  { label: 'Roles', path: ROUTES.adminRoles, allowedRoles: ['ops_admin', 'super_admin'] },
];

export function Sidebar() {
  const { roles } = useAuth();
  const visibleItems = STAFF_NAV_ITEMS.filter((item) =>
    item.allowedRoles.some((role) => roles.includes(role)),
  );

  return (
    <nav
      aria-label="Staff console"
      className="hidden w-56 shrink-0 flex-col gap-xs border-r border-stone bg-paper px-sm py-md desktop:flex dark:border-stone-dark dark:bg-ink-dark"
    >
      {visibleItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'rounded px-sm py-xs text-body-sm transition-colors duration-DEFAULT ease-standard',
              isActive
                ? 'bg-stone text-ink dark:bg-stone-dark dark:text-paper-dark'
                : 'text-ink-muted hover:text-ink dark:text-paper-dark-muted dark:hover:text-paper-dark',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
