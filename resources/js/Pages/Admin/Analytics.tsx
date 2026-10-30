import AppLayout from '@/Layouts/AppLayout';
import { card } from '@/Components/ui';

function Metric({ label, value, accent = 'text-brand' }: { label: string; value: number; accent?: string }) {
  return (
    <div className={card}>
      <p className="text-sm text-secondary">{label}</p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${accent}`}>{value.toLocaleString()}</p>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: { label: string | null; total: number }[] }) {
  const maximum = Math.max(1, ...rows.map((row) => Number(row.total)));

  return (
    <section className={card}>
      <h2 className="mb-4 font-bold text-brand">{title}</h2>
      {rows.length ? <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label ?? 'unknown'}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="capitalize text-primary">{(row.label ?? 'Unknown').replaceAll('_', ' ')}</span>
              <span className="font-semibold tabular-nums text-primary">{row.total}</span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-surface-raised">
              <div className="h-full rounded bg-action" style={{ width: `${(Number(row.total) / maximum) * 100}%` }} />
            </div>
          </div>
        ))}
      </div> : <p className="text-sm text-muted">No incident data yet.</p>}
    </section>
  );
}

export default function Analytics({ totalIncidents, activeAlerts, registeredResidents, centerSummary, dailyTrend, byStatus, byType, byBarangay }: any) {
  const maximumDaily = Math.max(1, ...dailyTrend.map((day: any) => Number(day.total)));

  return (
    <AppLayout title="Data analytics">
      <p className="mb-5 max-w-3xl text-sm leading-6 text-secondary">Incident activity over the last 30 days and current community readiness, based on information entered in this system.</p>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Incident reports" value={totalIncidents} />
        <Metric label="Active alerts" value={activeAlerts} accent="text-brand" />
        <Metric label="Registered residents" value={registeredResidents} />
        <Metric label="Open evacuation centers" value={centerSummary.open} accent="text-success" />
      </div>

      <section className={`${card} mb-5`}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-bold text-brand">Daily incident reports</h2>
            <p className="mt-1 text-sm text-muted">Last 30 days</p>
          </div>
          <p className="text-sm text-secondary">{centerSummary.availableSpaces.toLocaleString()} open spaces listed</p>
        </div>
        <div role="img" aria-label="Bar chart of daily incident reports for the last 30 days" className="flex h-44 items-end gap-1 border-b border-subtle pb-1">
          {dailyTrend.map((day: any, index: number) => (
            <div key={day.label} title={`${day.label}: ${day.total} reports`} className="flex h-full min-w-0 flex-1 flex-col justify-end">
              <div className="w-full rounded-t bg-brand" style={{ height: `${day.total ? Math.max(6, (Number(day.total) / maximumDaily) * 100) : 2}%` }} />
              {index % 5 === 0 && <span className="mt-1 truncate text-center text-[9px] text-muted">{day.label}</span>}
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Breakdown title="Reports by status" rows={byStatus} />
        <Breakdown title="Reports by incident type" rows={byType} />
        <Breakdown title="Most affected barangays" rows={byBarangay} />
        <section className={card}>
          <h2 className="mb-4 font-bold text-brand">Evacuation capacity</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-subtle pb-2"><dt className="text-muted">Centers listed</dt><dd className="font-semibold">{centerSummary.total}</dd></div>
            <div className="flex justify-between border-b border-subtle pb-2"><dt className="text-muted">Currently open</dt><dd className="font-semibold text-success">{centerSummary.open}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Open spaces listed</dt><dd className="font-semibold text-brand">{centerSummary.availableSpaces.toLocaleString()}</dd></div>
          </dl>
        </section>
      </div>
    </AppLayout>
  );
}