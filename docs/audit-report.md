# Abuyog Disaster Preparedness System Audit

**Review date:** 2026-10-24  
**Scope:** Read-only source/configuration review (Phases 1-3). This is an adapted project evaluation using six ISO/IEC 25010-inspired categories; it is not a claim of compliance or certification against ISO/IEC 25010.

## 1. Application Overview

This is a Laravel 13.34.0 application using PHP 8.5.0, Inertia.js 2.0.28, React 18.3.1, TypeScript 5.9.3, Tailwind CSS 3.4.19, and Vite 8.3.1. Breeze 2.4.2 supplies the session-authentication scaffold; Sanctum 4.3.3 is installed. The active database driver reported by Laravel configuration is SQLite. No `.env` values were read or included.

The application has public emergency-information pages, resident incident reporting, an admin management/review area, CSV reports, and three rate-limited public read API endpoints. Server-side admin authorization is enforced through `EnsureAdmin`. Review was static except for route registration, installed-version/config queries, and TypeScript checking. No tests, browser interaction, database migration, load test, or production deployment checks were run; therefore runtime behavior and performance are not certified by this report.

## 2. Features Verified in Code

- Public homepage, active disaster alerts, evacuation-center directory/search, emergency hotlines, safety guidelines, and a rule-based emergency assistant.
- Admin CRUD for alerts, centers, hotlines, and guidelines; dashboard analytics; incident review/status updates; and emergency reports with CSV export.
- Authenticated resident incident submissions with validation, optional location and image upload, and a paginated view scoped to the signed-in resident.
- Public read-only API under `/api/v1` for alerts, evacuation centers, and hotlines. API routes use `throttle:60,1`; hotlines are not paginated, while alerts and centers are.
- Role defaults to `user`, is not mass assignable, and admin routes are guarded by `EnsureAdmin`. Laravel's web middleware supplies CSRF protection. The login request rate-limits failed attempts. Incident uploads are image-validated, limited to 2 MB, and stored using generated filenames. CSV export escapes formula-leading text cells.
- Alert selection consistently excludes records whose `expires_at` is not later than `now()`, while alerts without an expiry remain active.

## 3. Missing or Incomplete Items

- Email-verification routes and UI exist, but the user model does not implement Laravel's verification contract. The verification completion path calls methods the model does not provide; registration also is not gated by `verified` middleware.
- The authorization model has only `admin` and `user`; there is no distinct barangay-official role or workflow in the inspected code. If barangay officials are an intended user group, this remains unimplemented.
- The reports page exposes date filters only, although the controller also accepts barangay and incident type filters.
- There is no explicit success confirmation displayed after incident submission or admin CRUD/review actions in the inspected pages.
- Hazard maps, resource management, and evacuation plans are **not in scope** for this audit and are not reported as defects.

## 4. Confirmed Defects and Security Findings

The table below records findings visible in source/configuration. A high severity describes the potential impact in the stated condition; it does not assert that a production incident has occurred. Runtime-only questions are separated in Section 7.

