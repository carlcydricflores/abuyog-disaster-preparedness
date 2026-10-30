import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Logo from '@/Components/Logo';
import ThemeToggle from '@/Components/ThemeToggle';

const sidebarStorageKey = 'abuyog-sidebar-collapsed';

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      return window.localStorage.getItem(sidebarStorageKey) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(sidebarStorageKey, String(collapsed));
    } catch {
      // The current choice still applies for this page when storage is unavailable.
    }
  }, [collapsed]);

  return [collapsed, setCollapsed] as const;
}

type NavigationItem = {
  label: string;
  routeName: string;
  icon: string;
  routeParameter?: string;
};

const publicItems: NavigationItem[] = [
  { label: 'Alerts', routeName: 'alerts', icon: 'alert' },
  { label: 'Emergency assistant', routeName: 'chat', icon: 'chat' },
  { label: 'Evacuation centers', routeName: 'centers', icon: 'center' },
  { label: 'Hotlines', routeName: 'hotlines', icon: 'phone' },
  { label: 'Safety guidelines', routeName: 'guidelines', icon: 'guide' },
];

const residentItems: NavigationItem[] = [
  { label: 'My reports', routeName: 'incidents.index', icon: 'reports' },
  { label: 'Dashboard', routeName: 'dashboard', icon: 'dashboard' },
  { label: 'Profile', routeName: 'profile.edit', icon: 'profile' },
];

const adminItems: NavigationItem[] = [
  { label: 'Manage content', routeName: 'admin.manage.index', routeParameter: 'alerts', icon: 'manage' },
  { label: 'Review incidents', routeName: 'admin.incidents', icon: 'reports' },
  { label: 'Reports', routeName: 'admin.reports', icon: 'reports' },
  { label: 'Analytics', routeName: 'admin.analytics', icon: 'analytics' },
  { label: 'Dashboard', routeName: 'dashboard', icon: 'dashboard' },
  { label: 'Profile', routeName: 'profile.edit', icon: 'profile' },
];

