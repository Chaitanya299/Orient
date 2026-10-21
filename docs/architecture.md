# Architecture — <!-- updated: 2026-10-21 -->

## Entry points
- **Claude Code plugin** (`plugins/orient/`, served from `main` by `.claude-plugin/marketplace.json`):
  six skills as `/orient:<name>`. `init` and `commit` are user-only (`disable-model-invocation`);
  `status`, `sync`, `decide`, `trace` are model-invocable.
- **npm package** `@chaitanya299/orient` (`bin/orient.mjs`, zero dependencies): `npx … opencode`
  or `npx … codex` copies the same six commands into `.opencode/` or `.agents/skills/` (ADR-0009).
- **Session start** (Claude Code only): `hooks/hooks.json` → `scripts/orient.sh`.
- **Git pre-commit** (opt-in, any agent): `scripts/pre-commit.sh` copied into `.git/hooks/` (ADR-0014).

## Component boundaries
- `plugins/orient/skills/`, `opencode/commands/`, `codex/skills/`: three ports of the same six
  commands. A behavior change lands in all three.
- `plugins/orient/agents/` + `opencode/agents/`: read-only `repo-cartographer` and `flow-tracer`,
  sandboxed with `disallowedTools` (ADR-0005).
- `plugins/orient/scripts/`: the only shell code. `orient.sh` (focus, plus drift warning),
  `migrate-adrs.sh` (old ADR names → `NNNN.md`, ADR-0019), `pre-commit.sh`.
- `bin/orient.mjs`: per-file copy with a hash manifest (edited files kept, new version as `.new`).
  It writes the `AGENTS.md` pointer block (ADR-0016) and runs `migrate-adrs.sh` on local installs.
- `plugins/orient/templates/`: what `init` writes into other repos. Not this repo's own docs.
- `scripts/check-version.mjs`: `plugin.json` is the version source, `package.json` mirrors it (ADR-0011).
- `.github/workflows/`: `secret-scan.yml` (gitleaks + version-sync on every push and PR),
  `publish.yml` (npm publish with provenance on a `v*` tag).

## Critical paths
- `init` → `repo-cartographer` surveys → draft docs + pointer block → approval → write.
- `decide` → next `NNNN.md` (ADR-0018) → approval → write; then structural changes go to this
  file and the STATE Shape diagram on a second approval; this file's `updated:` marker is set
  for every ADR (ADR-0020).
- Session start → `orient.sh` → `migrate-adrs.sh` → print current focus → warn if an ADR is newer
  than this file's `updated:` marker.
- Release → bump `plugin.json` + `package.json` → push `main` (Claude Code users update from the
  marketplace) → tag `v*` (npm).

## The one rule that governs every change
Anything on the always-on path — skill descriptions, agent descriptions, the hook, the `CLAUDE.md` block — costs every user on every session. Everything else is free until read. Weigh every addition against that line: on the always-on path it needs a reason recorded in an ADR; off it, it is free.
