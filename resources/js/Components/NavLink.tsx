import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-amber-400 text-amber-200 focus:border-amber-300'
                    : 'border-transparent text-stone-300 hover:border-stone-500 hover:text-white focus:border-stone-400 focus:text-white') +
                className
            }
        >
            {children}
        </Link>
    );
}
