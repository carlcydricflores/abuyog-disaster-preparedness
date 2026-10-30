import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Badge, Pager, btn, card } from '@/Components/ui';

export default function Index({ incidents }: any) {
  return (
    <AppLayout title="My reports">
      <div className="grid gap-4">
        {incidents.data.map((i: any) => (
          <article key={i.id} className={card}>
            <div className="mb-1 flex gap-2"><Badge text={i.type} /><Badge text={i.status} cls="bg-amber-600 text-stone-950" /></div>
            <p className="leading-6 text-stone-200">{i.description}</p>
            <p className="mt-2 text-sm text-stone-400">{i.barangay} <span aria-hidden="true">·</span> {new Date(i.created_at).toLocaleString()}</p>
            {i.admin_notes && <p className="mt-3 border-t border-stone-700 pt-3 text-sm leading-6 text-amber-200"><span className="font-semibold">Response:</span> {i.admin_notes}</p>}
          </article>
        ))}
        {!incidents.data.length && <div className={`${card} text-stone-300`}><h2 className="font-semibold text-stone-100">No reports yet</h2><p className="mt-1 text-sm">Reports you submit will appear here with their current review status.</p></div>}
      </div>
      <Pager links={incidents.links} />
      <Link href={route('incidents.create')} className={`${btn} mt-6`}>Report an incident</Link>
    </AppLayout>
  );
}
