import AppLayout from '@/Layouts/AppLayout';
import { card } from '@/Components/ui';

export default function Hotlines({ hotlines }: any) {
  return (
    <AppLayout title="Emergency hotlines">
      {Object.entries(hotlines).map(([cat, list]: any) => (
        <section key={cat} className="mb-8">
          <h2 className="mb-3 border-b border-stone-700 pb-2 text-lg font-bold capitalize text-stone-100">{cat}</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((h: any) => <a key={h.id} href={`tel:${h.number}`} className={`${card} transition-colors hover:border-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}><div className="text-sm text-stone-300">{h.name}</div><div className="mt-2 text-2xl font-bold text-amber-300">{h.number}</div><span className="mt-3 inline-block text-xs font-semibold uppercase text-stone-400">Call hotline</span></a>)}
          </div>
        </section>
      ))}
      {!Object.keys(hotlines).length && <p className={`${card} text-stone-300`}>No hotline numbers are currently listed.</p>}
    </AppLayout>
  );
}
