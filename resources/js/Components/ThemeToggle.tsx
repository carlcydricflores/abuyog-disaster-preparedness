import { Popover, PopoverButton, PopoverPanel, Radio, RadioGroup } from '@headlessui/react';
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

const themeIcons: Record<Theme, string> = {
  light: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42',
  dark: 'M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z',
  system: 'M3 4h18v13H3zM8 21h8m-4-4v4',
};

const themeLabels: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const themes: Theme[] = ['light', 'dark', 'system'];

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useLayoutEffect(() => {
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      document.documentElement.dataset.theme = resolveTheme(theme);

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

  return (
    <Popover className="relative">
      {() => (
        <>
          <PopoverButton
            type="button"
            aria-label={`Theme: ${themeLabels[theme]}. Open theme options`}
            title={`Theme: ${themeLabels[theme]}`}
            className="flex size-11 items-center justify-center rounded-full border border-subtle bg-glass text-brand shadow-glass transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
              <path d={themeIcons[theme]} />
            </svg>
          </PopoverButton>
          <PopoverPanel focus className="glass-surface absolute bottom-full left-0 z-50 mb-2 origin-bottom-left rounded-2xl p-1 shadow-glass">
            <RadioGroup
              value={theme}
              aria-label="Theme preference"
              onChange={(selection: Theme) => setTheme(selection)}
              className="flex gap-1"
            >
              {themes.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  aria-label={`${themeLabels[option]} theme`}
                  title={themeLabels[option]}
                  className={({ checked }) => `relative flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${checked ? 'bg-action text-action-ink' : 'text-primary hover:bg-surface-raised'}`}
                >
                  {({ checked }) => (
                    <>
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                        <path d={themeIcons[option]} />
                      </svg>
                      <span className="sr-only">{themeLabels[option]}</span>
                      {checked && (
                        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="absolute -right-0.5 -top-0.5 size-4 rounded-full bg-surface">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4 8 2.5 2.5L12 5" />
                        </svg>
                      )}
                    </>
                  )}
                </Radio>
              ))}
            </RadioGroup>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}
