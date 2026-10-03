### Executive summary

The current frontend is small, functional, and substantially cleaner than the historical audit describes. Installed versions match the stated baseline: Next.js **15.5.27**, React **19.3.0**, next-intl **4.14.9**, and styled-components **6.5.3**.

**No P0 critical issue was identified.** The most valuable next actions are:

1. Give language links and the linked logo accessible names.
2. Correct heading semantics and action-link contrast.
3. Improve logo sizing and reduce the large background asset.
4. Restore effective locale/message-key typing.
5. Simplify dormant promotion code and remove verified legacy remnants.

The migration, scan hardening, whitelist, SEO, dependency, and deployment work was not reopened. Intentional request-derived origins and dynamic rendering remain appropriate.

Verification performed:

- TypeScript passed with incremental output disabled.
- ESLint passed with caching disabled.
- In-memory type and date probes exposed specific issues below.
- Existing client output was inspected; no build was run because it would overwrite generated output and prepare standalone files.
- Working tree remained clean. No packages, application files, documentation, or configuration were changed. No scan URLs were requested.

### P0 — Critical

None identified within this source/static audit. Production behavior, external services, and browser performance were not tested.

### P1 — Important

**1. Active navigation links have no accessible names**

- **Files/code:** [LocaleSwitcher.tsx:21](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/shared/LocaleSwitcher/LocaleSwitcher.tsx:21), [HomePage.tsx:87](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.tsx:87), [ResponsiveImage.tsx:7](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/core/ResponsiveImage/ResponsiveImage.tsx:7).
- **Problem:** Language links contain only images with `alt=""`, without link labels. The homepage’s linked logo also receives the empty default alternative text.
- **Impact:** Screen-reader users cannot identify the language destinations or the logo link’s purpose.
- **Minimal fix:** Add localized accessible names to language links and a meaningful name to the logo link. Retain empty alternatives for decorative contact icons that already accompany visible text.
- **Change risk:** Low; does not require visual or routing changes.
- **Timing:** Handle now. Verify keyboard navigation and the browser accessibility tree.

### P2 — Improvement

**2. Page content lacks appropriate heading and landmark semantics**

- **Files/code:** [HomePage.tsx:86](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.tsx:86), [HomePage.elements.ts:49](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.elements.ts:49), [BusinessCard.elements.ts:48](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/shared/BusinessCard/BusinessCard.elements.ts:48), [BusinessCard.elements.ts:98](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/shared/BusinessCard/BusinessCard.elements.ts:98).
- **Problem:** Home section titles render as `div` elements, and Home has no main content landmark or page heading. Redirect/404 descriptive sentences render as `h3` beneath an `h1`.
- **Impact:** Visual hierarchy is unavailable or misleading to assistive technology.
- **Minimal fix:** Use existing polymorphic styling to render genuine section headings; render descriptions as paragraphs. Add an appropriate Home landmark/page heading without changing its appearance.
- **Change risk:** Low–medium: browser heading defaults must remain overridden by existing styles.
- **Timing:** Next accessibility task.

**3. Shared CTA text has insufficient default contrast**

- **Files/code:** [BusinessCard.elements.ts:78](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/shared/BusinessCard/BusinessCard.elements.ts:78).
- **Problem:** White text against `#ed4c1a` has a calculated contrast ratio of approximately **3.72:1**, below the 4.5:1 criterion for normal-size text.
- **Impact:** The active Redirect/404 home actions are harder to read for users with reduced vision.
- **Minimal fix:** Adjust the default CTA background enough to meet normal-text contrast while retaining the orange visual identity.
- **Change risk:** Low technically; requires a small approved visual change.
- **Timing:** Address with accessibility work. Other text over the background image needs browser measurement; its contrast is not established by this calculation.

**4. Logo rendering discards intrinsic dimensions; background is large**

- **Files/code:** [ResponsiveImage.tsx:9](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/core/ResponsiveImage/ResponsiveImage.tsx:9), [HomePage.tsx:88](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.tsx:88), [BusinessCard.elements.ts:15](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/shared/BusinessCard/BusinessCard.elements.ts:15).
- **Problem:** The image wrapper forces zero dimensions and `sizes="100vw"`, although the logo is capped at 190px. Callers pass `logo.src`, losing static-import dimension information. The CSS background asset is approximately **1.20 MB**.
- **Impact:** Logo sizing does not communicate its real display size to image selection, and space is not reliably reserved by its dimensions. The background adds substantial transfer cost on mobile connections.
- **Minimal fix:** Preserve logo aspect ratio/intrinsic dimensions and use a size hint matching its container. Separately optimize the background asset with visual comparison.
- **Change risk:** Medium: preserve the existing crop, quality, and layout. Do not assume the original 1.75 MB logo is transferred unchanged—Next image optimization is already used.
- **Timing:** After accessibility fixes. Confirm layout shift and image requests in a browser before broader optimization.

