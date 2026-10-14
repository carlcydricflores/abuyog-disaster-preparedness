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
            <p className="text-stone-300">{i.description}</p>
            <p className="mt-1 text-sm text-stone-500">{i.barangay} · {new Date(i.created_at).toLocaleString()}</p>
            {i.admin_notes && <p className="mt-2 text-sm text-amber-400">Response: {i.admin_notes}</p>}
          </article>
        ))}
        {!incidents.data.length && <p className="text-stone-500">You have not sent any reports yet.</p>}
      </div>
      <Pager links={incidents.links} />
      <Link href={route('incidents.create')} className={`${btn} mt-6`}>Report an incident</Link>
    </AppLayout>
  );
}
