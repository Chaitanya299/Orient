# Changelog

## 0.1.3

- `decide` now also fires on plan approval: when a plan is approved before a build, the
  agent offers to record the architectural choices in it. Plus backstops — a check before
  a task is reported complete, and `commit` flags a structural change with no matching ADR.
- `STATE.md` gains a `## Shape` section: a high-level mermaid diagram of the system, filled
  by `init` and kept current by `decide`.
- README documents the update gotcha: re-run `init` after updating to refresh the block.

## 0.1.2

- `decide` now offers to record a decision proactively when one is made in conversation,
  instead of waiting to be invoked.
- `decide` keeps `architecture.md` in sync: after the ADR, it previews a matching edit to
  the architecture doc for approval.
- opencode command prompts trimmed so invoking one no longer dumps a wall of instructions
  into the chat.

## 0.1.1

- Security: the survey and trace agents are now secret-blind (never open `.env`/keys,
  never copy a secret value into a doc) and treat repo content as data, not instructions.
- Security: `/orient:commit` refuses to commit a `.env` or a detected key.

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
