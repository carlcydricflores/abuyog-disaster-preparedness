# Abuyog Disaster Preparedness System UI/UX Design Plan

**Inspection date:** 2026-10-24  
**Status:** Phase 1 plan only; no application files changed.  
**Installed Laravel:** 13.34.0.

## Current UI and Scope

The application is an existing Inertia/React application. Its active route-backed pages include Home, Alerts, Centers, Hotlines, Guidelines, Chat, Dashboard, Incidents/Create, Incidents/Index, Admin/Analytics, Admin/Incidents, Admin/Manage, Admin/Reports, Auth/Login, Auth/Register, Auth/ForgotPassword, Auth/ResetPassword, Auth/ConfirmPassword, Auth/VerifyEmail, and Profile/Edit with profile/password/delete partials. `Welcome.tsx` is also present but appears to be the default Laravel welcome page rather than the application home route; verify its route use before deciding whether to leave it untouched.

The current visual direction for operational pages is charcoal with amber and orange accents. The custom `AppLayout`, `GuestLayout`, redesigned login page, and `ui.tsx` tokens provide a useful base. Several Breeze authentication/profile screens still use light gray, white, and indigo styles and the separate `AuthenticatedLayout`; the profile page uses this alternate shell. Home currently presents text, links, alerts, and hotline cards without the described hero photograph. Only `public/images/logo.png` was found in `public/images`; `public/images/abuyog-hero.jpg` is absent. The login page currently uses a custom warm, patterned panel rather than a photo.

The existing routes and feature flows are to be preserved: public emergency information and assistant, resident incident creation and own-report list, admin management/review/reporting/analytics, and authentication/profile. No page will be designed for hazard maps, resource management, or evacuation plans.

## Pages to Improve

- **Shared navigation and page shell:** `AppLayout` (clearer active states, compact responsive navigation on small screens, consistent page headings and content width; keep public/admin links and current route targets unchanged).
- **Public information:** `Home`, `Alerts`, `Centers`, `Hotlines`, `Guidelines`, and `Chat` (stronger scanning hierarchy, emergency-first actions, information density, empty states, mobile layouts, and consistent surfaces).
- **Resident workflow:** `Dashboard`, `Incidents/Create`, and `Incidents/Index` (task clarity, form layout and associated labels, field-level errors, submission/loading state, and report/status readability).
- **Admin workflow:** `Admin/Analytics`, `Admin/Incidents`, `Admin/Manage`, and `Admin/Reports` (operational navigation, dense but readable data presentation, filters/actions, table/list responsiveness, confirmation and status feedback).
- **Authentication and profile:** `GuestLayout`, `Login`, `Register`, `ForgotPassword`, `ResetPassword`, `ConfirmPassword`, `VerifyEmail`, `Profile/Edit`, and its partial forms (align remaining Breeze screens with the existing brand; retain the redesigned login composition and all existing actions).
- **Conditional:** `Welcome.tsx` only if route inspection shows it remains user-facing; otherwise leave the unused default page alone.

## Existing Components and Behavior to Preserve

- `resources/js/Components/ui.tsx`: existing `card`, `btn`, `btnAlt`, `input`, `severityStyle`, `Badge`, `Pager`, and `AlertCard` exports. Extend the established charcoal/amber/orange tokens rather than replacing the visual system.
- `resources/js/Components/Logo.tsx` and `public/images/logo.png`: preserve the existing brand asset and its proportions; do not invent a municipal seal, official endorsement, or alternate logo.
- `AppLayout`, `GuestLayout`, Breeze form controls, `Modal`, and current Inertia `Link`, `router`, and `useForm` workflows: refine and reuse instead of introducing a new UI framework.
- Keep all route names/URLs, authentication behavior, admin role checks, controller/model/database behavior, records, and user-facing features unchanged. No backend change is planned for this visual phase; action feedback should use existing client-side Inertia callbacks/state unless separately approved.

## Proposed Visual Refinements

