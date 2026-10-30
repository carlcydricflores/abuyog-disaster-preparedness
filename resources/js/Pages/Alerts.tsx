import AppLayout from '@/Layouts/AppLayout';
import { AlertCard, Pager, card } from '@/Components/ui';

export default function Alerts({ alerts }: any) {
  return (
    <AppLayout title="Disaster alerts">
      <div className="grid gap-4">{alerts.data.length ? alerts.data.map((a: any) => <AlertCard key={a.id} a={a} />) : <p className={`${card} text-stone-300`}>No active alerts right now. Check back for current advisories.</p>}</div>
      <Pager links={alerts.links} />
    </AppLayout>
  );
}
