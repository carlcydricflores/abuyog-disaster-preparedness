import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-9">
                <p className="text-xs font-bold uppercase text-amber-300">
                    Account access
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-stone-100">
                    Welcome back
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                    Sign in to continue to your preparedness dashboard.
                </p>
            </div>

            {status && (
                <div role="status" className="mb-5 border-l-2 border-amber-400 bg-stone-800 px-4 py-3 text-sm font-medium text-stone-100">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-stone-200">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block min-h-11 w-full rounded-md border border-stone-600 bg-stone-950 px-4 py-3 text-sm text-stone-100 shadow-sm outline-none placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60"
                        placeholder="you@example.com"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-stone-200">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block min-h-11 w-full rounded-md border border-stone-600 bg-stone-950 px-4 py-3 text-sm text-stone-100 shadow-sm outline-none placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                    <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-stone-300">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="size-4 rounded border-stone-500 bg-stone-950 accent-amber-500 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-950"
                        />
                        Remember me
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded text-sm font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-stone-950"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-orange-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <p className="mt-8 border-t border-stone-700 pt-5 text-center text-xs leading-5 text-stone-400">
                Abuyog Disaster Preparedness System
            </p>
        </GuestLayout>
    );
}
