import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import IncidentMedia from '@/Components/IncidentMedia';
import { Badge, Pager, btn, card } from '@/Components/ui';

export default function Index({ incidents }: any) {
  const { auth }: any = usePage().props;

  return (
    <AppLayout title="My reports">
      <div className="grid gap-4">
        {incidents.data.map((i: any) => (
          <article key={i.id} className={card}>
            <div className="mb-1 flex gap-2"><Badge text={i.type} /><Badge text={i.status} cls="status-watch" /></div>
            <p className="mb-2 text-sm font-semibold text-secondary">Filed by {auth.user.name}</p>
            {i.status === 'verified' && i.alert?.is_published && <p role="status" className="mb-2 text-sm font-semibold text-success">Verified and published as a public alert.</p>}
            <p className="leading-6 text-primary">{i.description}</p>
            <IncidentMedia photoUrl={i.photo_path ? route('incidents.photo', i.id) : null} type={i.type} barangay={i.barangay} />
            <p className="mt-2 text-sm text-muted">{i.barangay} <span aria-hidden="true">·</span> {new Date(i.created_at).toLocaleString()}</p>
            {i.admin_notes && <p className="mt-3 border-t border-subtle pt-3 text-sm leading-6 text-brand"><span className="font-semibold">Response:</span> {i.admin_notes}</p>}
          </article>
        ))}
        {!incidents.data.length && <div className={`${card} text-secondary`}><h2 className="font-semibold text-primary">No reports yet</h2><p className="mt-1 text-sm">Reports you submit will appear here with their current review status.</p></div>}
      </div>
      <Pager links={incidents.links} />
      <Link href={route('incidents.create')} className={`${btn} mt-6`}>Report an incident</Link>
    </AppLayout>
  );
}
