# ADR-0016: The npm installer writes the AGENTS.md pointer block deterministically

- Date: 2026-08-28
- Status: accepted
- Supersedes: none (hardens the always-on path first defined in ADR-0012)
- Superseded by: none

## Context
Every session's decision-capture depends on one artifact: the pointer block in the project's
`CLAUDE.md` / `AGENTS.md`. It names the docs and carries the triggers that make the agent offer
an ADR (`ADR-0012`) — "when a plan is approved," "before reporting a task complete." No block,
no triggers, and nothing downstream can fire.

Until now that block was written **only** by `init` step 6, which is model-driven. In practice
that step is skippable: a real opencode run installed cleanly (`0.1.6`), the user ran `init`,
built a feature, and no ADR was ever offered. `grep` confirmed the block was simply absent from
`AGENTS.md`. The model had run `init` but never landed step 6 — or paraphrased it, or the write
was not approved. The most important durable artifact in the whole system was gated on an LLM
faithfully completing a seven-step flow, which is exactly the "model must notice" fragility
`ADR-0014` warned about, now at the layer *below* the triggers.

The block is static markdown; only `$DOCS_DIR` varies, and it defaults to `docs`. There is no
reason its landing should depend on the model.

## Decision
For project-local opencode and Codex installs, `bin/orient.mjs` writes the pointer block into
`<project>/AGENTS.md` itself, at `npx` time, with no model in the loop.

- **Source of truth stays single.** The installer does not carry its own copy of the block. It
  reads the block straight out of the init command file it already ships
  (`opencode/commands/orient-init.md`, `codex/skills/orient-init/SKILL.md`), substitutes
  `$DOCS_DIR` (`docs`), and injects it. A self-check throws if that file's shape ever drifts
  from what the parser expects, so a format change fails loudly at release instead of shipping
  a broken installer.
- **Marker rules mirror `init` step 6.** Replace between `<!-- ORIENT:START/END -->` if both are
  present (idempotent on re-run), append if neither is, create the file if absent. Refuse to
  touch a file with CRLF or a lone/duplicated marker rather than corrupt it — `init` (or the
  user) resolves that rare case.
- **`--global` is unchanged.** A global install has no single project `AGENTS.md`, so it prints
  a note to run `init` per repo. `init` remains the writer there.
- **`init` is now a backstop, not the sole writer.** Its step-1 note tells the model to write
  the block first if it might not finish; for a project-local install the installer already
  wrote it, so step 6 just refreshes it in place.

## Why this over the alternatives
- **Strengthen `init`'s wording only** — still model-dependent, the exact failure we hit. Kept
  as the backstop, not the guarantee.
- **A separate template file the installer reads** — a second copy of the block to keep in sync.
  Reading the shipped init file removes the copy and the drift with it.
- **Inject via a hook or postinstall side effect** — would write silently and off the project
  root; violates "nothing writes without the user seeing it" and misses the project entirely.

## Trade-offs accepted
- **The installer now writes outside `.opencode/` / `.agents/`.** `npx … opencode` touches
  `AGENTS.md` at the project root — a wider blast radius than pure file delivery. Mitigated by
  the marker discipline (only ever the block between markers) and the refuse-to-corrupt guards.
- **Claude Code is not covered.** It installs as a plugin with no `npx` step, so its `CLAUDE.md`
  block is still model-written by `init`. The step-1 backstop is its only hardening; a
  deterministic guarantee there would need a silent hook write, which we decline.
- **Custom docs dirs default to `docs` at install.** A user who wants another dir re-runs
  `init`, which re-templates the block between the markers.

## Consequences
- Decision-capture works on a fresh opencode/Codex repo without depending on the model finishing
  `init`. The triggers are present from the moment the package is installed.
- The installer gains a real integration surface (AGENTS.md); the local suite covers create,
  idempotent replace, append-preserving-user-content, and the corruption-refusal guards.
