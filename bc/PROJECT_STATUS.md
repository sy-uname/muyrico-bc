# Project status

## Current project state

- MUY RICO bilingual business-card website using Next.js 15.5.27 App Router, React 19.3.0, next-intl 4.14.9, TypeScript, styled-components, npm, and standalone output.
- Spanish and Russian homepages provide contact, location, and social links. Promotions are disabled.
- QR landing page tracks only sources listed in server-runtime `SCAN_SOURCES`; accepted identifiers are trimmed/lowercased. Tracking uses runtime `SCAN_BACKEND_URL` and the existing configurable timeout (3000ms default); the ten-second client navigation timer is unchanged. Runtime settings are documented in `docs/scan-tracking-configuration.md`.
- Current frontend backlog is recorded in `docs/FRONTEND_AUDIT.md`; older repository/UI/scan audits remain historical references. Home, Redirect, and 404 share presentation primitives. Frontend findings #1 (accessible link names) and #2 (heading/landmark semantics) are implemented; lint, TypeScript, and build passed. Manual browser verification is pending.

## Confirmed known issues

- Shared CTA white-on-orange contrast is approximately 3.72:1; finding #3 remains open.
- Logo rendering discards intrinsic dimensions and uses a viewport-wide size hint despite its 190px cap; the background asset is large.
- Locale/message typing lacks effective next-intl AppConfig augmentation; invalid locale/message-key probes pass.
- Disabled promotion code retains a dynamic client environment lookup, a month-end deadline defect, and unencoded WhatsApp query text. Correctness fixes are needed before reactivation.
- Legacy UI/types/exports and unnecessary wrappers remain as documented in the frontend audit. 404 document composition is a runtime-verification candidate, not a confirmed browser defect.
- Scan tracking remains best-effort: timeouts do not prove a backend write failed. Duplicate/bot controls and backend behavior are outside the completed source-validation work.

## Work currently in progress

- No source implementation is currently in progress. Manual accessibility-tree, keyboard, and visual-parity checks for completed findings #1/#2 are pending.

## Recommended next tasks

1. Verify localized link names, Home main/h1/h2 structure, Redirect/404 paragraphs, keyboard navigation, and unchanged appearance in both locales. Use an isolated environment for scan-flow checks.
2. Address CTA contrast as a separate approved task; then locale/message typing and logo sizing/background optimization independently.
3. Follow the remaining execution order in `docs/FRONTEND_AUDIT.md`: small legacy cleanup, promotion correctness before enabling, measured client-composition simplification, and targeted 404 verification.
4. Verify runtime scan configuration/logging and browser behavior without generating real statistics solely for testing. Do not reopen completed migration/security/deployment tasks without new concrete evidence.

## Recently completed

- Fixed frontend audit #1: localized aria-label values on language-switcher and linked Home logo; decorative images retain empty alt text. Changed only the two components and Spanish/Russian message files.
- Fixed frontend audit #2: Home outer div now renders as main, an offscreen h1 reuses the existing localized metadata title, active section titles render as h2, and shared Redirect/404 descriptions render as p. Visible text, styles, routing, translations, and CTA contrast are unchanged.
- For both accessibility tasks, `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed; semantic-task whitespace checks and accessible-name message checks passed. Manual browser/accessibility-tree verification has not been performed.
- Current baseline includes completed Next.js 15 / React 19 / next-intl 4 migrations, styled-components and Link cleanup, React Query/demo removal, duplicate-provider removal, dependency/install-script review, scan investigation, SEO review, and deployment/script cleanup. Superseded historical known-issue entries were removed from the active backlog; these closed tasks are not reopened.

- Implemented runtime SCAN_SOURCES whitelist membership in `postData`: comma-separated items are trimmed/lowercased, empty items ignored, and incoming values normalized identically. Accepted POSTs carry the normalized source; unknown/removed sources log skipped/unknown_source and return null without calling the backend. Missing/empty lists track nothing and are not configuration errors. Existing empty/exact-default skips remain unchanged.
- Required source examples and additional runtime-list, empty-item, normalized payload, device, fail-open, and timeout checks passed with fully mocked fetch (no network/live scans). `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed. Backend URL/timeout, UI, navigation, locales, analytics, retries, and deployment were untouched.

- Hardened `postData` only: server-runtime SCAN_BACKEND_URL with the existing default, three-second fetch/JSON-body timeout with timer cleanup, and structured skipped/success/failure logs including stage/status/duration. Raw source/User-Agent context logging was removed.
- Preserved source selection/skipping, device categories, POST payload, returned JSON-or-null contract, and fail-open rendering. No retries, source validation, deduplication, rate limiting, UI, routing, analytics, or backend changes.
- Lint, TypeScript, and standalone build passed. Isolated mock-backend checks passed for success, HTTP/JSON/connection/config failures, slow headers/body, unchanged payloads/skips, one POST per attempt, runtime URL/default, and timer cleanup. No real scan service or redirect URL was requested.

- Completed source-only scan tracking analysis in `docs/scan-tracking-analysis.md`; no scan/application/backend URL was requested and no live tracking was tested. Runtime URL, timeout, and logging hardening is completed below; broader validation/counting proposals remain deferred.

- Extracted shared page shell/background, content spacing, 500px glass panels, gradient heading, logo container, message typography, and CTA CSS into `src/components/shared/BusinessCard/BusinessCard.elements.ts`.
- Home reuses its original visual values. Redirect and 404 compose the same foundation with noninteractive logos; duplicated containers, headings, descriptions, and CTA CSS were removed.
- Added the existing styled-components registry to the active redirect layout and 404 presentation.
- `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed. Browser checks and live tracking verification were not performed.

## Architectural decisions

- Shared presentation is neutral and client-safe; page-specific content and navigation remain separate. Home retains locale-aware links; Redirect/404 retain Next links. Scan POST logic, ten-second timer, routing, locales, analytics, dynamic rendering, request-derived metadata origin, and standalone configuration remain unchanged.

- Scan hardening should retain the direct server-to-backend flow; `/api/scans` is not part of the intended current path. Define visit/unique-scan counting semantics before introducing deduplication, bot exclusions, or idempotency.

- Scan backend configuration is server runtime only; the default remains the existing localhost service. The three-second budget bounds the awaited network/body work without changing source semantics or adding retries. Logs describe transport/response outcomes, not guaranteed database persistence.

- Active scan-source membership is the validation contract: SCAN_SOURCES is read at each eligible helper call, compared case-insensitively after trimming, and missing configuration means an empty set. Removed-source QR URLs continue rendering normally without recording statistics; no extra format restrictions are imposed.

- Accessibility fixes use existing localized messages and styled-components polymorphism. Home’s page heading is visually hidden to preserve layout; decorative images remain decorative when their parent link or visible text supplies the name.
