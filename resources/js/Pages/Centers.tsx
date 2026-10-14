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
      <form onSubmit={search} className="mb-6 flex flex-wrap gap-2">
        <input className={`${input} max-w-xs`} placeholder="Search name or barangay" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={`${input} max-w-[10rem]`} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option><option value="open">Open</option><option value="full">Full</option><option value="closed">Closed</option>
        </select>
        <button className={btn}>Search</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {centers.data.map((c: any) => {
          const pct = c.capacity ? Math.min(100, Math.round((c.occupied / c.capacity) * 100)) : 0;
          return (
            <article key={c.id} className={card}>
              <div className="flex items-start justify-between gap-2"><h3 className="text-lg font-bold text-amber-400">{c.name}</h3><Badge text={c.status} cls={statusStyle[c.status]} /></div>
              <p className="text-sm text-stone-400">{c.barangay}{c.address ? ` · ${c.address}` : ''}</p>
              <div className="mt-3 h-2 rounded bg-stone-800"><div className="h-2 rounded bg-orange-600" style={{ width: `${pct}%` }} /></div>
              <p className="mt-1 text-sm text-stone-300">{c.occupied} / {c.capacity} sheltered</p>
              <div className="mt-3 flex gap-4 text-sm">
                {c.latitude && <a className="text-amber-500 underline" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}>Open in Maps</a>}
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
