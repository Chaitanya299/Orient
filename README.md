<h1 align="center">orient</h1>

<p align="center">
  <em>Never lose the thread of what you're building.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
  <img src="https://img.shields.io/badge/Claude_Code-plugin-D97757.svg" alt="Claude Code plugin" />
  <img src="https://img.shields.io/badge/opencode-commands-000000.svg" alt="opencode commands" />
  <img src="https://img.shields.io/badge/Codex-skills-10A37F.svg" alt="Codex skills" />
  <img src="https://img.shields.io/badge/network-none-brightgreen.svg" alt="No network" />
  <img src="https://img.shields.io/badge/telemetry-zero-brightgreen.svg" alt="Zero telemetry" />
</p>

<p align="center">
  <b>A living map of what you're building — where it stands, the decisions you made, and the <i>why</i> behind them.</b><br/>
  Kept cheap enough that it never gets in your way, or your agent's.
</p>

---

You've been building projects with AI for months. It proposes, you approve, and the project keeps moving. Fast.

Then you try to remember why you chose this database over another, or whether that feature ever actually got finished, and you can't. Nothing was keeping track. Each decision lived in a conversation that scrolled away, and the reasoning went with it.

orient is the fix. As you build, it keeps a small, honest record alongside your code: what's done, what's still half wired, what you're building next, and the reasoning behind the choices that got you here. So at any point you can open it and see exactly where your project stands and why, instead of reconstructing it from memory.

## What it actually does

orient gives your project three things it was missing:

- **A `STATE.md` that always answers "where am I?"** — current focus, what's done, what's blocked. One glance instead of an archaeology dig through commits.
- **A decision log that keeps the *why*.** Every real architectural call becomes a short, append-only record (an ADR), so "why did we drop SQLite?" has an answer six months later instead of a shrug. orient offers to log a decision the moment you make one — you don't have to remember — and it updates your architecture notes to match. `init` even mines your git history and drafts candidate ADRs from the commits that look like real turning points, so you don't start from a blank page. You approve each one.
- **Answers on demand, never stale docs.** Trace a request through the code, or check where things stand, in a single command — instead of maintaining diagrams that rot the moment the code changes.

All of it lives in files that cost nothing until something reads them, with only ~14 lines of pointers in your instructions file. Nothing preloaded, nothing crowding the work.

```
docs/
  STATE.md          # what's built, in progress, blocked  (read this first)
  architecture.md   # entry points and module boundaries
  decisions/        # one append-only ADR per real decision
```

## Quickstart (Claude Code)

```
/plugin marketplace add Chaitanya299/Orient
/plugin install orient@chaitanya299-plugins
```

Type those into Claude Code's prompt (they start with `/`). From a plain terminal instead, run `claude plugin marketplace add Chaitanya299/Orient` then `claude plugin install orient@chaitanya299-plugins`.

Then, in a repo you want to track:

```
/orient:init
```

It surveys your repo in a read-only subagent, shows you **everything** it plans to write, and writes nothing until you approve. From then on, you and your agent work from one clear picture of what you're building.

## One idea, three agents

orient ships for all three major coding agents. Same behavior, native to each.

| Agent | How it ships | Install |
|---|---|---|
| **Claude Code** | Marketplace plugin | Two commands above |
| **opencode** | `.opencode` commands + agents | `npx @chaitanya299/orient opencode` |
| **Codex** | Native skills (`.agents/skills`) | `npx @chaitanya299/orient codex` |

The `npx` installer has zero dependencies — it just copies the files into place (add
`--global` to install for every project). Prefer to copy them yourself? The manual
steps are in each port's README: [opencode](./opencode/README.md), [Codex](./codex/README.md).

> **Claude Code is different — use the marketplace, not npm.** Claude Code loads plugins
> only through its marketplace (the two commands under Quickstart), never from `npm`. So
> `npm i @chaitanya299/orient` sets up the opencode and Codex ports; for Claude Code, run
> `claude plugin marketplace add Chaitanya299/Orient` then `claude plugin install orient@chaitanya299-plugins`.

## The workflow — the six commands, in the order you use them

| When | Command | What it does |
|---|---|---|
| Once per project | `init` | Scaffold the docs and seed ADRs from your git history. |
| Start of a session | `status` | "Where am I?" Reads STATE.md alone. Nearly free. |
| While building | `trace` | Understand how one path runs, on demand, with `file:line` refs. |
| When you decide something | `decide` | Record the *why* as an ADR, and update architecture.md to match. |
| Before you commit | `commit` | Draft a what / why / findings message for review. |
| End of a session | `sync` | Update STATE.md to match what actually changed. |

You won't run all six every day. The two you'll lean on most are `status` (to pick up
where you left off) and `decide` (so the reasoning never scrolls away) — and orient offers
`decide` on its own the moment you make a real decision, so you just say yes.

*(Claude Code uses `/orient:status`, opencode `/orient-status`, Codex `$orient-status` — same six everywhere.)*

## See it in action

orient runs on itself. Browse [`docs/`](./docs) in this repo to see exactly what it
produces on a real project — a live [`STATE.md`](./docs/STATE.md), an
[`architecture.md`](./docs/architecture.md), and a full
[decision log](./docs/decisions) you can read end to end. That folder is the example.

## Why it stays cheap

Your instructions file loads in full into every session, and long files measurably reduce how well a model follows any single instruction. So orient keeps its always-on footprint to a handful of short pointers. Everything substantial — state, decisions, architecture — lives in files that only load when read. That's the whole trick, and it's why orient holds up on a repo that's been alive for years.

## Secure by design

orient runs on your machine and reads your repos, so it's built to be safe with them:

- **No network. No telemetry.** It cannot send your code anywhere.
- **Read-only survey agents** — they analyze, never modify.
- **Secret-blind** — the agents never open `.env`/keys and never copy a secret value into a committed doc.
- **`commit` won't ship a secret** — it refuses to commit a `.env` or a detected key.
- **Nothing writes silently** — every write is a proposal you approve.

Full details and the reusable `.env` standard: [SECURITY.md](./SECURITY.md).

## FAQ

**Does it work on a huge, old repo?**
That's the point. The bigger the repo, the more you save by not re-deriving its context every session.

**Will it bloat my `CLAUDE.md` / `AGENTS.md`?**
No. It adds ~14 lines of pointers between markers, and never touches anything outside them. Re-running `init` never duplicates the block.

**Does it change my code?**
Never without asking. The survey and trace agents are read-only; the writing commands draft first and wait for your yes.

**What if I don't keep the docs current?**
Then they're just context, not enforcement — orient makes the right thing cheap, but a convention that *must* hold belongs in a test or a hook, not a doc. `sync` exists to make staying current a one-command habit.

## License

MIT, by [Chaitanya299](https://github.com/Chaitanya299). See [LICENSE](./plugins/orient/LICENSE).

*by ~ Chaitanya♥️*
