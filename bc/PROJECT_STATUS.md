# Project status

## Current project state

- MUY RICO bilingual business-card website using Next.js 14 App Router, React 18, TypeScript, next-intl, and styled-components.
- Spanish and Russian homepages provide contact, location, and social links. Promotions are disabled.
- QR landing page records scans through a separate service at `http://localhost:3016/scan`, then navigates home after ten seconds.
- Repository audit completed and saved in `docs/CODEX_AUDIT.md`. Read-only TypeScript and ESLint checks passed; build and runtime behavior were not verified. No tests or test script were found.

## Confirmed known issues

- `postinstall` invokes Husky, but Husky is not declared or installed.
- Both npm and Yarn lockfiles exist; the styled-components v5 resolution conflicts with the v6 dependency declaration.
- Localized routes nest duplicate `MainProvider` instances; each provider creates a new QueryClient on every render.
- Scan writes occur during page rendering and through a GET endpoint. The backend URL is hardcoded, there is no explicit timeout, and backend failures return `null` without an API error status.
- Canonical and sitemap URLs include `/es`, although Spanish uses an optional locale prefix.
- The active redirect layout omits the styled-components SSR registry used by localized pages.
- nginx and systemd deployment configuration is absent from this repository.

## Work currently in progress

- No implementation work is currently in progress. Audit findings await prioritization and validation.

## Recommended next tasks

1. Verify clean installation and deployment reproducibility, including package-manager choice, Husky, build/start modes, and archive contents.
2. Validate locale routing, `/mrbc`, document structure, provider behavior, 404 pages, and redirect styling.
3. Review scan tracking reliability, duplicate counting, input validation, backend failures, and timeout behavior.
4. Verify canonical URLs, sitemap entries, and reverse-proxy forwarded headers.
5. Review mobile accessibility and promotion behavior; run build and runtime checks when authorized.
