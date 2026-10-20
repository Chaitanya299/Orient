# ADR-0015: Test the plumbing deterministically, the skills semantically

- Date: 2026-08-27
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context

orient shipped to npm and the marketplace through 0.1.5 with no tests. CI ran
gitleaks and the version gate; nothing verified behaviour.

The obvious move — "test every subcommand" — runs into a split in what orient
actually is. About 197 lines are executable (`bin/orient.mjs`, two `.mjs`
scripts, two POSIX shell hooks). About 845 lines are SKILL.md prose: instructions
a model follows. A script can assert the first exactly and the second not at all.

A first draft proposed ~40 shell cases covering only the executables. Reviewing
it surfaced the real problem: running the proposed structural checks against the
repo showed **every one passing**, while the actual defects found that day were
found by reading and running the code. The draft tested where the light was, and
two of its cases could not have worked as written — one asserted an env var
neither script reads, another ignored that `check-version.mjs` resolves paths
from its own file location rather than cwd.

## Decision

Two layers, split by what is verifiable, not by what is convenient.

**Deterministic layer** — `tests/*.test.mjs`, run by `node --test` locally
before a release. Covers the executables' real branches, plus contract invariants
that catch drift between the plugin and its two ports. Kept in `tests/`, which is
gitignored — a maintainer's safety net, never committed and never shipped.

**Semantic layer** — `.claude/agents/repo-test.md`, dispatched on demand. Drives
a model through the six skills against a throwaway sandbox and reports whether
`/orient:decide` actually produced a well-formed ADR. Not in CI, and not claimed
to be.

## Why this over the alternatives

- **A hand-rolled POSIX-sh harness** — rejected. An untested harness makes every
  case vacuous: a bug in `assert_contains` turns green tests into no-ops. It is
  also still a framework, with its maintenance cost hidden in repo code.
- **bats-core or vitest** — rejected. A dependency for what `node:test` does
  free. `tests/` is absent from `package.json` `files:`, so test code never
  reaches consumers and the `engines: ">=16.7"` floor does not constrain it.
- **Generating the opencode and Codex ports from the plugin skills** — rejected.
  The opencode port is deliberately terser (see `b2bc45f`); generating would
  erase that. Instead the suite asserts the *safety* literals are identical
  across ports while prose length stays free.
- **Structural invariants only** — rejected as too little. It would leave both
  shell hooks' branch logic unverified, and those are the pieces that run on a
  user's machine outside any agent.

## Trade-offs accepted

- Skill behaviour is not gated. A regression in `decide`'s wording ships green.
  That is honest rather than fixed: no deterministic check can read prose for
  intent, and pretending otherwise is what the first draft did.
- `check-version.mjs` gained an `ORIENT_ROOT` seam purely so its drift branch is
  reachable from a test. One line of production code exists for the tests.
- The contract tests are green by construction today. They find nothing now;
  their value is entirely in the future, when a port or a manifest drifts.

## Consequences

- `npm test` is the local pre-release check; `npm run test:mutation` proves it
  still bites by breaking ten things and asserting the suite goes red for each. CI
  runs only gitleaks and the version gate — it cannot run a suite that isn't checked in.
- Any new subcommand must appear in all three ports or `F8` fails.
- Any new `userConfig` key must be read by a hook script, and any
  `CLAUDE_PLUGIN_OPTION_*` a hook reads must be declared — `T1a`/`T1b`.
- `pre-commit.sh` is pinned to the `ORIENT_*` namespace by `T1c`: it runs under
  git, where Claude Code's plugin env does not exist, so a future "consistency"
  edit pointing it at `CLAUDE_PLUGIN_OPTION_*` now fails loudly.
