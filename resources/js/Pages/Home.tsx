import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { AlertCard, btn, btnAlt, card } from '@/Components/ui';

export default function Home({ alerts, centers, hotlines }: any) {
  return (
    <AppLayout title="Preparedness information for Abuyog">
      <section className="glass-surface relative isolate mb-9 overflow-hidden rounded-3xl">
        <div className="relative z-10 max-w-2xl px-5 py-6 sm:px-8 sm:py-8">
          <p className="mb-2 text-xs font-bold uppercase text-brand">Community readiness</p>
          <p className="max-w-xl text-sm leading-6 text-primary sm:text-base">Local alerts, evacuation information, emergency contacts, and preparedness guidance for residents and responders.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={route('centers')} className={btn}>Find a shelter <span className="ml-2 rounded bg-black/20 px-2 py-0.5 text-xs">{centers} open</span></Link>
            <Link href={route('incidents.create')} className={`${btnAlt} bg-glass hover:bg-surface-raised`}>Report an incident</Link>
          </div>
        </div>
        <img src="/images/preparedness-hero.svg" alt="" width="800" height="450" className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-[55%] object-cover object-right opacity-75" />
        <div aria-hidden="true" className="home-hero-overlay pointer-events-none absolute inset-y-0 left-0 -z-0 w-2/3" />
      </section>

      <section aria-labelledby="active-alerts-heading" className="mb-9">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="active-alerts-heading" className="text-xl font-bold text-primary">Active alerts</h2>
            <p className="mt-1 text-sm text-muted">Current advisories and warnings</p>
          </div>
          <Link href={route('alerts')} className="rounded text-sm font-semibold text-brand underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">All alerts</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {alerts.length ? alerts.map((alert: any) => <AlertCard key={alert.id} a={alert} />) : <p className={`${card} text-secondary`}>No active alerts right now.</p>}
        </div>
      </section>

      <section aria-labelledby="hotlines-heading">
        <div className="mb-4">
          <h2 id="hotlines-heading" className="text-xl font-bold text-primary">Emergency hotlines</h2>
          <p className="mt-1 text-sm text-muted">Tap a number to call from a supported device.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {hotlines.map((hotline: any) => <a key={hotline.id} href={`tel:${hotline.number}`} className={`${card} transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus`}><div className="text-sm text-secondary">{hotline.name}</div><div className="mt-2 text-xl font-bold text-brand">{hotline.number}</div></a>)}
          {!hotlines.length && <p className={`${card} text-secondary`}>No hotline numbers are listed.</p>}
        </div>
      </section>
    </AppLayout>
  );
}
