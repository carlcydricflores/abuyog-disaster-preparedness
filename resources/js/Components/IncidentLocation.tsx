import { useState } from 'react';
import { btn } from '@/Components/ui';
import { directionsUrl, embedUrl, hasCoords } from '@/lib/maps';

/** Shows where an incident was reported: a map on demand and a directions link. For admins only. */
export default function IncidentLocation({ incident }: { incident: any }) {
  const [open, setOpen] = useState(false);
  // Reuse the evacuation-center link builder: exact pin when GPS coordinates were sent, otherwise the barangay area.
  const place = { name: `${incident.type} report`, barangay: incident.barangay, latitude: incident.latitude, longitude: incident.longitude };
  const exact = hasCoords(place);

  return (
    <div className="mt-3">
      <p className="text-sm text-secondary">
        <span className="font-semibold text-primary">Location:</span> {incident.barangay}
        {exact ? ` (GPS: ${Number(incident.latitude).toFixed(5)}, ${Number(incident.longitude).toFixed(5)})` : ' (no GPS pin; barangay only)'}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
          className="rounded-full border border-current px-4 py-1.5 text-sm font-semibold text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          {open ? 'Hide map' : 'View map'}
        </button>
        <a href={directionsUrl(place)} target="_blank" rel="noopener noreferrer" className={btn}>Get directions</a>
      </div>
      {open && (
        <div className="mt-3">
          <iframe title={`Map for ${incident.type} report in ${incident.barangay}`} src={embedUrl(place)} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" className="h-60 w-full rounded-xl border-0" />
          <p className="mt-1 text-xs text-muted">{exact ? 'Exact location sent by the reporter.' : 'Approximate location (barangay area).'}</p>
        </div>
      )}
    </div>
  );
}