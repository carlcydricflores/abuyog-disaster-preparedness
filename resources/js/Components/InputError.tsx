import { HTMLAttributes } from 'react';

export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            {...props}
            role="alert"
            className={'text-sm text-error ' + className}
        >
            {message}
        </p>
    ) : null;
}
