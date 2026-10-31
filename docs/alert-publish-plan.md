# Verified Incident Alert Publishing Plan

## Current State

- Laravel Framework 13.34.0, Tailwind CSS 3.4.19, Inertia React, and Vite are installed.
- `IncidentReviewController` currently changes status directly. Admin routes already use `auth` plus `EnsureAdmin`.
- `ManageController` creates manual alerts with types `typhoon`, `flood`, `earthquake`, `landslide`, `fire`, and `other`; those workflows must remain unchanged.
- Public Home/Alerts use `AlertCard`. The API currently serializes full Alert models, so it must move to an explicit public projection before adding reporter data.
- Incident types are `flood`, `landslide`, `fire`, `medical`, `road_blocked`, `power_outage`, `missing_person`, and `other`.

## Files Expected to Change

- Additive migration: `database/migrations/2026_10_30_143037_add_incident_publishing_fields.php`.
- Models: `app/Models/Incident.php`, `app/Models/Alert.php`.
- Validation and workflow: a publish `FormRequest`, an `IncidentAlertPublisher` action/service, `app/Http/Controllers/Admin/IncidentReviewController.php`, and `routes/web.php`.
- Reporter consent: `app/Http/Controllers/IncidentController.php`, `resources/js/Pages/Incidents/Create.tsx`, and `resources/js/Pages/Incidents/Index.tsx`.
- Review UI and direct alert editing: `resources/js/Pages/Admin/Incidents.tsx`, `app/Http/Controllers/Admin/ManageController.php`, and `resources/js/Pages/Admin/Manage.tsx`.
- Public output: `app/Http/Controllers/PublicController.php`, `app/Http/Controllers/Api/ApiController.php`, an explicit public alert presenter/resource, `resources/js/Components/ui.tsx`, `resources/js/Pages/Alerts.tsx`, and `resources/js/Pages/Home.tsx`.
- Regression coverage: a focused feature test file under `tests/Feature/`.

## Additive Schema

- Add nullable `incidents.allow_name_publication` boolean, default false. Existing incidents therefore do not grant consent.
- Add nullable `alerts.incident_id`, foreign-keyed to incidents with `nullOnDelete`, and a unique index. Multiple manual alerts remain valid; one incident can be linked to at most one alert.
- Add nullable `alerts.is_published` boolean with default true. Existing/manual alerts remain public by default; `null` is treated as published for compatibility. This allows explicit unpublishing without deleting the alert record. The migration is additive and no records are removed.
- No explicit migration command was run. Feature tests use `RefreshDatabase`, which applied the additive migration only in the configured test database. The application database still needs the migration applied by the user.

## Publish and Reject Flow

- Changing a status to `verified` opens a confirmation modal, never publishes as a side effect. The modal is prefilled with title, message, mapped alert type, barangay, default severity `advisory`, and expiry at 24 hours from now. The admin may edit title/message/expiry and must choose severity.
- Incident type mapping: flood/landslide/fire map directly; all other types map to `other`.
- The modal offers “Verify only (do not publish)” and a separate explicit “Verify and publish” action. A dedicated admin-only FormRequest and `IncidentAlertPublisher` action validate and execute publication in one `DB::transaction`, lock the incident row, set status verified, and create the linked alert. A duplicate request returns the existing linked alert or a conflict; the unique constraint is the final concurrency guard. Any failure rolls both writes back.
- A linked/published badge links to the existing Manage Alerts screen with the linked alert preselected; publish is disabled while its linked alert is active.
- Rejecting an already-published incident opens a confirmation with explicit choices: expire the alert now, unpublish it but retain its record, or cancel. The selected visibility change and rejected status are committed together; no alert is silently deleted.
- The existing ordinary status update remains available for non-publish transitions. Clear success/error feedback is shown in the review screen after each action.

## Reporter Credit and Privacy

- Add an unchecked consent checkbox to incident submission. Persist it as false unless the request explicitly submits true.
- For linked public alerts, show `Reported by First L.` when consent is true, or `Reported by a resident` otherwise. Always show the literal attribution `Verified by administrator`; do not name an office or invent an official endorsement.
- Build public web/API alerts from a strict allowlist: title, type, severity, barangays, message, expiry, creation time, reporter credit, and generic verification label. Do not serialize incident/user relations or expose email, user/incident IDs, exact coordinates, admin notes, or `photo_path`.
- Existing manual alerts remain public and unchanged in behavior. Linked-alert metadata is presented only as safe strings.

## Tests and Risks

- Test admin-only publishing; resident/guest denial; owner-scoped reports; one-alert behavior under duplicate requests; transaction rollback if alert creation fails; type mapping and draft validation; reporter credit with and without consent; public page/API exclusion of email, IDs, coordinates, and photos; admin-only review; and each rejection/expire/unpublish choice.
- Concurrency is guarded by a row lock plus the unique nullable `incident_id` index; databases used in tests must support the production transaction/constraint behavior.
- Publishing cannot create a public warning from a status dropdown misclick: only the explicit confirmation action creates the alert.
- No dependencies were added. The exact command to apply the migration after reviewing the diff is `php artisan migrate`.

## Implementation and Verification

- The migration adds `incidents.allow_name_publication` (nullable, default false), `alerts.incident_id` (nullable, unique foreign key), and `alerts.is_published` (nullable, default true). Existing manual alerts remain public by default.
- Publishing is admin-only and runs through `PublishIncidentAlertRequest` and `IncidentAlertPublisher`. The action locks the incident, maps type server-side, sets status and creates or updates the unique linked alert in one transaction. Duplicate requests reuse the linked alert. Rejection requires an explicit expire/unpublish choice and retains the alert record.
- Public Home, Alerts, and `/api/v1/alerts` use an allowlisted presenter. Reporter display is consent-aware; account IDs, emails, exact coordinates, admin notes, and photo paths are not serialized. Published incident alerts include a local type-matched SVG illustration, captioned as illustrative; manual alerts have no incident image.
- `npm run build` passes. Focused feature tests pass: 15 tests / 136 assertions. The full suite ran 42 tests: 41 passed; the existing `Tests\\Feature\\ExampleTest::test_the_application_returns_a_successful_response` still fails with an HTTP 500 database exception on the root request.
- `vendor/bin/pint --dirty --format agent` completed. No explicit `php artisan migrate` was run. Browser verification of the full workflow was not possible against the local app database because the required migration must remain unapplied; the publish and privacy paths were exercised by tests using the test database.