<p align="center">
  <img src="icon.svg" alt="NTFY Logo" width="21%">
</p>

# NTFY on StartOS

> **Upstream repo:** <https://github.com/binwiederhier/ntfy>
> **Upstream docs:** <https://docs.ntfy.sh>
>
> Everything not listed in this document should behave the same as upstream
> ntfy **v2.24.0**. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable.

NTFY is a simple, privacy-first HTTP-based pub/sub notification service. Publishers `POST` to a topic URL; subscribers get an instant push. Self-hosted on StartOS, all traffic stays on your infrastructure. The package ships with authentication required by default and a deny-all topic ACL — you explicitly grant access to make anything reachable.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions](#actions)
- [Base URL](#base-url)
- [Mobile Apps and Clients](#mobile-apps-and-clients)
- [Push Notification Limitations](#push-notification-limitations)
- [Attachment Storage](#attachment-storage)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [v2 Roadmap](#v2-roadmap)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                                     |
| ------------- | --------------------------------------------------------- |
| Image         | `binwiederhier/ntfy:v2.24.0` (upstream, unmodified)       |
| Architectures | x86_64, aarch64                                           |
| Entrypoint    | `ntfy serve --config /data/settings.yaml` (package-owned) |

## Volume and Data Layout

| Volume    | Mount (inside container) | Contents                                                                                                     |
| --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `main`    | `/data`                  | `auth.db` (users + ACLs + tokens), `cache.db` (message cache), `webpush.db`, `attachments/`, `settings.yaml` |
| `startos` | (not mounted in daemon)  | `store.json` — holds the admin management token minted on install                                            |

The `settings.yaml` config file is owned and enforced by StartOS. Hand-editing it is pointless — fields are re-asserted to their enforced values on service restart.

## Installation and First-Run Flow

1. Install the service. StartOS seeds `settings.yaml` with VAPID keys and a `base-url` derived from the mDNS LAN address, and creates a critical task to set the admin password.
2. Run the **Set Admin Password** critical task. An admin user is created, a never-expiring management token is minted and stored in `store.json`, and the password is shown once — copy it before closing the dialog.
3. The service starts automatically.
4. Open the web UI at your server's address and log in as `admin`.

The management token in `store.json` lets the package's own actions (Grant User Topic Access, Provision Publisher, etc.) authenticate against ntfy's admin API without keeping the admin password around. It persists across password rotations.

## Configuration Management

| StartOS-managed (enforced in `settings.yaml`)                                                                                                                                               | Upstream-managed (via Configure action or ntfy web UI)                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `listen-http: :80`, `auth-file`, `cache-file`, `attachment-cache-dir`, `web-push-file`, `auth-default-access: deny-all`, `behind-proxy: true`, `enable-login: true`, `enable-metrics: true` | `base-url`, `enable-signup`, `attachment-file-size-limit`, `attachment-total-size-limit`, `visitor-attachment-total-size-limit`, `cache-duration`, `web-push-email-address`, `log-level` |
| VAPID keys (generated on install)                                                                                                                                                           | Per-user profile settings, tokens, subscriptions — managed in the ntfy web UI by the logged-in user                                                                                      |

Run **Configure** to change anything in the right column. The service restarts to apply changes.

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose             | Access                       |
| --------- | ---- | -------- | ------------------- | ---------------------------- |
| Web UI    | 80   | HTTP     | NTFY web UI and API | LAN (mDNS), Tor, StartTunnel |

StartOS terminates TLS externally; the container itself serves plain HTTP on port 80. Other StartOS packages on the same box can reach ntfy at `http://ntfy.startos` on the internal VLAN.

## Actions

Actions are grouped in the StartOS UI by intent. "Availability" is the action's `allowedStatuses`. Setter actions return the relevant current state in their result, so there are no separate "view" actions — use the ntfy web UI (Account → Users & Access, admin-only) to browse state before acting.

### General

| Action                 | Purpose                                                                                             | Availability | Notes                                                          |
| ---------------------- | --------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| **Set Admin Password** | One-shot: create the admin user and mint the management token. Fired as a critical task on install. | Any          | Hidden. Use **Reset User Password** → `admin` to rotate later. |
| **Configure**          | Set base URL, self-registration, attachment limits, cache retention, VAPID email, log level.        | Any          | Leave a field blank to use ntfy's upstream default.            |

### Users

Manage human accounts and their per-user topic access.

| Action                      | Purpose                                                                                                                                                                | Availability | Inputs                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------ |
| **Create User**             | Create a regular user. Returns an auto-generated password shown once.                                                                                                  | Only running | Username                                                                 |
| **Reset User Password**     | Rotate any user's password (including admin). Tokens survive.                                                                                                          | Only running | User (dynamicSelect, excludes anonymous and `pkg_*`)                     |
| **Delete User**             | Delete a regular user. Admins cannot be deleted.                                                                                                                       | Only running | User (dynamicSelect, excludes admins and `pkg_*`)                        |
| **Grant User Topic Access** | Grant or deny `read-write` / `read-only` / `write-only` / `deny` on a topic or pattern for a specific user. Replaces prior grant. Result lists the user's full grants. | Only running | User, topic (existing / new / personal-namespace `<user>_*`), permission |

### Publishers

"Publisher" in this package is specific: a scoped, write-only automation account (username `pkg_<id>`), minted for a service or script that only needs to publish to a single topic. It is **not** a separate ntfy role — any regular user with write access can publish too. Publishers exist so you can hand credentials to automation (StartOS packages, cron jobs, external tools) without granting broader account access.

| Action                  | Purpose                                                                                                                                               | Availability | Inputs / Outputs                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------ |
| **Provision Publisher** | Mint a scoped, write-only automation account for a service or external tool that publishes to NTFY. Returns credentials to hand to the caller.        | Only running | Publisher ID, topic. Returns `{publishUrl, token, topic, username: pkg_<id>}`. |
| **Revoke Publisher**    | Delete a provisioned automation account; its topic grants and tokens cascade. Does not affect regular users' ability to publish via their own grants. | Only running | Publisher (dynamicSelect of `pkg_*` users)                                     |

### Public Access

Grant or deny unauthenticated ("everyone") access to topics. Separate from per-user access because public access is topic-scoped, not user-scoped.

| Action                         | Purpose                                                                                                                                                      | Availability | Inputs                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ---------------------------------- |
| **Set Anonymous Topic Access** | Grant or deny `read-write` / `read-only` / `write-only` / `deny` on a topic for anonymous clients. Result lists every topic currently with anonymous access. | Only running | Topic (existing / new), permission |

### Monitoring

| Action             | Purpose                                                                                                             | Availability |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------ |
| **Server Stats**   | Active version, base URL, message counts, account counts (users and publishers), attachment storage, feature flags. | Only running |
| **Server Metrics** | Detailed Prometheus metrics: throughput, subscribers, attachment bytes, UnifiedPush / web push delivery counts.     | Only running |

## Base URL

`base-url` is embedded by ntfy into attachment download links (the URLs a subscriber taps to download a file) and into web-push notification click targets (the URL the browser opens when a push is tapped). It does **not** affect subscription binding — browser web-push subscriptions are tied to the origin where the user opens the web UI, not to `base-url`.

Default seeded on install: the server's mDNS URL (`https://<server>.local:<port>`). Works on your home LAN; not reachable remotely.

Change it via **Configure** to an externally reachable URL if you need:

- Tap-to-download for attachments when you're off-LAN
- Web-push notifications whose click target opens outside the home network

Access methods:

| Access from…          | With `base-url` = LAN mDNS | With `base-url` = StartTunnel / Tor |
| --------------------- | -------------------------- | ----------------------------------- |
| Home LAN              | Works                      | Works                               |
| Outside (StartTunnel) | Attachment links broken    | Works                               |
| Tor                   | Attachment links broken    | Works                               |

Only one `base-url` at a time. Pick the widest-reachable URL your users actually use.

## Mobile Apps and Clients

**Official NTFY apps.** The [Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy) app ([F-Droid build](https://f-droid.org/en/packages/io.heckel.ntfy/) available) and [iOS](https://apps.apple.com/app/ntfy/id1625396347) app both work with self-hosted servers — set the server URL to your externally reachable address and log in with username/password or an access token.

**CLI.** The `ntfy` CLI can publish and subscribe:

```bash
ntfy publish -u admin:<pass> https://ntfy.myserver.tld/mytopic "Hello"
ntfy subscribe --token <tk_...> https://ntfy.myserver.tld/mytopic
```

**UnifiedPush.** This server works as a [UnifiedPush](https://unifiedpush.org/) distributor for Android — other apps on your phone (Element, Mastodon, Tusky, FairEmail, etc.) can route their push through your ntfy instead of Google FCM. No extra server-side setup.

**Web push in the browser.** VAPID keys are generated automatically on install. Subscribe to a topic in the web UI and browser notifications arrive even when the tab is closed.

**Message replay on reconnect.** When a subscriber goes offline and reconnects, ntfy automatically re-delivers messages from the cache. Window = `cache-duration` (default 12 hours, tunable via Configure).

## Push Notification Limitations

This package does **not** relay through Google Firebase (FCM) or Apple APNs. The official NTFY Android and iOS apps work, but they maintain a persistent long-polling connection to your server — they do not receive push via Google/Apple infrastructure.

**Android.** Works well if you disable battery optimization for the NTFY app (Settings → Apps → NTFY → Battery → Unrestricted). Without it, Android kills the background connection and you miss notifications.

**iOS.** Apple's background-app restrictions make the native NTFY app unreliable. The recommended iOS path is the ntfy **web app via Safari**:

1. Open your ntfy URL in Safari on iOS 16.4 or later.
2. Share → Add to Home Screen.
3. Open from the home screen and subscribe.
4. Allow notifications.

This uses Apple's Web Push (VAPID) infrastructure, which delivers reliably even when Safari is closed. No ntfy.sh relay or Apple Developer account needed.

## Attachment Storage

- Stored under `/data/attachments` on the `main` volume.
- Expire automatically when their message expires (tied to `cache-duration`).
- When the total limit is full, new uploads are rejected with an immediate error. Text/link/action notifications are unaffected.
- ntfy does not proactively alert on approaching limits — check **Server Stats** and adjust via **Configure**.

Defaults (upstream): per-file 15 MB, total 5000 MB, per-visitor 100 MB.

## Backups and Restore

Both `main` and `startos` volumes are backed up:

- `auth.db`, `cache.db`, `webpush.db`, `attachments/`, `settings.yaml` (on `main`)
- `store.json` (on `startos`) — the admin management token

**On restore**, users, passwords, topic ACLs, attachments, and web-push subscriptions are all restored. VAPID keys are preserved, so existing browser subscriptions continue to work.

**Backup size** is bounded by `cache-duration × upload rate`, not by total historical uploads — attachments age out of the cache regardless of backup history. Lower the attachment limits or cache retention via Configure to shrink further.

**Stale cache after old-backup restore:** the message cache is restored with messages that may have already expired by wall-clock time. They age out on their own; no corruption.

**Base URL after restore:** preserved as stored. If your new server's URL differs from the restored one, update via Configure — attachment links in already-delivered notifications still point at the old URL (cannot be retroactively rewritten).

## Health Checks

| Check         | Method                      | Success message              |
| ------------- | --------------------------- | ---------------------------- |
| Web Interface | `GET /v1/health` (HTTP 200) | "The web interface is ready" |

## Dependencies

None.

## Limitations and Differences

1. **No FCM / APNs push.** Native mobile apps long-poll your server; see [Push Notification Limitations](#push-notification-limitations).
2. **No SMTP gateway.** `smtp-sender-addr` and related fields are not configured — ntfy cannot send outbound emails on your behalf. Inbound email-to-topic (ntfy's `smtp-server-*`) is also not configured.
3. **No Twilio, Matrix, or Stripe integrations.** These require external accounts and are intentionally out of scope.
4. **No iOS instant push via upstream-base-url.** The `upstream-base-url` setting (which would forward topics through ntfy.sh for iOS FCM delivery) is not configured.
5. **Admin role is CLI-only.** The REST API can't create new admins or change an admin's password. StartOS actions hide this — Reset User Password transparently falls back to the CLI for admin targets.
6. **`base-url` must not be a sub-path.** Upstream ntfy rejects `base-url` values with a URL path component.
7. **Publishing via `ntfy.startos` on-box, `base-url` externally.** Internal StartOS services reach ntfy over the `http://ntfy.startos` VLAN hostname; external clients use whatever `base-url` resolves to. The two are different URLs and that's intentional.

## What Is Unchanged from Upstream

Everything in the ntfy web UI, the ntfy REST API, the ntfy CLI, topic semantics, wildcard ACLs, message formats, priorities, tags, action buttons, click URLs, attachments, call notifications (if ever configured), per-user tokens, UnifiedPush distribution, web push, and long-poll subscription behavior all work exactly as documented at <https://docs.ntfy.sh>.

## v2 Roadmap

- **SMTP email gateway.** Forward notifications to email via the StartOS system SMTP gateway.
- **Inbound email-to-topic.** Let users publish by emailing `<topic>@ntfy.myserver.tld`.
- **Telegram integration.** Forward notifications to Telegram via a bot.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: ntfy
upstream_version: v2.24.0
image: binwiederhier/ntfy:v2.24.0
architectures: [x86_64, aarch64]
volumes:
  main: /data
  startos: (not mounted in daemon; holds store.json)
ports:
  ui: 80
dependencies: none
startos_managed_settings:
  - listen-http
  - auth-file
  - cache-file
  - attachment-cache-dir
  - web-push-file
  - auth-default-access
  - behind-proxy
  - enable-login
  - enable-metrics
  - web-push-public-key
  - web-push-private-key
  - attachment-expiry-duration
  - web-push-email-address (seeded; user-overridable via Configure)
user_configurable_settings:
  - base-url
  - enable-signup
  - attachment-file-size-limit
  - attachment-total-size-limit
  - visitor-attachment-total-size-limit
  - cache-duration
  - log-level
actions:
  - set-admin-password # hidden; critical task on install
  - configure
  - create-user
  - reset-user-password
  - delete-user
  - grant-user-topic-access
  - provision-publisher
  - revoke-publisher
  - set-anonymous-topic-access
  - server-stats
  - server-metrics
health_checks:
  - web-interface: GET /v1/health
backup_volumes:
  - main
  - startos
internal_hostname: http://ntfy.startos:80
```
