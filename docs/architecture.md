# Architecture

## Entry points
Six skills, invoked as `/orient:<name>`:
- `init` — user-only. Scaffolds the docs system into a repo; too consequential to fire on its own.
- `commit` — user-only. Drafts a commit message behind an approval gate (ADR-0006).
- `status`, `sync`, `decide`, `trace` — model-invocable. Safe for the model to reach for mid-task.

## Component boundaries
- `skills/` — user-facing behavior. What a person invokes, and what the model may invoke on their behalf.
- `agents/` — read-only exploration. `repo-cartographer` and `flow-tracer`, sandboxed via `disallowedTools` (ADR-0005).
- `hooks/` — unconditional per-session cost. Anything here runs on every session in every repo that installed it, used or not.
- `templates/` — what `init` writes into other people's repos. Never read by this repo at runtime; do not confuse with the docs this repo keeps for itself.

## Critical paths
- `/orient:init` → `repo-cartographer` surveys → draft docs → human approval → write.
- `/orient:commit` → read staged diff → draft message → approval gate → commit (ADR-0006).
- session start → `orient.sh` → emit the current-focus block from `STATE.md`.

## The one rule that governs every change
Anything on the always-on path — skill descriptions, agent descriptions, the hook, the `CLAUDE.md` block — costs every user on every session. Everything else is free until read. Weigh every addition against that line: on the always-on path it needs a reason recorded in an ADR; off it, it is free.
