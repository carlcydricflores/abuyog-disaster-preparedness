<?php

namespace App\Support;

use App\Models\Alert;

class PublicAlertPresenter
{
    /** @return array<string, mixed> */
    public function present(Alert $alert): array
    {
        $incident = $alert->incident;
        $reportedBy = null;

        if ($incident) {
            $reportedBy = 'Reported by a resident';

            if ($incident->allow_name_publication && $incident->user?->name) {
                $nameParts = preg_split('/\s+/', trim($incident->user->name)) ?: [];
                $firstName = $nameParts[0] ?? '';
                $lastInitial = count($nameParts) > 1 ? mb_substr((string) end($nameParts), 0, 1).'.' : '';
                $displayName = trim($firstName.' '.$lastInitial);

                if ($displayName !== '') {
                    $reportedBy = 'Reported by '.$displayName;
                }
            }
        }

        $illustrationType = match ($incident?->type) {
            'flood' => 'flood',
            'landslide' => 'landslide',
            'fire' => 'fire',
            null => null,
            default => 'other',
        };

        return [
            'id' => $alert->id,
            'title' => $alert->title,
            'type' => $alert->type,
            'severity' => $alert->severity,
            'barangays' => $alert->barangays,
            'message' => $alert->message,
            'expires_at' => $alert->expires_at?->toIso8601String(),
            'created_at' => $alert->created_at?->toIso8601String(),
            'reported_by' => $reportedBy,
            'verified_by' => $incident ? 'Verified by administrator' : null,
            // Send safe links to the alert-photo route (not storage paths), so photos stay in private storage.
            'photos' => collect($alert->photos ?? [])
                ->filter(fn ($p) => is_string($p) && $p !== '')
                ->values()
                ->map(fn ($p, $i) => route('alerts.photo', [$alert->id, $i], false))
                ->all(),
            'illustration_url' => $illustrationType
                ? "/images/incidents/incident-illustration-{$illustrationType}.svg"
                : null,
        ];
    }
}