# UI Refresh Plan

**Status:** Approved and implemented on `develop`. Verification results are recorded below.

## Inspection Notes

- The branch is `develop` and was clean before this plan file was created. Laravel is 13.34.0 and Tailwind CSS is 3.4.19; implementation will follow the existing Tailwind v3 setup. No new packages are planned.
- `AppLayout` already has a fixed desktop side navigation, but it cannot collapse. On small screens its links expand inline; it is not an off-canvas drawer. `AuthenticatedLayout` still has a separate Breeze top navigation, and `GuestLayout` has a separate auth composition.
- `ThemeToggle` currently supports Light and Dark only, stores `light`/`dark` under `abuyog-color-theme`, and defaults to dark. It does not currently offer System or apply the theme before React starts.
- `ui.tsx`, shared controls, all page families, `app.css`, and the default Laravel `Welcome.tsx` contain dark-stone and/or amber/orange styling. `Welcome.tsx` also has Laravel-red accents. The route-backed application home is `Home.tsx`.
- `Logo.tsx` renders the provided `public/images/logo.png` Abuyog emblem with a blue hue adjustment. `preparedness-hero.svg` is used on the home and auth layouts and contains the preparedness illustration.
- The project has no shared CSS-variable palette, reduced-motion/transparency rules, or sidebar persistence. `@headlessui/react` is already declared; no icon package is installed or needed.

## Palette Proposal

Use semantic CSS variables in `app.css`, selected by the existing `data-theme` attribute. Blue is the brand/action family; amber, orange, red, green, and slate remain reserved for semantic status and validation feedback. Ratios below are calculated from the proposed sRGB values using WCAG relative luminance. Light/dark glass figures use the composited fills listed in the glass rules.

| Theme and purpose | Foreground | Background | Contrast |
| --- | --- | --- | ---: |
| Light primary text / page | `#102A43` | `#F2F7FC` | 13.59:1 |
| Light primary text / surface | `#102A43` | `#FFFFFF` | 14.64:1 |
| Light primary text / glass | `#102A43` | `#FCFEFF` | 14.47:1 |
| Light secondary text / page | `#405A73` | `#F2F7FC` | 6.65:1 |
| Light secondary text / surface | `#405A73` | `#FFFFFF` | 7.17:1 |
| Light secondary text / glass | `#405A73` | `#FCFEFF` | 7.09:1 |
| Light muted text / page, surface, glass | `#536B83` | `#F2F7FC`, `#FFFFFF`, `#FCFEFF` | 5.13:1, 5.53:1, 5.47:1 |
| Light blue links / page | `#155E9A` | `#F2F7FC` | 6.29:1 |
| Light blue links / surface | `#155E9A` | `#FFFFFF` | 6.78:1 |
| Light blue links / glass | `#155E9A` | `#FCFEFF` | 6.70:1 |
| Light primary button label | `#FFFFFF` | `#174A7E` | 9.06:1 |
| Light blue highlight label | `#123A5C` | `#DCEEFF` | 9.92:1 |
| Light focus ring / page, surface, glass | `#1877C9` | `#F2F7FC`, `#FFFFFF`, `#FCFEFF` | 4.31:1, 4.65:1, 4.59:1 |
| Light boundary / page, surface | `#7891AA` | `#F2F7FC`, `#FFFFFF` | 3.03:1, 3.27:1 |
| Dark primary text / page, surface, glass | `#EDF4FC` | `#0B1728`, `#13243A`, `#15273E` | 16.23:1, 14.13:1, 13.61:1 |
| Dark secondary text / page, surface, glass | `#BBCBDD` | `#0B1728`, `#13243A`, `#15273E` | 10.88:1, 9.47:1, 9.13:1 |
| Dark muted text / page, surface, glass | `#9FB3CA` | `#0B1728`, `#13243A`, `#15273E` | 8.37:1, 7.29:1, 7.02:1 |
| Dark blue links / page, surface, glass | `#9CCBFF` | `#0B1728`, `#13243A`, `#15273E` | 10.62:1, 9.25:1, 8.91:1 |
| Dark primary button label | `#08213B` | `#8FC5FF` | 8.98:1 |
| Dark blue highlight label | `#08213B` | `#9CCBFF` | 9.60:1 |
| Dark focus ring / page, surface, glass | `#86C5FF` | `#0B1728`, `#13243A`, `#15273E` | 9.80:1, 8.53:1, 8.22:1 |
| Dark boundary / page, surface | `#607B97` | `#0B1728`, `#13243A` | 4.09:1, 3.56:1 |

Glass fills will be at least 92% white in light mode and 90% navy in dark mode. Their conservative composites above assume a light-blue `#DCEEFF` or dark-blue `#29425F` backdrop. Surfaces carrying text will remain opaque enough to meet the listed ratios; text will not be placed directly over the hero image or a gradient.

### Semantic Status Colors

| State | Badge background | Label | Contrast |
| --- | --- | --- | ---: |
| Advisory | `#1D4ED8` | White | 6.70:1 |
| Watch | `#A16207` | White | 4.92:1 |
| Warning | `#C2410C` | White | 5.18:1 |
| Critical | `#B91C1C` | White | 6.47:1 |
| Center open | `#166534` | White | 7.13:1 |
| Center full | `#A16207` | White | 4.92:1 |
| Center closed | `#475569` | White | 7.58:1 |
| Inline error, light | `#B91C1C` | `#FFFFFF` | 6.47:1 |
| Inline error, dark | `#FCA5A5` | `#13243A` | 8.25:1 |
| Success, light | `#166534` | `#FFFFFF` | 7.13:1 |
| Success, dark | `#86EFAC` | `#13243A` | 11.15:1 |
| Occupancy bar, light | `#0B2A48` | `#7891AA` track | 4.47:1 fill/track; 3.27:1 track/surface |
| Occupancy bar, dark | `#D7ECFF` | `#607B97` track | 3.63:1 fill/track; 3.56:1 track/surface |

