import Logo from '@/Components/Logo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-stone-950 text-stone-100">
            <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
                <aside className="relative isolate flex min-h-[290px] flex-col overflow-hidden bg-stone-900 px-7 py-7 text-stone-100 sm:px-12 sm:py-9 lg:min-h-screen lg:px-16 lg:py-12">
                    <img src="/images/preparedness-hero.svg" alt="" width="800" height="450" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-25" />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/50"
                    />
                    <div className="relative flex items-center gap-4">
                        <Link href="/" aria-label="Abuyog Disaster Preparedness System home">
                            <Logo size={66} showText={false} />
                        </Link>
                        <div>
                            <p className="text-sm font-bold uppercase text-amber-300">
                                Abuyog
                            </p>
                            <p className="mt-1 text-xs font-medium uppercase text-stone-300">
                                Disaster Preparedness System
                            </p>
                        </div>
                    </div>

                    <div className="relative mt-auto max-w-xl pt-12 lg:pb-20 lg:pt-24">
                        <p className="mb-4 text-xs font-bold uppercase text-amber-300">
                            Ready together
                        </p>
                        <h1 className="max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">
                            Preparedness starts with being connected.
                        </h1>
                        <p className="mt-5 max-w-md text-base leading-7 text-stone-200">
                            Sign in to access local alerts, response resources, and the information your community needs.
                        </p>
                        <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase text-stone-300">
                            <span className="h-px w-10 bg-amber-300" />
                            Abuyog, Leyte
                        </div>
                    </div>
                </aside>

                <main className="flex min-h-[560px] items-center justify-center border-t border-stone-800 bg-stone-950 px-6 py-12 sm:px-12 lg:min-h-screen lg:border-l lg:border-t-0 lg:px-16">
                    <div className="w-full max-w-[420px]">
                        <div className="mb-6 flex justify-end">
                            <ThemeToggle />
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
