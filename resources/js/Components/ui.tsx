import { Link } from '@inertiajs/react';

// Shared Tailwind class tokens: dark yellow (amber) + dark orange on warm charcoal.
export const card = 'rounded-lg border border-amber-700/40 bg-stone-900 p-5';
export const btn = 'inline-block rounded-md bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';
export const btnAlt = 'inline-block rounded-md border border-amber-600 px-4 py-2 text-sm font-semibold text-amber-500 hover:bg-amber-600/10';
export const input = 'w-full rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:ring-amber-500';

export const severityStyle: Record<string, string> = {
  advisory: 'bg-yellow-700 text-white',
  watch: 'bg-amber-600 text-stone-950',
  warning: 'bg-orange-600 text-white',
  critical: 'bg-red-700 text-white',
};

/** Colored pill used for severity and status labels. */
export function Badge({ text, cls }: { text: string; cls?: string }) {
  return <span className={`rounded px-2 py-0.5 text-xs font-bold ${cls ?? 'bg-stone-700 text-stone-100'}`}>{String(text).replace('_', ' ')}</span>;
}

/** Renders Laravel paginator links. Labels are server-generated, so injecting them as HTML is safe. */
export function Pager({ links }: { links: any[] }) {
  if (!links || links.length <= 3) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-1">
      {links.map((l, i) => l.url
        ? <Link key={i} href={l.url} preserveScroll className={`rounded px-3 py-1 text-sm ${l.active ? 'bg-orange-700 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`} dangerouslySetInnerHTML={{ __html: l.label }} />
        : <span key={i} className="px-3 py-1 text-sm text-stone-600" dangerouslySetInnerHTML={{ __html: l.label }} />)}
    </div>
  );
}

export function AlertCard({ a }: { a: any }) {
  return (
    <article className={card}>
      <div className="mb-2 flex items-center gap-2"><Badge text={a.severity} cls={severityStyle[a.severity]} /><Badge text={a.type} /></div>
      <h3 className="text-lg font-bold text-amber-400">{a.title}</h3>
      <p className="mt-1 whitespace-pre-line text-stone-300">{a.message}</p>
      {a.barangays && <p className="mt-2 text-sm text-stone-500">Affected: {a.barangays}</p>}
    </article>
  );
}
