import Logo from '@/Components/Logo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-[#f2e8ce] text-[#34251b]">
            <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
                <aside className="relative flex min-h-[290px] flex-col overflow-hidden bg-[#8f350f] px-7 py-7 text-[#fff8e9] sm:px-12 sm:py-9 lg:min-h-screen lg:px-16 lg:py-12">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,231,175,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,231,175,0.16)_1px,transparent_1px)] [background-size:44px_44px]"
                    />
                    <div className="relative flex items-center gap-4">
                        <Link href="/" aria-label="Abuyog Disaster Preparedness System home">
                            <Logo size={66} showText={false} />
                        </Link>
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#f6ca59]">
                                Abuyog
                            </p>
                            <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-[#fff4dc]/75">
                                Disaster Preparedness System
                            </p>
                        </div>
                    </div>

                    <div className="relative mt-auto max-w-xl pt-12 lg:pb-20 lg:pt-24">
                        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#f6ca59]">
                            Ready together
                        </p>
                        <h1 className="max-w-lg text-4xl font-semibold leading-[1.08] sm:text-5xl">
                            Preparedness starts with being connected.
                        </h1>
                        <p className="mt-6 max-w-md text-base leading-7 text-[#fff4dc]/80">
                            Sign in to access local alerts, response resources, and the information your community needs.
                        </p>
                        <div className="mt-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#fff4dc]/70">
                            <span className="h-px w-10 bg-[#f6ca59]" />
                            Abuyog, Leyte
                        </div>
                    </div>
                </aside>

                <main className="flex min-h-[560px] items-center justify-center px-6 py-12 sm:px-12 lg:min-h-screen lg:px-16">
                    <div className="w-full max-w-[420px]">{children}</div>
                </main>
            </div>
        </div>
    );
}