**5. Locale and translation declarations do not provide the intended type protection**

- **Files/code:** [global.t.ts:4](/home/igor_vm/MUYRICO.WWW/BC/bc/global.t.ts:4), [routing.ts:4](/home/igor_vm/MUYRICO.WWW/BC/bc/src/i18n/routing.ts:4), [routing.ts:17](/home/igor_vm/MUYRICO.WWW/BC/bc/src/i18n/routing.ts:17), [request.ts:7](/home/igor_vm/MUYRICO.WWW/BC/bc/src/i18n/request.ts:7), [MainLayout.tsx:13](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/layout/MainLayout/MainLayout.tsx:13).
- **Problem:** The legacy global `IntlMessages` declaration does not populate next-intl 4’s `AppConfig`. The locale array also widens to strings. An in-memory TypeScript probe accepted both an unsupported locale and `t('not-a-real-message-key')` without diagnostics.
- **Impact:** Translation typos and invalid locale values escape compile-time checking. Existing `as any` casts further conceal validation assumptions.
- **Minimal fix:** Add narrowly scoped `AppConfig` augmentation, preserve literal locale types, and use the existing library’s locale-validation helper where appropriate.
- **Change risk:** Low–medium: stronger typing may expose previously hidden mistakes.
- **Timing:** Soon. This is a newly demonstrated typing gap, not a request to repeat the migration.

**6. Promotion configuration is read through a dynamic client environment lookup**

- **Files/code:** [getBlEnv.ts:1](/home/igor_vm/MUYRICO.WWW/BC/bc/src/helpers/getBlEnv.ts:1), [HomePage.tsx:42](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.tsx:42), [next.config.js:23](/home/igor_vm/MUYRICO.WWW/BC/bc/next.config.js:23).
- **Problem:** `process.env[varName]` is used for a client feature flag. Existing compiled client output retains the dynamic lookup rather than a substituted configuration value.
- **Impact:** Changing the build configuration to enable promotions does not reliably enable the client UI; server/client behavior can differ.
- **Minimal fix:** Use a direct reference to the configured flag or pass an explicit boolean from server composition.
- **Change risk:** Low. Promotions are currently disabled, so this is not an active production outage.
- **Timing:** Before enabling promotions. No runtime/deployment redesign is needed.

**7. Dormant promotion logic has deadline and URL-construction defects**

- **Files/code:** [HomePage.tsx:64](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.tsx:64), [HomePage.tsx:105](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.tsx:105).
- **Problem:** On the last day of a month after 18:00, the deadline function returns that day at 18:00—already expired. A deterministic probe reproduced this. Deadline calculation uses the visitor’s timezone. WhatsApp message text is inserted without query-value encoding.
- **Impact:** When enabled, promotions can immediately disappear at a month boundary; future text containing query delimiters can produce the wrong message.
- **Minimal fix:** Define the intended deadline/timezone policy, fix rollover accordingly, and encode the message using URL/query utilities.
- **Change risk:** Medium for deadline changes because the intended business schedule must be confirmed; low for encoding.
- **Timing:** Before enabling promotions. Do not change disabled-feature behavior speculatively.

**8. Home hydrates mostly static content because promotion logic owns the whole component**

- **Files/code:** [HomePage.tsx:1](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.tsx:1), [HomePage.tsx:43](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.tsx:43), [HomePage.tsx:60](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.tsx:60).
- **Problem:** Promotion state/date calculation and an effect run even when promotions are disabled. They force the entire feature composition into a client component.
- **Impact:** Unnecessary hydration and a state update on a page predominantly containing fixed links and images.
- **Minimal fix:** Isolate promotion behavior into a small client component. Evaluate server composition of the remaining content afterward; retain client boundaries required by styled-components and the locale switcher.
- **Change risk:** Medium: translation context and SSR styling must be preserved.
- **Timing:** Later, alongside promotion simplification. No bundle-size improvement is quantified yet, and a blanket conversion to Server Components is not justified.

**9. 404 document ownership needs targeted runtime verification**

