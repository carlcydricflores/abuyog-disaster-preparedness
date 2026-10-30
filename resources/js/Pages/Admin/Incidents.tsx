import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Badge, Pager, card, input } from '@/Components/ui';

export default function Incidents({ incidents, statuses, filters }: any) {
  const update = (id: number, body: any) => router.patch(route('admin.incidents.update', id), body, { preserveScroll: true });
  return (
    <AppLayout title="Incident reports">
      <label htmlFor="incident-status-filter" className="mb-1 block text-sm font-medium text-primary">Filter by status</label>
      <select id="incident-status-filter" className={`${input} mb-6 max-w-xs`} value={filters.status ?? ''} onChange={(e) => router.get(route('admin.incidents'), { status: e.target.value })}>
        <option value="">All statuses</option>{statuses.map((s: string) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
      </select>
      <div className="space-y-4">
        {incidents.data.map((i: any) => (
          <article key={i.id} className={card}>
            <div className="mb-2 flex flex-wrap items-center gap-2"><Badge text={i.type} /><span className="text-sm text-secondary">{i.barangay} · by {i.user.name} · {new Date(i.created_at).toLocaleString()}</span></div>
            <p className="leading-6 text-primary">{i.description}</p>
            {i.photo_path && <a className="text-sm text-brand underline" target="_blank" rel="noopener noreferrer" href={`/storage/${i.photo_path}`}>View photo</a>}
            <div className="mt-3 flex flex-wrap gap-2">
              <label className="sr-only" htmlFor={`review-status-${i.id}`}>Status for report {i.id}</label>
              <select id={`review-status-${i.id}`} className={`${input} max-w-[12rem]`} value={i.status} onChange={(e) => update(i.id, { status: e.target.value, admin_notes: i.admin_notes })}>{statuses.map((s: string) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}</select>
              <label className="sr-only" htmlFor={`review-notes-${i.id}`}>Note to reporter for report {i.id}</label>
              <input id={`review-notes-${i.id}`} className={`${input} min-w-0 flex-1`} placeholder="Note to reporter (saves when you leave this field)" defaultValue={i.admin_notes ?? ''} onBlur={(e) => e.target.value !== (i.admin_notes ?? '') && update(i.id, { status: i.status, admin_notes: e.target.value })} />
            </div>
          </article>
        ))}
      </div>
      <Pager links={incidents.links} />
    </AppLayout>
  );
}
