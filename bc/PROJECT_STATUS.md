# Project status

## Current project state

- MUY RICO bilingual business-card website using Next.js 14 App Router, React 18, TypeScript, next-intl, and styled-components.
- Spanish and Russian homepages provide contact, location, and social links. Promotions are disabled.
- QR landing page records scans through a separate service at `http://localhost:3016/scan`, then navigates home after ten seconds.
- Repository audits are saved in `docs/CODEX_AUDIT.md` and `docs/scan-main-ui-analysis.md`. Home, Redirect, and 404 now share neutral styled-components presentation primitives. Lint, TypeScript, and standalone build passed; browser behavior remains to be verified. No tests or test script were found.

## Confirmed known issues

- `postinstall` invokes Husky, but Husky is not declared or installed.
- Both npm and Yarn lockfiles exist; the styled-components v5 resolution conflicts with the v6 dependency declaration.
- Localized routes nest duplicate `MainProvider` instances; each provider creates a new QueryClient on every render.
- Scan writes occur during page rendering and through a GET endpoint. The backend URL is hardcoded, there is no explicit timeout, and backend failures return `null` without an API error status.
- The earlier homepage `/es` canonical finding is resolved in current source; sitemap locale/origin policy still needs a separate review.
- nginx and systemd deployment configuration is absent from this repository.

## Work currently in progress

- UI implementation and automated verification are complete. Browser/manual verification of Home, Redirect, and 404 is pending.

## Recommended next tasks

1. Verify clean installation and deployment reproducibility, including package-manager choice, Husky, build/start modes, and archive contents.
2. Verify Home appearance against its previous layout, Redirect/404 mobile layout and initial styles, ten-second scan navigation and home actions, locale/base-path routing, and multiple request hosts. Review provider/document architecture separately.
3. Review scan tracking reliability, duplicate counting, input validation, backend failures, and timeout behavior.
4. Verify canonical URLs, sitemap entries, and reverse-proxy forwarded headers.
5. Review mobile accessibility and promotion behavior; run build and runtime checks when authorized.

## Recently completed

- Extracted shared page shell/background, content spacing, 500px glass panels, gradient heading, logo container, message typography, and CTA CSS into `src/components/shared/BusinessCard/BusinessCard.elements.ts`.
- Home reuses its original visual values. Redirect and 404 compose the same foundation with noninteractive logos; duplicated containers, headings, descriptions, and CTA CSS were removed.
- Added the existing styled-components registry to the active redirect layout and 404 presentation.
- `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed. Browser checks and live tracking verification were not performed.

## Architectural decisions

- Shared presentation is neutral and client-safe; page-specific content and navigation remain separate. Home retains locale-aware links; Redirect/404 retain Next links. Scan POST logic, ten-second timer, routing, locales, analytics, dynamic rendering, request-derived metadata origin, and standalone configuration remain unchanged.
