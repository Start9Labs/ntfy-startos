# NTFY

## Documentation

- [NTFY documentation](https://docs.ntfy.sh) — the upstream user and operator guide covering publishing, subscribing, mobile apps, and the HTTP API.

## What you get on StartOS

- A self-hosted **NTFY server** exposed as the **Web UI** interface — web UI, REST API, and long-polling subscription endpoint, all on the same address.
- **Authentication is required by default** and the topic ACL is deny-all: no topic is reachable until you grant access to a user or to anonymous clients.
- A **VAPID keypair** generated at install for browser web push, so subscriptions in the web UI work as soon as you log in.
- Actions for managing users, per-user topic grants, anonymous topic grants, and scoped publisher accounts for automation.

## Getting set up

NTFY posts two tasks right after install. Run the critical one before anything else.

1. Run the **Set Admin Password** critical task. An `admin` user is created and an auto-generated password is shown once — copy it before dismissing the dialog. To rotate the password later, use **Reset User Password** and pick `admin`.
2. Open the **Web UI** interface and log in as `admin` with that password.
3. Run the **Set Base URL** task and choose the address you want in attachment download links and web push notifications. It offers only HTTPS addresses and pre-selects a public domain if you have one, else your server's `.local` address, which works on the LAN only. Only one base URL at a time — pick the one your users actually reach the server at, and subscribe to web push from that address: browsers that subscribed from another address don't receive pushes.

## Using NTFY

### Publishing and subscribing

Use the Web UI, the official Android or iOS apps, the `ntfy` CLI, or any HTTP client. Point each at the base URL you set above and authenticate with your admin password, a regular user's password, or an access token. Browser web push works as soon as you subscribe to a topic in the Web UI.

### UnifiedPush (Element and other apps)

NTFY can be the push backend for Android apps that support [UnifiedPush](https://unifiedpush.org), such as **Element**, instead of Google FCM. The ntfy app names every UnifiedPush topic `up` plus a random suffix, so access is granted on the pattern `up*`.

1. Run **Create User** (for example `unifiedpush`) and copy the password.
2. Run **Grant User Topic Access** for that user: choose **Enter New**, enter `up*`, and pick **Read Only**.
3. Run **Set Anonymous Topic Access**: choose **Enter New**, enter `up*`, and pick **Write Only**. This lets the app's server deliver pushes without an account; it can't read them.
4. In the ntfy app, set the default server to your **Base URL**, add the user under _Manage users_, and enable ntfy as a UnifiedPush distributor.
5. Choose ntfy in the app's notification settings, then restart the app.

Your **Base URL** must be reachable from the phone and from the server that sends the pushes — for Element, the homeserver your account is on. Clients embed it when they register, so if you change it later, re-select the distributor on each device.

### Actions

#### General

- **Configure** — self-registration on/off, per-file and total attachment size limits, per-user attachment quota, per-user daily bandwidth, message cache retention, VAPID contact email, and log level. The service restarts to apply.
- **Set Base URL** — the address NTFY puts in attachment links and web push notifications. If that address goes away, NTFY uses another HTTPS address until it returns, and a task asks you to choose again. The service restarts to apply.

#### Users

- **Create User** — create a regular (non-admin) user. The auto-generated password is shown once.
- **Reset User Password** — rotate any user's password, including `admin`. Existing access tokens survive.
- **Delete User** — permanently remove a regular user.
- **Grant User Topic Access** — give a user `read-write`, `read-only`, `write-only`, or `deny` on a topic or wildcard pattern (e.g. `alerts_*`), or grant their personal `<username>_*` namespace in one click. Replaces any prior grant for that user/topic.

#### Publishers

A "publisher" here is a scoped, write-only automation account (`pkg_<id>`) for handing credentials to a script or another service without sharing a regular login.

- **Provision Publisher** — mint a publisher with write access to a single topic. Returns the publish URL, an access token, the topic, and the username — hand these to the caller.
- **Revoke Publisher** — delete a provisioned publisher; its token and topic grant go with it.

Another service on your server can run both actions too, but only for its own publisher.

#### Public access

- **Set Anonymous Topic Access** — grant or deny `read-write`, `read-only`, `write-only`, or `deny` on a topic for unauthenticated clients. Use this for public broadcast topics.

#### Monitoring

- **Server Stats** — version, base URL, message counts, user and publisher counts, attachment storage usage, and feature flags.
- **Server Metrics** — Prometheus metrics: throughput, active subscribers, attachment bytes, UnifiedPush and web push delivery counters.

## Limitations

- **No FCM / APNs relay.** This server does not relay through Google Firebase or Apple Push Notification service. The native Android app works reliably if you disable battery optimization for it; on iOS, the most reliable path is to open the Web UI in Safari (16.4+) and **Add to Home Screen** — that uses Apple's Web Push and delivers even when Safari is closed.
- **`settings.yaml` is package-managed.** Fields the package owns are re-asserted on restart, so hand-editing those is pointless; change them through the **Configure** action. Any other ntfy setting you add by hand is left alone.