- **Files/code:** [app/layout.tsx:4](/home/igor_vm/MUYRICO.WWW/BC/bc/src/app/layout.tsx:4), [MainLayout.tsx:20](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/layout/MainLayout/MainLayout.tsx:20), [not-found.tsx:27](/home/igor_vm/MUYRICO.WWW/BC/bc/src/app/not-found.tsx:27).
- **Problem:** Document elements are supplied by route layouts, while the root not-found component supplies another complete document. That is potentially problematic when the not-found UI is rendered inside an existing localized layout.
- **Impact:** Possible nested document elements, wrong language ownership, or hydration warnings on particular 404 paths.
- **Minimal fix:** First reproduce top-level and locale-prefixed 404 behavior. Change document ownership only if the actual composition is defective.
- **Change risk:** Medium–high for layout restructuring; it would require a separate proposal and architectural approval.
- **Timing:** Investigate soon; do not refactor based on this source concern alone. No browser defect was confirmed.

### P3 — Cleanup / optional

**10. Verified legacy remnants and unused imports remain**

Repository searches found these candidates:

| Candidate | Evidence | Classification |
|---|---|---|
| `features/layout/RedirectLayout/*` | Only its own implementation and local barrel reference it; the feature layout barrel exports only MainLayout | Definitely unused in current application |
| `providers/RedirectProvider/*` | Only local implementation/type/barrel references; provider barrel excludes it | Definitely unused in current application |
| `ResponsiveImage.elements.ts:5` | `ImageContainer` has no consumer | Definitely unused |
| `queries/keys.ts:1`, `queries/index.ts` | No application consumer of `QueryKeys` or the query barrel | Definitely unused |
| `types/user.ts:1` | `User` is only declared and re-exported | Definitely unused |
| `RedirectPage.types.ts:1` | Imported but never used; RedirectPage takes no props | Definitely unused |
| `styles/globals.css.save` | No import/reference found | Probably an obsolete backup |
| Input, Button, Highlight, Typography; Loader through Button | No active route/feature renders them; some remain barrel-exported | Unused by active pages; retention intent needs confirmation |

Additional exact references:

- [RedirectPage.tsx:3](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/redirect/page/RedirectPage/RedirectPage.tsx:3): unused `useState`, `useTranslations`, `redirect`, `useSearchParams`, and `RedirectPageProps`.
- [HomePage.tsx:144](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.tsx:144): commented information section; associated imports and URLs have no active consumer.
- [next.config.js:29](/home/igor_vm/MUYRICO.WWW/BC/bc/next.config.js:29): `ourNameOut` has no consumer.

**Impact:** Confusing architecture and unnecessary maintenance surface; their runtime bundle cost is not established merely from barrel exports.  
**Minimal fix:** Remove clearly unused remnants in small groups; decide whether unrendered core widgets are intended reusable assets first.  
**Risk/timing:** Low for isolated remnants; later. No remaining legacy HTTP route was found requiring external-consumer verification.

**11. Unused core widgets contain latent defects**

- **Files/code:** [Input.tsx:1](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/core/Input/Input.tsx:1), [Button.types.ts:28](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/core/Button/Button.types.ts:28), [Button.elements.ts:13](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/core/Button/Button.elements.ts:13), [button-variants.ts:36](/home/igor_vm/MUYRICO.WWW/BC/bc/src/styles/button-variants.ts:36), [typography-variants.ts:15](/home/igor_vm/MUYRICO.WWW/BC/bc/src/styles/typography-variants.ts:15).
- **Problem:** Input uses hooks without its own client boundary and has no associated label; Button mixes button props with `HTMLLinkElement` anchor attributes, removes outlines without a replacement, and selects loader colors opposite to its disabled state. Typography’s `Record<string, …>` makes arbitrary variant names type-valid, and it references a font not loaded by global CSS.
- **Impact:** These are dormant defects, not active-page failures.
- **Minimal fix:** Prefer removing unwanted widgets. If retained for reuse, fix their specific contracts before adoption.
- **Change risk:** Low when unused; medium if external usage exists.
- **Timing:** Later. Do not modernize an unused design system wholesale.

**12. Redundant directives, boundaries, and wrapper abstractions can be simplified**

