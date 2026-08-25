# ADR-0011: plugin.json is the version source of truth, enforced by a gate

- Date: 2026-08-25
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
ADR-0009 added npm as a delivery channel and accepted a known trade-off: the version now
lives in two files, `plugins/orient/.claude-plugin/plugin.json` and `package.json`, which
can drift. Drift is not cosmetic here — Claude Code decides whether an update exists by
reading `plugin.json`'s version, so a stale version silently withholds shipped changes
from every installed user. That already happened once: the 0.1.1 security hardening was
committed with the version unchanged, and `claude plugin update` reported "already at the
latest version" while users kept the unhardened copy.

## Decision
`plugin.json` is the single source of truth for the version. `package.json` mirrors it
exactly — the same string, bumped in the same commit. A check (`scripts/check-version.mjs`)
compares the two and fails on mismatch. It runs as npm's `prepublishOnly` hook and as a CI
job, so a drifted pair cannot be published or merged.

## Why this over the alternatives
Deriving `package.json`'s version from `plugin.json` at build time was rejected: it needs a
build step, and orient has none by design. A documented convention with no enforcement was
rejected because that is what already failed — the release checklist said to bump the
version and the bump was still missed. Publishing from a single manifest was not available:
each ecosystem requires its own file at a fixed path.

## Trade-offs accepted
Both files must be edited for every release, and the gate will occasionally block a publish
that a human considered finished. That interruption is the point: it is cheaper than
shipping a version users cannot receive.

## Consequences
Version drift becomes a build failure instead of a silent non-update. The two-file cost of
ADR-0009's npm channel is now bounded by a check rather than by discipline.
