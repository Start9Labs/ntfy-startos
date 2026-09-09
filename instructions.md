# NTFY

## Documentation

- [NTFY documentation](https://docs.ntfy.sh) — the upstream user and operator guide covering publishing, subscribing, mobile apps, and the HTTP API.

## What you get on StartOS

- A self-hosted **NTFY server** exposed as the **Web UI** interface — web UI, REST API, and long-polling subscription endpoint, all on the same address.
- **Authentication is required by default** and the topic ACL is deny-all: no topic is reachable until you grant access to a user or to anonymous clients.
- A **VAPID keypair** generated at install for browser web push, so subscriptions in the web UI work as soon as you log in.
- Actions for managing users, per-user topic grants, anonymous topic grants, and scoped publisher accounts for automation.

## Getting set up

NTFY posts a critical task right after install. Run it before anything else.

1. Run the **Set Admin Password** critical task. An `admin` user is created and an auto-generated password is shown once — copy it before dismissing the dialog. To rotate the password later, use **Reset User Password** and pick `admin`.
2. Open the **Web UI** interface and log in as `admin` with that password.
3. Run **Configure** and set **Base URL** to the address you want embedded in attachment download links and web push notifications. The dropdown lists every non-local address the **Web UI** interface currently publishes — a StartTunnel or Tor address, and any clearnet domain you have attached to that interface. The default is your server's `.local` mDNS URL, which works on the LAN only; pick an off-LAN address if you need attachments and tap-to-open push to work away from home. Only one base URL at a time — pick the one your users actually reach the server at.

   To offer a clearnet domain here, attach it to the **Web UI** interface first; it then appears in this dropdown automatically.

## Using NTFY

### Publishing and subscribing

Use the Web UI, the official Android or iOS apps, the `ntfy` CLI, or any HTTP client. Point each at the base URL you set above and authenticate with your admin password, a regular user's password, or an access token. Browser web push works as soon as you subscribe to a topic in the Web UI.

### UnifiedPush (Matrix, Mastodon, and other apps)

NTFY can act as the push backend for Android apps that support
[UnifiedPush](https://unifiedpush.org) — most usefully **Element**, which otherwise
depends on Google FCM and, in its F-Droid build, has no push at all and falls back to
background polling that delays notifications by minutes.

Run the **Enable UnifiedPush** action, then follow the credentials it returns. It grants
the two permissions the flow needs and creates the subscriber account in one step.

Why two different permissions on the same `up*` pattern:

- **Anonymous write-only** — the pushing server (your Matrix homeserver) publishes
  _without credentials_. The Matrix push protocol has no field to carry them, so with
  this package's `deny-all` default the push is rejected and nothing is delivered, with
  no error on the phone. This grant is what lets it through.
- **A user with read-only** — the ntfy app subscribes, and it _can_ authenticate. Giving
  read to an account rather than to everyone keeps strangers from subscribing to your
  notification stream.

On the phone: install the ntfy app, set its default server to your **Base URL**, add the
returned credentials under its _Manage users_ setting, enable it as a UnifiedPush
distributor, then choose it in Element's notification settings and restart Element.

Note that push here is a function of the homeserver **your account lives on** — not of
federation. If your account is on someone else's homeserver, that server is what pushes
to your NTFY, and its administrators can see the address you registered.

**Base URL must not change afterwards.** Clients embed it when they register, so changing
it silently invalidates every existing registration; re-run **Enable UnifiedPush** and
re-select the distributor on each device if you do.

### Actions

#### General

- **Configure** — base URL, self-registration on/off, per-file and total attachment size limits, per-user attachment quota, per-user daily bandwidth, message cache retention, VAPID contact email, and log level. The service restarts to apply.

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
- **Enable UnifiedPush** — one-step setup for UnifiedPush apps: grants anonymous write-only and a `unifiedpush` user read-only on `up*`, and returns the server URL and credentials. Safe to re-run; it reissues the password and leaves the grants unchanged.

Both access actions open on a grant that is actually stored, so re-running one shows the
current permission rather than a default. **Set Anonymous Topic Access** also labels every
topic in its dropdown with the anonymous permission on it, and both actions print the full
grant list after you apply.

#### Monitoring

- **Server Stats** — version, base URL, message counts, user and publisher counts, attachment storage usage, and feature flags.
- **Server Metrics** — Prometheus metrics: throughput, active subscribers, attachment bytes, UnifiedPush and web push delivery counters.

## Limitations

- **No FCM / APNs relay.** This server does not relay through Google Firebase or Apple Push Notification service. The native Android app works reliably if you disable battery optimization for it; on iOS, the most reliable path is to open the Web UI in Safari (16.4+) and **Add to Home Screen** — that uses Apple's Web Push and delivers even when Safari is closed.
- **`settings.yaml` is package-managed.** Fields the package owns are re-asserted on restart, so hand-editing those is pointless; change them through the **Configure** action. Any other ntfy setting you add by hand is left alone.
