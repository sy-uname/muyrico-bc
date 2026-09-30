This is a small bilingual MUY RICO business-card website with contact links, social links, and QR scan tracking. Its main risks concern deployment consistency, tracking reliability, and layout/provider organization.

No files were modified and nothing was installed. `PROJECT_STATUS.md`, required by `AGENTS.md`, is missing.

**1. Application type**

The application presents MUY RICO’s location, telephone, WhatsApp, Telegram, Instagram, and Facebook links in Spanish and Russian. It also contains:

- A promotion panel and countdown, currently disabled.
- A QR landing page that records a scan and navigates home after ten seconds.
- Google Analytics and Google Tag Manager integration.

The principal UI is [HomePage.tsx](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/features/home/HomePage/HomePage.tsx:39).

**2. Architecture**

It uses Next.js App Router as both the frontend framework and a small server layer.

- `src/app`: routes, layouts, metadata, server action, and API endpoint.
- `src/components/features`: home, redirect, and layout components.
- `src/components/core`: reusable UI components.
- `src/providers`: React Query and theme contexts.
- `src/i18n` and `src/messages`: locale routing and translations.
- `src/styles`: themes, variants, and global CSS.
- `src/queries`: query utilities and apparently unused example user queries.

Server-rendered pages wrap client UI components. Scan tracking forwards requests to a separate local backend; this repository contains no database implementation.

**3. Main technologies and versions**

These versions match both `package-lock.json` and the installed packages:

| Technology | Version |
|---|---:|
| Node.js inspected locally | 20.17.0 |
| Next.js | 14.2.16 |
| React / React DOM | 18.2.0 |
| TypeScript | 5.6.3 |
| next-intl | 3.25.0 |
| styled-components | 6.1.13 |
| React Query | 3.39.3 |
| Sharp | 0.33.5 |
| `@next/third-parties` | 15.0.3 |
| ESLint / eslint-config-next | 8.57.1 / 14.2.16 |

TypeScript strict mode is enabled. Most dependency declarations use version ranges rather than exact versions.

**4. Entry points**

| Entry point | Purpose |
|---|---|
| `src/app/layout.tsx` | Shared provider wrapper |
| `src/app/[locale]/layout.tsx` | Localized layout |
| `src/app/[locale]/page.tsx` | Business-card homepage and metadata |
| `src/app/redirect/page.tsx` | Records a scan and renders the redirect screen |
| `src/app/api/scans/route.ts` | GET endpoint that records a scan |
| `src/middleware.ts` | Locale detection and routing |
| `src/app/sitemap.ts`, `robots.ts` | SEO endpoints |
| `src/app/not-found.tsx` | Custom 404 page |

Spanish is the default locale, with prefixes configured as `as-needed`: the intended public home routes are `/` and `/ru`, plus `/mrbc` in local mode.

**5. Build and deployment configuration**

[package.json](/home/igor_vm/MUYRICO.WWW/BC/bc/package.json:5) defines two distinct configurations:

| Mode | Build / start | Address configuration |
|---|---|---|
| Local | `npm run build` / `npm start` | `http://webserver.local/mrbc` |
| Deployment | `npm run deploy` / `npm run start_deploy` | `https://bc.muyricocr.com` |

`DEPLOY=true` controls the base path, domains, and analytics IDs through [next.config.js](/home/igor_vm/MUYRICO.WWW/BC/bc/next.config.js:6).

`deploypack` builds and archives `.next`, `node_modules`, `public`, `package.json`, and `next.config.js`. It packages a full Node installation rather than using standalone output.

The project instructions specify Ubuntu, nginx, systemd, and Node.js 20. I found no nginx configuration, systemd unit, Dockerfile, or CI workflow in the repository, so actual production configuration cannot be verified here.

**6. Important environment dependencies**

- **Scan service:** hardcoded `http://localhost:3016/scan`; it must be reachable from the Next.js server.
- **Reverse proxy:** metadata depends on `Host`, `X-Forwarded-Host`, and `X-Forwarded-Proto`.
- **Build configuration:** domains, links, promotion state, and analytics IDs are embedded through Next’s `env` configuration.
- **Browser services:** Google Fonts, Analytics, and Tag Manager.
- **Native dependencies:** packaged `node_modules` includes Sharp, so build and deployment platforms must be compatible.
- **Local DNS/proxy:** local links assume `webserver.local` and `/mrbc`.

