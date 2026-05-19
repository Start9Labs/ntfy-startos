# NTFY

## Documentation

- [NTFY documentation source](https://github.com/binwiederhier/ntfy/tree/main/docs) — upstream user and operator guide covering publishing, subscribing, mobile apps, and the HTTP API.

## What you get on StartOS

- A self-hosted **NTFY server** exposed as the **Web UI** interface — web UI, REST API, and long-polling subscription endpoint, all on the same address.
- **Authentication is required by default** and the topic ACL is deny-all: no topic is reachable until you grant access to a user or to anonymous clients.
- A **VAPID keypair** generated at install for browser web push, so subscriptions in the web UI work as soon as you log in.
- Actions for managing users, per-user topic grants, anonymous topic grants, and scoped publisher accounts for automation.

## Getting set up

NTFY posts a critical task right after install. Run it before anything else.

1. Run the **Set Admin Password** critical task. An `admin` user is created and an auto-generated password is shown once — copy it before dismissing the dialog. To rotate the password later, use **Reset User Password** and pick `admin`.
2. Open the **Web UI** interface and log in as `admin` with that password.
3. Run **Configure** and set **Base URL** to the address you want embedded in attachment download links and web push notifications. The default is your server's `.local` mDNS URL, which works on the LAN; pick a StartTunnel or Tor address if you need attachments and tap-to-open push to work off-LAN. Only one base URL at a time — pick the one your users actually reach the server at.

## Using NTFY

### Publishing and subscribing

Use the Web UI, the official Android or iOS apps, the `ntfy` CLI, or any HTTP client. Point each at the base URL you set above and authenticate with your admin password, a regular user's password, or an access token. Browser web push works as soon as you subscribe to a topic in the Web UI.

### Actions

#### General

- **Configure** — base URL, self-registration on/off, per-file and total attachment size limits, per-user attachment quota, message cache retention, VAPID contact email, and log level. The service restarts to apply.

#### Users

- **Create User** — create a regular (non-admin) user. The auto-generated password is shown once.
- **Reset User Password** — rotate any user's password, including `admin`. Existing access tokens survive.
- **Delete User** — permanently remove a regular user.
- **Grant User Topic Access** — give a user `read-write`, `read-only`, `write-only`, or `deny` on a topic or wildcard pattern (e.g. `alerts_*`), or grant their personal `<username>_*` namespace in one click. Replaces any prior grant for that user/topic.

#### Publishers

A "publisher" here is a scoped, write-only automation account (`pkg_<id>`) for handing credentials to a script or another service without sharing a regular login.

- **Provision Publisher** — mint a publisher with write access to a single topic. Returns the publish URL, an access token, the topic, and the username — hand these to the caller.
- **Revoke Publisher** — delete a provisioned publisher; its token and topic grant go with it.

#### Public access

- **Set Anonymous Topic Access** — grant or deny `read-write`, `read-only`, `write-only`, or `deny` on a topic for unauthenticated clients. Use this for public broadcast topics.

#### Monitoring

- **Server Stats** — version, base URL, message counts, user and publisher counts, attachment storage usage, and feature flags.
- **Server Metrics** — Prometheus metrics: throughput, active subscribers, attachment bytes, UnifiedPush and web push delivery counters.

## Limitations

- **No FCM / APNs relay.** This server does not relay through Google Firebase or Apple Push Notification service. The native Android app works reliably if you disable battery optimization for it; on iOS, the most reliable path is to open the Web UI in Safari (16.4+) and **Add to Home Screen** — that uses Apple's Web Push and delivers even when Safari is closed.
- **`settings.yaml` is package-managed.** Hand-editing it is pointless — fields the package owns are re-asserted on restart. Change settings through the **Configure** action.
