<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use Illuminate\Http\Request;
use Inertia\Inertia;

/** Admins review all incident reports and move them through the status workflow. */
class IncidentReviewController extends Controller
{
    public const STATUSES = ['pending', 'verified', 'in_progress', 'resolved', 'rejected'];

    public function index(Request $r)
    {
        $incidents = Incident::with('user:id,name,email')
            ->when($r->status, fn ($q, $v) => $q->where('status', $v))
            ->latest()->paginate(15)->withQueryString();
        return Inertia::render('Admin/Incidents', ['incidents' => $incidents, 'statuses' => self::STATUSES, 'filters' => $r->only('status')]);
    }

    public function update(Request $r, Incident $incident)
    {
        $data = $r->validate(['status' => 'required|in:' . implode(',', self::STATUSES), 'admin_notes' => 'nullable|string|max:2000']);
        $incident->forceFill($data)->save(); // status is not fillable, so it is set explicitly here
        return back();
    }
}
