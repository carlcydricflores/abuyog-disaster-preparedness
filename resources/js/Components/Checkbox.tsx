import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'size-4 rounded border-subtle bg-page text-brand focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-page ' +
                className
            }
        />
    );
}