- Keep the dark charcoal page surfaces and amber/orange actions; use the shared token exports consistently across both custom and Breeze-derived areas.
- Establish a predictable spacing and typography scale, restrained page headings, and clearer separation between urgent actions, status, secondary details, and long-form guidance.
- Improve the shared navigation for keyboard and mobile use: explicit menu button state, visible focus, active-route treatment, appropriate link grouping, and a compact expandable small-screen menu.
- Keep alert severity words visible alongside their colors; add a small textual/icon cue where useful so severity is not communicated by color alone. Preserve the existing severity labels and data.
- Associate every form label with its control, connect errors using `aria-describedby`, provide visible focus, keep processing/disabled states, and add local success/error feedback where the current Inertia callbacks allow it.
- Make admin lists and charts easier to scan at narrow widths without changing underlying data; use real application values only and label no demonstration values as real.
- Improve empty states and explanatory microcopy without adding clutter or fabricated emergency information.
- Prefer reduced motion and minimal transitions. Do not add libraries or a second CSS system.
- Check shared-token changes against all targeted pages to avoid regressions; retain readable emergency text and strong contrast if imagery does not load.

## Image Plan

| Location | Planned file and dimensions | How it will be obtained | Treatment and fallback |
|---|---|---|---|
| Home hero; optionally reuse in the GuestLayout's existing welcome panel | `public/images/preparedness-hero.svg`, `viewBox` and intended display ratio 1600 x 900; keep source optimized and under approximately 30 KB | Create an original, locally authored SVG illustration after approval. It will depict general preparedness elements (for example a go-bag, radio, first-aid supplies, and a simple community shelter motif), not an actual incident, hazard map, evacuation center, or official municipal scene. No external photo, URL, or third-party license is involved. | Responsive crop/contain appropriate to layout; decorative with `alt=""` if copy communicates all information. Keep emergency actions and text in HTML. Use the existing charcoal/amber/orange palette and a CSS-backed neutral surface if the asset fails.
| Existing brand mark | `public/images/logo.png` (existing file; do not replace) | Existing project asset; source/license not established by this inspection. | Continue using through `Logo.tsx`; preserve intrinsic proportions and meaningful alt text.

No other imagery is planned unless implementation review demonstrates a clear user benefit. The absent `abuyog-hero.jpg` will not be referenced or replaced with a guessed remote URL.

## Files Expected to Change After Approval

- `resources/js/Layouts/AppLayout.tsx`
- `resources/js/Layouts/GuestLayout.tsx`
- `resources/js/Layouts/AuthenticatedLayout.tsx` (profile currently uses this distinct layout)
- `resources/js/Components/ui.tsx`
- `resources/js/Components/InputLabel.tsx`, `InputError.tsx`, and selected existing button/input/navigation components where shared styling is needed
- `resources/js/Pages/Home.tsx`, `Alerts.tsx`, `Centers.tsx`, `Hotlines.tsx`, `Guidelines.tsx`, `Chat.tsx`, `Dashboard.tsx`
- `resources/js/Pages/Incidents/Create.tsx`, `Incidents/Index.tsx`
- `resources/js/Pages/Admin/Analytics.tsx`, `Admin/Incidents.tsx`, `Admin/Manage.tsx`, `Admin/Reports.tsx`
- `resources/js/Pages/Auth/Login.tsx`, `Register.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`, `ConfirmPassword.tsx`, `VerifyEmail.tsx`
- `resources/js/Pages/Profile/Edit.tsx` and `resources/js/Pages/Profile/Partials/*` if needed to remove visual inconsistency while preserving profile actions
- `public/images/preparedness-hero.svg` (new original asset)

`resources/css/app.css` is expected to remain unchanged unless the implementation proves a small global rule is necessary; any global change will be checked across the app. No Blade page templates, routes, controllers, migrations, database data, or package manifests are planned for change. `Welcome.tsx` is excluded unless route inspection confirms it is active.

## Phase 2+ Verification Intent

After implementation approval, run `npm run build` and `php artisan test`, verify every referenced image path resolves to a file, review responsive classes at mobile/tablet/desktop widths, and confirm navigation and all form actions/routes/role restrictions remain intact. Browser verification will be reported only if an available browser session can actually render and exercise the application. Any check that cannot be run will be reported as unverified rather than passed.
