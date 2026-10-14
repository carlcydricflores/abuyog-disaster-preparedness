import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { btn, btnAlt, card, input } from '@/Components/ui';

declare global {
  interface Window {
    google?: any;
  }
}

let googleMapsPromise: Promise<any> | null = null;

function loadGoogleMaps(apiKey: string): Promise<any> {
  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
      script.async = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => {
        googleMapsPromise = null;
        reject(new Error('Google Maps could not be loaded.'));
      };
      document.head.appendChild(script);
    });
  }

  return googleMapsPromise;
}

export default function Create({ types }: any) {
  const { data, setData, post, processing, errors } = useForm<any>({ type: types[0], barangay: '', description: '', latitude: '', longitude: '', photo: null });
  const mapElement = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const [mapState, setMapState] = useState<'loading' | 'ready' | 'missing-key' | 'error'>('loading');
  const [locationMessage, setLocationMessage] = useState('');
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const err = (k: string) => errors[k] && <p className="mt-1 text-sm text-red-400">{errors[k]}</p>;

  useEffect(() => {
    if (!apiKey) {
      setMapState('missing-key');
      return;
    }

    let cancelled = false;
    loadGoogleMaps(apiKey).then((google) => {
      if (cancelled || !mapElement.current) {
        return;
      }

      map.current = new google.maps.Map(mapElement.current, {
        center: { lat: 10.747, lng: 125.01 },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
      });
      map.current.addListener('click', (event: any) => {
        if (!event.latLng) {
          return;
        }

        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();
        marker.current?.setMap(null);
        marker.current = new google.maps.Marker({ map: map.current, position: { lat: latitude, lng: longitude } });
        setData((current: any) => ({ ...current, latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) }));
        setLocationMessage('Location selected on the map.');
      });
      setMapState('ready');
    }).catch(() => {
      if (!cancelled) {
        setMapState('error');
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const locate = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location services are not available in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const position = { lat: coords.latitude, lng: coords.longitude };
      setData((current: any) => ({ ...current, latitude: coords.latitude.toFixed(6), longitude: coords.longitude.toFixed(6) }));
      if (map.current) {
        map.current.panTo(position);
        map.current.setZoom(16);
        marker.current?.setMap(null);
        marker.current = new window.google.maps.Marker({ map: map.current, position });
      }
      setLocationMessage('Your current location is selected.');
    }, () => setLocationMessage('Could not access your location. Check browser permissions and try again.'));
  };

  return (
    <AppLayout title="Report an incident">
      <form onSubmit={(e) => { e.preventDefault(); post(route('incidents.store')); }} className={`${card} mx-auto max-w-xl space-y-4`}>
        <div><label className="mb-1 block text-sm text-stone-300">What happened?</label>
          <select className={input} value={data.type} onChange={(e) => setData('type', e.target.value)}>{types.map((t: string) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}</select>{err('type')}</div>
        <div><label className="mb-1 block text-sm text-stone-300">Barangay</label><input className={input} value={data.barangay} onChange={(e) => setData('barangay', e.target.value)} />{err('barangay')}</div>
        <div><label className="mb-1 block text-sm text-stone-300">Details</label><textarea rows={4} className={input} value={data.description} onChange={(e) => setData('description', e.target.value)} />{err('description')}</div>
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <label className="block text-sm text-stone-300">Incident location</label>
            <button type="button" onClick={locate} className={btnAlt}>Use my location</button>
          </div>
          <div ref={mapElement} role="application" aria-label="Google map location picker" className="h-72 w-full overflow-hidden rounded border border-stone-700 bg-stone-800 sm:h-96" />
          {mapState !== 'ready' && <p className="mt-2 text-sm text-amber-300">
            {mapState === 'loading' && 'Loading Google Maps...'}
            {mapState === 'missing-key' && 'Google Maps needs VITE_GOOGLE_MAPS_API_KEY configured in your local environment.'}
            {mapState === 'error' && 'Google Maps could not load. Check the API key and try again.'}
          </p>}
          <p className="mt-2 text-sm text-stone-400">Click the map to place a pin. {locationMessage}</p>
          {(errors.latitude || errors.longitude) && <p className="mt-1 text-sm text-red-400">{errors.latitude || errors.longitude}</p>}
        </div>
        <div><label className="mb-1 block text-sm text-stone-300">Photo (JPG or PNG, max 2 MB)</label><input type="file" accept="image/png,image/jpeg" onChange={(e) => setData('photo', e.target.files?.[0] ?? null)} className="text-sm text-stone-300" />{err('photo')}</div>
        <button disabled={processing} className={btn}>Send report</button>
      </form>
    </AppLayout>
  );
}
