import AppLayout from '@/Layouts/AppLayout';
import { card } from '@/Components/ui';

export default function Hotlines({ hotlines }: any) {
  return (
    <AppLayout title="Emergency hotlines">
      {Object.entries(hotlines).map(([cat, list]: any) => (
        <section key={cat} className="mb-8">
          <h2 className="mb-3 text-xl font-bold capitalize text-orange-500">{cat}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {list.map((h: any) => <a key={h.id} href={`tel:${h.number}`} className={card}><div className="text-stone-300">{h.name}</div><div className="text-2xl font-black text-amber-400">{h.number}</div></a>)}
          </div>
        </section>
      ))}
    </AppLayout>
  );
}
