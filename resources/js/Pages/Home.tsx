import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { AlertCard, btn, btnAlt, card } from '@/Components/ui';

export default function Home({ alerts, centers, hotlines }: any) {
  return (
    <AppLayout title="Together we Prepare, Together we Stand.">
      <p className="-mt-3 mb-8 max-w-xl text-stone-400">Live alerts, open evacuation centers and emergency numbers for residents, barangay officials and responders.</p>
      <div className="mb-10 flex gap-3">
        <Link href={route('centers')} className={btn}>Find a shelter ({centers} open)</Link>
        <Link href={route('incidents.create')} className={btnAlt}>Report an incident</Link>
      </div>
      <h2 className="mb-3 text-xl font-bold text-orange-500">Active alerts</h2>
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {alerts.length ? alerts.map((a: any) => <AlertCard key={a.id} a={a} />) : <p className="text-stone-500">No active alerts right now.</p>}
      </div>
      <h2 className="mb-3 text-xl font-bold text-orange-500">Call for help</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {hotlines.map((h: any) => <a key={h.id} href={`tel:${h.number}`} className={card}><div className="text-sm text-stone-400">{h.name}</div><div className="text-2xl font-black text-amber-400">{h.number}</div></a>)}
      </div>
    </AppLayout>
  );
}
