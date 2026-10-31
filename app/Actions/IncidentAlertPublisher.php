<?php

namespace App\Actions;

use App\Models\Alert;
use App\Models\Incident;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class IncidentAlertPublisher
{
    /**
     * @param  array{title: string, severity: string, barangays: string, message: string, expires_at: string}  $data
     * @return array{alert: Alert, alreadyPublished: bool}
     */
    public function publish(Incident $incident, array $data, User $admin): array
    {
        return DB::transaction(function () use ($incident, $data, $admin): array {
            $lockedIncident = Incident::query()->lockForUpdate()->findOrFail($incident->id);
            $alert = Alert::query()->where('incident_id', $lockedIncident->id)->lockForUpdate()->first();
            $alreadyPublished = $alert !== null
                && ($alert->is_published ?? true)
                && ($alert->expires_at === null || $alert->expires_at->isFuture());

            $lockedIncident->forceFill(['status' => 'verified'])->save();

            if ($alreadyPublished) {
                return ['alert' => $alert, 'alreadyPublished' => true];
            }

            $attributes = [
                'user_id' => $admin->id,
                'incident_id' => $lockedIncident->id,
                'is_published' => true,
                'title' => $data['title'],
                'type' => match ($lockedIncident->type) {
                    'flood' => 'flood',
                    'landslide' => 'landslide',
                    'fire' => 'fire',
                    default => 'other',
                },
                'severity' => $data['severity'],
                'barangays' => $data['barangays'],
                'message' => $data['message'],
                'expires_at' => $data['expires_at'],
                // Copy the reporter's photo(s) onto the public alert. Falls back to the single older photo_path.
                'photos' => $lockedIncident->photos
                    ?: ($lockedIncident->photo_path ? [$lockedIncident->photo_path] : null),
            ];

            if ($alert) {
                $alert->forceFill($attributes)->save();
            } else {
                // forceFill is used because incident_id and is_published are not in Alert's $fillable list;
                // Alert::create() would silently drop them.
                $alert = new Alert();
                $alert->forceFill($attributes)->save();
            }

            return ['alert' => $alert, 'alreadyPublished' => false];
        });
    }

    public function updateStatus(Incident $incident, string $status, ?string $adminNotes, ?string $alertAction): void
    {
        DB::transaction(function () use ($incident, $status, $adminNotes, $alertAction): void {
            $lockedIncident = Incident::query()->lockForUpdate()->findOrFail($incident->id);
            $alert = Alert::query()->where('incident_id', $lockedIncident->id)->lockForUpdate()->first();
            $hasPublishedAlert = $alert !== null && ($alert->is_published ?? true);

            if ($status === 'rejected' && $hasPublishedAlert && ! in_array($alertAction, ['expire', 'unpublish'], true)) {
                throw ValidationException::withMessages([
                    'linked_alert_action' => 'Choose whether to expire or unpublish the linked public alert before rejecting this report.',
                ]);
            }

            $lockedIncident->forceFill(['status' => $status, 'admin_notes' => $adminNotes])->save();

            if ($status === 'rejected' && $hasPublishedAlert) {
                if ($alertAction === 'expire') {
                    $alert->forceFill(['expires_at' => now()])->save();
                } else {
                    $alert->forceFill(['is_published' => false])->save();
                }
            }
        });
    }
}