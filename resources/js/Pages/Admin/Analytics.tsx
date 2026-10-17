import AppLayout from '@/Layouts/AppLayout';
import { card } from '@/Components/ui';

function Metric({ label, value, accent = 'text-amber-400' }: { label: string; value: number; accent?: string }) {
  return (
    <div className={card}>
      <p className="text-sm text-stone-400">{label}</p>
      <p className={`mt-2 text-3xl font-black ${accent}`}>{value.toLocaleString()}</p>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: { label: string | null; total: number }[] }) {
  const maximum = Math.max(1, ...rows.map((row) => Number(row.total)));

  return (
    <section className={card}>
      <h2 className="mb-4 font-bold text-orange-400">{title}</h2>
      {rows.length ? <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label ?? 'unknown'}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="capitalize text-stone-300">{(row.label ?? 'Unknown').replaceAll('_', ' ')}</span>
              <span className="font-semibold text-stone-100">{row.total}</span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-stone-800">
              <div className="h-full rounded bg-orange-600" style={{ width: `${(Number(row.total) / maximum) * 100}%` }} />
            </div>
          </div>
        ))}
      </div> : <p className="text-sm text-stone-500">No incident data yet.</p>}
    </section>
  );
}

export default function Analytics({ totalIncidents, activeAlerts, registeredResidents, centerSummary, dailyTrend, byStatus, byType, byBarangay }: any) {
  const maximumDaily = Math.max(1, ...dailyTrend.map((day: any) => Number(day.total)));

  return (
    <AppLayout title="Data analytics">
      <p className="mb-5 text-sm text-stone-400">Incident activity over the last 30 days and current community readiness.</p>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Incident reports" value={totalIncidents} />
        <Metric label="Active alerts" value={activeAlerts} accent="text-orange-400" />
        <Metric label="Registered residents" value={registeredResidents} />
        <Metric label="Open evacuation centers" value={centerSummary.open} accent="text-emerald-400" />
      </div>

      <section className={`${card} mb-5`}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-bold text-orange-400">Daily incident reports</h2>
            <p className="mt-1 text-sm text-stone-500">Last 30 days</p>
          </div>
          <p className="text-sm text-stone-400">{centerSummary.availableSpaces.toLocaleString()} open spaces listed</p>
        </div>
        <div role="img" aria-label="Bar chart of daily incident reports for the last 30 days" className="flex h-44 items-end gap-1 border-b border-stone-700 pb-1">
          {dailyTrend.map((day: any, index: number) => (
            <div key={day.label} title={`${day.label}: ${day.total} reports`} className="flex h-full min-w-0 flex-1 flex-col justify-end">
              <div className="w-full rounded-t bg-amber-500/80" style={{ height: `${day.total ? Math.max(6, (Number(day.total) / maximumDaily) * 100) : 2}%` }} />
              {index % 5 === 0 && <span className="mt-1 truncate text-center text-[9px] text-stone-500">{day.label}</span>}
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Breakdown title="Reports by status" rows={byStatus} />
        <Breakdown title="Reports by incident type" rows={byType} />
        <Breakdown title="Most affected barangays" rows={byBarangay} />
        <section className={card}>
          <h2 className="mb-4 font-bold text-orange-400">Evacuation capacity</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-stone-800 pb-2"><dt className="text-stone-400">Centers listed</dt><dd className="font-semibold">{centerSummary.total}</dd></div>
            <div className="flex justify-between border-b border-stone-800 pb-2"><dt className="text-stone-400">Currently open</dt><dd className="font-semibold text-emerald-400">{centerSummary.open}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-400">Open spaces listed</dt><dd className="font-semibold text-amber-400">{centerSummary.availableSpaces.toLocaleString()}</dd></div>
          </dl>
        </section>
      </div>
    </AppLayout>
  );
}