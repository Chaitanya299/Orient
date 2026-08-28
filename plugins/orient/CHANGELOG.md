# Changelog

## 0.1.6

- Installer no longer clobbers your edits. `npx @chaitanya299/orient opencode|codex` now
  records what it shipped (a hash manifest), so files you never touched update on their own,
  while a file you edited is kept and the new version is saved beside it as `<file>.new`.
  No more "delete everything and reinstall" to take an update.
- opencode's commit secret-gate patterns were restored to their bounded form, matching the
  Claude Code and Codex ports.
- `pre-commit.sh` treats the docs directory as literal text, not a regex.
- Relicensed to Apache-2.0 (from MIT); added `CONTRIBUTING.md` and a trademark policy.
  Releases can now publish with signed provenance.

## 0.1.5

- The pre-commit hook's reminder is now a bold, boxed banner (coloured when the terminal
  supports it, plain in logs/CI) instead of one easy-to-miss line. Same behavior otherwise:
  non-blocking by default, `ORIENT_BLOCK=1` to block, `--no-verify` to skip.

## 0.1.4

- New opt-in git `pre-commit` hook (`scripts/pre-commit.sh`): when a dependency or build
  manifest is staged with no ADR, it prints a one-line reminder to run `/orient:decide`.
  Non-blocking by default (`ORIENT_BLOCK=1` makes it block; `--no-verify` always skips).
  Git-native, so it works the same across every agent. Install is manual and documented —
  nothing auto-wires it.
- `commit`'s decision check is now a plain, list-based reminder, not a "structural change"
  guess: it keys off a fixed manifest list, has the model judge whether a real dependency
  or datastore changed (so version bumps don't trigger it), and never blocks. It no longer
  claims to detect a "matching ADR" — that isn't computable from a diff.
- Removed the `decide` decision-sweep idea from the 0.1.3 line of work: pairing an ADR to
  the change it documents isn't computable from git, and a check inside `decide` can't catch
  a decision you forgot to record. Capture stays on the commit and hook paths. (ADR-0014)

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
