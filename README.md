<h1 align="center">orient</h1>

<p align="center">
  <em>Never lose the thread of what you're building.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-Apache_2.0-blue.svg" alt="License: Apache 2.0" />
  <img src="https://img.shields.io/badge/Claude_Code-plugin-D97757.svg" alt="Claude Code plugin" />
  <img src="https://img.shields.io/badge/opencode-commands-000000.svg" alt="opencode commands" />
  <img src="https://img.shields.io/badge/Codex-skills-10A37F.svg" alt="Codex skills" />
  <img src="https://img.shields.io/badge/network-none-brightgreen.svg" alt="No network" />
  <img src="https://img.shields.io/badge/telemetry-zero-brightgreen.svg" alt="Zero telemetry" />
  <img src="https://img.shields.io/npm/dt/@chaitanya299/orient.svg" alt="Downloads" />
</p>

<p align="center">
  <b>A living map of what you're building: where it stands, the decisions you made, and the <i>why</i> behind them.</b><br/>
  Kept cheap enough that it never gets in your way, or your agent's.
</p>

---

You've been building projects with AI for months. It proposes, you approve, and the project keeps moving. Fast.

Then you try to remember why you chose this database over another, or whether that feature ever actually got finished, and you can't. Nothing was keeping track. Each decision lived in a conversation that scrolled away, and the reasoning went with it.

orient is the fix. As you build, it keeps a small, honest record alongside your code: what's done, what's still half wired, what you're building next, and the reasoning behind the choices that got you here. So at any point you can open it and see exactly where your project stands and why, instead of reconstructing it from memory.

## What it actually does

orient gives your project three things it was missing:

- **A `STATE.md` that always answers "where am I?"** Current focus, what's done, what's blocked. One glance instead of an archaeology dig through commits.
- **A decision log that keeps the *why*.** Every real architectural call becomes a short, append-only record (an ADR), so "why did we drop SQLite?" has an answer six months later instead of a shrug. orient offers to log a decision the moment you make one, so you don't have to remember, and it updates your architecture notes to match. `init` even mines your git history and drafts candidate ADRs from the commits that look like real turning points, so you don't start from a blank page. You approve each one.
- **Answers on demand, never stale docs.** Trace a request through the code, or check where things stand, in a single command, instead of maintaining diagrams that rot the moment the code changes.

All of it lives in files that cost nothing until something reads them, with only ~14 lines of pointers in your instructions file. Nothing preloaded, nothing crowding the work.

```
docs/
  STATE.md          # what's built, in progress, blocked  (read this first)
  architecture.md   # entry points and module boundaries
  decisions/        # one append-only ADR per real decision
```

## Quickstart (Claude Code)

Inside Claude Code:

```
/plugin marketplace add Chaitanya299/Orient
/plugin install orient@chaitanya299-plugins
```

From terminal:

```bash
claude plugin marketplace add Chaitanya299/Orient
claude plugin install orient@chaitanya299-plugins
```

Then, in a repo you want to track:

```
/orient:init
```

It surveys your repo in a read-only subagent, shows you everything it plans to write, and writes nothing until you approve. From then on, you and your agent work from one clear picture of what you're building.

## Install for opencode

```bash
npx @chaitanya299/orient opencode
```

This copies six commands and two agents into `.opencode/`, and writes orient's pointer block into your project's `AGENTS.md` (the block that makes the agent offer to record decisions), so decision-capture works from the first session. Restart opencode, then run `/orient-init` to scaffold the docs. Re-running the installer just refreshes the block in place, and it never touches anything else in your `AGENTS.md`.

For global install (available in every project):

```bash
npx @chaitanya299/orient opencode --global
```

## Install for Codex

```bash
npx @chaitanya299/orient codex
```

This copies six skills into `.agents/skills/`, and writes orient's pointer block into your project's `AGENTS.md` (the block that makes the agent offer to record decisions), so decision-capture works from the first session. Restart Codex, then run `$orient-init` to scaffold the docs. Re-running the installer just refreshes the block in place, and it never touches anything else in your `AGENTS.md`.

For global install (available in every project):

```bash
npx @chaitanya299/orient codex --global
```

## The workflow, the six commands in the order you use them

| When | Command | What it does |
|---|---|---|
| Once per project | `init` | Scaffold the docs and seed ADRs from your git history. |
| Start of a session | `status` | "Where am I?" Reads STATE.md alone. Nearly free. |
| While building | `trace` | Understand how one path runs, on demand, with `file:line` refs. |
| When you decide something | `decide` | Record the *why* as an ADR, and update architecture.md to match. |
| Before you commit | `commit` | Draft a what / why / findings message for review. |
| End of a session | `sync` | Update STATE.md to match what actually changed. |

