# Project status

## Current project state

- MUY RICO bilingual business-card website using Next.js 14 App Router, React 18, TypeScript, next-intl, and styled-components.
- Spanish and Russian homepages provide contact, location, and social links. Promotions are disabled.
- QR landing page tracks only sources listed in server-runtime `SCAN_SOURCES`; accepted identifiers are trimmed/lowercased. Tracking uses runtime `SCAN_BACKEND_URL` and the existing configurable timeout (3000ms default); the ten-second client navigation timer is unchanged. Runtime settings are documented in `docs/scan-tracking-configuration.md`.
- Repository audits are saved in `docs/CODEX_AUDIT.md` and `docs/scan-main-ui-analysis.md`. Home, Redirect, and 404 now share neutral styled-components presentation primitives. Lint, TypeScript, and standalone build passed; browser behavior remains to be verified. No tests or test script were found.

## Confirmed known issues

- `postinstall` invokes Husky, but Husky is not declared or installed.
- Both npm and Yarn lockfiles exist; the styled-components v5 resolution conflicts with the v6 dependency declaration.
- Localized routes nest duplicate `MainProvider` instances; each provider creates a new QueryClient on every render.
- Scan tracking remains best-effort direct `/redirect` → `postData` during server rendering. Skips/failures still return `null`; configured source membership validation is implemented; duplicate/bot controls remain unchanged. Timeout/response failures do not prove the backend did not commit a write. Backend controls and actual duplicate rates are unverified.
- `/api/scans` has no repository application callers and appears legacy; external usage must be checked before removal.
- The earlier homepage `/es` canonical finding is resolved in current source; sitemap locale/origin policy still needs a separate review.
- nginx and systemd deployment configuration is absent from this repository.

## Work currently in progress

- UI implementation and automated verification are complete. Browser/manual verification of Home, Redirect, and 404 is pending.

## Recommended next tasks

1. Verify clean installation and deployment reproducibility, including package-manager choice, Husky, build/start modes, and archive contents.
2. Verify Home appearance against its previous layout, Redirect/404 mobile layout and initial styles, ten-second scan navigation and home actions, locale/base-path routing, and multiple request hosts. Review provider/document architecture separately.
3. Verify active SCAN_SOURCES and existing backend URL/timeout settings in the running server environment, production log visibility, and unchanged fail-open navigation. Confirm duplicate/bot counting policy and legacy API consumers before proposing further controls or route removal.
4. Verify canonical URLs, sitemap entries, and reverse-proxy forwarded headers.
5. Review mobile accessibility and promotion behavior; run build and runtime checks when authorized.

## Recently completed

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
