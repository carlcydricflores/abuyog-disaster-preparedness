import AppLayout from '@/Layouts/AppLayout';
import { card } from '@/Components/ui';

export default function Hotlines({ hotlines }: any) {
  return (
    <AppLayout title="Emergency hotlines">
      {Object.entries(hotlines).map(([cat, list]: any) => (
        <section key={cat} className="mb-8">
          <h2 className="mb-3 border-b border-subtle pb-2 text-lg font-bold capitalize text-primary">{cat}</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((h: any) => <a key={h.id} href={`tel:${h.number}`} className={`${card} transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus`}><div className="text-sm text-secondary">{h.name}</div><div className="mt-2 text-2xl font-bold text-brand">{h.number}</div><span className="mt-3 inline-block text-xs font-semibold uppercase text-muted">Call hotline</span></a>)}
          </div>
        </section>
      ))}
      {!Object.keys(hotlines).length && <p className={`${card} text-secondary`}>No hotline numbers are currently listed.</p>}
    </AppLayout>
  );
}