| Quality category | Problem | Evidence from the code | Severity (Critical, High, Medium, Low) | Recommended solution | Relevant file |
|---|---|---|---|---|---|
| Security / Reliability | Seeded default admin credentials are fixed and published in project setup documentation. Rerunning the seeder also resets the seeded account password. Anyone deploying seeded data without changing it could expose admin access. | The seeder force-fills a fixed admin email/password on every run; README repeats credentials and instructs changing the password. | High | Remove reusable credentials from deployable seed data. Create the initial admin through an environment-specific, one-time process that requires a unique secret; never overwrite an existing password when seeding. Rotate credentials if this has ever been deployed. | `database/seeders/DatabaseSeeder.php`; `README.md` |
| Security / Functional Suitability | Email verification is registered but not correctly supported or enforced. `User` does not implement `MustVerifyEmail`; profile code detects that it does not, while the verification controller calls `hasVerifiedEmail()` and `markEmailAsVerified()`. Authenticated application routes use `auth` only, not `verified`. The verification workflow can fail, and unverified accounts can access authenticated routes. | `User` extends `Authenticatable` without the verification contract; `VerifyEmailController` invokes the missing contract methods; `routes/web.php` groups incident routes under `auth`; `routes/auth.php` declares verification endpoints. | High | Correct the model/verification integration and add narrowly scoped `verified` middleware only if verified email is an intended access requirement. Preserve the existing registration/login behavior until the policy is approved; add tests for successful verification and access before/after verification. | `app/Models/User.php`; `app/Http/Controllers/Auth/VerifyEmailController.php`; `app/Http/Controllers/ProfileController.php`; `routes/web.php`; `routes/auth.php` |
| Security | Incident photos are stored on the public disk and linked via `/storage/{path}` from the admin review page. The public storage link exists. Anyone with a photo URL can request it without an authorization check; photos may contain sensitive incident or victim information. | `IncidentController` stores uploads on disk `public`; `filesystems.php` maps `public/storage` to `storage/app/public`; `IncidentReviewController` page emits direct `/storage/...` URLs. | High | Treat incident photos as private: store them on a private disk and serve them through an authenticated, authorized download action (admin or owning reporter). Assess existing uploads before changing storage behavior. | `app/Http/Controllers/IncidentController.php`; `resources/js/Pages/Admin/Incidents.tsx`; `config/filesystems.php` |
| Reliability / Functional Suitability | Evacuation-center validation allows `occupied` to exceed `capacity`, and allows contradictory status/count combinations. The public page caps the occupancy bar visually at 100%, while the displayed count can exceed capacity and analytics report zero remaining spaces. | `ManageController` independently validates both fields up to 100000, without a cross-field constraint; migration has separate unsigned columns and no check constraint; `Centers.tsx` clamps only the bar width. | Medium | Validate `occupied <= capacity` on create and update; define whether `full`/`closed` statuses must agree with counts. Add tests for boundary and inconsistent values. | `app/Http/Controllers/Admin/ManageController.php`; `database/migrations/2026_01_01_000000_create_disaster_tables.php`; `resources/js/Pages/Centers.tsx` |
| Reliability | Deleting an administrator account can cascade-delete alerts authored by that account. The profile deletion route is available to authenticated administrators, and the alert foreign key uses cascade deletion. | `ProfileController::destroy()` deletes the user; the alerts table defines `user_id` with `cascadeOnDelete()`. | Medium | Preserve published emergency records when an author account is removed, for example by retaining/deactivating admin accounts or using nullable attribution with `nullOnDelete()`. Decide retention policy before any schema change. | `app/Http/Controllers/ProfileController.php`; `database/migrations/2026_01_01_000000_create_disaster_tables.php` |
| Reliability / Functional Suitability | Alert expiry uses UTC application time while admin entry is a timezone-free `datetime-local` value. The README instructs Asia/Manila configuration, but `config/app.php` hardcodes UTC. This mismatch can shift the effective expiry relative to local time. | `Alert::active()` compares expiry to `now()`; form uses `datetime-local`; `config/app.php` sets `timezone` to `UTC`; `README.md` instructs Asia/Manila. | Medium | Make timezone policy explicit and configurable, store timestamps consistently, and convert local input to the chosen storage timezone. Add tests with a known Asia/Manila expiry boundary and daylight/timezone assumptions documented. | `app/Models/Alert.php`; `app/Http/Controllers/Admin/ManageController.php`; `resources/js/Pages/Admin/Manage.tsx`; `config/app.php`; `README.md` |
| Functional Suitability | Report users cannot select barangay or incident type filters from the reports screen, even though the backend accepts those filters. | `ReportController::query()` supports `barangay` and `type`; `Reports.tsx` only collects `from` and `to` for both page navigation and export. | Medium | Add validated filter controls to the screen and preserve all active filters in CSV links, or remove unused controller options if they are not intended features. | `app/Http/Controllers/Admin/ReportController.php`; `resources/js/Pages/Admin/Reports.tsx` |
| Usability | Several forms have visible `<label>` elements without `htmlFor`/matching input `id`; center search has a placeholder but no label. This weakens programmatic label association and assistive-technology support. | Incident form labels and generic management labels are not associated with controls; center search input has no label. | Medium | Give every control a stable `id` and corresponding `htmlFor`, add an explicit search label, and verify keyboard and screen-reader flows. | `resources/js/Pages/Incidents/Create.tsx`; `resources/js/Pages/Admin/Manage.tsx`; `resources/js/Pages/Centers.tsx`; `resources/js/Pages/Admin/Reports.tsx` |
| Usability | Successful incident submission and admin mutations have no explicit success feedback in the inspected UI, leaving users to infer whether an action completed. | Incident `store()` redirects to the list; admin create/update/delete and review actions return/back; affected React pages do not render a success status. | Low | Flash a concise status message and render it accessibly with an appropriate live region; preserve validation errors already returned by Laravel/Inertia. | `app/Http/Controllers/IncidentController.php`; `app/Http/Controllers/Admin/ManageController.php`; `app/Http/Controllers/Admin/IncidentReviewController.php`; `resources/js/Pages/Incidents/Index.tsx`; `resources/js/Pages/Admin/Manage.tsx`; `resources/js/Pages/Admin/Incidents.tsx` |
| Maintainability | Setup documentation describes Laravel 12/MySQL and PHP 8.2+, while the inspected installation is Laravel 13.34.0/PHP 8.5.0 and reports SQLite. Setup instructions and runtime facts can lead to incorrect reproduction or evaluation. | `README.md` setup heading states Laravel 12/MySQL/PHP 8.2; `composer.json` requires Laravel `^13.17` and PHP `^8.3`; current runtime/config checks report Laravel 13.34.0, PHP 8.5.0, SQLite. | Low | Update setup documentation to the supported versions and actual intended database options, without disclosing local secrets. Keep example setup aligned with configuration. | `README.md`; `composer.json`; `config/database.php` |
| Maintainability / Reliability | Automated coverage is concentrated in authentication, profile, chatbot, and one analytics authorization/data test. No tests were found for incident submission/privacy, admin CRUD, alert expiry, center count constraints, CSV formula escaping, or the API contract. | Existing test files include `ChatbotAnalyticsTest`, `ProfileTest`, auth feature tests, and examples; inspected feature flows have no corresponding tests. | Medium | Add focused PHPUnit feature tests around high-risk workflows, access boundaries, validation, and data integrity. Avoid broad snapshot-only coverage. | `tests/Feature/`; `app/Http/Controllers/` |

