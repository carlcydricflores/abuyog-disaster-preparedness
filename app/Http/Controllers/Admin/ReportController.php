<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Incident;
use Illuminate\Http\Request;
use Inertia\Inertia;

/** Emergency reports: filterable summary + CSV export. */
class ReportController extends Controller
{
    /** Shared filter logic so on-screen numbers and the CSV always match. */
    private function query(Request $r)
    {
        $r->validate(['from' => 'nullable|date', 'to' => 'nullable|date', 'barangay' => 'nullable|string|max:100', 'type' => 'nullable|string|max:30']);

        return Incident::query()
            ->when($r->from, fn ($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($r->to, fn ($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->when($r->barangay, fn ($q, $v) => $q->where('barangay', $v))
            ->when($r->type, fn ($q, $v) => $q->where('type', $v));
    }

    public function index(Request $r)
    {
        // $col comes only from the fixed list below, never from user input.
        $group = fn ($col) => $this->query($r)->selectRaw("$col as label, count(*) as total")->groupBy($col)->orderByDesc('total')->get();

        return Inertia::render('Admin/Reports', [
            'total' => $this->query($r)->count(),
            'reports' => $this->query($r)->with('user:id,name')->latest()->paginate(15)->withQueryString(),
            'byStatus' => $group('status'),
            'byType' => $group('type'),
            'byBarangay' => $group('barangay'),
            'alerts' => Alert::when($r->from, fn ($q, $v) => $q->whereDate('created_at', '>=', $v))->when($r->to, fn ($q, $v) => $q->whereDate('created_at', '<=', $v))->count(),
            'filters' => $r->only('from', 'to', 'barangay', 'type'),
        ]);
    }

    public function export(Request $r)
    {
        $rows = $this->query($r)->with('user:id,name')->latest()->cursor();
        // Cells starting with = + - @ get a leading ' to stop CSV/Excel formula injection.
        $safe = fn ($v) => preg_match('/^[=+\-@]/', (string) $v) ? "'".$v : $v;

        return response()->streamDownload(function () use ($rows, $safe) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['ID', 'Date', 'Type', 'Barangay', 'Status', 'Reporter', 'Description']);
            foreach ($rows as $i) {
                fputcsv($out, [$i->id, $i->created_at, $i->type, $safe($i->barangay), $i->status, $safe($i->user->name), $safe($i->description)]);
            }
            fclose($out);
        }, 'incident-report-'.now()->format('Ymd-His').'.csv', ['Content-Type' => 'text/csv']);
    }
}
