import { useState } from 'react';
import { MapCenter, directionsUrl, embedUrl, hasCoords } from '@/lib/maps';

/** "View map" (loads one map only when opened) and "Get directions" buttons for one evacuation center. */
export default function CenterLocation({ center }: { center: MapCenter }) {
  const [open, setOpen] = useState(false);
  const exact = hasCoords(center);
  const btn = 'rounded-full px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400';

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
          className={`${btn} border border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10`}>
          {open ? 'Hide map' : 'View map'}
        </button>
        <a href={directionsUrl(center)} target="_blank" rel="noopener noreferrer" className={`${btn} bg-blue-700 text-white hover:bg-blue-600`}>
          Get directions
        </a>
      </div>

      {open && (
        <div className="mt-3">
          <iframe title={`Map of ${center.name}`} src={embedUrl(center)} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" className="h-60 w-full rounded-xl border-0" />
          <p className="mt-1 text-xs opacity-70">{exact ? 'Exact location.' : 'Approximate location (barangay area).'}</p>
        </div>
      )}
    </div>
  );
}