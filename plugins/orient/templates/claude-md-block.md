<!-- ORIENT:START -->
## Project docs — read on demand, never import

- `{{DOCS_DIR}}/STATE.md` — what's built, in progress, blocked. Read this first when picking up work.
- `{{DOCS_DIR}}/decisions/` — one file per architectural decision. Read the relevant one before changing that area.
- `{{DOCS_DIR}}/architecture.md` — entry points and module boundaries. Read before cross-module work.

## Workflow

- Before reporting a task complete: update `{{DOCS_DIR}}/STATE.md`, and if an architectural decision was made with no ADR recorded, offer to record it.
- When a real architectural decision is made in conversation (a framework, database, auth, or API choice, or reversing one), proactively offer to record it with `/orient:decide` — don't wait to be asked. It also updates `architecture.md`.
- When a plan is approved before a build, treat any architectural choices inside it as decisions — offer to record them before starting.
- Never edit a past decision file. Supersede it with a new one.
- Trace execution paths on demand instead of maintaining a flow doc.
<!-- ORIENT:END -->
