<!-- ORIENT:START -->
## Project docs — read on demand, never import

- `docs/STATE.md` — what's built, in progress, blocked. Read this first when picking up work.
- `docs/decisions/` — one file per architectural decision. Read the relevant one before changing that area.
- `docs/architecture.md` — entry points and module boundaries. Read before cross-module work.

## Workflow

- Before reporting a task complete: update `docs/STATE.md` on the default branch, or `docs/state/<branch>.md` on any other branch (`/orient:sync` does this), and if an architectural decision was made with no ADR recorded, offer to record it.
- When a real architectural decision is made in conversation (a framework, database, auth, or API choice, or reversing one), proactively offer to record it with `/orient:decide` — don't wait to be asked. It also updates `architecture.md` on the default branch; on any other branch it leaves the proposal in the branch note.
- When a plan is approved before a build, treat any architectural choices inside it as decisions — offer to record them before starting.
- Never edit a past decision file. Supersede it with a new one.
- Trace execution paths on demand instead of maintaining a flow doc.
<!-- ORIENT:END -->

## Build rules for this repo

- Only `plugin.json` goes in `.claude-plugin/`. Skills, agents, hooks, scripts and templates live at the plugin root.
- `version` lives in `plugin.json` only, never also in the marketplace entry. Bump it on every release.
- Nothing enters the always-on path without a reason recorded in an ADR.
- Before claiming a change is done: `claude plugin validate . --strict` and `claude plugin validate ./plugins/orient --strict` must both pass.
