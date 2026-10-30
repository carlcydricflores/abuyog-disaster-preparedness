import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Pager, btn, btnAlt, card, input } from '@/Components/ui';

function parseGoogleMapsCoordinates(mapLink: string) {
  let normalizedLink = mapLink;
  try {
    normalizedLink = decodeURIComponent(mapLink);
  } catch {
    return null;
  }

  const match = normalizedLink.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/i)
    ?? normalizedLink.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/)
    ?? normalizedLink.match(/[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i)
    ?? normalizedLink.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);

  if (!match) {
    return null;
  }

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
  }

  return { latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) };
}

/** Generic admin CRUD screen. The form is generated from the `fields` definition sent by ManageController. */
export default function Manage({ resource, fields, rows }: any) {
  const blank = Object.fromEntries(fields.map((f: any) => [f.name, '']));
  if (resource === 'centers') blank.locationLink = '';
  const { data, setData, post, put, reset, errors, processing, clearErrors } = useForm<any>(blank);
  const [editId, setEditId] = useState<number | null>(null);
  const [locationMessage, setLocationMessage] = useState('');
  const [notice, setNotice] = useState('');

  const submit = (e: any) => {
    e.preventDefault();
    const opts = { preserveScroll: true, onSuccess: () => { reset(); setEditId(null); setNotice(editId ? 'Changes saved.' : 'Item added.'); } };
    editId ? put(route('admin.manage.update', [resource, editId]), opts) : post(route('admin.manage.store', resource), opts);
  };
  const edit = (row: any) => {
    clearErrors();
    setEditId(row.id);
    const rowData = Object.fromEntries(fields.map((f: any) => [f.name, row[f.name] ?? '']));
    if (resource === 'centers') {
      rowData.locationLink = row.latitude && row.longitude ? `https://www.google.com/maps?q=${row.latitude},${row.longitude}` : '';
    }
    setData(rowData);
    setLocationMessage('');
  };
  const remove = (id: number) => confirm('Delete this item?') && router.delete(route('admin.manage.destroy', [resource, id]), { preserveScroll: true, onSuccess: () => setNotice('Item deleted.') });

  const updateLocationLink = (mapLink: string) => {
    const coordinates = parseGoogleMapsCoordinates(mapLink);
    setData((current: any) => ({
      ...current,
      locationLink: mapLink,
      latitude: coordinates?.latitude ?? '',
      longitude: coordinates?.longitude ?? '',
    }));
    setLocationMessage(mapLink && !coordinates ? 'Paste a Google Maps link that includes a pinned location or coordinates.' : '');
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location services are not available in this browser.');
      return;
    }

    setLocationMessage('Finding your current location...');
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const latitude = coords.latitude.toFixed(6);
      const longitude = coords.longitude.toFixed(6);
      setData((current: any) => ({
        ...current,
        latitude,
        longitude,
        locationLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
      }));
      setLocationMessage('Current location added.');
    }, () => setLocationMessage('Could not access your location. Check browser permissions and try again.'), { enableHighAccuracy: true, timeout: 10000 });
  };

  return (
    <AppLayout title={`Manage ${resource}`}>
      <div className="mb-6 flex flex-wrap gap-2">
        {['alerts', 'centers', 'hotlines', 'guidelines'].map((r) => <Link key={r} href={route('admin.manage.index', r)} className={r === resource ? btn : btnAlt}>{r}</Link>)}
      </div>
      {notice && <p role="status" className="mb-4 rounded border border-emerald-700 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-200">{notice}</p>}
      <form onSubmit={submit} className={`${card} mb-8 grid gap-4 md:grid-cols-2`}>
        {fields.map((f: any) => {
          const fieldId = `manage-${resource}-${f.name}`;
          const errorId = `${fieldId}-error`;
          if (resource === 'centers' && f.name === 'longitude') return null;
          if (resource === 'centers' && f.name === 'latitude') {
            return (
              <div key="locationLink" className="md:col-span-2">
                <label htmlFor="center-location-link" className="mb-1 block text-sm font-medium text-stone-200">Google Maps link</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id="center-location-link"
                    type="url"
                    className={input}
                    placeholder="Paste a Google Maps link with a dropped pin"
                    value={data.locationLink}
                    onChange={(e) => updateLocationLink(e.target.value)}
                  />
                  <button type="button" className={`${btnAlt} shrink-0`} onClick={useCurrentLocation}>Use my current location</button>
                </div>
                {locationMessage && <p className="mt-1 text-sm text-amber-300">{locationMessage}</p>}
                {(errors.latitude || errors.longitude) && <p className="mt-1 text-sm text-red-400">{errors.latitude || errors.longitude}</p>}
                {data.latitude && data.longitude && <a className="mt-2 inline-block text-sm text-amber-500 underline" href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`} target="_blank" rel="noopener noreferrer">Open selected location in Google Maps</a>}
              </div>
            );
          }

          return (
            <div key={f.name} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
              <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-stone-200">{f.label}</label>
              {f.type === 'select' ? <select id={fieldId} aria-invalid={Boolean(errors[f.name])} aria-describedby={errors[f.name] ? errorId : undefined} className={input} value={data[f.name]} onChange={(e) => setData(f.name, e.target.value)}><option value="">Choose…</option>{f.options.map((o: string) => <option key={o}>{o}</option>)}</select>
                : f.type === 'textarea' ? <textarea id={fieldId} aria-invalid={Boolean(errors[f.name])} aria-describedby={errors[f.name] ? errorId : undefined} rows={4} className={input} value={data[f.name]} onChange={(e) => setData(f.name, e.target.value)} />
                : <input id={fieldId} aria-invalid={Boolean(errors[f.name])} aria-describedby={errors[f.name] ? errorId : undefined} type={f.type} step="any" className={input} value={data[f.name]} onChange={(e) => setData(f.name, e.target.value)} />}
              {errors[f.name] && <p id={errorId} role="alert" className="mt-1 text-sm text-red-300">{errors[f.name]}</p>}
            </div>
          );
        })}
        <div className="flex gap-2 md:col-span-2">
          <button disabled={processing} className={btn}>{editId ? 'Save changes' : 'Add'}</button>
          {editId && <button type="button" className={btnAlt} onClick={() => { reset(); setEditId(null); }}>Cancel</button>}
        </div>
      </form>
      <div className="space-y-2">
        {rows.data.map((row: any) => (
          <div key={row.id} className={`${card} flex items-center justify-between gap-4 py-3`}>
            <div className="min-w-0"><div className="truncate font-semibold text-amber-400">{row[fields[0].name]}</div><div className="truncate text-sm text-stone-500">{fields.slice(1, 4).map((f: any) => row[f.name]).filter(Boolean).join(' · ')}</div></div>
            <div className="flex shrink-0 gap-3 text-sm"><button type="button" className="rounded px-2 py-2 font-semibold text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" onClick={() => edit(row)}>Edit</button><button type="button" className="rounded px-2 py-2 font-semibold text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300" onClick={() => remove(row.id)}>Delete</button></div>
          </div>
        ))}
        {!rows.data.length && <p className="text-stone-500">Nothing here yet. Use the form above to add the first item.</p>}
      </div>
      <Pager links={rows.links} />
    </AppLayout>
  );
}
