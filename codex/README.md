# orient — for Codex

Know where you are in a codebase — current state, past decisions, and the *why*
behind them — without burning context. This is the [Codex](https://developers.openai.com/codex)
port of the [Claude Code plugin](../plugins/orient).

Codex ships orient as **skills** (the [open agent skills standard](https://agentskills.io)).
Codex holds only each skill's name and description until it decides to use one, then
loads the full `SKILL.md` — the same progressive-disclosure economics orient is built
around.

## Install

**Fastest** — the zero-dependency installer:

```bash
npx @chaitanya299/orient codex            # into ./.agents/skills
npx @chaitanya299/orient codex --global   # into ~/.agents/skills
```

Or copy the files by hand.

**Globally** (available in every repo you open):

```bash
mkdir -p ~/.agents/skills
cp -R codex/skills/* ~/.agents/skills/
```

**Or per-project** (checked into one repo, shared with your team):

```bash
mkdir -p .agents/skills
cp -R codex/skills/* .agents/skills/
```

Restart Codex (or open a new chat) so it rescans skills. Then, in a repo you want to
track, invoke `$orient-init`.

## Skills

| Skill | What it does |
|---|---|
| `orient-init` | Scaffold or repair the docs system. Run once per project. |
| `orient-status` | Where the project stands, read from `STATE.md` alone. |
| `orient-sync` | Update `STATE.md` to match what actually changed this session. |
| `orient-decide` | Record an architectural decision as a numbered ADR. |
| `orient-commit` | Draft a commit message (what / why / findings) for review. |
| `orient-trace` | Trace one execution path, with `file:line` refs. |

Invoke a skill explicitly by typing `$` and its name (e.g. `$orient-init`). Codex may
also invoke the read-only skills implicitly when a prompt matches their description.

`orient-init` and `orient-commit` are set to **explicit-only** (`allow_implicit_invocation: false`
in each skill's `agents/openai.yaml`) because they write files or commit — Codex will
never fire them on its own.

## How it stays cheap

The real content — state, decisions, architecture — lives in files that load only
when read. `AGENTS.md` gets a short pointer block that names those files and tells the
agent to read them on demand. Codex reads `AGENTS.md` into context at startup (32 KiB
cap), so keeping it to pointers, not content, is what makes this affordable.

## Differences from the Claude Code version

- **No subagent isolation.** The Claude Code plugin ran the repo survey and the flow
  trace in read-only subagents so the heavy reading burned *their* context, not yours.
  Codex is single-agent, so `orient-init` and `orient-trace` do that work inline. Same
  output, but the reading counts against your main context window.
- **Writes to `AGENTS.md`**, not `CLAUDE.md` — Codex's native instructions file.
- **`disable-model-invocation` → `allow_implicit_invocation: false`** in
  `agents/openai.yaml` for the two writing skills.
- **`docs_dir` is conversational**, not stored config — say "use the `documentation`
  folder" when invoking `orient-init`; it defaults to `docs`.

## Limitations

Docs are context, not enforcement. orient makes the right thing cheap and easy, but it
can't *make* anyone keep `STATE.md` current. Anything that must hold — an invariant, a
convention — belongs in a test, a lint rule, or a hook, not a doc.
