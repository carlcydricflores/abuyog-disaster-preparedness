import { Link } from '@inertiajs/react';
import { useState } from 'react';

export const card = 'glass-surface rounded-2xl p-4 sm:p-5';
export const btn = 'inline-flex min-h-11 items-center justify-center rounded-full bg-action px-5 py-2 text-sm font-bold text-action-ink shadow-sm transition hover:brightness-105 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-page';
export const btnAlt = 'inline-flex min-h-11 items-center justify-center rounded-full border border-subtle bg-surface px-5 py-2 text-sm font-semibold text-brand transition-colors hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-page';
export const input = 'w-full rounded-xl border border-subtle bg-surface px-3 py-2.5 text-primary placeholder:text-muted focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus';

export const severityStyle: Record<string, string> = {
  advisory: 'status-advisory',
  watch: 'status-watch',
  warning: 'status-warning',
  critical: 'status-critical',
};

const severityBorder: Record<string, string> = {
  advisory: 'severity-border-advisory',
  watch: 'severity-border-watch',
  warning: 'severity-border-warning',
  critical: 'severity-border-critical',
};

/** Colored pill used for severity and status labels. */
export function Badge({ text, cls }: { text: string; cls?: string }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${cls ?? 'bg-surface-raised text-primary'}`}>{String(text).replace('_', ' ')}</span>;
}

/** Renders Laravel paginator links. Labels are server-generated, so injecting them as HTML is safe. */
export function Pager({ links }: { links: any[] }) {
  if (!links || links.length <= 3) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-1">
      {links.map((l, i) => l.url
        ? <Link key={i} href={l.url} preserveScroll aria-current={l.active ? 'page' : undefined} className={`rounded-full px-3 py-2 text-sm ${l.active ? 'bg-action text-action-ink' : 'bg-surface-raised text-secondary hover:text-primary'}`} dangerouslySetInnerHTML={{ __html: l.label }} />
        : <span key={i} className="px-3 py-2 text-sm text-muted" dangerouslySetInnerHTML={{ __html: l.label }} />)}
    </div>
  );
}

/** Photo URLs may arrive as full URLs, absolute paths, or storage paths like "incidents/abc.jpg". */
const photoSrc = (p: string) => (/^(https?:)?\//.test(p) ? p : `/storage/${p}`);

export function AlertCard({ a }: { a: any }) {
  const severity = String(a.severity).replace('_', ' ');
  const [illustrationUnavailable, setIllustrationUnavailable] = useState(false);
  const [failedPhotos, setFailedPhotos] = useState<string[]>([]);
  // Photos submitted by the reporter (only present when an admin published the report with its photos).
  const photos: string[] = (Array.isArray(a.photos) ? a.photos : []).filter((p: string) => !failedPhotos.includes(p));

  return (
    <article className={`${card} border-l-4 ${severityBorder[a.severity] ?? 'severity-border-advisory'}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span aria-label={`Alert severity: ${severity}`} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase ${severityStyle[a.severity] ?? 'bg-surface-raised text-primary'}`}>
          <span aria-hidden="true">{a.severity === 'critical' || a.severity === 'warning' ? '!' : 'i'}</span>
          {severity}
        </span>
        <Badge text={a.type} />
      </div>
      <h3 className="text-lg font-bold text-brand">{a.title}</h3>
      <p className="mt-2 whitespace-pre-line leading-6 text-primary">{a.message}</p>
      {a.barangays && <p className="mt-3 border-t border-subtle pt-3 text-sm text-secondary"><span className="font-semibold text-primary">Affected areas:</span> {a.barangays}</p>}

      {photos.length > 0 ? (
        <figure className="mt-4">
          <div className={`grid gap-2 ${photos.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
            {photos.map((p) => (
              <a key={p} href={photoSrc(p)} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <img
                  src={photoSrc(p)}
                  alt={`Photo submitted by a resident for: ${a.title}`}
                  loading="lazy"
                  decoding="async"
                  onError={() => setFailedPhotos((list) => [...list, p])}
                  className="aspect-[3/2] w-full object-cover"
                />
              </a>
            ))}
          </div>
          <figcaption className="mt-2 text-xs font-medium text-secondary">Photo submitted by a resident. Select it to enlarge.</figcaption>
        </figure>
      ) : (
        a.illustration_url && (
          <figure className="mt-4">
            {illustrationUnavailable ? (
              <div role="img" aria-label="Illustration unavailable; this alert image is illustrative only" className="flex aspect-[3/2] items-center justify-center rounded-2xl border border-subtle bg-surface-raised p-4 text-center text-sm text-secondary">
                Illustration unavailable
              </div>
            ) : (
              <img
                src={a.illustration_url}
                alt="Illustrative image, not a photograph or evidence of the actual incident"
                loading="lazy"
                decoding="async"
                onError={() => setIllustrationUnavailable(true)}
                className="aspect-[3/2] w-full rounded-2xl object-cover"
              />
            )}
            <figcaption className="mt-2 text-xs font-medium text-secondary">Illustrative image, not the actual incident</figcaption>
          </figure>
        )
      )}

      {a.reported_by && <p className="mt-3 text-sm font-medium text-secondary">{a.reported_by}</p>}
      {a.verified_by && <p className="mt-1 text-xs font-semibold text-muted">{a.verified_by}</p>}
    </article>
  );
}