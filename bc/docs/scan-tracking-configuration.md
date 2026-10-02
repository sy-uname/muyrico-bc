# Scan tracking runtime configuration

Set these server environment variables for the running Node.js application. They are read from `process.env` when tracking is attempted; they are not client configuration or build-time Next.js `env` entries. Updating the process environment generally requires restarting the application through its existing runtime management.

```env
SCAN_SOURCES=laVereda, Facebook, Telegram, Instagram
SCAN_BACKEND_URL=http://localhost:3016/scan
SCAN_REQUEST_TIMEOUT_MS=3000
```

`SCAN_SOURCES` defines the currently tracked QR placement/channel/partner identifiers. Split on commas; trim and lowercase each item; ignore empty items. Incoming identifiers are trimmed and lowercased for membership comparison and accepted identifiers are sent to the backend in that normalized form. No additional format restrictions apply.

Missing or empty `SCAN_SOURCES` means no sources are tracked. Unknown or removed sources skip the backend POST and log `outcome: skipped`, `reason: unknown_source`; the redirect page continues normally. This is not a configuration error. Existing absent/empty source and exact `default` handling still skips with `empty_or_default_source` before membership validation.

For `SCAN_SOURCES=laVereda, Facebook, Telegram`, `laVereda`, `LAVEREDA`, ` lavereda `, and `Facebook` are accepted; `Instagram` and `oldPartner` are skipped. Accepted backend identifiers are `lavereda` and `facebook` respectively.

`SCAN_BACKEND_URL` defaults to `http://localhost:3016/scan` when unset. `SCAN_REQUEST_TIMEOUT_MS` uses a finite positive number of milliseconds, otherwise defaults to 3000. Existing endpoint, timeout, device categories, transport failure handling, and JSON-or-null return behavior are unchanged by source validation.

Configure the intended active source list in the server environment before enabling this version in production. Verify environment provisioning without making real scans solely for testing. Old QR URLs remain usable even after their source is removed from statistics.
