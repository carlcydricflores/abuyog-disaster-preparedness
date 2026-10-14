import { router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { btn, btnAlt, card, input } from '@/Components/ui';

const Table = ({ title, rows }: any) => (
  <div className={card}><h3 className="mb-2 font-bold text-orange-500">{title}</h3>
    {rows.map((r: any) => <div key={r.label} className="flex justify-between border-b border-stone-800 py-1 text-sm"><span className="capitalize">{String(r.label).replace('_', ' ')}</span><span className="font-bold text-amber-400">{r.total}</span></div>)}
    {!rows.length && <p className="text-sm text-stone-500">No data for this range.</p>}
  </div>
);

export default function Reports({ total, alerts, byStatus, byType, byBarangay, filters }: any) {
  const [f, setF] = useState({ from: filters.from ?? '', to: filters.to ?? '' });
  const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as any).toString();
  return (
    <AppLayout title="Emergency reports">
      <form onSubmit={(e) => { e.preventDefault(); router.get(route('admin.reports'), f); }} className="mb-6 flex flex-wrap items-end gap-2 print:hidden">
        <div><label className="block text-sm text-stone-400">From</label><input type="date" className={input} value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></div>
        <div><label className="block text-sm text-stone-400">To</label><input type="date" className={input} value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></div>
        <button className={btn}>Apply</button>
        <a href={`${route('admin.reports.export')}?${qs}`} className={btnAlt}>Download CSV</a>
        <button type="button" onClick={() => window.print()} className={btnAlt}>Print / Save PDF</button>
      </form>
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className={card}><div className="text-sm text-stone-400">Incident reports</div><div className="text-4xl font-black text-amber-400">{total}</div></div>
        <div className={card}><div className="text-sm text-stone-400">Alerts issued</div><div className="text-4xl font-black text-orange-500">{alerts}</div></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3"><Table title="By status" rows={byStatus} /><Table title="By type" rows={byType} /><Table title="By barangay" rows={byBarangay} /></div>
    </AppLayout>
  );
}