Status labels will retain visible text and add consistent icon/shape cues where useful; color will not be the only signal. The occupancy display will retain its numeric count and accessible progress values. Charts and primary actions will use blue, not status colors.

## Sidebar and Theme Behavior

- Enhance the existing `AppLayout` side navigation instead of replacing the application shell. Desktop uses a 272px expanded rail and a 76px collapsed icon rail; the main content margin transitions with it.
- Guests see Alerts, Emergency assistant, Evacuation centers, Hotlines, Safety guidelines, Log in, and Register. Residents see the public links plus Report an incident, My reports, Dashboard/My account, Profile, and Log out. Admins see public links and account actions plus Report an incident and an Admin section for Manage content, Review incidents, Reports, and Analytics. Render admin links only when the existing `auth.user.role === 'admin'` check passes; do not alter server authorization or routes.
- Put the logo at the sidebar top; put the incident-report action beside the role-appropriate navigation; put theme selection and login/register or profile/logout actions in a persistent lower account area. The mobile menu button stays in the page header.
- At mobile and tablet widths, show a modal off-canvas drawer with backdrop. Reuse the installed Headless UI primitives if their installed API supports the needed dialog behavior; otherwise implement the same focus trap, focus return, outside-click, Escape, and link-close behavior without adding a dependency. Collapsed icons have accessible names/tooltips, active links use `aria-current`, toggles expose `aria-expanded`, and a skip link targets the main landmark.
- Store desktop collapsed state under a dedicated localStorage key with guarded reads/writes. Extend the existing theme toggle and `abuyog-color-theme` key to include System, use `prefers-color-scheme` for that selection, and set the resolved `data-theme` before the page paints so reloads do not flash the wrong theme. Keep Light/Dark/System as one theme mechanism.

## Liquid Glass and Assets

- Apply restrained translucent surfaces to the sidebar/header, cards, modal, and dropdowns: 16–24px corners where appropriate, thin blue-tinted borders, soft shadows, and 150–250ms transitions. Use gentle blue page lighting behind surfaces, not decoration behind text.
- Use `@supports` for `backdrop-filter`; unsupported browsers get solid token surfaces. `prefers-reduced-transparency: reduce` also switches glass to opaque fills. `prefers-reduced-motion: reduce` removes movement and nonessential transitions.
- Keep the provided `public/images/logo.png` as the active logo and apply the blue hue treatment in `Logo.tsx`. Recolor the warm shapes in `preparedness-hero.svg` to navy, blue, sky, and white while preserving the preparedness objects; update both layout overlays to blue semantic tokens. Remove the Laravel-red styling from the un-routed `Welcome.tsx` as part of the all-pages theme pass.
- Use existing inline SVG icons and Figtree; add no icon/font dependency.

## Expected Files After Approval

- Theme and shell: `resources/css/app.css`, `resources/views/app.blade.php`, `resources/js/Components/ui.tsx`, `resources/js/Components/ThemeToggle.tsx`, `resources/js/Components/Logo.tsx`, `resources/js/Components/AppSidebar.tsx`, `resources/js/Layouts/AppLayout.tsx`, `resources/js/Layouts/AuthenticatedLayout.tsx`, and `resources/js/Layouts/GuestLayout.tsx`.
- Shared controls: the existing button, input, navigation, dropdown, and modal components under `resources/js/Components/`.
- Pages to audit/update: `resources/js/Pages/{Welcome,Home,Alerts,Centers,Hotlines,Guidelines,Chat,Dashboard}.tsx`; `resources/js/Pages/Incidents/{Create,Index}.tsx`; `resources/js/Pages/Admin/{Analytics,Incidents,Manage,Reports}.tsx`; every page under `resources/js/Pages/Auth/`; and `resources/js/Pages/Profile/` plus its three partial forms.
- Visual asset: `public/images/preparedness-hero.svg`. No routes, controllers, models, migrations, database records, authentication rules, roles, or dependencies will be changed.

## Verification Results and Manual Checks

- `npm run build` passes. `php artisan test` ran 27 tests: 26 passed and the unmodified `ExampleTest::test_the_application_returns_a_successful_response` failed with HTTP 500 from a database exception while requesting the database-backed home page. No backend, test, or database setup was changed.
- Browser automation checked 171 route/viewport/theme combinations across 19 paths, widths of 390, 820, and 1440px, and Light, Dark, and System. There were no HTTP errors or horizontal overflow. Protected routes were exercised as a guest and redirect into the login flow; resident/admin authenticated screens were not visually checked without authorized test accounts.
- Verified desktop sidebar collapse to 76px, content spacing, persistence after reload, and no overflow; verified Light persists after reload and System resolves to this browser's dark OS preference. The mobile drawer opens, focuses within the dialog, and closes on Escape, backdrop click, and link tap.
- Browser inspection confirms reduced-transparency is enabled and glass surfaces become opaque; `backdrop-filter` is supported but intentionally inactive under that preference. Screenshots were inspected for the home page in Light desktop and login on a phone in Dark mode. Palette contrast values are recorded above; occupancy track and fill are at least 3:1 against adjacent surfaces and one another.