## 5. Prioritized Recommendations

1. **High: Remove/revoke seeded fixed admin credentials.** Ensure the seed process cannot reset a known password and protect any installation that has used those credentials.
2. **High: Repair email verification integration.** Decide whether verification is required, make the verification model contract functional, and test before adding `verified` route enforcement. Do not change auth behavior without review.
3. **High: Make incident images private.** Require authorization for reads and plan for already stored images.
4. **Medium: Enforce center capacity invariants** and test occupancy/status edge cases.
5. **Medium: Resolve timezone policy** for admin-entered alert expiry; ensure filtering/report export controls match backend behavior.
6. **Medium: Preserve alert data on admin account removal** according to an explicit retention policy.
7. **Medium/Low: Improve form labels and action feedback**, then add focused regression tests for the paths above.
8. **Low: Correct setup documentation** and record tested runtime/database versions.

## 6. Six-Category Assessment

### Functional Suitability
The core emergency-information and incident workflow surfaces exist in code, including active-alert filtering, resident-owned incident listing, admin review, paginated directories, and CSV export. Gaps include the broken email-verification implementation, absent barangay-official-specific role/workflow if that audience is required, and report filters that the backend accepts but the UI does not expose. Code presence does not establish end-to-end acceptance.

### Performance Efficiency
Pagination is used for alerts, centers, incident lists, admin lists, and API alerts/centers. Admin incident review eager-loads the reporter; report export streams a cursor and neutralizes formula-leading values. Potential growth concerns: report summaries run multiple aggregate queries, center search uses leading-wildcard `LIKE` predicates, incident analytics filter/group by dates without an explicit `created_at` index, and hotlines/guidelines/API hotlines are unpaginated. These are candidates for measurement, not verified performance defects.

Recommended measurable test plan (targets are proposed project acceptance thresholds, not ISO/IEC requirements):

