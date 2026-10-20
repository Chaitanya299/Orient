# ADR-0002: CLAUDE.md holds pointers, not content

- Date: 2026-08-19
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
`CLAUDE.md` is loaded in full into every session, which makes every line it holds a permanent tax on the context window. Long instruction files cost tokens directly, and — more insidiously — they measurably reduce how reliably the model follows any single instruction, because the lines that matter are diluted by the ones that don't.

## Decision
The block Orient writes into `CLAUDE.md` stays at or under twenty lines and contains only pointers — names of files to read on demand when the work actually calls for them. The content lives in the files; only the pointers live in `CLAUDE.md`.

## Why this over the alternatives
`@path` imports were rejected: imported files load at session launch just as inlined text would, so they organize the prose without saving any context — the worst of both worlds, tidy but not cheap. Inlining the docs directly was rejected for the same cost, plus the adherence loss above.

## Trade-offs accepted
One extra read step at the moment the docs are genuinely needed.

## Consequences
The docs directory can grow without bound at zero always-on cost. You pay only for what you read.
