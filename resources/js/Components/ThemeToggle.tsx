import { useLayoutEffect, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';

const storageKey = 'abuyog-color-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'system';
  }

  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
      return storedTheme;
    }
  } catch {
    return 'system';
  }

  return 'system';
}

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useLayoutEffect(() => {
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      document.documentElement.dataset.theme = theme === 'system'
        ? systemPreference.matches ? 'dark' : 'light'
        : theme;

      try {
        window.localStorage.setItem(storageKey, theme);
      } catch {
        // The current choice still applies for this page when storage is unavailable.
      }
    };

    applyTheme();
    if (theme === 'system') {
      systemPreference.addEventListener('change', applyTheme);
      return () => systemPreference.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  const optionClass = (selected: boolean) => `inline-flex min-h-10 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${compact ? 'size-10 px-0' : 'px-3'} ${selected ? 'bg-action text-action-ink' : 'text-primary hover:bg-surface-raised'}`;

  return (
    <div role="group" aria-label="Color theme" className={`inline-flex gap-1 rounded-3xl border border-subtle bg-glass p-1 shadow-glass ${compact ? 'flex-col' : 'items-center'}`}>
      <button type="button" aria-pressed={theme === 'light'} onClick={() => setTheme('light')} className={optionClass(theme === 'light')}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4"><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
        <span className={compact ? 'sr-only' : undefined}>Light</span>
      </button>
      <button type="button" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')} className={optionClass(theme === 'dark')}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" /></svg>
        <span className={compact ? 'sr-only' : undefined}>Dark</span>
      </button>
      <button type="button" aria-pressed={theme === 'system'} onClick={() => setTheme('system')} className={optionClass(theme === 'system')}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4"><rect x="3" y="4" width="18" height="13" rx="2" /><path strokeLinecap="round" d="M8 21h8m-4-4v4" /></svg>
        <span className={compact ? 'sr-only' : undefined}>System</span>
      </button>
    </div>
  );
}
