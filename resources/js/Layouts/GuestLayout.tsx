import Logo from '@/Components/Logo';
import AppSidebar, { useSidebarCollapsed } from '@/Components/AppSidebar';
import { Link } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    const [collapsed, setCollapsed] = useSidebarCollapsed();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-page text-primary">
            <a href="#main-content" className="sr-only fixed left-4 top-4 z-[60] rounded-xl bg-action px-4 py-3 font-bold text-action-ink focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Skip to content</a>
            <AppSidebar user={null} collapsed={collapsed} onToggleCollapsed={() => setCollapsed((value) => !value)} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
            <header className="glass-surface sticky top-2 z-20 mx-3 mt-2 flex min-h-14 items-center justify-between gap-3 rounded-2xl px-3 lg:hidden">
                <button type="button" aria-controls="mobile-site-navigation" aria-expanded={mobileOpen} aria-label="Open navigation menu" onClick={() => setMobileOpen(true)} className="flex size-10 items-center justify-center rounded-full text-secondary hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <Link href={route('home')} aria-label="Abuyog Preparedness home" className="flex items-center gap-2 rounded-xl text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Logo size={30} showText={false} /><span>Abuyog Preparedness</span></Link>
                <span className="size-10" aria-hidden="true" />
            </header>
            <main id="main-content" className={`transition-[margin] duration-200 ${collapsed ? 'lg:ml-[6.5rem]' : 'lg:ml-[18rem]'}`}>
            <div className="grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-[1.05fr_0.95fr]">
                <aside className="relative isolate flex min-h-[290px] flex-col overflow-hidden rounded-3xl border border-subtle bg-surface px-7 py-7 text-primary sm:px-12 sm:py-9 lg:min-h-screen lg:rounded-none lg:border-0 lg:px-16 lg:py-12">
                    <img src="/images/preparedness-hero.svg" alt="" width="800" height="450" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-25" />
                    <div
                        aria-hidden="true"
                        className="auth-hero-overlay pointer-events-none absolute inset-0 -z-0"
                    />
                    <div className="relative flex items-center gap-4">
                        <Link href="/" aria-label="Abuyog Disaster Preparedness System home">
                            <Logo size={66} showText={false} />
                        </Link>
                        <div>
                            <p className="text-sm font-bold uppercase text-brand">
                                Abuyog
                            </p>
                            <p className="mt-1 text-xs font-medium uppercase text-secondary">
                                Disaster Preparedness System
                            </p>
                        </div>
                    </div>

                    <div className="relative mt-auto max-w-xl pt-12 lg:pb-20 lg:pt-24">
                        <p className="mb-4 text-xs font-bold uppercase text-brand">
                            Ready together
                        </p>
                        <h1 className="max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">
                            Preparedness starts with being connected.
                        </h1>
                        <p className="mt-5 max-w-md text-base leading-7 text-primary">
                            Sign in to access local alerts, response resources, and the information your community needs.
                        </p>
                        <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase text-secondary">
                            <span className="h-px w-10 bg-brand" />
                            Abuyog, Leyte
                        </div>
                    </div>
                </aside>

                <section className="flex min-h-[560px] items-center justify-center px-6 py-12 sm:px-12 lg:min-h-screen lg:px-16">
                    <div className="glass-surface w-full max-w-[420px] rounded-3xl p-6 sm:p-8">
                        {children}
                    </div>
                </section>
            </div>
            </main>
        </div>
    );
}
