# Orient

Know where you are in a codebase — current state, past decisions, and the *why*
behind them — without burning context.

## The problem

On a large, long-running repo you can't tell what's built, what's in progress, what's
blocked, or why past decisions were made. The usual fix is a pile of docs that either
go stale or get so long they cost real tokens on every session and drown out your
actual instructions.

## What Orient does

It scaffolds a small documentation system whose real content costs **zero tokens until
something reads it**, and writes at most ~20 lines of *pointers* into your `CLAUDE.md` —
never content, never `@imports`.

## Install

```
/plugin marketplace add parasanachaitanya99/orient
/plugin install orient@parasanachaitanya99-plugins
```

Then, in a repo you want to track, **run `/orient:init` first**. The first `init`
surveys your repo (in a subagent) and may take up to a minute; it shows you everything
it plans to write and writes nothing until you approve.

## Skills

- `/orient:init` — scaffold or repair the docs system. Run once per project.
- `/orient:status` — where the project stands, read from `STATE.md` alone.
- `/orient:sync` — update `STATE.md` to match what actually changed this session.
- `/orient:decide` — record an architectural decision as a numbered ADR.
- `/orient:commit` — draft a commit message (what / why / findings) for review.
- `/orient:trace` — trace one execution path on demand, with `file:line` references.

## Why it's cheap

`CLAUDE.md` loads in full into every session, and long files reduce instruction
adherence. So Orient keeps its always-on footprint tiny: pointers only in
`CLAUDE.md`, a session-start hook that prints just your current focus (and only when
you've set the repo up), and skill descriptions kept short. Everything substantial —
state, decisions, architecture — lives in files that only load when read.

## Configuration

Set at enable time:

- **`docs_dir`** (default `docs`) — where `STATE.md`, `architecture.md`, and
  `decisions/` live, relative to the repo root.
- **`auto_orient`** (default `true`) — print the current focus from `STATE.md` at
  session start.

## Limitations

Docs are context, not enforcement. Orient makes the right thing easy and cheap, but
it can't *make* anyone keep `STATE.md` current or record a decision. Anything that must
hold — a convention, an invariant — belongs in a test, a lint rule, or a hook, not in a
doc. The agents are read-only by removing `Write`/`Edit`; they retain `Bash` for `git
log` and greps, so treat "read-only" as intent, not a sandbox.
