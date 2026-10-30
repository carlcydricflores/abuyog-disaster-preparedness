<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class IncidentPhotoController extends Controller
{
    public function show(Request $request, Incident $incident): BinaryFileResponse
    {
        abort_unless(
            $request->user()->isAdmin() || $request->user()->id === $incident->user_id,
            404,
        );

        abort_unless($incident->photo_path && Storage::disk('local')->exists($incident->photo_path), 404);

        $disk = Storage::disk('local');

        $response = response()->file($disk->path($incident->photo_path));
        $response->setPrivate();
        $response->headers->set('Content-Type', $disk->mimeType($incident->photo_path) ?? 'application/octet-stream');
        $response->headers->set('Cache-Control', 'private, no-store');
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        return $response;
    }
}