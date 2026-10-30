import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { card } from '@/Components/ui';

export default function Dashboard() {
  const { auth }: any = usePage().props;
  const admin = auth.user.role === 'admin';
  const tiles: [string, string][] = admin
    ? [[route('admin.manage.index', 'alerts'), 'Post & manage alerts'], [route('admin.manage.index', 'centers'), 'Evacuation centers'],
       [route('admin.manage.index', 'hotlines'), 'Hotlines'], [route('admin.manage.index', 'guidelines'), 'Safety guidelines'],
       [route('admin.incidents'), 'Review incident reports'], [route('admin.reports'), 'Emergency reports'], [route('admin.analytics'), 'Data analytics']]
    : [[route('incidents.create'), 'Report an incident'], [route('incidents.index'), 'My reports'], [route('centers'), 'Find a shelter'], [route('profile.edit'), 'Profile']];
  return (
    <AppLayout title={admin ? 'Admin dashboard' : 'My account'}>
      <p className="mb-6 text-secondary">Signed in as <span className="font-semibold text-primary">{auth.user.name}</span>.</p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{tiles.map(([href, label]) => <Link key={href} href={href} className={`${card} group min-h-24 transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus`}><span className="flex items-center justify-between gap-4 font-semibold text-primary"><span>{label}</span><span aria-hidden="true" className="text-lg text-brand transition-transform group-hover:translate-x-1">→</span></span></Link>)}</div>
    </AppLayout>
  );
}
