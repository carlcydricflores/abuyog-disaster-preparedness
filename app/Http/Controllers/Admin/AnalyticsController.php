<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\EvacuationCenter;
use App\Models\Incident;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(): Response
    {
        $today = now()->startOfDay();
        $startDate = $today->copy()->subDays(29);
        $dailyCounts = Incident::query()
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $today)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->groupBy('date')
            ->pluck('total', 'date');

        $dailyTrend = collect(range(0, 29))->map(function (int $offset) use ($startDate, $dailyCounts): array {
            $date = $startDate->copy()->addDays($offset);

            return ['label' => $date->format('M j'), 'total' => (int) ($dailyCounts[$date->toDateString()] ?? 0)];
        });

        $group = fn (string $column) => Incident::query()
            ->selectRaw("{$column} as label, COUNT(*) as total")
            ->groupBy($column)
            ->orderByDesc('total')
            ->limit(8)
            ->get();

        return Inertia::render('Admin/Analytics', [
            'totalIncidents' => Incident::count(),
            'activeAlerts' => Alert::active()->count(),
            'registeredResidents' => User::where('role', 'user')->count(),
            'centerSummary' => [
                'total' => EvacuationCenter::count(),
                'open' => EvacuationCenter::where('status', 'open')->count(),
                'availableSpaces' => (int) EvacuationCenter::query()
                    ->where('status', 'open')
                    ->selectRaw('COALESCE(SUM(CASE WHEN capacity > occupied THEN capacity - occupied ELSE 0 END), 0) as total')
                    ->value('total'),
            ],
            'dailyTrend' => $dailyTrend,
            'byStatus' => $group('status'),
            'byType' => $group('type'),
            'byBarangay' => $group('barangay'),
        ]);
    }
}