You won't run all six every day. The two you'll lean on most are `status` (to pick up
where you left off) and `decide` (so the reasoning never scrolls away), and orient offers
`decide` on its own the moment you make a real decision, so you just say yes.

*(Claude Code uses `/orient:status`, opencode `/orient-status`, Codex `$orient-status`, the same six everywhere.)*

> **Read what it drafts before you approve.** The `commit` messages and `decide` ADRs are
> AI-drafted from your diff and the conversation. They're strong starting points, not gospel.
> They can miss a subtle reason, overstate a finding, or record the wrong *why*. orient never
> writes without your yes, so treat that yes as a real review. Check the message and the ADR
> against what actually changed, and fix anything wrong or missing before you approve.

## See it in action

orient runs on itself. Browse [`docs/`](./docs) in this repo to see exactly what it
produces on a real project: a live [`STATE.md`](./docs/STATE.md), an
[`architecture.md`](./docs/architecture.md), and a full
[decision log](./docs/decisions) you can read end to end. That folder is the example.

## Updating

When you update the plugin or the npm package, orient's files change, but the block it
already wrote into your project's `CLAUDE.md` / `AGENTS.md` does **not**. To pick up new
behavior (like a smarter `decide`), **re-run `init` in each tracked project**. It's safe:
it only replaces the text between the `ORIENT` markers, and never touches your `STATE.md`
or existing ADRs.

- **Claude Code:** `claude plugin update orient@chaitanya299-plugins`, restart, then re-run `/orient:init`.
- **opencode / Codex:** `npx @chaitanya299/orient@latest opencode` (or `codex`), then re-run init.

## Why it stays cheap

Your instructions file loads in full into every session, and long files measurably reduce how well a model follows any single instruction. So orient keeps its always-on footprint to a handful of short pointers. Everything substantial (state, decisions, architecture) lives in files that only load when read. That's the whole trick, and it's why orient holds up on a repo that's been alive for years.

## Secure by design

orient runs on your machine and reads your repos, so it's built to be safe with them:

- **No network. No telemetry.** It cannot send your code anywhere.
- **Read-only survey agents.** They analyze, never modify.
- **Secret-blind.** The agents never open `.env`/keys and never copy a secret value into a committed doc.
- **`commit` won't ship a secret.** It refuses to commit a `.env` or a detected key.
- **Nothing writes silently.** Every write is a proposal you approve.

Full details and the reusable `.env` standard: [SECURITY.md](./SECURITY.md).

## FAQ

**Does it work on a huge, old repo?**

That's the point. The bigger the repo, the more you save by not re-deriving its context every session.

**Will it bloat my `CLAUDE.md` / `AGENTS.md`?**

No. It adds about 14 lines of pointers between markers, and never touches anything outside them. Re-running `init` never duplicates the block.

**Does it change my code?**

Never without asking. The survey and trace agents are read-only. The writing commands draft first, then wait for your yes.

**Should I trust the commit messages and ADRs it writes?**

Read them first. They're AI-drafted from the diff and the conversation. They're solid drafts, but they can miss a reason, overstate a finding, or capture the wrong *why*. orient shows every draft and waits for your approval, so use that moment to review it and fill in anything missing, not to rubber-stamp.

**What if I don't keep the docs current?**

Then they're just context, not enforcement. orient makes the right thing cheap, but a convention that *must* hold belongs in a test or a hook, not a doc. `sync` exists to make staying current a one-command habit.

**Can something remind me at commit time?**

Yes, opt-in. orient ships a git `pre-commit` hook (`plugins/orient/scripts/pre-commit.sh`) that nudges when a dependency or build manifest (`package.json`, `go.mod`, `Cargo.toml`, `Dockerfile`, and so on) is staged with no ADR. It's a plain reminder, not a decision detector, and it never blocks the commit. This is the one deterministic piece, because git runs it, so it fires no matter which agent (or none) you commit from. To use it, copy that script into a tracked repo's `.git/hooks/pre-commit` and `chmod +x` it. `ORIENT_BLOCK=1` makes it block instead of nudge, and `git commit --no-verify` always skips it.

## License

Orient is licensed under the Apache License 2.0. See [LICENSE](LICENSE).

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines and [TRADEMARK.md](TRADEMARK.md) for trademark usage policy.

© 2026 Parasana Sai Chaitanya
