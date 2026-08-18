# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **`ntfy user add` refuses a non-existent auth file, so setup must `touch` it first.** A zero-byte file passes the stat check and ntfy's SQLite manager runs its `CREATE TABLE` migrations on first open — that `touch` is why Set Admin Password works on a fresh volume.
- **The admin token, not the admin password, is what the package keeps.** Tokens survive password changes, so the monitoring actions keep working after a rotation. Never store the password.
- **`behind-proxy: true` is load-bearing for rate limiting**, not cosmetic: StartOS terminates TLS in front of ntfy, so without it every client presents as the proxy's single IP.
- **Install must fail if the mDNS address does not resolve.** A server with no `base-url` silently breaks attachment links and web push; better to refuse the install.
- **`web-push-email-address` is seeded with a placeholder because ntfy refuses to start on a partial web-push config.** Don't remove the default in favour of leaving it unset.
- **Provision/Revoke Publisher carry `access: 'dependent'` deliberately** — other packages call them via `effects.action.run` to mint and tear down their own scoped credentials. Changing their ids or input shapes breaks those callers.
- **The publish URL handed to a dependent is the bridge address**, resolved from the interface's own host, not the retired `ntfy.startos` name.
