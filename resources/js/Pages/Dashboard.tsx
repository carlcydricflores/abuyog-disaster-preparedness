import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { card } from '@/Components/ui';

export default function Dashboard() {
  const { auth }: any = usePage().props;
  const admin = auth.user.role === 'admin';
  const tiles: [string, string][] = admin
    ? [[route('admin.manage.index', 'alerts'), 'Post & manage alerts'], [route('admin.manage.index', 'centers'), 'Evacuation centers'],
       [route('admin.manage.index', 'hotlines'), 'Hotlines'], [route('admin.manage.index', 'guidelines'), 'Safety guidelines'],
       [route('admin.incidents'), 'Review incident reports'], [route('admin.reports'), 'Emergency reports']]
    : [[route('incidents.create'), 'Report an incident'], [route('incidents.index'), 'My reports'], [route('centers'), 'Find a shelter'], [route('profile.edit'), 'Profile']];
  return (
    <AppLayout title={admin ? 'Admin dashboard' : 'My account'}>
      <p className="mb-6 text-stone-400">Signed in as {auth.user.name}.</p>
      <div className="grid gap-4 md:grid-cols-3">{tiles.map(([href, label]) => <Link key={href} href={href} className={`${card} font-bold text-amber-400 hover:border-orange-600`}>{label}</Link>)}</div>
    </AppLayout>
  );
}
