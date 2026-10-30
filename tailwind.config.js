import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                page: 'var(--color-page)',
                surface: 'var(--color-surface)',
                'surface-raised': 'var(--color-surface-raised)',
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                muted: 'var(--color-muted)',
                brand: 'var(--color-brand)',
                action: 'var(--color-action)',
                'action-ink': 'var(--color-action-ink)',
                focus: 'var(--color-focus)',
                subtle: 'var(--color-border)',
                glass: 'var(--color-glass)',
                error: 'var(--color-error)',
                success: 'var(--color-success)',
                danger: 'var(--color-danger)',
                'success-surface': 'var(--color-success-surface)',
                occupancy: 'var(--color-occupancy)',
                'occupancy-track': 'var(--color-occupancy-track)',
            },
            boxShadow: {
                glass: '0 12px 32px rgb(3 14 29 / 18%), inset 0 1px rgb(255 255 255 / 28%)',
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
