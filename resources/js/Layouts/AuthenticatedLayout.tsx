import Logo from '@/Components/Logo';
import AppSidebar, { useSidebarCollapsed } from '@/Components/AppSidebar';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [collapsed, setCollapsed] = useSidebarCollapsed();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-page text-primary">
            <a href="#main-content" className="sr-only fixed left-4 top-4 z-[60] rounded-xl bg-action px-4 py-3 font-bold text-action-ink focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Skip to content</a>
            <AppSidebar user={user} collapsed={collapsed} onToggleCollapsed={() => setCollapsed((value) => !value)} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
            <header className="glass-surface sticky top-2 z-20 mx-3 mt-2 flex min-h-14 items-center justify-between gap-3 rounded-2xl px-3 lg:hidden">
                <button type="button" aria-controls="mobile-site-navigation" aria-expanded={mobileOpen} aria-label="Open navigation menu" onClick={() => setMobileOpen(true)} className="flex size-10 items-center justify-center rounded-full text-secondary hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <Link href={route('home')} aria-label="Abuyog Preparedness home" className="flex items-center gap-2 rounded-xl text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Logo size={30} showText={false} /><span>Abuyog Preparedness</span></Link>
                <span className="size-10" aria-hidden="true" />
            </header>
            <div className={`min-h-screen transition-[margin] duration-200 ${collapsed ? 'lg:ml-[6.5rem]' : 'lg:ml-[18rem]'}`}>
            <main id="main-content">
                {header && <header className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</header>}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
            </main>
            </div>
        </div>
    );
}
