# orient

**Know where you are in a codebase** — what's built, what's in progress, what's blocked,
and the *why* behind past decisions — without burning context on every session.

A Claude Code plugin, distributed through this marketplace repo.

## The problem

On a large, long-running repo, orientation lives nowhere reliable. Either there are no
docs and every session re-derives the same context, or there's a pile of docs that go
stale or grow so long they cost real tokens on every launch and drown out your actual
instructions.

`CLAUDE.md` loads in full into *every* session. Content you put there is a permanent tax.

## What orient does

It scaffolds a small docs system whose real content costs **zero tokens until something
reads it**, and writes only ~20 lines of *pointers* into `CLAUDE.md` — never content,
never `@imports`. State, decisions, and architecture live in files that load on demand:

```
docs/
  STATE.md          # current focus, what's done, what's blocked
  architecture.md   # entry points and module boundaries
  decisions/        # one append-only ADR per architectural decision
```

The always-on footprint is a handful of short skill descriptions and a session-start
hook that prints just your current focus — and only in repos you've set up.

## Install

```
/plugin marketplace add Chaitanya299/Orient
/plugin install orient@parasanachaitanya99-plugins
```

Then, in a repo you want to track, **run `/orient:init` first**. It surveys the repo in
a subagent (up to ~a minute on a big one), shows you everything it plans to write, and
writes nothing until you approve.

### Try it without installing

```
git clone https://github.com/Chaitanya299/Orient
claude --plugin-dir ./Orient/plugins/orient
```

## Skills

| Command | What it does |
|---|---|
| `/orient:init` | Scaffold or repair the docs system. Run once per project. |
| `/orient:status` | Where the project stands, read from `STATE.md` alone. |
| `/orient:sync` | Update `STATE.md` to match what actually changed this session. |
| `/orient:decide` | Record an architectural decision as a numbered ADR. |
| `/orient:commit` | Draft a commit message (what / why / findings) for review. |
| `/orient:trace` | Trace one execution path on demand, with `file:line` references. |

Full details, configuration, and limitations: **[plugins/orient/README.md](./plugins/orient/README.md)**.

## Limitations

Docs are context, not enforcement. orient makes the right thing cheap and easy, but it
can't *make* anyone keep `STATE.md` current. Anything that must hold — an invariant, a
convention — belongs in a test, a lint rule, or a hook, not a doc.

## License

MIT — see [plugins/orient/LICENSE](./plugins/orient/LICENSE).
