import AppLayout from '@/Layouts/AppLayout';
import { card } from '@/Components/ui';

export default function Guidelines({ guidelines }: any) {
  return (
    <AppLayout title="Know More, Fearless">
      {['before', 'during', 'after'].map((k) => (
        <section key={k} className="mb-8">
          <h2 className="mb-3 text-xl font-bold capitalize text-orange-500">{k} a disaster</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(guidelines[k] ?? []).map((g: any) => <article key={g.id} className={card}><h3 className="font-bold text-amber-400">{g.title}</h3><p className="mt-1 whitespace-pre-line text-stone-300">{g.body}</p></article>)}
          </div>
        </section>
      ))}
    </AppLayout>
  );
}
