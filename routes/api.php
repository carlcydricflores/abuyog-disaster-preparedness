<?php

use App\Http\Controllers\Api\ApiController;
use Illuminate\Support\Facades\Route;

// Public read-only API, rate limited. Add auth:sanctum routes to this group when you need token access.
Route::prefix('v1')->middleware('throttle:60,1')->group(function () {
    Route::get('alerts', [ApiController::class, 'alerts']);
    Route::get('evacuation-centers', [ApiController::class, 'centers']);
    Route::get('hotlines', [ApiController::class, 'hotlines']);
});
