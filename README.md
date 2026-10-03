# Muy Rico Software

Muy Rico website — business card application.

## Build modes

The project uses the `DEPLOY` environment variable only during the build.

### Local / development-server build

```bash
npm run build
```

Equivalent build mode:

```text
DEPLOY=false
```

This configuration is intended for environments such as:

```text
http://webserver.local/mrbc
```

### Production build

```bash
npm run deploy
```

Equivalent build mode:

```text
DEPLOY=true
```

This creates the production standalone build.

### Production deployment archive

```bash
npm run deploypack
```

This performs a production build and creates:

```text
muyrico_bc_YYYYMMDD.tar.gz
```

The archive contains the contents of the Next.js standalone directory and can be extracted directly into the deployment directory.

---

## Standalone build

Next.js is configured with:

```text
output: standalone
```

After `next build`, additional static assets are copied into the standalone tree:

```text
public/
.next/static/
```

The resulting standalone application can be started with:

```bash
npm start
```

which runs:

```text
node .next/standalone/server.js
```

`DEPLOY` is a build-time setting and is not required when starting an already built standalone application.

---

## Environment configuration

Create an environment file using the following naming pattern:

```text
.env.<place>.local
```

Example:

```dotenv
# Next.js standalone server
PORT=<port>
HOSTNAME=<ip_or_name>

# Scan backend endpoint
SCAN_BACKEND_URL=<full_url>

# Request timeout in milliseconds
SCAN_REQUEST_TIMEOUT_MS=<timeout>

# Allowed QR sources separated by commas
SCAN_SOURCES=source1,source2,source3
```

### Variables

- `PORT` — port used by the Next.js standalone server.
- `HOSTNAME` — IP address or hostname the standalone server listens on.
- `SCAN_BACKEND_URL` — full URL of the scan backend endpoint.
- `SCAN_REQUEST_TIMEOUT_MS` — scan backend request timeout in milliseconds.
- `SCAN_SOURCES` — comma-separated list of allowed QR tracking sources.

Example:

```dotenv
PORT=3014
HOSTNAME=0.0.0.0
SCAN_BACKEND_URL=http://localhost:3016/scan
SCAN_REQUEST_TIMEOUT_MS=3000
SCAN_SOURCES=laVereda,facebook,instagram
```

---

## systemd service

The deployed standalone directory has the following structure:

```text
<deploy_root>/
├── standalone/
│   ├── server.js
│   ├── public/
│   └── .next/
└── .env.<place>.local
```

Create:

```text
/etc/systemd/system/<app>.service
```

Example template:

```ini
[Unit]
Description=Muy Rico business card site
After=network.target

[Service]
Type=simple
User=<user>

WorkingDirectory=<deploy_root>
ExecStart=/usr/bin/node <deploy_root>/standalone/server.js

Restart=on-failure

Environment="NODE_ENV=production"
EnvironmentFile=<deploy_root>/.env.<place>.local

ExecReload=/bin/kill -s HUP $MAINPID

KillMode=process
KillSignal=SIGINT
TimeoutStopSec=90

[Install]
WantedBy=multi-user.target
```

### Placeholders

- `<app>` — systemd service name.
- `<user>` — Linux user that runs the application.
- `<deploy_root>` — directory containing the deployed `standalone` directory.
- `<place>` — deployment/environment identifier.

After changing the service definition:

```bash
sudo systemctl daemon-reload
sudo systemctl restart <app>
```

Check status:

```bash
sudo systemctl status <app>
```

View application logs:

```bash
journalctl -u <app> -f
```

---

## Deployment example

Build the production archive:

```bash
npm run deploypack
```

Extract the archive into the standalone deployment directory.

For example, if the deployment root is:

```text
/var/www/mrbc
```

the server entry point is:

```text
/var/www/mrbc/standalone/server.js
```

and the environment file can be:

```text
/var/www/mrbc/.env.dev.local
```

The systemd service then starts the application with:

```text
NODE_ENV=production
```

Runtime values such as `PORT`, `HOSTNAME`, and scan backend settings are read from the environment file.
