<?php

namespace Tests\Feature;

use App\Models\EvacuationCenter;
use App\Models\Hotline;
use App\Models\Incident;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ChatbotAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_use_the_emergency_assistant(): void
    {
        Hotline::create(['name' => 'Emergency hotline', 'category' => 'emergency', 'number' => '911']);

        $this->get(route('chat'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Chat'));

        $this->post(route('chat.reply'), ['message' => 'List emergency hotlines'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Chat')->where('answer', fn (string $answer): bool => str_contains($answer, 'Available hotlines') && str_contains($answer, 'Emergency hotline') && str_contains($answer, '911')));
    }

    public function test_only_admins_can_view_analytics(): void
    {
        $resident = User::factory()->create();

        $this->actingAs($resident)->get(route('admin.analytics'))->assertForbidden();

        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        EvacuationCenter::create(['name' => 'Central School', 'barangay' => 'Poblacion', 'capacity' => 100, 'occupied' => 25, 'status' => 'open']);
        Incident::create(['user_id' => $resident->id, 'type' => 'flood', 'barangay' => 'Poblacion', 'description' => 'Flood water is rising quickly.']);

        $this->actingAs($admin)->get(route('admin.analytics'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Analytics')
                ->where('totalIncidents', 1)
                ->where('centerSummary.availableSpaces', 75)
                ->has('dailyTrend', 30));
    }
}
