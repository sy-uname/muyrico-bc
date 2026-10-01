The smallest suitable refactor is to share the main page’s **background, page container, glass panel, heading styles, and action-link styles**, while keeping scan tracking and route-specific layouts separate.

This is a source-code analysis. I did not modify files, install packages, run a build, or open the scan URL—which would record a scan. Visual behavior such as clipping or initial style flashing has not been reproduced in a browser.

**1. Exact routes and scan flow**

| Page/endpoint | Route and implementation |
|---|---|
| Main page | `src/app/[locale]/page.tsx` → `HomePage`. Default locale uses `<basePath>/`; other locales use `<basePath>/<locale>`. |
| Primary scan entry | `<basePath>/redirect?source=...` → `src/app/redirect/page.tsx` → `RedirectPage`. |
| Page reached afterward | The main page, through `router.push('/')` after ten seconds or the immediate home link. Next navigation handles the configured base path; locale middleware then handles the home request. |
| Related scan endpoint | `src/app/api/scans/route.ts`: returns JSON, not a visual page. |
| Separate scan result page | None found in the current source. |

In development, your example `/mrbc/redirect?source=something` follows this sequence:

1. Locale middleware excludes `/redirect`.
2. The [server page](/home/igor_vm/MUYRICO.WWW/BC/bc/src/app/redirect/page.tsx:27) extracts `source`, taking the first value if repeated.
3. It reads the request User-Agent and awaits `postData`.
4. [postData](/home/igor_vm/MUYRICO.WWW/BC/bc/src/app/actions.ts:24) posts `{source, device}` to `http://localhost:3016/scan`. Empty or `default` sources skip the POST.
5. The page renders the welcome screen regardless of the returned tracking result.
6. After the client component mounts, its ten-second timer navigates home. The button can navigate home earlier.

`/redirect` calls `postData` directly; it does **not** call `/api/scans`.

**2. Component hierarchies**

Main page:

```text
app/layout.tsx
└─ MainProvider
   ├─ QueryClientProvider
   └─ ThemeProvider
      └─ app/[locale]/layout.tsx
         └─ MainProvider (second instance)
            └─ MainLayout
               └─ html/body
                  ├─ NextIntlClientProvider
                  │  └─ StyledComponentsRegistry
                  │     └─ HomePage
                  │        └─ HomePageContainer
                  │           ├─ LogoContainer → ResponsiveImage
                  │           └─ ContentContainer
                  │              ├─ LocaleSwitcherSection → LocaleSwitcher
                  │              └─ ButtonsContainer
                  │                 ├─ Promotion section (currently disabled)
                  │                 ├─ Contact/location section
                  │                 └─ Social section
                  ├─ GoogleTagManager
                  └─ GoogleAnalytics
```

Scan flow:

```text
app/layout.tsx
└─ MainProvider
   ├─ QueryClientProvider
   └─ ThemeProvider
      └─ app/redirect/layout.tsx
         └─ html[lang=defaultLocale]
            ├─ body/main
            │  └─ app/redirect/page.tsx
            │     ├─ await postData(...)
            │     └─ Suspense ("Loading...")
            │        └─ RedirectPage
            │           └─ RedirectPageContainer
            │              ├─ RedirectPageTitle
            │              ├─ RedirectPageDescription
            │              └─ OfferActionButton
            └─ GoogleAnalytics

RedirectPage timer or button
└─ "/" → locale middleware → main-page tree
```

The separately defined `features/layout/RedirectLayout` and `RedirectProvider` are exported, but reference searches found no active composition of them in this flow. Editing those alone would not change `/redirect`.

**3. Confirmed UI inconsistencies**

The relevant styles are [HomePage.elements.ts](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.elements.ts:6) and [RedirectPage.elements.ts](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/redirect/page/RedirectPage/RedirectPage.elements.ts:9).

