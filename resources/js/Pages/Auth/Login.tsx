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
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a5a18]">
                    Account access
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-normal text-[#34251b]">
                    Welcome back
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#746452]">
                    Sign in to continue to your preparedness dashboard.
                </p>
            </div>

            {status && (
                <div role="status" className="mb-5 border-l-2 border-[#9a5a18] bg-[#ead9b5] px-4 py-3 text-sm font-medium text-[#604017]">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-[#493a2d]">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full rounded-sm border border-[#cbb995] bg-[#fffaf0] px-4 py-3 text-sm text-[#34251b] shadow-sm outline-none transition placeholder:text-[#9d8c73] focus:border-[#9a4519] focus:ring-2 focus:ring-[#9a4519]/20"
                        placeholder="you@example.com"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-[#493a2d]">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full rounded-sm border border-[#cbb995] bg-[#fffaf0] px-4 py-3 text-sm text-[#34251b] shadow-sm outline-none transition placeholder:text-[#9d8c73] focus:border-[#9a4519] focus:ring-2 focus:ring-[#9a4519]/20"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#655644]">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="h-4 w-4 rounded-sm border-[#bca985] accent-[#9a4519] focus:ring-[#9a4519]"
                        />
                        Remember me
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-semibold text-[#874016] underline decoration-[#c69a5b] underline-offset-4 transition hover:text-[#55270f] focus:outline-none focus:ring-2 focus:ring-[#9a4519] focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-[#8f350f] px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#fff8e9] shadow-sm transition hover:bg-[#742b0d] focus:outline-none focus:ring-2 focus:ring-[#9a4519] focus:ring-offset-2 focus:ring-offset-[#f2e8ce] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <p className="mt-10 border-t border-[#d8c8a8] pt-5 text-center text-xs leading-5 text-[#806f58]">
                Abuyog Disaster Preparedness System
            </p>
        </GuestLayout>
    );
}
