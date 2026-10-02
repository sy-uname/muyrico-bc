# Scan tracking analysis

The current flow is best-effort tracking of eligible visits to `/redirect`, not proof of a physical QR scan and not an exactly-once recording system. Preserve the direct `/redirect` → `postData` → backend `/scan` architecture. The smallest useful improvements are a bounded backend wait, server-only endpoint configuration, runtime source validation based on existing QR values, and a clear internal result/logging contract. Deduplication and rate limiting need a counting policy and runtime evidence before implementation.

## Scope and evidence

Source inspected: Next.js 14.2.16 / React 18.2.0 application code, installed Next fetch/request code, routing, middleware, robots/sitemap, configuration, and repository references. No application URL or backend URL was requested. No live scans were recorded by this analysis. No packages were installed, no application source was modified, and no build or runtime test was run. Only this report and the related project-status update are authorized outputs.

The backend implementation, database schema, nginx configuration, systemd environment, access logs, and external consumers are not present in the inspected repository. Backend persistence, validation, idempotency, and request retry behavior therefore remain unknown.

## Complete current flow

1. The development URL is `http://webserver.local/mrbc/redirect?source=something`. `/mrbc` comes from configured `basePath`; it is not part of a separate scan route or a constant to duplicate in source.
2. [Middleware](../src/middleware.ts#L7) excludes `/redirect` and API routes from locale middleware. Tracking does not run in middleware.
3. [The redirect server page](../src/app/redirect/page.tsx#L1) intentionally declares `dynamic = 'force-dynamic'`. Metadata uses the default locale and the server-only request-derived origin helper. Metadata itself does not record scans.
4. In [Page](../src/app/redirect/page.tsx#L27), `searchParams.source` is normalized to the first value if it is an array, otherwise to its value or an empty string. The request User-Agent defaults to `unknown`.
5. `await postData({ source, userAgent })` executes before returning the page JSX.
6. [postData](../src/app/actions.ts#L24) logs the supplied context. It skips absent/empty sources and the exact string `default`.
7. It classifies the User-Agent and POSTs JSON `{ source, device }` to `http://localhost:3016/scan`, with `Content-Type: application/json`. It sends no browser IP, request hostname, event ID, idempotency key, or original User-Agent in the backend payload. The source value is JSON data; it does not select the destination URL.
8. For a non-2xx response it logs the HTTP status and returns `null`. For a 2xx response it reads and returns JSON. Fetch or JSON parsing exceptions are logged and return `null`.
9. The page ignores that result and returns Suspense wrapping the client RedirectPage. No success/failure result is shown.
10. [RedirectPage](../src/components/features/redirect/page/RedirectPage/RedirectPage.tsx#L21) performs no tracking call. It starts a ten-second timer after mounting and retains the immediate home link. Both navigate to `/`; Next handles the configured base path and the home request enters existing locale routing.
11. Navigation to home does not call `postData`. Google Analytics remains a separate tracking system, not a substitute for or participant in the backend scan POST.

**Exactly when a record is persisted cannot be established here.** The confirmed event is a POST attempt when an eligible server-page execution reaches `postData`. Persistence depends on the backend. Successful persistence can precede a failed/invalid response, and a successfully displayed page does not imply successful persistence.

## Confirmed problems and implementation limitations

### Backend wait is coupled to page rendering

The server awaits the full fetch and JSON response body before returning the welcome screen. There is no explicit application timeout or cancellation signal. Platform/network defaults may eventually terminate a request, but there is no project-defined latency budget.

A connection failure or non-2xx response is caught and the page can continue. A slow connection, response headers, or response body delays the page and the start of the client's ten-second timer. The effective time from URL opening to home navigation is backend/render/hydration latency plus the timer, not simply ten seconds.

### Failure states are indistinguishable to the caller

`null` covers intentional skipping, connection failures, non-2xx responses, and invalid/empty JSON. A JSON `null` success response also returns `null`. JSON results have no declared runtime schema and no explicit result type. The redirect page discards every result.

Failures are **not completely silent**: non-2xx statuses use `console.error`, exceptions use `console.log`, and every call logs context. However, there is no clear typed outcome, duration measurement, or demonstrated production monitoring. Raw source and User-Agent values are logged before validation. nginx/systemd log collection is unverified.

A backend returning 204 or a valid non-JSON success response is treated as a parsing failure. Whether that conflicts with the actual service contract requires verification. A committed write followed by a lost or malformed response is an ambiguous outcome, not proof that nothing was recorded.

### Endpoint is hardcoded

[getServerDBURL](../src/app/actions.ts#L3) always returns `http://localhost:3016/scan`. Neither `DEPLOY` nor existing Next configuration changes it. The separate Node application runs on port 3014 in current start scripts.

This is acceptable for a co-located service, but prevents choosing a test service or another endpoint without editing code. `localhost` IPv4/IPv6 resolution and backend bind address must agree; their actual compatibility is unverified.

Recommend a server-runtime `SCAN_BACKEND_URL` read directly in server code, retaining the existing URL as the compatibility default. Do not put it in `next.config.js`'s client-inlined `env`, do not prefix it `NEXT_PUBLIC_`, and do not derive it from the incoming domain. The fixed backend service destination is distinct from intentional request-derived application metadata origins. No standalone/deployment configuration change is necessary; environment provisioning can be handled separately by the existing runtime operator.

### Source validation is absent

Current input behavior:

| Input | Current outcome |
|---|---|
| No source, `?source`, or `?source=` | Skip tracking; still render welcome screen |
| `source=default` | Skip tracking |
| `source=DEFAULT` or `source=Default` | Attempt POST |
| Whitespace-only source | Attempt POST; no trimming |
| Leading/trailing whitespace | Forward unchanged |
| Repeated source parameters | First value wins; later values are ignored |
| First source empty, later source valid | Skip tracking |
| Arbitrary nonempty string | Forward unchanged |
| Long string, Unicode, punctuation, decoded control characters | No application-level length/format rejection |

The source is not rendered into this page or interpolated into a SQL statement here. JSON serialization is used, so this code does not establish an XSS or SQL-injection defect. Backend treatment and database constraints remain unknown. URL/proxy limits are not a substitute for application validation.

The `source || 'Common'` fallback is unreachable for empty sources because those return earlier. TypeScript types are not runtime validation, especially for the exported server action. No additional callers besides redirect and the legacy route were found; remote action reachability was not tested.

### No application duplicate/bot controls

There is no deduplication key, persistent event store, bot filter, or application rate limiter. There is also no explicit application-level retry. These are confirmed absences, not proof that backend/proxy controls are absent or that every absence needs remediation.

## Potential risks requiring reproduction or runtime verification

| Scenario | What the source establishes / what remains unknown |
|---|---|
| Reload, new tab, repeated URL request | Each execution with an eligible source attempts another POST. Backend duplicate handling is unknown. |
| User retries after slow/error response | The previous write may already have committed. A later execution can attempt another write. |
| Proxy/browser retries | Possible if infrastructure retries requests; actual proxy and browser behavior must be checked. |
| Crawlers, link preview bots, QR preview/security scanners | Any request that executes the page with an eligible source is treated like a visitor; no bot check is applied. |
| Next prefetch / RSC navigation | A request that actually executes Page reaches its POST. Actual dynamic-route prefetch depth and cache reuse must be observed, not assumed. |
| Client navigation or refresh back to redirect | A fresh server execution can POST again; a reused client/router payload may not. |
| Back/forward navigation | Browser/router caches may reuse a page; a fresh request may record again. Mounting the client timer alone does not POST. |
| React/Next rendering repetition | There is no exactly-once guard, so another server execution could POST. A guaranteed duplicate on every request or from Strict Mode has not been demonstrated. |
| HEAD or speculative requests | May traverse rendering in this framework/server setup; there is no method filter in Page. Verify with an isolated backend before concluding these produce records. |
| Backend timeout or broken response after commit | Caller cannot know whether the write occurred. Retrying without backend idempotency can duplicate it. |

No internal link to `/redirect?source=...` and no caller of `/api/scans` were found in repository application code. Thus an existing internal automatic-prefetch trigger is not confirmed. External links and consumers are outside this search.

The client effect contains only navigation. React development effect re-execution does not itself call tracking; timer cleanup clears its pending timer. Do not attribute backend duplicates to that effect without a corresponding server request.

The current page uses request headers and force-dynamic rendering. Installed Next fetch code treats non-GET/HEAD fetches following dynamic data usage as uncacheable in that context. This is not an idempotency guarantee. Adding `cache: 'no-store'` would make the mutation intent explicit and protect the helper from being used in a different cache context; it is not a fix for a demonstrated current duplicate or cache bug.

## Is rendering-time GET tracking appropriate?

For simple campaign attribution meaning **eligible landing-page visits**, the current approach is defensible: QR scanners open GET URLs and server tracking works without client JavaScript. Keeping direct server-to-backend tracking avoids an extra HTTP hop. Routing through `/api/scans` would not solve duplicates or distinguish bots.

If the desired metric is **unique physical QR scans** or **confirmed human visits**, a GET/page render is insufficient evidence. A copied link, reload, crawler, or preview can have the same source. A static printed QR URL contains no unique identifier for each physical scan. Changing to a client-side POST or user action would change counting behavior and is not the minimal safe task.

The present implementation is best-effort, not durable delivery. There is no queue or outbox; an unavailable backend can lose an event. Adding either would be a larger architectural change and is not recommended without a demonstrated need.

## Crawlers and bots

[robots.ts](../src/app/robots.ts#L3) permits all paths. The sitemap does not explicitly list redirect, but links can still expose it. There is no crawler-specific source or User-Agent handling.

A bot User-Agent containing Windows or Android can be classified as that device. Headless browsers can run the redirect timer; bots that do not execute JavaScript may still cause the server POST. User-Agent values are spoofable, so bot filtering cannot prove a human scan.

Known-bot/preview and recognizable-prefetch exclusions are optional counting-policy changes. First inspect controlled traffic and logs. Robots exclusions/noindex would not prevent arbitrary requests and would touch crawler/metadata behavior; they are outside the minimal implementation.

## User-Agent/device handling

[getDeviceType](../src/app/actions.ts#L8) lowercases the User-Agent, then returns `iphone` for iPhone/iPad/iPod tokens, `android` for Android, `windows` for Windows, otherwise `unknown`.

This is a coarse platform heuristic, not a reliable device or visitor identifier. iPad/iPod are deliberately grouped under the label `iphone`; desktop-mode iPads may appear as Macintosh; macOS/Linux desktops are unknown; bots can mimic any group. Missing or empty User-Agent becomes unknown. Only the category is forwarded.

It may be sufficient if the backend intentionally expects these four values and uses them for rough statistics. Do not rename categories or add a parser dependency until backend enum compatibility and intended reporting are established. Never use User-Agent alone as an idempotency key. Validate runtime types and, if useful, bound input size without changing established categories.

## Suspense and error UI

[The Suspense boundary](../src/app/redirect/page.tsx#L34) is created after `await postData`. Its `Loading...` fallback does not cover the tracking wait. RedirectPage contains no scan fetch or relevant suspending operation. The boundary may serve unrelated rendering needs, but is not backend loading UX.

Retain the existing UI and boundary in the smallest tracking fix. Adding a route loading UI, moving the write into a streaming child, or making it fire-and-forget changes timing/behavior and is unnecessary for a bounded-wait improvement. An unawaited server fetch is not reliable delivery because request/process lifetimes can end before it completes.

## Legacy `/api/scans`

[The route](../src/app/api/scans/route.ts#L6) is a separate force-dynamic GET endpoint. It extracts the first source through URLSearchParams, uses `default` when empty, reads User-Agent, delegates to postData, and returns `{ data }` with a normal success status even when the helper failed.

Repository-wide source searches found no frontend, server, or configuration caller. Only its own implementation and audit/status documentation reference it. This supports classifying it as **likely obsolete legacy code**, not an intended step in the current flow. The route is still reachable if deployed and can independently attempt writes.

It can be removed in a separate narrow change after checking backend/client scripts, QR destinations, proxy/access logs, and external integrations for usage over a representative period. Source references alone do not prove safe removal. Do not redesign the redirect flow to use it. If retained, validation in postData should cover both callers; error-status redesign is not a priority for the primary flow.

## Rate limiting, deduplication, and idempotency

First decide whether reloads count as visits and what a duplicate means. Repeated source alone is not a duplicate identity: many legitimate visitors use the same QR code.

- **Rate limiting:** useful if logs show abuse, unbounded cardinality, backend load, or storage cost. Prefer limits at an existing trusted proxy/backend when practical. IP-based limits can combine visitors behind shared networks, and trusted forwarded-IP handling must be verified. No requirement for a new limiter dependency is established.
- **Deduplication:** a source/User-Agent/time-window rule can merge distinct real visitors. An in-memory map does not survive restarts and is not robust across concurrent processes. Cookies also change visitor/counting policy. Do not add heuristic deduplication silently.
- **Idempotency:** justified when the backend must suppress retries of the same event. It requires a stable event identity and an atomic backend uniqueness rule. A new random ID per page execution does not deduplicate reloads. Timeout/connection uncertainty is a reason to avoid automatic retries unless this contract exists.

The smallest first change should not add automatic retries, persistent state, rate limiting, or deduplication. Retain one bounded attempt per eligible execution while making the limitation explicit.

## Recommended changes

1. Keep direct `/redirect` → postData and intentional dynamic rendering.
2. Add server-runtime `SCAN_BACKEND_URL` with the current endpoint as default. Validate configured URL protocol/shape; invalid configuration must not throw outside fail-open handling. Keep it independent of incoming origin and out of client config.
3. Add a named timeout budget, selected from backend latency expectations (a provisional 2–3 seconds is an example, not an established requirement). Cover fetch and response-body handling with the same cancellation lifetime; clear timers in finally. Node 20 supports AbortController without a dependency. Continue rendering on timeout/failure.
4. Define a typed internal result distinguishing skipped, success, and failure, using safe unknown/error handling. Preserve fail-open user behavior. Agree whether success means accepted HTTP response or validated acknowledgment; avoid treating committed-but-unparseable responses as definitely unwritten. If the legacy route remains, preserve its externally observable JSON contract until callers are checked.
5. Validate source at the helper boundary. Preserve missing/empty/exact-default skipping and first-parameter semantics initially. Establish a named maximum length and acceptable format from actual QR sources/backend schema. Do not invent an ASCII-only allowlist, trim identifiers, case-fold them, or truncate them without confirming compatibility. Invalid input should skip tracking and still render normally.
6. Use explicit `cache: 'no-store'` on the backend mutation request. Standardize failure logging with reason/status/duration and bounded identifiers; avoid logging complete raw User-Agent/source payloads unnecessarily.
7. Do not add retries. Evaluate bot exclusions and idempotency separately after controlled runtime evidence and metric definition.

The existing helper is a `use server` export. If retained as a server action, runtime validation belongs at its entry; compile-time PostDataContext does not enforce incoming runtime values. Converting it into an ordinary server-only utility is optional, requires checking action usage, and is not necessary for the minimal change.

For a later Next.js upgrade, await request APIs/searchParams when that target version requires it, keeping the source selection and server-only origin boundary intact. Do not upgrade now or alter the unrelated origin helper as part of tracking hardening.

## Smallest safe implementation sequence and likely files

1. Confirm backend response contract, existing source identifiers, maximum accepted length, normal latency, and desired counting metric with service/runtime evidence. This does not require visiting a production scan URL.
2. Harden `src/app/actions.ts`: runtime server-only URL configuration/default, bounded request/body wait, validation, explicit no-store, typed outcome, and consistent failure logs. Keep payload field names and device categories unchanged.
3. Change `src/app/redirect/page.tsx` only if needed to handle the new result without altering rendering/navigation. It may remain unchanged if the helper handles logging and returns an ignored result. Do not duplicate helper validation at the page unnecessarily.
4. If changing the helper return shape, narrowly adapt `src/app/api/scans/route.ts` to retain its existing response contract, or keep the new result internal. Do not reintroduce it into the scan flow. Decide removal later from usage evidence.
5. Add focused verification using an isolated mock backend for timeout, malformed inputs, response types, and ambiguous outcomes. If repository tests are introduced, keep the harness dependency-free where practical; choose the exact file with the approved implementation. Run lint, TypeScript, and build after source modifications.
6. Update `PROJECT_STATUS.md` after passing checks with runtime items still pending.

Likely mandatory source change: `src/app/actions.ts`. Conditional source changes: `src/app/redirect/page.tsx`, `src/app/api/scans/route.ts`, and a focused test file. An optional environment declaration/example may document SCAN_BACKEND_URL without changing deployment mechanics. UI files, locale middleware, analytics configuration, origin helper, next.config.js, and package versions should remain untouched.

## Manual/runtime verification still required

- Backend binding, response schema/body, persistence point, validation, and any existing uniqueness/rate-limit rules.
- Runtime environment propagation and localhost IPv4/IPv6 behavior.
- Fast failure, slow headers, stalled bodies, 204/non-JSON responses, and write-then-disconnect against a dedicated fake/test service.
- Exactly how many requests/POSTs occur for initial load, reload, concurrent requests, repeated query parameters, browser retry, navigation/back/forward, router refresh, prefetch, and HEAD. Use isolated sources and a nonproduction backend.
- Proxy retries, real bot/preview traffic, and external `/api/scans` consumers from access logs.
- Welcome rendering and unchanged ten-second client timer after failed/timed-out tracking; home action, locales/basePath, analytics, and multiple request hosts remain unaffected.

No live-path verification was performed. This analysis does not establish exactly-once counting, demonstrate a real duplicate, or establish that production backend/proxy controls are absent.
