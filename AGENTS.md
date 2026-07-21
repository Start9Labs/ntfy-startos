# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `ntfy`.** The single `ui` interface (ntfy's web UI + HTTP publish API, port 80) binds on the `ui-multi` host — the host id (`sdk.MultiHost.of` group) and interface id differ, so `sdk.host.getOwn` lookups go through `uiHostId` / `uiInterfaceId` (exported from `startos/utils.ts`).
- **Dependent-callable provisioning.** `provision-publisher` and `revoke-publisher` (`startos/actions/publishers/`) carry `access: 'dependent'`, so a dependent package can call them directly via `effects.action.run` — provision mints a scoped, write-only `pkg_<id>` publisher account and returns a never-expiring `token` plus the LXC-bridge `publishUrl` (ntfy's `ui` interface reached over the internal network); revoke tears that account down (e.g. on the dependent's uninstall). Non-dependents still queue these as user tasks.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach ntfy -n ntfy-main-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `ntfy-main-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
