import { router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Badge, Pager, card, btn, input } from '@/Components/ui';

const statusStyle: any = { open: 'bg-green-800 text-white', full: 'bg-amber-600 text-stone-950', closed: 'bg-stone-600 text-white' };

export default function Centers({ centers, filters }: any) {
  const [q, setQ] = useState(filters.q ?? '');
  const [status, setStatus] = useState(filters.status ?? '');
  const search = (e: any) => { e.preventDefault(); router.get(route('centers'), { q, status }, { preserveState: true }); };

  return (
    <AppLayout title="Evacuation centers">
      <form onSubmit={search} className={`${card} mb-6 flex flex-wrap items-end gap-3`}>
        <div className="min-w-52 flex-1"><label htmlFor="center-search" className="mb-1 block text-sm font-medium text-stone-200">Center or barangay</label><input id="center-search" className={input} placeholder="Search by name or barangay" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="min-w-40"><label htmlFor="center-status" className="mb-1 block text-sm font-medium text-stone-200">Availability</label><select id="center-status" className={input} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option><option value="open">Open</option><option value="full">Full</option><option value="closed">Closed</option>
        </select></div>
        <button className={btn}>Search</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {centers.data.map((c: any) => {
          const pct = c.capacity ? Math.min(100, Math.round((c.occupied / c.capacity) * 100)) : 0;
          return (
            <article key={c.id} className={card}>
              <div className="flex items-start justify-between gap-2"><h3 className="text-lg font-bold text-amber-400">{c.name}</h3><Badge text={c.status} cls={statusStyle[c.status]} /></div>
              <p className="text-sm text-stone-400">{c.barangay}{c.address ? ` · ${c.address}` : ''}</p>
              <div role="progressbar" aria-label={`Shelter occupancy at ${c.name}`} aria-valuemin={0} aria-valuemax={c.capacity} aria-valuenow={Math.min(c.occupied, c.capacity)} className="mt-4 h-2 rounded bg-stone-800"><div className="h-2 rounded bg-orange-500" style={{ width: `${pct}%` }} /></div>
              <p className="mt-1 text-sm text-stone-300">{c.occupied} / {c.capacity} sheltered</p>
              <div className="mt-3 flex gap-4 text-sm">
                {c.latitude != null && c.longitude != null && <a className="rounded text-amber-300 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}>Open in Maps</a>}
                {c.contact && <span className="text-stone-400">Contact: {c.contact}</span>}
              </div>
            </article>
          );
        })}
      </div>
      {!centers.data.length && <p className="text-stone-500">No centers match your search.</p>}
      <Pager links={centers.links} />
    </AppLayout>
  );
}
