<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\IncidentReviewController;
use App\Http\Controllers\Admin\ManageController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\IncidentPhotoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public pages
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/alerts', [PublicController::class, 'alerts'])->name('alerts');
Route::get('/evacuation-centers', [PublicController::class, 'centers'])->name('centers');
Route::get('/hotlines', [PublicController::class, 'hotlines'])->name('hotlines');
Route::get('/safety-guidelines', [PublicController::class, 'guidelines'])->name('guidelines');
Route::get('/assistant', [ChatController::class, 'index'])->name('chat');
Route::post('/assistant', [ChatController::class, 'reply'])->middleware('throttle:20,1')->name('chat.reply');

// Logged-in users (role: user or admin)
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('/incidents', [IncidentController::class, 'index'])->name('incidents.index');
    Route::get('/incidents/create', [IncidentController::class, 'create'])->name('incidents.create');
    Route::get('/incidents/{incident}/photo', [IncidentPhotoController::class, 'show'])->name('incidents.photo');
    Route::post('/incidents', [IncidentController::class, 'store'])->middleware('throttle:10,1')->name('incidents.store'); // 10/min

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin only (auth + role check)
Route::prefix('admin')->name('admin.')->middleware(['auth', EnsureAdmin::class])->group(function () {
    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics');
    Route::get('manage/{resource}', [ManageController::class, 'index'])->name('manage.index');
    Route::post('manage/{resource}', [ManageController::class, 'store'])->name('manage.store');
    Route::put('manage/{resource}/{id}', [ManageController::class, 'update'])->name('manage.update');
    Route::delete('manage/{resource}/{id}', [ManageController::class, 'destroy'])->name('manage.destroy');

    Route::get('incidents', [IncidentReviewController::class, 'index'])->name('incidents');
    Route::patch('incidents/{incident}', [IncidentReviewController::class, 'update'])->name('incidents.update');

    Route::get('reports', [ReportController::class, 'index'])->name('reports');
    Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');
});

require __DIR__.'/auth.php';
