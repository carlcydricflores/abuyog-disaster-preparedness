<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use Illuminate\Support\Facades\Storage;

/** Serves a photo attached to a PUBLISHED alert from private storage. */
class AlertPhotoController extends Controller
{
    public function show(Alert $alert, int $index)
    {
        // Only alerts that are currently public (published and not expired) expose their photos.
        abort_unless(Alert::active()->whereKey($alert->id)->exists(), 404);

        // The URL carries only a position number, never a file path, so visitors cannot request other files.
        $path = ($alert->photos ?? [])[$index] ?? null;
        abort_unless(is_string($path) && str_starts_with($path, 'incidents/') && ! str_contains($path, '..'), 404);

        // Newer reports live on the private disk; older ones may still be on the public disk.
        foreach (['local', 'public'] as $disk) {
            if (Storage::disk($disk)->exists($path)) {
                return Storage::disk($disk)->response($path, null, ['Cache-Control' => 'public, max-age=3600']);
            }
        }

        abort(404);
    }
}