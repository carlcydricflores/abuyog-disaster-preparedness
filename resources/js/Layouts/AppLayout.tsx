import EmergencyCallButton from '@/Components/EmergencyCallButton';
import { Head, Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import Logo from '@/Components/Logo';
import AppSidebar, { useSidebarCollapsed } from '@/Components/AppSidebar';


/** Site-wide shell: navigation adapts to guest / user / admin. (Role links are cosmetic; the server enforces RBAC.) */
export default function AppLayout({ title, children }: PropsWithChildren<{ title: string }>) {
  const { auth }: any = usePage().props;
  const user = auth?.user;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useSidebarCollapsed();

  return (
    <div className="min-h-screen bg-page text-primary">
      <Head title={`${title} · Abuyog Emergency`} />
      <a href="#main-content" className="sr-only fixed left-4 top-4 z-[60] rounded-xl bg-action px-4 py-3 font-bold text-action-ink focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Skip to content</a>
      <AppSidebar user={user} collapsed={collapsed} onToggleCollapsed={() => setCollapsed((value) => !value)} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className={`min-h-screen min-w-0 transition-[margin] duration-200 ${collapsed ? 'lg:ml-[6.5rem]' : 'lg:ml-[18rem]'}`}>
        <header className="glass-surface sticky top-2 z-20 mx-3 mt-2 flex min-h-14 items-center justify-between gap-3 rounded-2xl px-3 lg:hidden">
          <button type="button" aria-controls="mobile-site-navigation" aria-expanded={mobileOpen} aria-label="Open navigation menu" onClick={() => setMobileOpen(true)} className="flex size-10 items-center justify-center rounded-full text-secondary hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link href={route('home')} aria-label="Abuyog Preparedness home" className="flex items-center gap-2 rounded-xl text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Logo size={30} showText={false} />
            <span>Abuyog Preparedness</span>
          </Link>
          <span className="size-10" aria-hidden="true" />
        </header>
        <main id="main-content" className="w-full px-4 py-7 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <h1 className="mb-6 text-2xl font-bold text-primary sm:text-3xl">{title}</h1>
            {children}
          </div>
        </main>
        <footer className="border-t border-subtle py-6 text-center text-sm text-muted">
          In immediate danger? Call 911.
        </footer>
      </div>

      {/* Floating "Call 911" shortcut, visible on every page */}
      <EmergencyCallButton />
    </div>
  );
}