- **Files/code:** [redirect/layout.tsx:1](/home/igor_vm/MUYRICO.WWW/BC/bc/src/app/redirect/layout.tsx:1), [redirect/page.tsx:39](/home/igor_vm/MUYRICO.WWW/BC/bc/src/app/redirect/page.tsx:39), [MainProvider.tsx:6](/home/igor_vm/MUYRICO.WWW/BC/bc/src/providers/MainProvider/MainProvider.tsx:6), [ThemeProvider.tsx:19](/home/igor_vm/MUYRICO.WWW/BC/bc/src/providers/ThemeProvider/ThemeProvider.tsx:19).
- **Problem:** The layout uses an action directive although it is already a Server Component. Suspense wraps a component with no active suspending hook and appears only after tracking finishes. MainProvider is now a simple ThemeProvider wrapper; no active page invokes `toggleTheme`.
- **Impact:** Unclear responsibilities and misleading loading expectations, rather than a demonstrated reliability failure.
- **Minimal fix:** Remove unnecessary directive/boundary after checking behavior. Consider simplifying unused theme-switch state independently.
- **Change risk:** Low–medium. Keep styled-components providers/registry intact; client providers do not automatically turn passed server children into Client Components.
- **Timing:** Later. Redirect’s navigation effect legitimately needs a client boundary, and its timer cleanup is correct.

**13. Project documentation still describes closed problems as current**

- **Files/code:** `AGENTS.md` stack section; `PROJECT_STATUS.md` current state and known issues.
- **Problem:** Documentation still names Next 14/React 18, duplicate QueryClient providers, Husky, a v5 resolution, and the legacy scan route despite current source removing them.
- **Impact:** Future work can reopen completed tasks or target nonexistent problems.
- **Minimal fix:** Reconcile current-state sections with verified source while preserving historical decisions.
- **Change risk:** Low; changing architectural instructions needs owner review.
- **Timing:** Soon, as a documentation-only task. No files were updated during this audit.

### Configuration and boundary conclusions

These reviewed areas do **not** warrant new backlog items:

- `basePath`, `baseSrvPath`, and deployment mode remain build-time settings.
- Main-site/social URLs are intentionally fixed external destinations; they do not violate multi-domain application-origin handling.
- Analytics IDs and public brand/link values are not secrets. Their presence in client output is not a security defect.
- Scan URL, timeout, and source list remain server-runtime configuration.
- `getCurrentOrigin()` is server-only, directly imported, and absent from the shared helper barrel.
- Next.js 15 `headers()`, route `params`, and `searchParams` are awaited in the active code inspected.
- No reason was found to remove intentional dynamic rendering or `generateStaticParams()`.
- Shared presentation is already reused across Home, Redirect, and 404. Separate locale-aware and ordinary Next links remain functionally justified.
- No active duplicate tracking call, uncleaned timer/listener, or guaranteed repeated translation fetch was established.
- No current source leak of server-only utilities into Client Components was found.

### Recommended execution order

1. **Accessible navigation names.**  
   Change only language/linked-logo labeling. Verify lint, TypeScript, build, keyboard navigation, and accessibility-tree names.

2. **Heading semantics and CTA contrast.**  
   Preserve appearance apart from the necessary contrast adjustment. Verify automated checks, screen-reader heading/landmark navigation, and both locales at mobile widths.

3. **Effective translation/locale typing.**  
   Add focused declarations and remove relevant casts. Verify that deliberately invalid locale/message-key probes fail, then lint, TypeScript, build, and locale switching.

4. **Logo sizing, then background optimization as separate tasks.**  
   Verify layout stability, network image sizes, visual parity, slow-network loading, and automated checks. Avoid making asset and layout changes inseparable.

5. **Small legacy-remnant cleanup.**  
   Start with orphan providers/layouts, unused types/exports, and imports. Verify reference searches, lint, TypeScript, build, and basic Home/Redirect/404 rendering.

6. **Promotion correctness before reactivation.**  
   Fix direct flag access, confirm deadline policy, test month boundaries/timezones and encoded WhatsApp text. Keep production promotions disabled during testing.

7. **Optional promotion/client-composition simplification.**  
   Proceed only after measuring a benefit. Verify SSR styling, hydration, both locales, and production bundle behavior.

8. **Targeted 404 composition investigation.**  
   Test top-level and locale-prefixed nonexistent paths through direct loads and client navigation; inspect status, document structure, language, and hydration warnings. A layout fix needs a separate proposal if confirmed.

9. **Refresh current project documentation.**  
   Preserve historical decisions and record the verified baseline/backlog.

For browser tests involving Redirect, use an isolated environment with no active scan sources or a mock backend. Do not generate real statistics solely to verify frontend changes.
