<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\EvacuationCenter;
use App\Models\Guideline;
use App\Models\Hotline;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Chat', ['answer' => null]);
    }

    public function reply(Request $request): Response
    {
        $validated = $request->validate(['message' => 'required|string|max:500']);

        return Inertia::render('Chat', ['answer' => $this->answer($validated['message'])]);
    }

    private function answer(string $message): string
    {
        $normalized = Str::lower($message);

        if (Str::contains($normalized, ['911', 'trapped', 'injured', 'injury', 'immediate danger', 'life-threatening', 'unconscious'])) {
            return 'If anyone is in immediate danger, call 911 now. Do not wait for an online reply.';
        }

        if (Str::contains($normalized, ['hotline', 'phone', 'number', 'call'])) {
            $hotlines = Hotline::query()->orderBy('category')->orderBy('name')->limit(10)->get();

            if ($hotlines->isEmpty()) {
                return 'No hotline numbers are listed yet. For immediate danger, call 911.';
            }

            return "Available hotlines:\n".$hotlines->map(fn (Hotline $hotline): string => "{$hotline->name} ({$hotline->category}): {$hotline->number}")->implode("\n");
        }

        if (Str::contains($normalized, ['shelter', 'evacuation', 'evacuate', 'center', 'centre'])) {
            $centers = EvacuationCenter::query()
                ->where('status', 'open')
                ->whereColumn('occupied', '<', 'capacity')
                ->orderBy('barangay')
                ->limit(10)
                ->get();

            if ($centers->isEmpty()) {
                return 'There are no open evacuation centers with available capacity listed right now. Check the evacuation centers page for updates. If you are in immediate danger, call 911.';
            }

            return "Open evacuation centers with listed space:\n".$centers->map(fn (EvacuationCenter $center): string => "{$center->name}, {$center->barangay}".($center->address ? ", {$center->address}" : '').' ('.max(0, $center->capacity - $center->occupied).' spaces listed)')->implode("\n");
        }

        if (Str::contains($normalized, ['alert', 'warning', 'weather', 'storm'])) {
            $alerts = Alert::active()->latest()->limit(5)->get();

            if ($alerts->isEmpty()) {
                return 'There are no active alerts listed right now. Continue monitoring official local updates.';
            }

            return "Current active alerts:\n".$alerts->map(fn (Alert $alert): string => "{$alert->title} ({$alert->severity}): {$alert->message}".($alert->barangays ? " Affected areas: {$alert->barangays}." : ''))->implode("\n\n");
        }

        $terms = collect(preg_split('/[^a-z0-9]+/', $normalized, -1, PREG_SPLIT_NO_EMPTY) ?: [])
            ->filter(fn (string $term): bool => strlen($term) >= 4 && ! in_array($term, ['what', 'when', 'where', 'should', 'could', 'would', 'about', 'please', 'there'], true))
            ->unique()
            ->values();

        if ($terms->isNotEmpty()) {
            $guidelines = Guideline::query()
                ->where(function ($query) use ($terms): void {
                    foreach ($terms as $term) {
                        $query->orWhere('title', 'like', "%{$term}%")
                            ->orWhere('body', 'like', "%{$term}%");
                    }
                })
                ->orderBy('category')
                ->limit(4)
                ->get();

            if ($guidelines->isNotEmpty()) {
                return $guidelines->map(fn (Guideline $guideline): string => "{$guideline->title}: {$guideline->body}")->implode("\n\n");
            }
        }

        return 'I can help with preparedness guidelines, current alerts, evacuation centers, and emergency hotlines. What would you like to know? For immediate danger, call 911.';
    }
}
