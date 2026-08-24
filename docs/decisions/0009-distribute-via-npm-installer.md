# ADR-0009: Distribute via an optional npm installer

- Date: 2026-08-24
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
orient's founding principle is pure markdown + JSON + one POSIX shell script — no
Node, no npm, no dependencies. But the opencode and Codex ports install by copying
files, which meant a manual `cp` dance, and the project had no presence on npm, where
many developers look first and expect a one-line `npx` install.

## Decision
Ship an optional npm package (`@chaitanya299/orient`) whose only job is to copy the
bundled command/skill files into place — `npx @chaitanya299/orient opencode|codex`. It
has zero runtime dependencies (Node stdlib `fs.cpSync` only). The plugin content it
installs stays pure markdown/JSON/shell; Node is a delivery runtime, never a dependency
of the thing being delivered.

## Why this over the alternatives
Staying off npm was rejected: it loses discoverability and keeps the opencode/Codex
install as a manual copy. A full CLI framework (commander, prompts, chalk) was rejected
because adding dependencies to solve a directory copy directly contradicts the founding
principle — a ~60-line stdlib script does the whole job.

## Trade-offs accepted
A `package.json` and `bin/` now live at the repo root, and the install story has two
shapes to keep in sync (marketplace/copy vs `npx`). The npx path requires Node ≥16.7.

## Consequences
The plugin's dependency-free nature is preserved — the constraint applies to what
orient *is*, not to how it's delivered. Claude Code still installs via the marketplace;
npm is an added channel, not a replacement.
