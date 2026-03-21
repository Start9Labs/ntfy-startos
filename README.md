<p align="center">
  <img src="icon.svg" alt="NTFY Logo" width="21%">
</p>

# NTFY on StartOS

> **Upstream repo:** <https://github.com/binwiederhier/ntfy>
> **Upstream docs:** <https://docs.ntfy.sh>

NTFY is a simple, privacy-first pub/sub push notification service. Send notifications to your phone or desktop from any script, server, or service — no account needed. Self-hosted on your StartOS server, your notifications stay on your infrastructure.

---

## Quick Start

After installing:

1. Open **Actions** and run **Set Admin Password** — the service will not start until this is done.
2. Once the service is running, open the NTFY web UI at your server's address and log in as `admin`.
3. Subscribe to a topic from the web UI (e.g. `alerts`).
4. Send your first notification:
   ```bash
   curl -d "Hello from my server" http://ntfy.local/alerts -u admin:yourpassword
   ```
5. Try priorities, titles, and tags:
   ```bash
   curl -H "Title: Disk almost full" -H "Priority: high" -H "Tags: warning" \
     -d "Disk usage at 90%" http://ntfy.local/alerts -u admin:yourpassword
   ```
6. Connect the NTFY mobile app: set the server URL → log in → subscribe to `alerts`.
7. Generate an access token from the web UI profile page for use in scripts (avoids storing your password in scripts).

---

## Container Runtime

| Property      | Value                           |
| ------------- | ------------------------------- |
| Image         | `binwiederhier/ntfy:v2.19.2`    |
| Architectures | x86_64, aarch64                 |
| Entrypoint    | `ntfy serve`                    |

## Volumes

| Volume | Mount Point | Purpose         |
| ------ | ----------- | --------------- |
| `main` | `/data`     | Persistent data (user database, message cache, attachments, config) |

## Network Interfaces

| Interface | Port | Protocol | Purpose              |
| --------- | ---- | -------- | -------------------- |
| Web UI    | 80   | HTTP     | NTFY web UI and API  |

## Actions

| Action                  | Description |
| ----------------------- | ----------- |
| **Set Admin Password**  | Set or change the admin account password. Required before the service will start. |
| **Get Admin Credentials** | Show the admin username, password, server URL, and VAPID public key. |
| **Toggle Signup**       | Enable or disable new user self-registration. |
| **Configure Base URL**  | Choose which address is embedded in attachment links and web push notifications. |
| **Configure Storage**   | Set attachment size limits and message cache / attachment retention duration. |
| **Configure Web Push**  | Set the contact email for VAPID web push notifications. |
| **Set Log Level**       | Change server log verbosity (trace / debug / info / warn / error). |
| **Server Stats**        | View message counts, active visitors, and server version (service must be running). |

## Dependencies

None.

## Backups

The `main` volume is backed up. This includes:
- User database and credentials (`auth.db`)
- Message cache (`cache.db`)
- Attachment files (`attachments/`)
- VAPID keys and settings (`store.json`, `webpush.db`)

**Backup size:** Attachment files are automatically deleted after the cache retention period (default 12 hours). Backup size at any point is bounded by `cache retention × upload rate`, not total historical uploads. To reduce backup size, lower the attachment size limits or cache retention via **Configure Storage**.

**On restore:** All users, passwords, topic ACLs, attachments, and web push subscriptions are restored. VAPID keys are preserved so existing browser push subscriptions remain valid. If your server URL has changed, update it via **Configure Base URL** — attachment links in already-delivered notifications will continue to point to the old URL (expected trade-off; cannot be retroactively fixed).

**Stale cache:** The message cache is included in backups. After restoring from an old backup, the cache may contain messages that have since expired. These age out normally; no data is lost.

## Health Checks

| Check         | Method                        | Messages                            |
| ------------- | ----------------------------- | ----------------------------------- |
| Web Interface | `GET /v1/health` (HTTP 200)   | Ready: "The web interface is ready" |

---

## User Management

1. **First run:** Use **Set Admin Password** to set the admin password. The admin username is `admin`.
2. **Admin panel:** After logging in, the admin has full access to NTFY's built-in web UI admin panel for managing users and topic ACLs.
3. **Adding users:** Self-registration is enabled by default — users visit the NTFY web UI and register. The admin can also create users directly from the admin panel.
4. **Access control:** Default access is `deny-all`. Registered users have no topic access until the admin grants it from the admin panel. The `admin` user has the admin role and bypasses ACL entirely.
5. **Access tokens:** Users create and manage their own tokens from the NTFY web UI profile page. Use tokens in apps and scripts instead of passwords.
6. **Disabling self-registration:** Use **Toggle Signup** to prevent new user registration. When disabled, only the admin can create accounts.

