<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\EvacuationCenter;
use App\Models\Hotline;

/** Public, read-only REST endpoints (/api/v1/*) for mobile apps or SMS gateways. */
class ApiController extends Controller
{
    public function alerts()
    {
        return Alert::active()->latest()->paginate(20);
    }

    public function centers()
    {
        return EvacuationCenter::where('status', '!=', 'closed')->orderBy('barangay')->paginate(50);
    }

    public function hotlines()
    {
        return Hotline::orderBy('category')->get();
    }
}
