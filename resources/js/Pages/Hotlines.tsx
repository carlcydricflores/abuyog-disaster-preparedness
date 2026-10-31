import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { btn, card } from '@/Components/ui';

// Keep only digits and "+" so the phone dialer accepts the number (removes spaces, dashes, brackets).
const dialable = (n: string) => n.replace(/[^\d+]/g, '');
// A number made only of zeros (like the seeded placeholder) is not a real number, so it must not be callable.
const isPlaceholder = (n: string) => !/[1-9]/.test(n);

function HotlineCard({ h }: { h: any }) {
  const [copied, setCopied] = useState(false);

  // Copy helps on laptops, where "tel:" links often do nothing. Wrapped in try/catch because clipboard access can be blocked.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(h.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable: the number is still shown on screen */ }
  };

  return (
    <article className={card}>
      <h3 className="font-semibold text-secondary">{h.name}</h3>
      <p className="mt-1 text-2xl font-black text-brand">{h.number}</p>
      {isPlaceholder(h.number) ? (
        <p className="mt-3 text-sm text-muted">Number not set yet. An administrator must add it.</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={`tel:${dialable(h.number)}`} aria-label={`Call ${h.name} at ${h.number}`} className={btn}>Call now</a>
          <button type="button" onClick={copy}
            className="rounded-full border border-current px-4 py-1.5 text-sm font-semibold text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            {copied ? 'Copied' : 'Copy number'}
          </button>
        </div>
      )}
    </article>
  );
}

export default function Hotlines({ hotlines }: any) {
  return (
    <AppLayout title="Emergency hotlines">
      <div className={`${card} mb-8 flex flex-wrap items-center justify-between gap-3`}>
        <div>
          <h2 className="text-lg font-bold text-brand">In immediate danger?</h2>
          <p className="text-sm text-muted">Call the national emergency hotline first.</p>
        </div>
        <a href="tel:911" aria-label="Call 911, the national emergency hotline" className={`${btn} text-base`}>Call 911</a>
      </div>

      {Object.entries(hotlines).map(([cat, list]: any) => (
        <section key={cat} className="mb-8">
          <h2 className="mb-3 text-xl font-bold capitalize text-brand">{cat}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {list.map((h: any) => <HotlineCard key={h.id} h={h} />)}
          </div>
        </section>
      ))}
      <p className="text-sm text-muted">Call buttons work on phones. On a computer, use Copy number and dial from your phone.</p>
    </AppLayout>
  );
}