---

## Base URL and Hostnames

NTFY embeds its `base-url` into attachment download links and web push notification payloads. It is not stored in the database — it is computed dynamically from the current config value.

**Default:** The mDNS/LAN address (`yourserver.local`). Works on your home network. Not accessible remotely.

**Changing the base URL:**
- Use the **Configure Base URL** action to select a different address (Tor, public domain, or another LAN address).
- Only a service restart is needed — no reinstall, no database migration.
- The only consequence: attachment links in *already-delivered* notifications will point to the old URL. New notifications immediately use the new URL.

**Access method summary:**

| Access method           | Attachment links work? | Notes |
| ----------------------- | ---------------------- | ----- |
| LAN (home network)      | ✓ Always               | Best default experience |
| Tor                     | ✗ If base-url=LAN      | Links resolve to `.local`, unreachable via Tor |
| StartTunnel / public    | ✗ If base-url=LAN      | Links resolve to `.local`, unreachable remotely |

For remote or Tor access, change the base URL to your StartTunnel domain or Tor address via **Configure Base URL**.

---

## Mobile Apps and Clients

**Official NTFY apps:** The official [Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy) and [iOS](https://apps.apple.com/app/ntfy/id1625396347) apps work with self-hosted servers. In the app settings, set the server URL to your NTFY address and use your username/password or an access token.

**UnifiedPush:** NTFY works as a [UnifiedPush](https://unifiedpush.org/) distributor for Android. Privacy-focused apps (Mastodon, Element, etc.) can use your self-hosted NTFY instead of Google FCM for push delivery. No extra configuration needed — NTFY detects UnifiedPush clients automatically. The server URL must be reachable from the device (Tor or StartTunnel recommended for use outside the home network).

**CLI:** The `ntfy` CLI can publish and subscribe. Example:
```bash
ntfy publish --token <token> http://ntfy.local/mytopic "Hello"
ntfy subscribe http://ntfy.local/mytopic -u admin:<pass>
```

**Web push (browser):** VAPID keys are generated automatically on install. Browser push notifications work in the NTFY web UI — subscribe to a topic and notifications arrive even when the tab is closed, as long as the browser is running.

**Message replay on reconnect:** When a client goes offline and reconnects, NTFY automatically replays missed messages from the cache. Clients catch up automatically. The replay window is the cache retention period (default 12 hours, configurable via **Configure Storage**).

---

## Push Notification Limitations

**No Firebase (FCM) / APNs push:** This self-hosted package does not use Google Firebase or Apple APNs. The official NTFY Android and iOS apps will **not** receive background push notifications via Google/Apple infrastructure. Instead, apps maintain a persistent connection to your server (long-polling). This works reliably on Android when the NTFY app is given battery exemption. On iOS, background delivery may be unreliable without APNs.

**Web push works fully:** Browser notifications via Web Push (VAPID) are fully supported and do not require Firebase or Apple services.

**Recommendation for Android:** Use [UnifiedPush](https://unifiedpush.org/) with apps that support it (Element, Mastodon clients, etc.) for reliable background delivery without Google services.

---

## Attachment Storage

- Attachments are stored in `/data/attachments` on the main volume.
- **Expiry:** Attachment files are deleted automatically when their message expires (controlled by cache retention — the same setting as message cache duration).
- **When full:** New attachment uploads are rejected with an immediate error. Regular text/link/action notifications are completely unaffected — only new file uploads are blocked.
- **No proactive alerts:** NTFY does not notify the admin when limits are approaching. Use **Server Stats** to check current usage and **Configure Storage** to adjust limits.
- **Storage limits (defaults):**
  - Per-file limit: 15 MB
  - Total server limit: 5,000 MB
  - Per-visitor quota: 100 MB

---

## v2 Roadmap (Not in This Release)

- **SMTP email gateway:** Forward notifications to email via the StartOS system SMTP gateway.
- **Telegram integration:** Forward notifications to Telegram via a bot.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: ntfy
image: binwiederhier/ntfy:v2.19.2
architectures: [x86_64, aarch64]
volumes:
  main: /data
ports:
  ui: 80
dependencies: none
actions:
  - set-admin-password
  - get-admin-credentials
  - toggle-signup
  - choose-base-url
  - configure-storage
  - configure-web-push
  - set-log-level
  - server-stats
health_checks:
  - GET /v1/health (HTTP 200)
backup_volumes:
  - main
```
