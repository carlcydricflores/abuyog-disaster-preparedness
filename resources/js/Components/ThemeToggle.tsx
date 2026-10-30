import { useLayoutEffect, useState } from 'react';

type Theme = 'dark' | 'light';

const storageKey = 'abuyog-color-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  try {
    return window.localStorage.getItem(storageKey) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // The current choice still applies for this page when storage is unavailable.
    }
  }, [theme]);

  const optionClass = (selected: boolean) => `inline-flex min-h-10 items-center gap-2 rounded px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${selected ? 'bg-amber-500 text-stone-950' : 'text-stone-200 hover:bg-stone-800'}`;

  return (
    <div role="group" aria-label="Color theme" className="inline-flex items-center gap-1 rounded-md border border-stone-700 bg-stone-950 p-1">
      <button type="button" aria-pressed={theme === 'light'} onClick={() => setTheme('light')} className={optionClass(theme === 'light')}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4"><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
        Light
      </button>
      <button type="button" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')} className={optionClass(theme === 'dark')}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" /></svg>
        Dark
      </button>
    </div>
  );
}
