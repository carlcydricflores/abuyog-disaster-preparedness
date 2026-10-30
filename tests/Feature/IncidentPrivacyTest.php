<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Incident;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class IncidentPrivacyTest extends TestCase
{
    use RefreshDatabase;

    public function test_resident_can_only_see_their_own_reports(): void
    {
        $resident = User::factory()->create();
        $otherResident = User::factory()->create();
        $ownReport = $this->createIncident($resident, 'Owner report marker');
        $this->createIncident($otherResident, 'Private report marker');

        $this->actingAs($resident)
            ->get(route('incidents.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Incidents/Index')
                ->has('incidents.data', 1)
                ->where('incidents.data.0.id', $ownReport->id)
                ->where('incidents.data.0.description', 'Owner report marker'));
    }

    public function test_only_report_owner_and_admin_can_view_a_private_photo(): void
    {
        Storage::fake('local');
        $owner = User::factory()->create();
        $otherResident = User::factory()->create();
        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        $photoPath = UploadedFile::fake()->create('incident.jpg', 10, 'image/jpeg')->store('incidents', 'local');
        $incident = $this->createIncident($owner, 'Photo report marker', ['photo_path' => $photoPath]);

        $response = $this->actingAs($owner)->get(route('incidents.photo', $incident));
        $response->assertOk()->assertHeader('X-Content-Type-Options', 'nosniff');
        $this->assertStringContainsString('private', $response->headers->get('Cache-Control'));
        $this->assertStringContainsString('no-store', $response->headers->get('Cache-Control'));

        $this->actingAs($otherResident)
            ->get(route('incidents.photo', $incident))
            ->assertNotFound();

        $this->actingAs($admin)
            ->get(route('incidents.photo', $incident))
            ->assertOk();
    }

    public function test_guest_cannot_view_a_private_report_photo(): void
    {
        $owner = User::factory()->create();
        $incident = $this->createIncident($owner, 'Photo report marker', ['photo_path' => 'incidents/private.jpg']);

        $this->get(route('incidents.photo', $incident))
            ->assertRedirect(route('login'));
    }

    public function test_non_admin_cannot_view_admin_report_pages_and_admin_sees_reporter_name(): void
    {
        $resident = User::factory()->create();
        $reporter = User::factory()->create();
        $incident = $this->createIncident($reporter, 'Admin report marker');

        $this->actingAs($resident)->get(route('admin.reports'))->assertForbidden();

        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();

        $this->actingAs($admin)
            ->get(route('admin.reports'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Reports')
                ->where('reports.data.0.id', $incident->id)
                ->where('reports.data.0.user.name', $reporter->name));
    }

    public function test_public_home_does_not_expose_reporter_names_or_photo_paths(): void
    {
        $reporter = User::factory()->create(['name' => 'Private Reporter Name']);
        $this->createIncident($reporter, 'Private report marker', ['photo_path' => 'incidents/private.jpg']);

        $this->get(route('home'))
            ->assertOk()
            ->assertDontSee('Private Reporter Name')
            ->assertDontSee('incidents/private.jpg');
    }

    private function createIncident(User $user, string $description, array $attributes = []): Incident
    {
        return Incident::create(array_merge([
            'user_id' => $user->id,
            'type' => 'flood',
            'barangay' => 'Poblacion',
            'description' => $description,
        ], $attributes));
    }
}
