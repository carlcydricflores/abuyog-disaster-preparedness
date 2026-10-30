import { Head, Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import Logo from '@/Components/Logo';
import ThemeToggle from '@/Components/ThemeToggle';

/** Site-wide shell: navigation adapts to guest / user / admin. (Role links are cosmetic; the server enforces RBAC.) */
export default function AppLayout({ title, children }: PropsWithChildren<{ title: string }>) {
  const { auth }: any = usePage().props;
  const user = auth?.user;
  const [navigationOpen, setNavigationOpen] = useState(false);
  const link = (active: boolean) => `flex min-h-11 items-center rounded px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${active ? 'bg-stone-800 text-amber-300' : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'}`;
  const publicLinks = [
    ['alerts', 'Alerts'],
    ['chat', 'Emergency assistant'],
    ['centers', 'Evacuation centers'],
    ['hotlines', 'Hotlines'],
    ['guidelines', 'Safety guide'],
  ];

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100 md:flex-row">
      <Head title={`${title} · Abuyog Emergency`} />
      <aside className="border-b border-amber-700/40 bg-stone-900 md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:border-b-0 md:border-r">
        <div className="flex min-h-16 items-center justify-between border-b border-stone-800 px-4 py-3 md:justify-start">
          <Link href={route('home')} className="flex min-w-0 items-center gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
            <Logo size={36} />
            <span className="truncate text-sm font-semibold text-stone-100">Abuyog Preparedness</span>
          </Link>
          <button
            type="button"
            aria-controls="main-navigation"
            aria-expanded={navigationOpen}
            aria-label={navigationOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setNavigationOpen((open) => !open)}
            className="flex size-11 shrink-0 items-center justify-center rounded text-stone-200 hover:bg-stone-800 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 md:hidden"
          >
            <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {navigationOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        <nav id="main-navigation" aria-label="Main navigation" className={`${navigationOpen ? 'flex' : 'hidden'} flex-col gap-1 px-3 py-3 md:flex md:flex-1`}>
          {publicLinks.map(([name, label]) => (
            <Link key={name} href={route(name)} aria-current={route().current(name) ? 'page' : undefined} className={link(route().current(name))}>{label}</Link>
          ))}
          {user ? <>
            {user.role === 'admin' && <Link href={route('admin.analytics')} aria-current={route().current('admin.*') ? 'page' : undefined} className={link(route().current('admin.*'))}>Admin workspace</Link>}
            {user.role === 'user' && <Link href={route('incidents.index')} aria-current={route().current('incidents.*') ? 'page' : undefined} className={link(route().current('incidents.*'))}>My reports</Link>}
            <Link href={route('incidents.create')} className="flex min-h-11 items-center justify-center rounded bg-orange-700 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">Report an incident</Link>
            <Link href={route('dashboard')} aria-current={route().current('dashboard') ? 'page' : undefined} className={link(route().current('dashboard'))}>{user.role === 'admin' ? 'Admin dashboard' : 'My account'}</Link>
            <Link href={route('profile.edit')} aria-current={route().current('profile.*') ? 'page' : undefined} className={link(route().current('profile.*'))}>Profile</Link>
            <Link href={route('logout')} method="post" as="button" className={`${link(false)} w-full text-left`}>Log out</Link>
          </> : <>
            <Link href={route('login')} aria-current={route().current('login') ? 'page' : undefined} className={link(route().current('login'))}>Log in</Link>
            <Link href={route('register')} aria-current={route().current('register') ? 'page' : undefined} className={link(route().current('register'))}>Register</Link>
          </>}
          <div className="mt-auto border-t border-stone-700 pt-4">
            <ThemeToggle />
          </div>
        </nav>
      </aside>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col md:ml-64">
        <main className="w-full flex-1 px-4 py-7 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-4 flex justify-end md:hidden">
              <ThemeToggle />
            </div>
            <h1 className="mb-6 text-2xl font-bold text-amber-300 sm:text-3xl">{title}</h1>
            {children}
          </div>
        </main>
        <footer className="border-t border-stone-800 py-6 text-center text-sm text-stone-500">
          In immediate danger? Call 911.
        </footer>
      </div>
    </div>
  );
}
