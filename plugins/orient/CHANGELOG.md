# Changelog

## 0.1.0

Initial release.

- `/orient:init` — scaffold or repair a context-cheap docs system (STATE.md,
  architecture.md, decisions/), surveying the repo in a read-only subagent and seeding
  candidate ADRs from git history. Every write is a proposal the user approves.
- `/orient:status` — report current focus / in progress / blocked from STATE.md alone.
- `/orient:sync` — reconcile STATE.md with uncommitted work.
- `/orient:decide` — record an architectural decision as a numbered, append-only ADR.
- `/orient:commit` — draft a what / why / findings commit message for review before committing.
- `/orient:trace` — trace one execution path on demand with file:line references.
- Session-start hook prints the current focus from STATE.md (configurable), and nudges
  once after install to run `/orient:init`.
- Writes at most ~20 lines of pointers into CLAUDE.md, wrapped in `ORIENT` markers so
  re-running init replaces only its own block.
