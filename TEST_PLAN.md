# NTFY on StartOS — Test Plan

**Package:** `ntfy` v2.0.0:2-beta.1
**Upstream:** binwiederhier/ntfy v2.19.2
**SDK:** @start9labs/start-sdk 0.4.0-beta.66

Use this checklist when validating a build before release. Mark each item ✅ pass, ❌ fail, or ⚠️ partial. Record notes inline.

---

## 1. Build Verification

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 1.1 | `npm run check` passes with no TypeScript errors | Exit 0, no output | | |
| 1.2 | `make x86` produces `ntfy_x86_64.s9pk` | Build complete, SDK version shown | | |
| 1.3 | `make aarch64` produces `ntfy_aarch64.s9pk` | Build complete | | |
| 1.4 | `start-cli s9pk inspect ntfy_x86_64.s9pk manifest` shows correct metadata | id=ntfy, version=2.0.0:2-beta.1, arch=x86_64 | | |

---

## 2. Fresh Install

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 2.1 | Sideload `ntfy_x86_64.s9pk` onto a clean StartOS server | Package installs without error | | |
| 2.2 | Install alert appears | Alert text: "After installing, open Actions and run 'Set Admin Password'…" | | |
| 2.3 | Service status shows stopped/blocked | Service does NOT start automatically | | |
| 2.4 | Critical task "Set Admin Password" appears on dashboard | Task is visible and marked critical | | |
| 2.5 | Attempting to start service before running action is blocked | Service cannot start | | |

---

## 3. Set Admin Password Action

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 3.1 | Open "Set Admin Password" action — form shows two fields | Password + Confirm Password fields present | | |
| 3.2 | Submit with mismatched passwords | Error: "Passwords do not match" | | |
| 3.3 | Submit with password shorter than 8 characters | Validation error before submit | | |
| 3.4 | Submit with valid matching password (≥ 8 chars) | Action succeeds; result shows username "admin" | | |
| 3.5 | Critical task clears after successful action | Task is no longer shown on dashboard | | |
| 3.6 | Service starts automatically after task clears | Service transitions to running state | | |
| 3.7 | Health check turns green | "The web interface is ready" shown | | |
| 3.8 | Run action a second time with a new password | Action succeeds (change-pass path); login works with new password | | |
| 3.9 | Login to web UI with old password after step 3.8 | Login fails (old password rejected) | | |

---

## 4. Web UI & Core Notifications

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 4.1 | Open NTFY web UI at mDNS address (`http://<server>.local`) | Login page loads | | |
| 4.2 | Login as `admin` with the password set in §3 | Login succeeds; dashboard shown | | |
| 4.3 | Subscribe to topic `test` from web UI | Topic appears in sidebar | | |
| 4.4 | Publish via curl: `curl -d "Hello from curl" http://<server>.local/test -u admin:<pass>` | HTTP 200; message appears in web UI under `test` | | |
| 4.5 | Publish with title, priority, tag: `curl -H "Title: Disk full" -H "Priority: high" -H "Tags: warning" -d "90% used" http://<server>.local/test -u admin:<pass>` | Message appears with title, priority badge, and tag | | |
| 4.6 | Attempt to publish without credentials | HTTP 401 or 403 (deny-all enforced) | | |
| 4.7 | Attempt to subscribe without credentials | HTTP 401 or 403 | | |
| 4.8 | Stop and restart service | Service comes back up; health check recovers; messages in cache preserved | | |

---

## 5. Get Admin Credentials Action

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 5.1 | Run "Get Admin Credentials" action | Result group shows: Username, Password, Server URL, VAPID Public Key | | |
| 5.2 | Server URL matches the mDNS address of the server | URL is correct hostname | | |
| 5.3 | Password field is masked/copyable | Password visible on reveal; copyable | | |
| 5.4 | VAPID Public Key is a non-empty string | Key is present (generated on install) | | |

---

