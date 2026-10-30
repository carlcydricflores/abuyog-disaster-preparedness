import { Link } from '@inertiajs/react';

// Shared Tailwind class tokens: charcoal surfaces with amber and orange actions.
export const card = 'rounded-lg border border-stone-700 bg-stone-900 p-4 sm:p-5';
export const btn = 'inline-flex min-h-11 items-center justify-center rounded-md bg-orange-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950';
export const btnAlt = 'inline-flex min-h-11 items-center justify-center rounded-md border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950';
export const input = 'w-full rounded-md border border-stone-600 bg-stone-950 px-3 py-2.5 text-stone-100 placeholder-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60';

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
  const severity = String(a.severity).replace('_', ' ');

  return (
    <article className={`${card} border-l-4 ${a.severity === 'critical' ? 'border-l-red-500' : a.severity === 'warning' ? 'border-l-orange-500' : 'border-l-amber-400'}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span aria-label={`Alert severity: ${severity}`} className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-bold uppercase ${severityStyle[a.severity] ?? 'bg-stone-700 text-white'}`}>
          <span aria-hidden="true">{a.severity === 'critical' || a.severity === 'warning' ? '!' : 'i'}</span>
          {severity}
        </span>
        <Badge text={a.type} />
      </div>
      <h3 className="text-lg font-bold text-amber-300">{a.title}</h3>
      <p className="mt-2 whitespace-pre-line leading-6 text-stone-200">{a.message}</p>
      {a.barangays && <p className="mt-3 border-t border-stone-700 pt-3 text-sm text-stone-300"><span className="font-semibold text-stone-100">Affected areas:</span> {a.barangays}</p>}
    </article>
  );
}
