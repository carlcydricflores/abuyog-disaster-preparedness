import { Head, Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import Logo from '@/Components/Logo';


/** Site-wide shell: navigation adapts to guest / user / admin. (Role links are cosmetic; the server enforces RBAC.) */
export default function AppLayout({ title, children }: PropsWithChildren<{ title: string }>) {
  const { auth }: any = usePage().props;
  const user = auth?.user;
  const [navigationOpen, setNavigationOpen] = useState(true);
  const link = 'flex items-center justify-center rounded px-3 py-2 text-center text-sm text-stone-300 hover:bg-stone-800 hover:text-amber-400';

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100 md:flex-row">
      <Head title={`${title} · Abuyog Emergency`} />
      <aside className={`border-b border-amber-700/40 bg-stone-900 transition-[width] duration-200 md:fixed md:inset-y-0 md:left-0 md:flex md:flex-col md:border-b-0 md:border-r ${navigationOpen ? 'md:w-64' : 'md:w-16'}`}>
        <div className={`flex items-center gap-2 border-b border-stone-800 px-3 py-3 ${navigationOpen ? 'justify-between' : 'justify-center'}`}>
          <Link href={route('home')} className={`flex min-w-0 items-center gap-2 ${navigationOpen ? '' : 'md:hidden'}`}>
            <Logo size={32} />
            <span className={`${navigationOpen ? '' : 'hidden'} truncate text-sm font-semibold text-stone-100`}>Abuyog Updates</span>
          </Link>
          <button
            type="button"
            aria-controls="main-navigation"
            aria-expanded={navigationOpen}
            aria-label={navigationOpen ? 'Collapse navigation' : 'Expand navigation'}
            onClick={() => setNavigationOpen((open) => !open)}
            className="flex size-10 shrink-0 items-center justify-center rounded text-stone-300 hover:bg-stone-800 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {navigationOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        <nav id="main-navigation" aria-label="Main navigation" className={`${navigationOpen ? 'flex' : 'hidden'} flex-wrap justify-center gap-1 px-3 py-3 md:flex-col md:items-stretch md:justify-center`}>
            <Link href={route('alerts')} className={link}>Alerts</Link>
            <Link href={route('centers')} className={link}>Evacuation centers</Link>
            <Link href={route('hotlines')} className={link}>Hotlines</Link>
            <Link href={route('guidelines')} className={link}>Safety guide</Link>
            {user ? <>
              <Link href={route('incidents.create')} className="flex items-center justify-center rounded bg-orange-700 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-orange-600">Report an incident</Link>
              <Link href={route('dashboard')} className={link}>{user.role === 'admin' ? 'Admin' : 'My account'}</Link>
              <Link href={route('logout')} method="post" as="button" className={link}>Log out</Link>
            </> : <>
              <Link href={route('login')} className={link}>Log in</Link>
              <Link href={route('register')} className="flex items-center justify-center rounded border border-amber-600 px-3 py-2 text-center text-sm text-amber-500 hover:bg-amber-600/10">Register</Link>
            </>}
        </nav>
      </aside>
      <div className={`flex min-h-screen min-w-0 flex-1 flex-col transition-[margin] duration-200 ${navigationOpen ? 'md:ml-64' : 'md:ml-16'}`}>
        <main className="w-full flex-1 px-4 py-8">
          <div className="mx-auto w-full max-w-5xl">
            <h1 className="mb-6 text-center text-3xl font-black tracking-tight text-amber-500">{title}</h1>
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
