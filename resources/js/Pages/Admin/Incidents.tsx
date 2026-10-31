import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import IncidentMedia from '@/Components/IncidentMedia';
import Modal from '@/Components/Modal';
import { Badge, Pager, btn, btnAlt, card, input } from '@/Components/ui';
import IncidentLocation from '@/Components/IncidentLocation';

type AlertDraft = {
  title: string;
  type: string;
  severity: string;
  barangays: string;
  message: string;
  expires_at: string;
};

const alertTypes = new Set(['flood', 'landslide', 'fire']);

function hasPublishedAlert(incident: any): boolean {
  return Boolean(incident.alert && incident.alert.is_published !== false);
}

function hasActiveAlert(incident: any): boolean {
  if (!hasPublishedAlert(incident)) {
    return false;
  }

  const expiry = incident.alert.expires_at;
  return !expiry || new Date(expiry).getTime() > Date.now();
}

function toLocalDateTime(date: Date): string {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function createAlertDraft(incident: any): AlertDraft {
  const type = alertTypes.has(incident.type) ? incident.type : 'other';
  const label = incident.type.replaceAll('_', ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase());

  return {
    title: `${label} incident reported in ${incident.barangay}`.slice(0, 150),
    type,
    severity: 'advisory',
    barangays: incident.barangay,
    message: incident.description,
    expires_at: toLocalDateTime(new Date(Date.now() + 24 * 60 * 60 * 1000)),
  };
}

export default function Incidents({ incidents, statuses, filters }: any) {
  const [publishIncident, setPublishIncident] = useState<any>(null);
  const [publishDraft, setPublishDraft] = useState<AlertDraft | null>(null);
  const [rejectIncident, setRejectIncident] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const update = (incident: any, data: Record<string, string>, successMessage: string) => {
    router.patch(route('admin.incidents.update', incident.id), data, {
      preserveScroll: true,
      onSuccess: () => {
        setFeedback(successMessage);
        setRejectIncident(null);
      },
      onError: (errors) => setFeedback(Object.values(errors).join(' ')),
    });
  };

  const selectStatus = (incident: any, status: string) => {
    if (status === 'verified') {
      if (hasActiveAlert(incident)) {
        setFeedback('This incident is already linked to a published alert.');
        return;
      }

      setPublishIncident(incident);
      setPublishDraft(createAlertDraft(incident));
      setFormErrors({});
      setFeedback('');
      return;
    }

    if (status === 'rejected' && incident.alert && incident.alert.is_published !== false) {
      setRejectIncident(incident);
      setFeedback('');
      return;
    }

    update(incident, { status, admin_notes: incident.admin_notes ?? '' }, 'Incident status updated.');
  };

  const verifyOnly = () => {
    if (!publishIncident) {
      return;
    }

    update(publishIncident, { status: 'verified', admin_notes: publishIncident.admin_notes ?? '' }, 'Incident verified without publishing an alert.');
    setPublishIncident(null);
    setPublishDraft(null);
  };

  const publishAlert = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!publishIncident || !publishDraft) {
      return;
    }

    setFormErrors({});
    router.post(route('admin.incidents.publish', publishIncident.id), publishDraft, {
      preserveScroll: true,
      onSuccess: () => {
        setFeedback('Incident verified and linked to a public alert.');
        setPublishIncident(null);
        setPublishDraft(null);
      },
      onError: (errors) => setFormErrors(errors as Record<string, string>),
    });
  };

  const reject = (alertAction: 'expire' | 'unpublish') => {
    if (!rejectIncident) {
      return;
    }

    update(rejectIncident, {
      status: 'rejected',
      admin_notes: rejectIncident.admin_notes ?? '',
      linked_alert_action: alertAction,
    }, alertAction === 'expire'
      ? 'Incident rejected and linked alert expired.'
      : 'Incident rejected and linked alert unpublished.');
  };

  return (
    <AppLayout title="Incident reports">
      {feedback && <p role="status" aria-live="polite" className={`${card} mb-4 text-sm text-primary`}>{feedback}</p>}
      <label htmlFor="incident-status-filter" className="mb-1 block text-sm font-medium text-primary">Filter by status</label>
      <select id="incident-status-filter" className={`${input} mb-6 max-w-xs`} value={filters.status ?? ''} onChange={(e) => router.get(route('admin.incidents'), { status: e.target.value })}>
        <option value="">All statuses</option>{statuses.map((status: string) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
      </select>
      <div className="space-y-4">
        {incidents.data.map((incident: any) => {
          const publishedAlertExists = hasPublishedAlert(incident);
          const activeAlertExists = hasActiveAlert(incident);

          return (
            <article key={incident.id} className={card}>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge text={incident.type} />
                <span className="text-sm text-secondary">{incident.barangay} · by {incident.user.name} · {new Date(incident.created_at).toLocaleString()}</span>
              </div>
              {publishedAlertExists && (
                <Link href={`${route('admin.manage.index', 'alerts')}?edit=${incident.alert.id}`} className="mb-3 inline-flex rounded-full bg-success-surface px-3 py-1 text-sm font-semibold text-success underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  Published as alert · Edit alert
                </Link>
              )}
              <p className="leading-6 text-primary">{incident.description}</p>
              <IncidentMedia photoUrl={incident.photo_path ? route('incidents.photo', incident.id) : null} type={incident.type} barangay={incident.barangay} />
              <IncidentLocation incident={incident} />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`review-status-${incident.id}`}>Status for report {incident.id}</label>
                <select id={`review-status-${incident.id}`} className={`${input} max-w-[12rem]`} value={incident.status} onChange={(event) => selectStatus(incident, event.target.value)}>
                  {statuses.map((status: string) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
                </select>
                <label className="sr-only" htmlFor={`review-notes-${incident.id}`}>Note to reporter for report {incident.id}</label>
                <input id={`review-notes-${incident.id}`} className={`${input} min-w-0 flex-1`} placeholder="Note to reporter (saves when you leave this field)" defaultValue={incident.admin_notes ?? ''} onBlur={(event) => event.target.value !== (incident.admin_notes ?? '') && update(incident, { status: incident.status, admin_notes: event.target.value }, 'Admin note saved.')} />
                {!activeAlertExists && (
                  <button type="button" className={btnAlt} onClick={() => selectStatus(incident, 'verified')}>
                    Verify and publish as alert
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <Pager links={incidents.links} />

      <Modal show={Boolean(publishIncident && publishDraft)} onClose={() => { setPublishIncident(null); setPublishDraft(null); }} maxWidth="lg">
        {publishIncident && publishDraft && (
          <form onSubmit={publishAlert} className="space-y-4 p-6">
            <div>
              <h2 className="text-xl font-bold text-primary">Review public alert</h2>
              <p className="mt-1 text-sm text-secondary">Review this prefilled draft. Nothing is published until you confirm.</p>
            </div>
            {formErrors.publish && <p role="alert" className="text-sm text-error">{formErrors.publish}</p>}
            <div>
              <label htmlFor="publish-alert-title" className="mb-1 block text-sm font-semibold text-primary">Title</label>
              <input id="publish-alert-title" maxLength={150} className={input} value={publishDraft.title} onChange={(event) => setPublishDraft({ ...publishDraft, title: event.target.value })} />
              {formErrors.title && <p role="alert" className="mt-1 text-sm text-error">{formErrors.title}</p>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="publish-alert-type" className="mb-1 block text-sm font-semibold text-primary">Alert type</label>
                <input id="publish-alert-type" className={input} value={publishDraft.type.replaceAll('_', ' ')} readOnly />
              </div>
              <div>
                <label htmlFor="publish-alert-severity" className="mb-1 block text-sm font-semibold text-primary">Severity</label>
                <select id="publish-alert-severity" className={input} value={publishDraft.severity} onChange={(event) => setPublishDraft({ ...publishDraft, severity: event.target.value })}>
                  <option value="advisory">Advisory</option><option value="watch">Watch</option><option value="warning">Warning</option><option value="critical">Critical</option>
                </select>
                {formErrors.severity && <p role="alert" className="mt-1 text-sm text-error">{formErrors.severity}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="publish-alert-barangays" className="mb-1 block text-sm font-semibold text-primary">Affected barangay</label>
              <input id="publish-alert-barangays" className={input} value={publishDraft.barangays} readOnly />
            </div>
            <div>
              <label htmlFor="publish-alert-message" className="mb-1 block text-sm font-semibold text-primary">Public message</label>
              <textarea id="publish-alert-message" rows={5} maxLength={2000} className={input} value={publishDraft.message} onChange={(event) => setPublishDraft({ ...publishDraft, message: event.target.value })} />
              {formErrors.message && <p role="alert" className="mt-1 text-sm text-error">{formErrors.message}</p>}
            </div>
            <div>
              <label htmlFor="publish-alert-expiry" className="mb-1 block text-sm font-semibold text-primary">Expires at</label>
              <input id="publish-alert-expiry" type="datetime-local" className={input} value={publishDraft.expires_at} onChange={(event) => setPublishDraft({ ...publishDraft, expires_at: event.target.value })} />
              {formErrors.expires_at && <p role="alert" className="mt-1 text-sm text-error">{formErrors.expires_at}</p>}
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-subtle pt-4">
              <button type="button" className={btnAlt} onClick={verifyOnly}>Verify only (do not publish)</button>
              <button type="submit" className={btn}>Confirm and publish</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal show={Boolean(rejectIncident)} onClose={() => setRejectIncident(null)} maxWidth="md">
        {rejectIncident && (
          <div className="space-y-4 p-6">
            <div>
              <h2 className="text-xl font-bold text-primary">Reject report and handle linked alert</h2>
              <p className="mt-2 text-sm leading-6 text-secondary">This report is linked to a public alert. Choose whether to expire it now or unpublish it while keeping its record.</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-subtle pt-4">
              <button type="button" className={btnAlt} onClick={() => setRejectIncident(null)}>Cancel</button>
              <button type="button" className={btnAlt} onClick={() => reject('expire')}>Expire alert and reject</button>
              <button type="button" className={btn} onClick={() => reject('unpublish')}>Unpublish alert and reject</button>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}