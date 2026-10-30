import { useState } from 'react';
import Modal from '@/Components/Modal';

const incidentLabels: Record<string, string> = {
  flood: 'flood',
  landslide: 'landslide',
  fire: 'fire',
  medical: 'medical emergency',
  road_blocked: 'blocked road',
  power_outage: 'power outage',
  missing_person: 'missing person',
  other: 'other incident',
};

export default function IncidentMedia({
  photoUrl,
  type,
  barangay,
}: {
  photoUrl?: string | null;
  type: string;
  barangay: string;
}) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [enlarged, setEnlarged] = useState(false);
  const incidentType = incidentLabels[type] ?? incidentLabels.other;
  const illustrationUrl = `/images/incidents/incident-illustration-${incidentLabels[type] ? type : 'other'}.svg`;
  const usePhoto = Boolean(photoUrl && !failedImages[photoUrl]);
  const imageUrl = usePhoto ? photoUrl : failedImages[illustrationUrl] ? null : illustrationUrl;
  const caption = usePhoto ? 'Reporter-uploaded photo' : 'Illustrative image, not the actual incident';
  const alt = usePhoto
    ? `Reporter-uploaded photo of a ${incidentType} report in ${barangay}`
    : `Illustration representing a ${incidentType} report`;
  const handleImageError = (url: string) => setFailedImages((current) => ({ ...current, [url]: true }));

  return (
    <>
      <figure className="mt-4">
        {imageUrl ? (
          <button
            type="button"
            aria-label={`Enlarge ${caption.toLowerCase()}`}
            onClick={() => setEnlarged(true)}
            className="block w-full overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <img
              src={imageUrl}
              alt={alt}
              loading="lazy"
              decoding="async"
              onError={() => handleImageError(imageUrl)}
              className="aspect-[3/2] w-full object-cover"
            />
          </button>
        ) : (
          <div role="img" aria-label={`${alt}. Image unavailable.`} className="flex aspect-[3/2] items-center justify-center rounded-2xl border border-subtle bg-surface-raised p-6 text-center text-sm text-secondary">
            Image unavailable
          </div>
        )}
        <figcaption className="mt-2 text-xs font-medium text-secondary">{caption}</figcaption>
      </figure>
      <Modal show={enlarged && Boolean(imageUrl)} onClose={() => setEnlarged(false)} maxWidth="xl">
        {imageUrl && (
          <figure className="p-3">
            <img
              src={imageUrl}
              alt={alt}
              decoding="async"
              onError={() => handleImageError(imageUrl)}
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
            <figcaption className="mt-2 text-sm text-secondary">{caption}</figcaption>
          </figure>
        )}
      </Modal>
    </>
  );
}