<?php

namespace App\Http\Controllers\Admin;

use App\Actions\IncidentAlertPublisher;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PublishIncidentAlertRequest;
use App\Models\Incident;
use Illuminate\Http\Request;
use Inertia\Inertia;

/** Admins review all incident reports and move them through the status workflow. */
class IncidentReviewController extends Controller
{
    public const STATUSES = ['pending', 'verified', 'in_progress', 'resolved', 'rejected'];

    public function index(Request $r)
    {
        $incidents = Incident::with(['user:id,name', 'alert:id,incident_id,is_published,expires_at'])
            ->when($r->status, fn ($q, $v) => $q->where('status', $v))
            ->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Incidents', ['incidents' => $incidents, 'statuses' => self::STATUSES, 'filters' => $r->only('status')]);
    }

    public function update(Request $r, Incident $incident, IncidentAlertPublisher $publisher)
    {
        $data = $r->validate([
            'status' => 'required|in:'.implode(',', self::STATUSES),
            'admin_notes' => 'nullable|string|max:2000',
            'linked_alert_action' => 'nullable|in:expire,unpublish',
        ]);
        $publisher->updateStatus(
            $incident,
            $data['status'],
            $data['admin_notes'] ?? null,
            $data['linked_alert_action'] ?? null,
        );

        return back();
    }

    public function publish(PublishIncidentAlertRequest $request, Incident $incident, IncidentAlertPublisher $publisher)
    {
        $result = $publisher->publish($incident, $request->validated(), $request->user());

        return back()->with('success', $result['alreadyPublished']
            ? 'This incident is already published as an alert.'
            : 'Incident verified and published as a public alert.');
    }
}
