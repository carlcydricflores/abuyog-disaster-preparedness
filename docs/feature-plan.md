# Feature Plan: Centers Map, Private Reports, Theme Menu

**Status:** Approved; Phase 2 is in progress. The map implementation is waiting on the dependency choice below.

## Inspection Findings

- Installed versions: Laravel Framework 13.34.0 and Tailwind CSS 3.4.19. Leaflet and React Leaflet are not installed.
- `PublicController@centers` already applies search/status filters and paginates 12 centers. The center model and schema already include nullable latitude/longitude, occupancy, and status.
- `IncidentController@index` scopes reports to `$request->user()->incidents()`. Admin incident review already eager-loads reporter names. The admin Reports page currently shows aggregates only, so it needs a detail table/list to display reporter names.
- The CSV export already includes a Reporter column and prefixes formula-leading values with an apostrophe. Preserve this protection.
- Incident uploads currently use the `public` filesystem disk. `public/storage` is a Windows junction to `storage/app/public`, and the disk is configured with public visibility. The `storage/app/public/incidents` directory is absent in this checkout, so no local incident photos were found; deployed storage must be inventoried separately. Existing/future public-disk photo URLs are not a privacy boundary.
- `ThemeToggle` currently renders the Light/Dark/System choices expanded. The theme preference is stored in `abuyog-color-theme`, and the Blade shell applies the theme before React starts. The shared `AppSidebar` is used by guest, authenticated, and login/register layouts, so the compact control can remain consistent there.
- Only `logo.png` and `preparedness-hero.svg` are currently in `public/images`; there are no report illustrations yet. The eight incident types are flood, landslide, fire, medical, road blocked, power outage, missing person, and other.
- Existing role middleware protects admin routes; no public incident/report route was found. No schema migration appears necessary for the requested fields.

## Proposed Implementation

### Evacuation Map

- Keep the existing search and status filters. Return a full filtered center collection for the map while retaining the current paginated text list. Render markers only for centers with coordinates; show “Location not set” in the list for all others.
- Marker popups show center name, barangay, status, and occupancy. Selecting a list entry centers/opens its marker; selecting a marker highlights and scrolls to the matching list item when it is on the current list page. The map uses only `EvacuationCenter` data, never incident coordinates.
- Use OSM raster tiles with visible `© OpenStreetMap contributors` attribution. Keep the text list functional when tiles/map scripts fail, provide a responsive fixed-height map region, and style map popups to remain legible in both themes.
- **Dependency approval required:** recommend `leaflet`, `react-leaflet`, and `@types/leaflet` for multi-marker selection and synchronized list/map interaction. Do not install them until approved. If declined, use an embedded OSM iframe as requested; a plain OSM embed does not provide equivalent multi-marker and bidirectional selection behavior, so that fallback has a known interaction limitation.

### Reporter Names and Photo Privacy

- Keep resident report access scoped to the owner. Show the reporter’s name in My Reports, admin incident review, a new filtered/paginated detail list on Admin Reports, and the existing CSV Reporter column. Do not add names/photos to public pages.
- **Privacy issue and proposed fix:** the current public disk/symlink can serve uploaded images directly without authorization. Store new incident photos on Laravel’s private local disk and add one authenticated photo endpoint that returns an image only when the requester owns the incident or is an admin. Use a private/no-store response and never accept a storage path from the request.
- Render owner/admin images through that endpoint, not `/storage/...`; use lazy loading, a fixed aspect ratio, `object-cover`, descriptive alt text, and an accessible click-to-enlarge dialog. On load failure, show the matching labeled illustration.
- No database migration is planned. For deployed legacy images, first inventory and back up the public `incidents` files, copy them to private storage, verify every file against its incident, then remove the public copies only with explicit approval. The local checkout currently has no incident photo directory to migrate.
- Keep the CSV formula-injection guard intact; reporter names must continue through the existing safe-cell function.

### Illustrations and Optional Real Photos

- Create original, code-authored SVGs under `public/images/incidents/`, each with a 640×420 viewBox and a visible caption “Illustrative image, not the actual incident”. These are authored for this project, not downloaded stock imagery:
  - `incident-illustration-flood.svg`: rising water, a street/building outline, and a water-level marker.
  - `incident-illustration-landslide.svg`: hillside, earth/debris, and a blocked roadway.
  - `incident-illustration-fire.svg`: building outline, visible flame, and safety perimeter.
  - `incident-illustration-medical.svg`: first-aid kit and medical cross, without depicting an identifiable patient.
  - `incident-illustration-road-blocked.svg`: road barrier and debris/closure symbol.
  - `incident-illustration-power-outage.svg`: utility pole/lines and an outage indicator.
  - `incident-illustration-missing-person.svg`: neutral search/people icon, not a fictional face.
  - `incident-illustration-other.svg`: general incident alert and response symbol.
