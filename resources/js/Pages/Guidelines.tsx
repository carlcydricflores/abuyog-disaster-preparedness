import AppLayout from '@/Layouts/AppLayout';
import { card } from '@/Components/ui';

export default function Guidelines({ guidelines }: any) {
  return (
    <AppLayout title="Safety guidelines">
      <p className="mb-6 max-w-3xl leading-6 text-secondary">Practical preparedness information organized by when it may be useful. Follow current instructions from local emergency responders.</p>
      {['before', 'during', 'after'].map((k) => (
        <section key={k} className="mb-8">
          <h2 className="mb-3 border-b border-subtle pb-2 text-lg font-bold capitalize text-brand">{k} a disaster</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(guidelines[k] ?? []).map((g: any) => <article key={g.id} className={card}><h3 className="font-semibold text-primary">{g.title}</h3><p className="mt-2 whitespace-pre-line leading-6 text-secondary">{g.body}</p></article>)}
          </div>
          {!(guidelines[k] ?? []).length && <p className="text-sm text-muted">No guidance is currently listed for this stage.</p>}
        </section>
      ))}
    </AppLayout>
  );
}
