# ADR-0014: A list-based commit reminder and an opt-in pre-commit hook

- Date: 2026-08-27
- Status: accepted
- Supersedes: none (refines the commit backstop from ADR-0012)
- Superseded by: none

## Context
ADR-0012 added three judgment-based triggers for capturing a decision (plan approval, task
completion, a commit backstop). They all depend on the model *noticing*, so they can miss.
The obvious next step looked like a deterministic scan: since dependency and build manifests
are files and files land in git, "did a manifest change since the last ADR?" seemed like a
fact a few git commands could answer, runnable as a step inside `decide` and as a mechanical
check in `commit`.

A full review (`/autoplan`: CEO + Eng, Claude + Codex, four independent adversarial passes,
unanimous) took that design apart. Three findings mattered:

1. **Pairing an ADR to the change it documents is not computable from git.** ADRs cite no
   commit and are recorded in a *separate* commit from the change. So `BASE = last commit
   touching decisions/` does not mean "unrecorded" — verified against this repo, `BASE` was
   `HEAD`, so the scan saw nothing. It both misses (any later unrelated ADR permanently hides
   an earlier unrecorded change) and false-positives (the release commit bundles ADR + version
   bump, so the scan flags a plain version bump every release).
2. **A check inside `decide` cannot catch a *forgotten* decision** — if you forgot, you are not
   running `decide`. It only helps someone already recording, and is redundant with the commit
   path, which fires more often and without you choosing to.
3. **"Deterministic" was overclaimed.** Prose telling an agent to run git is the same
   "model must notice" fragility. The only genuinely deterministic path is a git hook.

## Decision
- **`commit`'s decision check becomes a plain, list-based reminder.** It keys off a fixed
  manifest list (`package.json`, `go.mod`, `Cargo.toml`, `requirements.txt`, `pyproject.toml`,
  `Gemfile`, `pom.xml`, `build.gradle`, `composer.json`, `Dockerfile`, `docker-compose.yml`;
  lockfiles excluded). A staged manifest *triggers a judgment*: the model reads the diff and
  offers `decide` only if a dependency or datastore was actually added or swapped — not a
  version bump. It never claims a "matching ADR" (uncomputable) and never blocks the commit.
- **A new opt-in `pre-commit` hook (`scripts/pre-commit.sh`) is the one deterministic piece.**
  Git runs it, so it fires regardless of which agent — or no agent — makes the commit, and it
  needs no per-port copy. When a manifest is staged with no ADR staged, it prints a one-line
  reminder and exits 0 (non-blocking). `ORIENT_BLOCK=1` flips it to a blocking `exit 1`;
  `git commit --no-verify` always skips it. Install is manual and documented — nothing enters
  the always-on path without the user opting in (per the repo's own build rule).
- **The `decide` sweep is not built.** `decide` keeps recording the one decision it was
  invoked for.

## Why this over the alternatives
The manifest signal is a *structural-surface backstop*, not an architectural-decision detector:
it catches new-dependency decisions and misses design decisions that touch no manifest (a
module split, an auth-flow change, "defer auth to v2"). Those artifact-less decisions have no
file for any detector to see, so the prompt triggers (ADR-0012) remain their only net. Framing
this as "detects decisions" would have been a lie the code couldn't back. Filename-match hands
the content judgment to the model rather than parsing every ecosystem's manifest format
(language-specific, fragile) — cheap and good enough, with content-classification left as a
calibration knob. One git-native hook beats mirroring scan logic as prose across six skill
files (two skills × three ports), which would drift; the ports are intentionally non-identical,
so a parity test would be over-engineering.

## Trade-offs accepted
The hook and the reminder both fire on any manifest touch, including a version bump, because
neither inspects the diff content (the reminder defers that to the model; the hook can't). On
an active repo that is some noise; mitigations are that the hook is opt-in and non-blocking,
lockfiles are excluded, and the message is one line. If the noise bothers a user, the knob is
content-classification (added-dependency lines vs a version bump), added later. We also ship
without having measured 0.1.3's real miss rate — accepted because this release mostly *removes*
an overclaiming design and adds an opt-in tool, rather than adding always-on machinery.

## Consequences
Decision-capture now has an honest story: prompt triggers at planning time, a plain reminder at
commit time, and an opt-in hook for anyone who wants a deterministic nudge that survives being
committed from outside the agent. Nothing claims a guarantee it can't keep.
