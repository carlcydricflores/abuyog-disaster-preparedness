import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Badge, Pager, card, input } from '@/Components/ui';

export default function Incidents({ incidents, statuses, filters }: any) {
  const update = (id: number, body: any) => router.patch(route('admin.incidents.update', id), body, { preserveScroll: true });
  return (
    <AppLayout title="Incident reports">
      <select className={`${input} mb-6 max-w-xs`} value={filters.status ?? ''} onChange={(e) => router.get(route('admin.incidents'), { status: e.target.value })}>
        <option value="">All statuses</option>{statuses.map((s: string) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
      </select>
      <div className="space-y-4">
        {incidents.data.map((i: any) => (
          <article key={i.id} className={card}>
            <div className="mb-1 flex gap-2"><Badge text={i.type} /><span className="text-sm text-stone-500">{i.barangay} · by {i.user.name} · {new Date(i.created_at).toLocaleString()}</span></div>
            <p className="text-stone-200">{i.description}</p>
            {i.photo_path && <a className="text-sm text-amber-500 underline" target="_blank" rel="noopener noreferrer" href={`/storage/${i.photo_path}`}>View photo</a>}
            <div className="mt-3 flex flex-wrap gap-2">
              <select className={`${input} max-w-[10rem]`} value={i.status} onChange={(e) => update(i.id, { status: e.target.value, admin_notes: i.admin_notes })}>{statuses.map((s: string) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}</select>
              <input className={`${input} flex-1`} placeholder="Note to reporter (saves when you click away)" defaultValue={i.admin_notes ?? ''} onBlur={(e) => e.target.value !== (i.admin_notes ?? '') && update(i.id, { status: i.status, admin_notes: e.target.value })} />
            </div>
          </article>
        ))}
      </div>
      <Pager links={incidents.links} />
    </AppLayout>
  );
}
