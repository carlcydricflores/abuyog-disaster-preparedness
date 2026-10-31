// Builds Google Maps links for an evacuation center.
// Uses exact coordinates when saved; otherwise falls back to the barangay area (never invents coordinates).
export type MapCenter = {
  name: string;
  barangay: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
};

export function hasCoords(c: MapCenter): boolean {
  const ok = (v: unknown) => v !== null && v !== undefined && v !== '' && !isNaN(Number(v));
  return ok(c.latitude) && ok(c.longitude);
}

/** "lat,lng" when saved, otherwise "Barangay, Abuyog, Leyte, Philippines". */
export function locationQuery(c: MapCenter): string {
  return hasCoords(c) ? `${Number(c.latitude)},${Number(c.longitude)}` : `${c.barangay}, Abuyog, Leyte, Philippines`;
}

/** Keyless Google Maps embed (no API key needed). */
export const embedUrl = (c: MapCenter) =>
  `https://www.google.com/maps?q=${encodeURIComponent(locationQuery(c))}&output=embed`;

/** Opens Google Maps directions from the visitor's current location. */
export const directionsUrl = (c: MapCenter) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationQuery(c))}&travelmode=driving`;