- If real photos are later supplied, use 1200×800 JPEG files, at most 500 KB each, with these names: `incident-photo-flood.jpg` (water level on an Abuyog street), `incident-photo-landslide.jpg` (slope/debris and affected road), `incident-photo-fire.jpg` (fire impact after the scene is safe), `incident-photo-medical.jpg` (medical response supplies, no identifiable patient), `incident-photo-road-blocked.jpg` (blocked road/barrier), `incident-photo-power-outage.jpg` (affected utility area, no unsafe close-up), `incident-photo-missing-person.jpg` (only an authorized family-provided image), and `incident-photo-other.jpg` (the relevant scene). Use only photos taken by you, used with permission, or carrying a free license with attribution. No internet photo downloads or guessed URLs.

### Compact Theme Menu

- Replace the expanded labels with one icon button and a small popover containing icon-only Light, Dark, and System options. Keep accessible names/tooltips, selected check/highlight, visible focus, Enter/Space open, arrow-key choice navigation, Escape, outside-click close, and mobile usability.
- Reuse the current preference key and pre-paint bootstrap; use the existing shared sidebar placement so the control remains present on public, authenticated, login, and register layouts. No second theme system or dependency is planned.

## Expected Files

- Map: `resources/js/Pages/Centers.tsx`, `app/Http/Controllers/PublicController.php`, and a focused `resources/js/Components/EvacuationMap.tsx`; if Leaflet is approved, `package.json` and the package lockfile will change.
- Names/private photos: `resources/js/Pages/Incidents/Index.tsx`, `resources/js/Pages/Admin/Incidents.tsx`, `resources/js/Pages/Admin/Reports.tsx`, `app/Http/Controllers/IncidentController.php`, `app/Http/Controllers/Admin/ReportController.php`, `routes/web.php`, and a small authorized photo controller.
- Theme menu: `resources/js/Components/ThemeToggle.tsx` and likely `resources/js/Components/AppSidebar.tsx`; existing Blade theme bootstrap remains in place.
- Add eight original SVG illustrations under `public/images/incidents/` and focused feature tests for owner/admin photo access, cross-resident denial, admin route protection, public-page privacy, and map filtering/data.
- No database migration is planned. No auth, role, or route permissions will be loosened.

## Risks and Verification

- Publicly stored legacy images may exist outside this checkout. Do not remove/move deployed files until they are inventoried, backed up, and the private copy is verified.
- OSM tiles require internet access and use the standard OSM tile service; include attribution and avoid bulk/offline tile use.
- Verify that public responses contain no reporter names/photos or incident coordinates; resident A cannot access resident B’s report/photo; admins can access reports; non-admins receive the existing forbidden response.
- After approval, run `npm run build` and `php artisan test`, check all image paths, and inspect changed pages at mobile/tablet/desktop in Light and Dark. Test marker/list synchronization, no-coordinate handling, image failure fallback, the theme menu’s keyboard behavior, and theme persistence.

## Implementation Progress

- Step 1, theme toggle: replaced the expanded controls with one icon button and keyboard-operable icon radio popover. Browser checks passed for keyboard open, arrow selection, Escape, outside click, and guest login access through the mobile drawer. Existing persistence and pre-paint bootstrap are unchanged.
- Step 2, reporter names: My Reports displays the signed-in owner’s name. Admin Reports now includes a filtered/paginated report list with names; admin incident review and CSV already displayed the reporter, and CSV formula-injection protection remains unchanged.
- Step 3, report images: new uploads use the private local disk and the owner/admin-only image route returns `private, no-store` responses. Eight original local SVG illustrations and the shared lazy-loaded/enlarge component are in place. The focused privacy suite passes 5 tests / 43 assertions.
- Legacy privacy caveat: this checkout has no `storage/app/public/incidents` directory, but deployed public-disk photos may still be directly reachable. Inventory, backup, copy/verify, and removal of deployed public copies remain a separate approved operation.
- Verification to date: `npm run build` passes. Full `php artisan test` ran 32 tests: 31 passed; the existing `ExampleTest::test_the_application_returns_a_successful_response` still fails with an HTTP 500 database exception on the root request.
- Step 4, map: not started. Leaflet was not approved or declined in the dependency prompt, so no map package was installed and the existing Centers page remains unchanged. Choose Leaflet or the OSM iframe fallback before this step.