| Aspect | Main page | Scan welcome screen |
|---|---|---|
| Background | `bg.webp`, cover sizing, position `25% 0%` | No background image; global body background image is commented out |
| Outer container | Centered column, `min-height: 100vh` | Centered column, `min-height: calc(100vh - 80px - 251px)` |
| Outer padding | 30px | 20px |
| Content width | Panels have `width: 100%`, `max-width: 500px`; content wrapper has no explicit width | No explicit content maximum width |
| Spacing | Outer gap 20px; content gap 10px; section gap 15px | No container gap; description margin-bottom 20px; action margin-top 10px |
| Heading | Rubik, 18px, weight 700, uppercase gradient | Rubik, 100px, weight 500, solid orange |
| Body/labels | Nunito inherited; labels 16px, translucent white | Description is an `h3`, 30px, solid orange |
| Cards | Translucent glass panels, blur, shadows, 12px radius | No card/panel |
| Action link | Orange CTA in the disabled promotion panel | Same CSS values, separately implemented |
| Other links | Icon-based contacts/social links | Only a home action |
| Logo/images | Logo capped at 190px; 48px contact/social icons | No logo or images |
| Mobile adaptation | Icon rows wrap; panel width capped; no page-specific media queries | No media queries or responsive heading sizing |
| Loading | No route-specific loading UI found | Plain `Loading...` Suspense fallback |
| Tracking errors | Not applicable to home content | No user-facing error or result state |

The redirect container subtracts header/footer heights, but its actual layout contains neither corresponding header nor footer. That explains its different vertical placement.

The 100px heading creates a **potential mobile wrapping/clipping concern**. Global `overflow-x: hidden` can conceal overflow, but browser confirmation is still needed.

The Suspense boundary is returned **after** `await postData(...)`; its fallback does not surround the backend wait. Therefore, it is not a scan-progress indicator.

**4. Existing reuse and duplicated code**

Already shared:

- Root `MainProvider`, React Query provider, and theme provider.
- Global reset and Nunito/Rubik font definitions, imported through different files.
- styled-components infrastructure and compiler configuration.
- Google Analytics component and configured GA ID.
- Server-only origin helper for metadata.
- `postData`, shared by the redirect page and JSON API endpoint.

Not currently shared:

- Background/page shell.
- Logo.
- Glass panels and spacing primitives.
- Heading styles.
- Rendered action-link component.
- Internationalization provider and style registry.

Confirmed duplication:

- Home and redirect `OfferActionButton` have identical CSS, including hover/active colors, padding, radius, and margins. Their underlying link components differ.
- Redirect container/title/description/action styles also match the corresponding implementation in [not-found.tsx](/home/igor_vm/MUYRICO.WWW/BC/bc/src/app/not-found.tsx:11).
- Home and redirect have parallel document layouts, but their locale, provider, and analytics composition differs.

The 404 duplication is relevant evidence, but changing the 404 page is not necessary for this task.

**5. Why the pages differ**

The background belongs to `HomePageContainer`, not a shared layout or global body rule. `/redirect` never renders that component.

Its presentation instead follows the same large-heading, plain-background pattern as the 404 page. Although both routes receive a theme provider, their visible page styles largely use hardcoded values rather than theme tokens.

There is also a rendering-infrastructure difference: [MainLayout](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/layout/MainLayout/MainLayout.tsx:19) installs `StyledComponentsRegistry`; the [active redirect layout](/home/igor_vm/MUYRICO.WWW/BC/bc/src/app/redirect/layout.tsx:9) does not. Missing registry usage is confirmed; any resulting initial flash or hydration discrepancy remains unverified.

**6. Architectural differences to preserve**

These differences serve separate functional requirements or are outside this visual refactor:

- Both pages intentionally use dynamic rendering and request-derived metadata origins.
- The localized main page uses translation context; `/redirect` currently has default-locale metadata/document language and hardcoded visible copy.
- Main navigation uses the locale-aware project `Link`. Redirect navigation uses ordinary Next `Link` and `useRouter`.
- Main includes GTM and GA; redirect includes GA only.
- Scan tracking runs on the server before rendering. The timer runs on the client.
- `generateStaticParams()` enumerates locales and should remain.
- Standalone output and development `/mrbc` configuration should remain unchanged.