## 6. Configure Base URL Action

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 6.1 | Open "Configure Base URL" action | Dropdown shows available addresses (at minimum: mDNS `.local`) | | |
| 6.2 | Addresses are labelled by type | LAN/mDNS, Tor, or Public Domain labels visible | | |
| 6.3 | Select a different address and confirm | Action succeeds; service restarts | | |
| 6.4 | After restart, publish a message with an attachment (see §9) | Attachment URL in notification uses the newly selected base URL | | |
| 6.5 | Re-run action and select mDNS address to restore default | Service restarts; base URL reverts | | |

---

## 7. Toggle User Registration Action

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 7.1 | Run "Toggle User Registration" — disable signup | Action succeeds; service restarts | | |
| 7.2 | Attempt to register a new account from web UI | Registration is refused | | |
| 7.3 | Re-run action — enable signup | Action succeeds; service restarts | | |
| 7.4 | Register a new test account from web UI | Registration succeeds | | |
| 7.5 | Verify new user has no topic access by default (deny-all) | User sees no topics; publish/subscribe rejected until admin grants ACL | | |

---

## 8. Configure Storage Action

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 8.1 | Open action — all four fields pre-populated with current values | Fields show defaults (15 MB / 5000 MB / 100 MB / 12 hours) | | |
| 8.2 | Change cache duration to 1 hour and confirm | Action succeeds; service restarts with new value | | |
| 8.3 | Verify attachment expiry equals cache duration | Attachment expiry is not a separate setting — both use the same configured value | | |
| 8.4 | Change attachment file size limit to 1 MB | Service restarts; uploads > 1 MB rejected | | |
| 8.5 | Restore defaults | Service restarts normally | | |

---

## 9. Attachments

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 9.1 | Upload a file attachment via curl: `curl -T /path/to/file.jpg -u admin:<pass> http://<server>.local/test` | File uploaded; download URL in notification response | | |
| 9.2 | Download attachment from URL returned in notification | File downloads correctly | | |
| 9.3 | Upload file exceeding per-file limit (default 15 MB) | HTTP 413 or upload error | | |
| 9.4 | Run "Server Stats" — attachment fields appear (if exposed by `/v1/stats`) | Stats shown without error | | |

---

## 10. Configure Web Push Action

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 10.1 | Open action — email field is blank or shows current value | Form loads correctly | | |
| 10.2 | Submit with a valid email address | Action succeeds; service restarts | | |
| 10.3 | Submit with invalid email format | Validation error shown | | |
| 10.4 | Submit with blank email | Accepted (falls back to `ntfy@example.com`) | | |

---

## 11. Set Log Level Action

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 11.1 | Open action — current log level pre-selected | `info` selected by default | | |
| 11.2 | Change to `debug` | Action succeeds; service restarts | | |
| 11.3 | Verify debug logs appear in StartOS service log viewer | Log output is verbose | | |
| 11.4 | Change back to `info` | Service restarts; log verbosity returns to normal | | |

---

## 12. Server Stats Action

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 12.1 | Run action while service is running | Result shows: Server version, Base URL, Messages in cache, Active visitors, Active topics, Registered users, Attachment storage used, Self-registration status, Web push status | | |
| 12.2 | Run action while service is stopped | Error: "Action only available when service is running" | | |
| 12.3 | Publish several messages then re-run action | Message count has increased | | |
| 12.4 | Registered users count matches number of accounts created | User count is accurate | | |
| 12.5 | Upload an attachment then re-run action | Attachment storage used shows non-zero value | | |

---

## 12b. Server Metrics Action

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 12b.1 | Run action while service is running | Result shows sections: Messages, Active Connections, Attachments, Delivery | | |
| 12b.2 | Run action while service is stopped | Error: "Action only available when service is running" | | |
| 12b.3 | Publish messages then re-run | `Published (success)` counter has increased | | |
| 12b.4 | Upload an attachment then re-run | `Storage used` shows non-zero value | | |
| 12b.5 | Visitor/subscriber/topic counts are non-zero while connected | Gauges reflect live state | | |

---

