import AppLayout from '@/Layouts/AppLayout';
import { AlertCard, Pager } from '@/Components/ui';

export default function Alerts({ alerts }: any) {
  return (
    <AppLayout title="Disaster alerts">
      <div className="grid gap-4">{alerts.data.length ? alerts.data.map((a: any) => <AlertCard key={a.id} a={a} />) : <p className="text-stone-500">No active alerts. You will see new warnings here first.</p>}</div>
      <Pager links={alerts.links} />
    </AppLayout>
  );
}
