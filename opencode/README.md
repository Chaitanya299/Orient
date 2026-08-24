# orient — for opencode

Know where you are in a codebase — current state, past decisions, and the *why*
behind them — without burning context. This is the [opencode](https://opencode.ai)
port of the [Claude Code plugin](../plugins/orient).

opencode has no plugin marketplace, so orient ships here as plain command and agent
files you drop into your opencode config.

## Install

**Globally** (available in every project):

```bash
mkdir -p ~/.config/opencode/commands ~/.config/opencode/agents
cp opencode/commands/*.md ~/.config/opencode/commands/
cp opencode/agents/*.md   ~/.config/opencode/agents/
```

**Or per-project** (checked into one repo):

```bash
mkdir -p .opencode/commands .opencode/agents
cp opencode/commands/*.md .opencode/commands/
cp opencode/agents/*.md   .opencode/agents/
```

opencode loads these at startup. Restart opencode, then run `/orient-init` in a repo
you want to track.

> **Directory names:** current opencode (opencode.ai) uses plural `commands/` and
> `agents/`. If your build doesn't pick them up, it's an older fork — try singular
> `command/` and `agent/`.

## Commands

| Command | What it does |
|---|---|
| `/orient-init [docs_dir]` | Scaffold or repair the docs system. Run once per project. |
| `/orient-status` | Where the project stands, read from `STATE.md` alone. |
| `/orient-sync` | Update `STATE.md` to match what actually changed this session. |
| `/orient-decide` | Record an architectural decision as a numbered ADR. |
| `/orient-commit` | Draft a commit message (what / why / findings) for review. |
| `/orient-trace <route\|command\|function>` | Trace one execution path, with `file:line` refs. |

`/orient-init` surveys the repo in the `repo-cartographer` subagent, shows you
everything it plans to write, and writes nothing until you approve. It scaffolds
`docs/STATE.md`, `docs/architecture.md`, `docs/decisions/`, and a pointers-only block
in your `AGENTS.md`.

## How it stays cheap

The real content — state, decisions, architecture — lives in files that load only
when read. `AGENTS.md` gets a short pointer block that names those files and tells the
agent to read them on demand (never preloaded). Both subagents are read-only
(`permission: { edit: deny }`), so a survey or trace can't mutate your repo.

## Differences from the Claude Code version

- **No session-start auto-orientation.** The Claude Code plugin printed your current
  focus at session start via a hook. opencode has no supported way to inject context
  when a session begins, so orient relies on the `AGENTS.md` block (which tells the
  agent to read `STATE.md` first when picking up work) and on `/orient-status` for
  on-demand orientation. This is the more idiomatic opencode approach anyway.
- **`docs_dir` is an argument, not stored config.** Pass it to `/orient-init` (e.g.
  `/orient-init documentation`); it defaults to `docs`.
- **Templates are embedded** in `orient-init` rather than shipped as separate files,
  since opencode commands have no stable plugin-root path to resolve.

## Limitations

Docs are context, not enforcement. orient makes the right thing cheap and easy, but it
can't *make* anyone keep `STATE.md` current. Anything that must hold — an invariant, a
convention — belongs in a test, a lint rule, or a hook, not a doc.
