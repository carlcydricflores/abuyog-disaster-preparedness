import { router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { btn, btnAlt, card, input } from '@/Components/ui';

const Table = ({ title, rows }: any) => (
  <section className={card}><h3 className="mb-3 font-semibold text-primary">{title}</h3>
    {rows.map((r: any) => <div key={r.label} className="flex justify-between gap-4 border-b border-subtle py-2 text-sm last:border-0"><span className="capitalize text-secondary">{String(r.label).replace('_', ' ')}</span><span className="font-semibold tabular-nums text-brand">{r.total}</span></div>)}
    {!rows.length && <p className="text-sm text-muted">No data for this range.</p>}
  </section>
);

export default function Reports({ total, alerts, byStatus, byType, byBarangay, filters }: any) {
  const [f, setF] = useState({ from: filters.from ?? '', to: filters.to ?? '' });
  const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as any).toString();
  return (
    <AppLayout title="Emergency reports">
      <form onSubmit={(e) => { e.preventDefault(); router.get(route('admin.reports'), f); }} className="mb-6 flex flex-wrap items-end gap-2 print:hidden">
        <div><label htmlFor="report-from" className="mb-1 block text-sm font-medium text-primary">From</label><input id="report-from" type="date" className={input} value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></div>
        <div><label htmlFor="report-to" className="mb-1 block text-sm font-medium text-primary">To</label><input id="report-to" type="date" className={input} value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></div>
        <button className={btn}>Apply</button>
        <a href={`${route('admin.reports.export')}?${qs}`} className={btnAlt}>Download CSV</a>
        <button type="button" onClick={() => window.print()} className={btnAlt}>Print / Save PDF</button>
      </form>
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className={card}><div className="text-sm text-secondary">Incident reports</div><div className="mt-2 text-3xl font-bold tabular-nums text-brand">{total}</div></div>
        <div className={card}><div className="text-sm text-secondary">Alerts issued</div><div className="mt-2 text-3xl font-bold tabular-nums text-brand">{alerts}</div></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3"><Table title="By status" rows={byStatus} /><Table title="By type" rows={byType} /><Table title="By barangay" rows={byBarangay} /></div>
    </AppLayout>
  );
}
