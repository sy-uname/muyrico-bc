# Muy Rico Software

Muy Rico website — business card application.

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
```

### Variables

- `PORT` — port used by the Next.js standalone server.
- `HOSTNAME` — IP address or hostname the server listens on.
- `SCAN_BACKEND_URL` — full URL of the scan backend endpoint.
- `SCAN_REQUEST_TIMEOUT_MS` — request timeout in milliseconds.

---

## systemd service

Create a service file:

```text
/etc/systemd/system/<app>.service
```

Template:

```ini
[Unit]
Description=
After=network.target

[Service]
Type=simple
User=<user>
WorkingDirectory=<work_directory>

ExecStart=/usr/bin/node <work_directory>/standalone/server.js

Restart=on-failure

Environment="NODE_ENV=development"
Environment="DEPLOY=false"
EnvironmentFile=<work_directory>/.env.<place>.local

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
- `<work_directory>` — application working directory.
- `<place>` — deployment/environment identifier.

