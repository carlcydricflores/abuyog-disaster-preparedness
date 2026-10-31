<?php

namespace Tests\Feature;

use App\Actions\IncidentAlertPublisher;
use App\Models\Alert;
use App\Models\Incident;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

    public function test_only_admins_can_publish_an_incident_as_a_public_alert(): void
    {
        $resident = User::factory()->create();
        $incident = $this->createIncident($resident, 'Flood water is rising quickly.');

        $this->actingAs($resident)
            ->post(route('admin.incidents.publish', $incident), $this->publishPayload($incident))
            ->assertForbidden();

        $this->assertSame('pending', $incident->fresh()->status);
        $this->assertDatabaseCount('alerts', 0);

        $admin = $this->createAdmin();
        $this->actingAs($admin)
            ->post(route('admin.incidents.publish', $incident), $this->publishPayload($incident))
            ->assertRedirect();

        $this->assertSame('verified', $incident->fresh()->status);
        $this->assertDatabaseHas('alerts', ['incident_id' => $incident->id, 'user_id' => $admin->id]);
    }

    public function test_repeated_publish_requests_reuse_the_single_linked_alert(): void
    {
        $admin = $this->createAdmin();
        $incident = $this->createIncident(User::factory()->create(), 'Flood water is rising quickly.');
        $payload = $this->publishPayload($incident);

        $this->actingAs($admin)->post(route('admin.incidents.publish', $incident), $payload)->assertRedirect();
        $alertId = Alert::where('incident_id', $incident->id)->value('id');
        $this->actingAs($admin)->post(route('admin.incidents.publish', $incident), $payload)->assertRedirect();

        $this->assertDatabaseCount('alerts', 1);
        $this->assertDatabaseHas('alerts', ['id' => $alertId, 'incident_id' => $incident->id]);
        $this->assertSame('verified', $incident->fresh()->status);
    }

    public function test_incident_types_map_to_the_public_alert_type_on_the_server(): void
    {
        $admin = $this->createAdmin();
        foreach (['flood' => 'flood', 'landslide' => 'landslide', 'fire' => 'fire', 'power_outage' => 'other'] as $incidentType => $expectedAlertType) {
            $incident = $this->createIncident(User::factory()->create(), 'Incident type mapping check.', ['type' => $incidentType]);

            $this->actingAs($admin)
                ->post(route('admin.incidents.publish', $incident), $this->publishPayload($incident))
                ->assertRedirect();

            $this->assertSame($expectedAlertType, $incident->alert()->firstOrFail()->type);
        }
    }

    public function test_failed_alert_creation_rolls_back_the_incident_status_change(): void
    {
        $admin = $this->createAdmin();
        $incident = $this->createIncident(User::factory()->create(), 'Flood water is rising quickly.');
        $invalidPayload = $this->publishPayload($incident);
        $invalidPayload['severity'] = null;

        try {
            app(IncidentAlertPublisher::class)->publish($incident, $invalidPayload, $admin);
            $this->fail('Expected alert creation to fail when its required severity is missing.');
        } catch (QueryException) {
            $this->assertSame('pending', $incident->fresh()->status);
            $this->assertDatabaseCount('alerts', 0);
        }
    }

    public function test_name_consent_controls_public_credit_without_exposing_private_incident_fields(): void
    {
        $admin = $this->createAdmin();
        $reporter = User::factory()->create([
            'name' => 'Juan Dela Cruz',
            'email' => 'private-reporter@example.test',
        ]);
        $incident = $this->createIncident($reporter, 'Flood water is rising quickly.', [
            'allow_name_publication' => true,
            'latitude' => '10.7470000',
            'longitude' => '125.0100000',
            'photo_path' => 'incidents/private-photo.jpg',
        ]);
        $this->publishIncident($admin, $incident);

        $this->get(route('alerts'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('alerts.data.0.reported_by', 'Reported by Juan C.')
                ->where('alerts.data.0.verified_by', 'Verified by administrator')
                ->where('alerts.data.0.illustration_url', '/images/incidents/incident-illustration-flood.svg'))
            ->assertDontSee('private-reporter@example.test')
            ->assertDontSee('10.7470000')
            ->assertDontSee('125.0100000')
            ->assertDontSee('incidents/private-photo.jpg');

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('alerts.0.reported_by', 'Reported by Juan C.'))
            ->assertDontSee('private-reporter@example.test')
            ->assertDontSee('incidents/private-photo.jpg');

        $this->get('/api/v1/alerts')
            ->assertOk()
            ->assertJsonPath('data.0.reported_by', 'Reported by Juan C.')
            ->assertJsonPath('data.0.verified_by', 'Verified by administrator')
            ->assertJsonPath('data.0.illustration_url', '/images/incidents/incident-illustration-flood.svg')
            ->assertJsonMissingPath('data.0.user_id')
            ->assertJsonMissingPath('data.0.incident_id')
            ->assertDontSee('private-reporter@example.test')
            ->assertDontSee('10.7470000')
            ->assertDontSee('125.0100000')
            ->assertDontSee('incidents/private-photo.jpg');
    }

    public function test_missing_name_consent_uses_generic_public_credit(): void
    {
        $admin = $this->createAdmin();
        $reporter = User::factory()->create(['name' => 'Consent Not Given']);
        $incident = $this->createIncident($reporter, 'A road is blocked by debris.');
        $this->publishIncident($admin, $incident);

        $this->get('/api/v1/alerts')
            ->assertOk()
            ->assertJsonPath('data.0.reported_by', 'Reported by a resident')
            ->assertDontSee('Consent Not Given');
    }

    public function test_manually_created_alerts_remain_public_without_incident_credit(): void
    {
        $admin = $this->createAdmin();
        $alert = Alert::create([
            'user_id' => $admin->id,
            'title' => 'Weather advisory',
            'type' => 'typhoon',
            'severity' => 'watch',
            'barangays' => 'Poblacion',
            'message' => 'Monitor local weather updates.',
            'expires_at' => now()->addDay(),
        ]);

        $this->get('/api/v1/alerts')
            ->assertOk()
            ->assertJsonPath('data.0.id', $alert->id)
            ->assertJsonPath('data.0.title', 'Weather advisory')
            ->assertJsonPath('data.0.reported_by', null)
            ->assertJsonPath('data.0.verified_by', null)
            ->assertJsonPath('data.0.illustration_url', null);
    }

    public function test_verify_only_changes_status_without_creating_an_alert(): void
    {
        $admin = $this->createAdmin();
        $incident = $this->createIncident(User::factory()->create(), 'A road is blocked by debris.');

        $this->actingAs($admin)
            ->patch(route('admin.incidents.update', $incident), [
                'status' => 'verified',
                'admin_notes' => 'Checked by response staff.',
            ])
            ->assertRedirect();

        $this->assertSame('verified', $incident->fresh()->status);
        $this->assertDatabaseCount('alerts', 0);
    }

    public function test_rejecting_a_published_incident_requires_a_choice_and_keeps_the_alert_record(): void
    {
        $admin = $this->createAdmin();
        $incident = $this->createIncident(User::factory()->create(), 'Flood water is rising quickly.');
        $this->publishIncident($admin, $incident);
        $alert = $incident->alert()->firstOrFail();

        $this->actingAs($admin)
            ->patch(route('admin.incidents.update', $incident), ['status' => 'rejected'])
            ->assertSessionHasErrors('linked_alert_action');
        $this->assertSame('verified', $incident->fresh()->status);
        $this->assertTrue((bool) $alert->fresh()->is_published);

        $this->actingAs($admin)
            ->patch(route('admin.incidents.update', $incident), ['status' => 'rejected', 'linked_alert_action' => 'expire'])
            ->assertRedirect();
        $this->assertSame('rejected', $incident->fresh()->status);
        $this->assertTrue($alert->fresh()->expires_at->isPast());
        $this->assertDatabaseHas('alerts', ['id' => $alert->id]);
    }

    public function test_rejection_can_unpublish_without_deleting_the_alert(): void
    {
        $admin = $this->createAdmin();
        $incident = $this->createIncident(User::factory()->create(), 'A road is blocked by debris.');
        $this->publishIncident($admin, $incident);
        $alert = $incident->alert()->firstOrFail();

        $this->actingAs($admin)
            ->patch(route('admin.incidents.update', $incident), ['status' => 'rejected', 'linked_alert_action' => 'unpublish'])
            ->assertRedirect();

        $this->assertSame('rejected', $incident->fresh()->status);
        $this->assertFalse((bool) $alert->fresh()->is_published);
        $this->assertDatabaseHas('alerts', ['id' => $alert->id]);
        $this->get('/api/v1/alerts')->assertOk()->assertJsonMissing(['id' => $alert->id]);
    }

    private function createAdmin(): User
    {
        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();

        return $admin;
    }

    private function publishPayload(Incident $incident): array
    {
        return [
            'title' => 'Flood reported in '.$incident->barangay,
            'type' => $incident->type === 'flood' ? 'flood' : 'other',
            'severity' => 'advisory',
            'barangays' => $incident->barangay,
            'message' => $incident->description,
            'expires_at' => now()->addDay()->toDateTimeString(),
        ];
    }

    private function publishIncident(User $admin, Incident $incident): Alert
    {
        $this->actingAs($admin)
            ->post(route('admin.incidents.publish', $incident), $this->publishPayload($incident))
            ->assertRedirect();

        return $incident->fresh()->alert()->firstOrFail();
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