## 13. Web Push (VAPID / Browser Notifications)

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 13.1 | Open NTFY web UI in a desktop browser that supports Web Push | No errors in console | | |
| 13.2 | Enable browser notifications for a topic | Browser prompts for notification permission | | |
| 13.3 | Close the browser tab; publish a message to the subscribed topic | Browser notification arrives even with tab closed | | |
| 13.4 | Restart service; repeat 13.3 | Notification still works (VAPID keys unchanged across restart) | | |
| 13.5 | Run "Get Admin Credentials" — VAPID public key matches key shown in browser subscription | Keys are consistent | | |

---

## 14. Multi-User Scenario

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 14.1 | Register a second user account (`alice`) via web UI (signup must be enabled) | Registration succeeds | | |
| 14.2 | Log in as `alice` — verify no topic access | Topics are inaccessible by default | | |
| 14.3 | Admin runs **Provision User Topics** action with username `alice` | Action succeeds; `alice` granted access to `alice_*` namespace | | |
| 14.4 | Log in as `alice` — publish and subscribe to `alice_alerts` | Publish/subscribe succeed | | |
| 14.5 | `alice` attempts to access topic `other_private` (no ACL granted) | Rejected | | |
| 14.6 | Admin runs **Manage Topic Access** — set `alice_alerts` to read-only for everyone | Anonymous subscribe succeeds; anonymous publish rejected | | |
| 14.7 | Create an access token for `alice` from the web UI profile page | Token created; use token in curl instead of password | | |

---

## 15. Backup & Restore

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 15.1 | Create a backup of the running service | Backup completes; includes `auth.db`, `cache.db`, `attachments/`, `store.json`, `webpush.db` | | |
| 15.2 | Uninstall the service completely | Package removed; data cleared | | |
| 15.3 | Restore from backup | Restore alert appears mentioning URL and attachment links | | |
| 15.4 | Service starts without prompting for admin password again | Admin password restored from backup; no critical task | | |
| 15.5 | Login as `admin` with original password | Login succeeds | | |
| 15.6 | Verify VAPID keys match pre-backup values (check "Get Admin Credentials") | VAPID public key is identical; existing browser push subscriptions remain valid | | |
| 15.7 | Verify user accounts and topic ACLs restored | `alice` account and ACL are intact | | |
| 15.8 | Cache messages from before backup are present (stale cache expected; age out normally) | Messages visible in web UI | | |

---

## 16. Update / Sideload

| # | Test | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 16.1 | Sideload a newer build over a running installation | Update alert appears | | |
| 16.2 | Service restarts with new version | Health check recovers | | |
| 16.3 | Settings (base URL, log level, storage limits) are preserved | No loss of configuration | | |
| 16.4 | Admin login still works post-update | No re-run of Set Admin Password required | | |

---

## 17. Known Items Requiring Live Verification

These items could not be fully validated from code inspection alone. Verify during testing and update this table.

| # | Item | How to verify | Verified? |
|---|------|---------------|-----------|
| V1 | `ntfy webpush keys` exact output format — regex parses public/private key correctly | Check startup logs; VAPID key in "Get Admin Credentials" should be non-empty | ✅ Fixed — output uses `web-push-public-key: <key>` format |
| V2 | `ntfy user add` exit code on first run vs already-exists — change-pass fallback triggers correctly | Run "Set Admin Password" twice; both succeed | |
| V3 | `/v1/stats` response fields in v2.19.2 — `messages`, `visitors`, `topics`, `version` all present | "Server Stats" output matches expected fields | |
| V4 | SSE proxy timeout vs 45s keepalive — long-lived subscriptions not dropped by StartOS proxy | Subscribe to a topic, leave connection open > 2 minutes, confirm no disconnect | |
| V5 | `NTFY_BEHIND_PROXY=true` — X-Forwarded-For headers forwarded correctly; no IP binding issues | Check visitor count in "Server Stats" matches actual clients | |

---

## 18. Pass Criteria

A build is considered **release-ready** when:

- All §1–§12b items are ✅ pass
- All §15 (Backup & Restore) items are ✅ pass
- §13 (Web Push) is at minimum ✅ 13.1–13.4
- All §17 known items are verified and resolved
- No ❌ failures remain open