const iconPaths: Record<string, string[]> = {
  alert: ['M12 3 2.8 19h18.4L12 3Z', 'M12 9v4m0 3h.01'],
  chat: ['M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6.5a7.5 7.5 0 1 1 17-3Z', 'M8 11h.01M12 11h.01M16 11h.01'],
  center: ['M3 21h18M5 21V5l7-3 7 3v16', 'M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4'],
  phone: ['M7 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-2l-4-2-2 2a14 14 0 0 1-6-6l2-2-2-4Z'],
  guide: ['M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z', 'M4 6h12M8 10h8M8 14h6'],
  reports: ['M8 4h8l2 2h3v15H3V6h3l2-2Z', 'M8 11h8M8 15h8'],
  dashboard: ['M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z'],
  profile: ['M20 21a8 8 0 0 0-16 0', 'M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
  manage: ['M4 6h16M4 12h16M4 18h16', 'M8 4v4m8 2v4m-5 2v4'],
  analytics: ['M4 19V5m0 14h17', 'm7 15 4-5 3 2 5-7'],
  report: ['M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z', 'M12 9a2 2 0 1 0 0 .01'],
  login: ['M10 17l5-5-5-5', 'M15 12H3M21 3v18'],
  register: ['M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6m-3-3h6'],
  logout: ['M10 17l5-5-5-5', 'M15 12H3m18-9v18'],
  collapse: ['m15 18-6-6 6-6'],
  expand: ['m9 18 6-6-6-6'],
  menu: ['M4 6h16M4 12h16M4 18h16'],
  close: ['m6 6 12 12M18 6 6 18'],
};

function AppIcon({ name, className = 'size-5' }: { name: string; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {(iconPaths[name] ?? []).map((path) => <path key={path} d={path} />)}
    </svg>
  );
}

function SidebarItems({ user, collapsed, onNavigate, navigationId }: { user: any; collapsed: boolean; onNavigate?: () => void; navigationId: string }) {
  const items = user?.role === 'admin' ? adminItems : user ? residentItems : [];
  const linkClass = (active: boolean) => `group flex min-h-11 items-center gap-3 rounded-xl border-l-2 px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${collapsed ? 'justify-center px-0' : ''} ${active ? 'border-brand bg-surface-raised text-brand' : 'border-transparent text-secondary hover:bg-surface-raised hover:text-primary'}`;

  const renderItem = (item: NavigationItem) => {
    const active = route().current(item.routeName === 'admin.manage.index' ? 'admin.manage.*' : item.routeName === 'admin.incidents' ? 'admin.incidents*' : item.routeName);
    const href = item.routeParameter ? route(item.routeName, item.routeParameter) : route(item.routeName);

    return (
      <Link
        key={`${item.routeName}-${item.label}`}
        href={href}
        aria-label={collapsed ? item.label : undefined}
        aria-current={active ? 'page' : undefined}
        title={collapsed ? item.label : undefined}
        onClick={onNavigate}
        className={linkClass(active)}
      >
        <AppIcon name={item.icon} />
        <span className={collapsed ? 'sr-only' : 'truncate'}>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      <nav id={navigationId} aria-label="Main navigation" className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {publicItems.map(renderItem)}
        {user && (
          <>
            <p className={`px-3 pb-1 pt-5 text-xs font-bold uppercase tracking-wider text-muted ${collapsed ? 'sr-only' : ''}`}>
              {user.role === 'admin' ? 'Administration' : 'Your account'}
            </p>
            {user.role === 'admin' && (
              <Link
                href={route('incidents.create')}
                aria-label={collapsed ? 'Report an incident' : undefined}
                title={collapsed ? 'Report an incident' : undefined}
                onClick={onNavigate}
                className={`mb-2 flex min-h-11 items-center justify-center gap-2 rounded-full bg-action px-3 py-2 text-center text-sm font-bold text-action-ink transition-colors hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${collapsed ? 'size-11 self-center px-0' : ''}`}
              >
                <AppIcon name="report" />
                <span className={collapsed ? 'sr-only' : ''}>Report an incident</span>
              </Link>
            )}
            {items.map(renderItem)}
            {user.role !== 'admin' && renderItem({ label: 'Report an incident', routeName: 'incidents.create', icon: 'report' })}
            <Link
              href={route('logout')}
              method="post"
              as="button"
              aria-label={collapsed ? 'Log out' : undefined}
              title={collapsed ? 'Log out' : undefined}
              onClick={onNavigate}
              className={linkClass(false) + ' w-full text-left'}
            >
              <AppIcon name="logout" />
              <span className={collapsed ? 'sr-only' : ''}>Log out</span>
            </Link>
          </>
        )}
        {!user && (
          <div className="mt-auto flex flex-col gap-1 border-t border-subtle pt-4">
            {renderItem({ label: 'Log in', routeName: 'login', icon: 'login' })}
            {renderItem({ label: 'Register', routeName: 'register', icon: 'register' })}
          </div>
        )}
      </nav>
      <div className={`flex items-center border-t border-subtle px-3 py-4 ${collapsed ? 'justify-center' : 'justify-start'}`}>
        <ThemeToggle />
      </div>
    </>
  );
}

export default function AppSidebar({
  user,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: {
  user: any;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseMobile();
      }
    };

    document.addEventListener('keydown', closeOnEscape, true);
    return () => document.removeEventListener('keydown', closeOnEscape, true);
  }, [mobileOpen, onCloseMobile]);

  return (
    <>
      <aside
        id="app-sidebar"
        aria-label="Site navigation"
        className={`glass-surface fixed inset-y-3 left-3 z-30 hidden flex-col overflow-visible rounded-3xl lg:flex ${collapsed ? 'w-[4.75rem]' : 'w-[17rem]'} transition-[width] duration-200`}
      >
        <div className={`flex items-center border-b border-subtle ${collapsed ? 'min-h-28 flex-col justify-center gap-1 px-2' : 'min-h-[4.5rem] justify-between gap-2 px-3'}`}>
          <Link href={route('home')} aria-label="Abuyog Preparedness home" className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" onClick={onCloseMobile}>
            <Logo size={36} showText={false} />
            <span className={collapsed ? 'sr-only' : 'truncate text-sm font-bold text-primary'}>Abuyog Preparedness</span>
          </Link>
          <button type="button" aria-controls="site-navigation" aria-expanded={!collapsed} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'} title={collapsed ? 'Expand navigation' : 'Collapse navigation'} onClick={onToggleCollapsed} className="flex size-10 shrink-0 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-raised hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <AppIcon name={collapsed ? 'expand' : 'collapse'} />
          </button>
        </div>
        <SidebarItems user={user} collapsed={collapsed} navigationId="site-navigation" />
      </aside>

      <Dialog open={mobileOpen} onClose={onCloseMobile} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm" />
        <div className="fixed inset-0 flex">
          <DialogPanel id="mobile-site-navigation" className="glass-surface flex h-full w-[min(21rem,88vw)] flex-col rounded-r-3xl rounded-l-none shadow-2xl">
            <DialogTitle className="sr-only">Main navigation</DialogTitle>
            <div className="flex min-h-[4.5rem] items-center justify-between border-b border-subtle px-4">
              <Link href={route('home')} aria-label="Abuyog Preparedness home" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" onClick={onCloseMobile}>
                <Logo size={36} showText={false} />
                <span className="text-sm font-bold text-primary">Abuyog Preparedness</span>
              </Link>
              <button type="button" aria-label="Close navigation" onClick={onCloseMobile} className="flex size-10 items-center justify-center rounded-full text-secondary hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <AppIcon name="close" />
              </button>
            </div>
            <SidebarItems user={user} collapsed={false} onNavigate={onCloseMobile} navigationId="mobile-site-navigation-links" />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}