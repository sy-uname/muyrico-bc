# Project

MUY RICO web application — business-card module.

## Stack

- Node.js 20
- TypeScript
- React 18
- Next.js 14 App Router
- next-intl
- styled-components

---

## Project workflow

### Project state

Before starting work, read `PROJECT_STATUS.md`.

Use it to understand:

- current project state;
- work in progress;
- known issues;
- pending tasks;
- recently completed work;
- previous architectural decisions.

After completing a significant task:

1. update `PROJECT_STATUS.md`;
2. move completed items to `Recently completed`;
3. update `Known issues`;
4. update `Next tasks`;
5. record important architectural decisions.

Do not remove historical decisions that are still relevant.

### Change approval

Before making significant architectural changes:

1. explain the problem;
2. propose the solution;
3. wait for approval.

Do not make unrelated architectural changes as part of another task.

### Verification

After modifications run:

```
npm run lint
npx tsc --noEmit
npm run build
```

If tests exist, run them too.

Do not report a task as complete if the relevant verification fails.

---

## General coding rules

- Preserve existing application behavior unless a behavior change is explicitly requested.
- Do not modify unrelated code.
- Prefer simple solutions over unnecessary abstractions.
- Do not add dependencies unless necessary.
- Do not change package versions without explaining why.
- Prefer existing project patterns, types, helpers, and conventions.
- Use named constants for repeated or semantically meaningful values instead of duplicating literals.
- Do not extract trivial values or widely accepted conventional literals into constants unless doing so improves readability or maintainability.

---

## TypeScript

- Keep strict typing.
- Avoid `any`.
- Prefer existing project types and helpers.
- Do not weaken TypeScript settings to bypass type errors.
- Fix the underlying type issue instead of suppressing it unless suppression is explicitly justified.

---

## Next.js

- This project uses the App Router.
- Do not use Pages Router APIs.
- Clearly distinguish Server Components and Client Components.
- Do not move server-only APIs into client code.
- Do not import server-only modules into Client Components.
- Be careful with static generation and dynamic rendering.
- Do not assume that all routes are intended to be statically rendered.

---

## Runtime environment

### Production environment

Production runs on Ubuntu with:

- nginx
- systemd
- Node.js 20

Do not assume Docker, containers, CI/CD, or another process manager unless such infrastructure is explicitly added to the project.

### Reverse proxy

Production is expected to run behind nginx.

nginx must preserve the original request host and protocol when proxying requests to Next.js.

The application relies on request information including:

```
Host
X-Forwarded-Host
X-Forwarded-Proto
```

Do not assume that the application has only one production hostname.

---

## Architecture decisions

### Multi-domain application origin

This application intentionally supports multiple domains from a single Next.js application instance.

Do not hardcode the hostname or origin of this business-card application when generating request-dependent URLs such as:

- metadata URLs;
- canonical URLs;
- other absolute URLs that must represent the host through which the current request was received.

For those URLs, use the current request host through the existing server-only origin helper.

This restriction does not apply to intentionally configured external URLs, including:

- the main MUY RICO website;
- social networks;
- third-party services;
- other resources whose hostname is intentionally fixed.

Do not replace request-derived application origin handling with a fixed `SITE_URL`, `BASE_URL`, or similar environment variable unless explicitly requested.

### Dynamic rendering

Dynamic rendering is intentional for routes that depend on request-specific information.

`src/helpers/getOrigin.ts` uses `next/headers` to determine the current origin from:

- `X-Forwarded-Host`;
- `Host`;
- `X-Forwarded-Proto`.

This helper is intentionally marked with:

```
import 'server-only'
```

`src/app/[locale]/page.tsx` is intentionally dynamic because its metadata must use the hostname of the current HTTP request.

`src/app/redirect/page.tsx` is intentionally dynamic because it depends on request-specific information, including:

- request headers;
- User-Agent;
- current request origin;
- request search parameters.

`export const dynamic = 'force-dynamic'` on these routes is intentional.

Do not remove it merely to make the routes statically rendered.

Do not report this dynamic rendering as an architectural problem by itself.

### `generateStaticParams()`

`generateStaticParams()` may still be used to enumerate supported locale parameters.

Its presence does not mean that the corresponding route is expected to be fully statically rendered.

Do not remove `generateStaticParams()` solely because a route also uses intentional dynamic rendering.

### Server/client boundary

`getCurrentOrigin()` is server-only.

Do not export it through a shared helper barrel that is imported by Client Components.

Import it directly from:

```
@helpers/getOrigin
```

Server-only modules must not be imported into Client Components.

Shared helper barrels such as `@helpers` must contain only code that is safe for every consumer that imports them.

### Locale URLs

The application uses:

```
localePrefix: 'as-needed'
```

Locale URL paths must be derived from the existing i18n routing configuration and application base-path configuration.

Do not hardcode locale identifiers or locale-specific paths when the same information is available from the routing configuration.

In particular:

- use `routing.defaultLocale` to determine whether a locale prefix must be omitted;
- use the current locale value supplied by the routing layer for non-default locale paths;
- use the configured application `basePath` instead of duplicating its literal value in URL-generation code;
- use `routing.locales` where the complete configured locale list is required.

The general path rule is:

```
default locale:
    <basePath>/

non-default locale:
    <basePath>/<locale>
```

When no application base path is configured, this naturally becomes:

```
default locale:
    /

non-default locale:
    /<locale>
```

For the current configuration, paths such as `/ru` or `/mrbc/ru` may be valid results, but they are examples only and must not be treated as hardcoded architectural constants.

Likewise, `/mrbc` is a current configuration value, not a permanent path that should be duplicated in application code.

Do not hardcode a default-locale path such as `/es`. Whether a locale is the default must be determined from `routing.defaultLocale`.

Sitemap locale paths must be generated from the same routing and base-path configuration and must follow the same locale-prefix rule.

The hostname strategy used by sitemap generation must remain consistent with the project's multi-domain SEO policy.

### Canonical URLs

Canonical URLs must:

- use the current request origin where the hostname must reflect the active domain;
- determine the default locale from the routing configuration;
- omit the locale prefix for the configured default locale;
- include the current locale prefix for configured non-default locales;
- respect the configured application base path;
- avoid duplicating locale or base-path literals that already exist in project configuration.

Do not replace request-derived canonical origins with a fixed production hostname unless explicitly requested.

---

## Audit rules

When reviewing or auditing this project:

- distinguish confirmed bugs from intentional architectural decisions;
- do not report intentional dynamic rendering as a defect unless it causes an actual build or runtime problem;
- do not recommend static rendering merely because it is theoretically possible;
- do not replace request-dependent behavior with static configuration without checking the multi-domain requirements above;
- do not assume that a warning about dynamic rendering automatically requires remediation;
- distinguish external fixed URLs from the request-derived origin of this application;
- verify actual usage before removing imports, helpers, routes, providers, or dependencies;
- do not classify code as unused solely from naming or directory structure without checking references.

Before recommending a change that contradicts an architectural decision in this file, explain the conflict explicitly.

---

## Scope discipline

When working on an audit item:

1. identify the specific problem;
2. confirm whether it is a real issue in the current code;
3. distinguish it from intentional behavior;
4. propose the smallest appropriate change;
5. avoid bundling unrelated cleanup into the same task.

If a finding is only a potential concern and has not been reproduced or confirmed, describe it as such rather than presenting it as a confirmed bug.