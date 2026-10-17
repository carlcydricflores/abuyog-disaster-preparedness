<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

/** Residents submit incidents and track only THEIR OWN reports. */
class IncidentController extends Controller
{
    public const TYPES = ['flood', 'landslide', 'fire', 'medical', 'road_blocked', 'power_outage', 'missing_person', 'other'];

    public function index(Request $r)
    {
        // Scoped to the logged-in user: nobody can read another person's report.
        return Inertia::render('Incidents/Index', ['incidents' => $r->user()->incidents()->latest()->paginate(10)]);
    }

    public function create()
    {
        return Inertia::render('Incidents/Create', ['types' => self::TYPES]);
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'type' => 'required|in:'.implode(',', self::TYPES),
            'barangay' => 'required|string|max:100',
            'description' => 'required|string|min:10|max:2000',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // real image check, 2 MB cap
        ]);

        // store() generates a random filename, so user-supplied names never touch the disk.
        if ($r->hasFile('photo')) {
            $data['photo_path'] = $r->file('photo')->store('incidents', 'public');
        }
        unset($data['photo']);

        $r->user()->incidents()->create($data);

        return redirect()->route('incidents.index');
    }
}
