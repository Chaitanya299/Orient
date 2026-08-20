<!-- BEARINGS:START -->
## Project docs — read on demand, never import

- `docs/STATE.md` — what's built, in progress, blocked. Read this first when picking up work.
- `docs/decisions/` — one file per architectural decision. Read the relevant one before changing that area.
- `docs/architecture.md` — entry points and component boundaries. Read before cross-cutting work.

## Workflow

- Update `docs/STATE.md` before reporting a task complete.
- Record real design decisions as a new numbered ADR. Never edit a past one — supersede it.
- Trace execution paths on demand instead of maintaining a flow doc.
<!-- BEARINGS:END -->

## Build rules for this repo

- Only `plugin.json` goes in `.claude-plugin/`. Skills, agents, hooks, scripts and templates live at the plugin root.
- `version` lives in `plugin.json` only, never also in the marketplace entry. Bump it on every release.
- Nothing enters the always-on path without a reason recorded in an ADR.
- Before claiming a change is done: `claude plugin validate . --strict` and `claude plugin validate ./plugins/bearings --strict` must both pass.