The updated homepage canonical implementation already omits the default-locale prefix using `routing.defaultLocale`. The older project-status finding about homepage `/es` canonicals is stale.

**7. Safe reuse and things to keep separate**

Safe presentation reuse:

- `HomePageContainer` background, alignment, padding, and minimum height.
- `ContentContainer` spacing.
- `ButtonsSection` glass-panel styling and 500px cap.
- `ButtonsSectionTitile` heading appearance, rendered as an `h1` on the scan screen.
- Existing action-link CSS.
- `ResponsiveImage` and the existing logo asset.

Extract these existing definitions into a small shared presentation module rather than making redirect depend on a home feature’s internal style file.

Two qualifications matter:

- **Keep link behavior separate from shared styling.** Moving both CTAs to the current home `Link` would introduce locale-aware behavior into a route without its provider. Share a CSS fragment while retaining each existing link implementation.
- **Do not reuse the complete `MainLayout`.** It would introduce GTM, locale context, and other changes. Add the existing style registry to the active redirect layout instead.

The core `Button` and `Typography` exist, but neither supplies the current homepage appearance: the button uses theme colors and larger padding; typography uses Roboto. Adopting them would require wider design-system changes.

Keep scan-specific tracking, timer, content, and navigation separate. Do not add the locale switcher, promotion countdown, contact grid, new scan-result states, or a new external logo link as part of this refactor. A noninteractive logo can provide branding without adding navigation behavior.

**8. Recommended refactoring and optional cleanup**

Recommended:

- Move the existing page-shell, content, panel, heading, logo-container styling, and CTA CSS into shared styled-components primitives.
- Update home to use them without changing its appearance.
- Compose redirect from the shared shell and one glass panel.
- Replace its oversized heading with the shared heading style.
- Retain a scan-specific description style using the existing Nunito font and suitable panel text contrast.
- Install the existing registry in the active redirect layout.
- Leave global CSS, route metadata, API calls, timer, localization, and analytics composition intact.

Optional cleanup, separately scoped:

- Remove verified unused imports and `ActionButtonContainer` in redirect files.
- Correct the visible `punto vienta` typo if copy changes are approved.
- Later consider sharing the duplicated 404 presentation.
- Address duplicate providers and QueryClient lifecycle separately.
- Revisit loading/error UX separately because it changes scan-flow behavior.

**9. Concrete proposed implementation sequence**

1. **Extract existing presentation primitives.**  
   Likely new file: `src/components/shared/BusinessCard/BusinessCard.elements.ts`. Use direct imports or a narrowly scoped export; include no server-only code.

2. **Adopt them on the main page while preserving current CSS values and behavior.**  
   Change:
   - `src/components/features/home/HomePage/HomePage.elements.ts`
   - `src/components/features/home/HomePage/HomePage.tsx` only as needed for composition/imports.

3. **Restyle the scan welcome screen using the shared shell, panel, heading, and CTA CSS.**  
   Change:
   - `src/components/features/redirect/page/RedirectPage/RedirectPage.tsx`
   - `src/components/features/redirect/page/RedirectPage/RedirectPage.elements.ts`

   Preserve the ten-second timer, `router.push('/')`, home link, visible copy, and cleanup behavior.

4. **Add SSR style collection to the active redirect layout.**  
   Change `src/app/redirect/layout.tsx`. Preserve its document language, `<main>`, and GA composition; do not substitute the unused `RedirectLayout`.

5. **Verify after approval and implementation.**  
   Run lint, TypeScript, build, and existing tests if present. Check direct loads and scan-to-home navigation at mobile/desktop widths, local base path and deployment mode, and multiple request hosts. Use controlled scan sources to verify tracking remains unchanged.

6. **Update `PROJECT_STATUS.md` after implementation and successful verification.**

No changes are needed to `actions.ts`, `/api/scans`, middleware, routing configuration, origin helper, translation files, global CSS, package versions, or standalone deployment settings for this visual refactor.