- Seed 10,000 incidents, 1,000 alerts, 500 centers, and 100 hotline records. Measure p50/p95 response times and query counts for home, alerts, center search, resident incident list, admin review, analytics, and reports.
- At 50 concurrent virtual users for 10 minutes, target p95 under 500 ms for paginated read pages and under 2 seconds for analytics/report summaries, with error rate below 1% on the agreed test environment.
- Export 100,000 incident rows and record completion time, peak memory, and output validity; confirm memory remains bounded and spreadsheet formula payloads are neutralized.
- Compare center search performance at different data volumes and with common barangay/name terms. Add indexes only where measurement supports them.

No such load or timing tests were run; these results remain unverified.

### Usability
Navigation includes public pages and a role-aware dashboard; resident and admin workflows are represented, and the UI uses responsive Tailwind utility classes. Form field association and action-success feedback need improvement. Color contrast, mobile layout behavior, real keyboard traversal, screen-reader announcements, and clarity with real local emergency content were not measured in a browser.

### Reliability
Server-side request validation and alert expiry filtering are present. However, center count invariants are not enforced, the email-verification completion path is inconsistent with the user model, account deletion may cascade away alerts, and timezone policy conflicts with local deployment guidance. No interruption/retry, duplicate-submit, mail, file-write failure, or live database recovery tests were run.

### Security
Positive controls visible in code include server-side admin middleware, non-mass-assignable roles, password hashing via Laravel's hashed cast, session login throttling, CSRF middleware, bounded/validated image uploads, parameterized query values, rate limits on chat/incident/API routes, and CSV formula neutralization. The highest concerns found are fixed seeded admin credentials, public incident-photo URLs, and broken/un-enforced email verification. No penetration test, deployed configuration review, or adversarial upload/browser test was performed. Sanctum is installed, but the inspected API endpoints are intentionally public and do not use token authentication.

### Maintainability
Feature code uses Laravel controllers/models, a shared generic management controller, reusable React UI components, and a small set of PHPUnit feature tests. Documentation is stale against current dependencies/runtime. Important workflows lack regression tests, and business invariants are concentrated in controller validation rather than enforced across all write paths. No unnecessary architectural rewrite is recommended.

## 7. Risks Requiring Runtime Testing

- Confirm the installed database schema is migrated and run the feature suite in an isolated test environment; no test suite was run during this read-only phase.
- Exercise registration, verification email delivery, signed verification URL, profile update, and access to each authenticated/admin route before and after verification.
- Attempt direct unauthenticated access to a known incident photo URL; test the desired privacy policy and any existing storage contents before changing disk visibility.
- Submit occupied counts above capacity and all center status/count combinations; verify public display, assistant responses, and analytics.
- Enter and expire alerts in the intended Asia/Manila timezone, including expiry exactly at the current time and null expiry.
- Exercise CSV with formula-leading values in every free-text output field and large exports; inspect spreadsheet opening behavior and resource consumption.
- Verify public API payload contents, rate-limit behavior, pagination, error responses, and whether data exposure is acceptable for all three endpoints.
- Test forms at desktop/mobile sizes with keyboard-only navigation and screen-reader tooling; measure contrast and visible validation/success feedback.
- Perform the specified load tests and collect response-time, query-count, memory, and error-rate results before making performance claims.
- Confirm whether the seeded admin account/password has ever been used outside a local development database, and rotate/revoke it if necessary.

## Verification Performed

- `php -v`: PHP 8.5.0.
- `composer show --direct`: Laravel Framework 13.34.0; Inertia Laravel 2.0.28; Sanctum 4.3.3; Breeze 2.4.2.
- `php artisan config:show database.default`: SQLite (driver only; no environment values exposed).
- `php artisan config:show app.timezone`: UTC.
- `php artisan route:list`: 46 routes registered, including admin, auth, incident, public pages, and three `/api/v1` endpoints.
- `git status --short --branch`: `develop`, clean at inspection time.
- `npm ls --depth=0`: React 18.3.1, React DOM 18.3.1, Inertia React 2.3.28, TypeScript 5.9.3, Vite 8.3.1, Tailwind CSS 3.4.19. An optional `@laravel/multiplex` dependency is unmet; no use of it was found in inspected build configuration.
- `npm exec -- tsc --noEmit`: completed with no diagnostics.
- Tests and production build were not run. The former may alter test/runtime state and the latter emits generated files; neither was necessary for this read-only phase.
