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
                <p className="text-xs font-bold uppercase text-brand">
                    Account access
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-primary">
                    Welcome back
                </h2>
                <p className="mt-2 text-sm leading-6 text-secondary">
                    Sign in to continue to your preparedness dashboard.
                </p>
            </div>

            {status && (
                <div role="status" className="mb-5 border-l-2 border-brand bg-surface-raised px-4 py-3 text-sm font-medium text-primary">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-primary">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block min-h-11 w-full rounded-md border border-subtle bg-page px-4 py-3 text-sm text-primary shadow-sm outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-focus"
                        placeholder="you@example.com"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-primary">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block min-h-11 w-full rounded-md border border-subtle bg-page px-4 py-3 text-sm text-primary shadow-sm outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-focus"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                    <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-secondary">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="size-4 rounded border-subtle bg-page accent-action focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-page"
                        />
                        Remember me
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded text-sm font-semibold text-brand underline underline-offset-4 hover:text-brand focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-page"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-action px-5 py-3 text-sm font-bold text-action-ink shadow-sm transition-colors hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-page disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <p className="mt-8 border-t border-subtle pt-5 text-center text-xs leading-5 text-muted">
                Abuyog Disaster Preparedness System
            </p>
        </GuestLayout>
    );
}
