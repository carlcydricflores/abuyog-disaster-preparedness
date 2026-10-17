<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\EvacuationCenter;
use App\Models\Guideline;
use App\Models\Hotline;
use Illuminate\Http\Request;
use Inertia\Inertia;

/** Read-only public pages: home, alerts, evacuation centers, hotlines, guidelines. */
class PublicController extends Controller
{
    public function home()
    {
        return Inertia::render('Home', [
            'alerts' => Alert::active()->latest()->take(3)->get(),
            'centers' => EvacuationCenter::where('status', 'open')->count(),
            'hotlines' => Hotline::orderBy('category')->take(4)->get(),
        ]);
    }

    public function alerts()
    {
        return Inertia::render('Alerts', ['alerts' => Alert::active()->latest()->paginate(10)]);
    }

    /** Search by name/barangay, filter by status. Values are bound parameters (no SQL injection). */
    public function centers(Request $r)
    {
        $centers = EvacuationCenter::query()
            ->when($r->q, fn ($q, $v) => $q->where(fn ($w) => $w->where('name', 'like', "%{$v}%")->orWhere('barangay', 'like', "%{$v}%")))
            ->when($r->status, fn ($q, $v) => $q->where('status', $v))
            ->orderBy('barangay')->paginate(12)->withQueryString();

        return Inertia::render('Centers', ['centers' => $centers, 'filters' => $r->only('q', 'status')]);
    }

    public function hotlines()
    {
        return Inertia::render('Hotlines', ['hotlines' => Hotline::orderBy('category')->orderBy('name')->get()->groupBy('category')]);
    }

    public function guidelines()
    {
        return Inertia::render('Guidelines', ['guidelines' => Guideline::orderBy('title')->get()->groupBy('category')]);
    }
}