**7. Potential architectural problems**

- **Document structure is distributed across nested layouts.** The root layout supplies providers but no `<html>` or `<body>`; localized layouts, redirect layouts, and the 404 page supply their own document elements. This warrants checking initial rendering, navigation, and error handling. See [root layout](/home/igor_vm/MUYRICO.WWW/BC/bc/src/app/layout.tsx:4).
- **Providers are duplicated.** Localized pages receive `MainProvider` at both root and locale levels, creating separate theme and query contexts.
- **QueryClient is recreated on every provider render.** This can discard cached query state when the provider rerenders. See [MainProvider.tsx](/home/igor_vm/MUYRICO.WWW/BC/bc/src/providers/MainProvider/MainProvider.tsx:8).
- **Scan writes occur during page rendering and GET requests.** Reloads, crawlers, retries, or prefetching can potentially inflate counts.
- **Request headers make homepage metadata request-dependent.** `generateStaticParams` exists, but metadata calls `headers()`, so it should not be assumed that localized pages are fully static.
- **Unused infrastructure adds complexity.** Example JSONPlaceholder queries, `RedirectProvider`, and a separate `RedirectLayout` appear unused.

**8. Potential bugs or suspicious code**

| Finding | Likely consequence |
|---|---|
| `postinstall` runs `husky install`, but Husky is absent from dependencies and installed packages | A clean installation can fail at the lifecycle script. |
| `resolutions.styled-components` requests v5 while dependencies request v6; both npm and Yarn lockfiles exist | Installation behavior may vary by package manager. |
| Normal `build` and `start` explicitly select local mode | Using conventional production commands can produce local URLs and `/mrbc` routing. |
| Scan backend is awaited before rendering, without an explicit timeout | A slow backend delays the page and the start of the client redirect timer. |
| Backend failures become `null`, while `/api/scans` still responds successfully | Callers cannot reliably distinguish successful tracking from failure. |
| Scan source is accepted without validation or visible application-level rate limiting | Tracking data can be polluted by arbitrary requests. |
| Dynamic `process.env[varName]` access is used in client code | Promotion configuration may not be inlined correctly when enabled. |
| Canonical and sitemap links use `/es`, despite default-locale prefix being `as-needed` | SEO links may point to redirecting URLs. |
| Redirect route omits the styled-components SSR registry | Its initial styles may flash or differ from localized pages. |

Relevant tracking code is in [actions.ts](/home/igor_vm/MUYRICO.WWW/BC/bc/src/app/actions.ts:24) and [scan route](/home/igor_vm/MUYRICO.WWW/BC/bc/src/app/api/scans/route.ts:6).

Additional concerns:

- [getOrigin.ts](/home/igor_vm/MUYRICO.WWW/BC/bc/src/helpers/getOrigin.ts:4) trusts forwarded headers and defaults to HTTPS, even for local HTTP requests. Correctness depends on proxy configuration.
- The shared [Link component](/home/igor_vm/MUYRICO.WWW/BC/bc/src/components/core/Link/Link.tsx:7) creates navigation helpers during rendering and does not share the configured `localePrefix`.
- Promotion deadlines use the visitor’s timezone and can select an already-expired deadline on the last day after 18:00.
- Promotion WhatsApp text is inserted without explicit query-value encoding.
- Locale buttons have empty image alternatives and no visible accessible names.
- `Input` uses hooks without its own client directive; it depends on being imported beneath a client boundary.
- GTM and direct GA are both loaded; duplicate analytics events are possible depending on the external GTM configuration.
- Explicit `any` usage remains despite strict TypeScript settings.

**9. Recommended next analysis**

Prioritize:

1. **Deployment reproducibility:** package-manager choice, missing Husky, archive contents, and matching build/start modes.
2. **Route and rendering behavior:** locale switching, `/mrbc`, 404 pages, document structure, and redirect styles.
3. **Scan tracking reliability:** backend contract, slow/unavailable service behavior, duplicate counts, validation, and response semantics.
4. **SEO and proxy configuration:** canonical URLs, sitemap entries, and forwarded-header handling.
5. **Mobile accessibility and promotion behavior.**

Read-only TypeScript validation and ESLint both passed. No test files or test script were found. A build was not run because it would write generated files; runtime and deployment findings remain unverified.
