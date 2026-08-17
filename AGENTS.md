# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **`ntfy user add` refuses a non-existent auth file, so setup must `touch` it first.** A zero-byte file passes the stat check and ntfy's SQLite manager runs its `CREATE TABLE` migrations on first open — that `touch` is why Set Admin Password works on a fresh volume.
- **The admin token, not the admin password, is what the package keeps.** Tokens survive password changes, so the monitoring actions keep working after a rotation. Never store the password.
- **`behind-proxy: true` is load-bearing for rate limiting**, not cosmetic: StartOS terminates TLS in front of ntfy, so without it every client presents as the proxy's single IP.
- **Install must fail if the mDNS address does not resolve.** A server with no `base-url` silently breaks attachment links and web push; better to refuse the install.
- **`web-push-email-address` is seeded with a placeholder because ntfy refuses to start on a partial web-push config.** Don't remove the default in favour of leaving it unset.
- **Provision/Revoke Publisher carry `access: 'dependent'` deliberately** — other packages call them via `effects.action.run` to mint and tear down their own scoped credentials. Changing their ids or input shapes breaks those callers.
- **The publish URL handed to a dependent is the bridge address**, resolved from the interface's own host, not the retired `ntfy.startos` name.
