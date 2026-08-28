# STATE — <!-- updated: 2026-08-28 -->

## Current focus
0.1.6 bumped, committed, and pushed to GitHub (0.1.5 is the last version live on npm until
publish). Three installer/hook fixes, a relicense to Apache 2.0, launch security hardening
(locked-down `.gitignore`, signed-provenance publish workflow), and governance docs
(CONTRIBUTING, TRADEMARK). A 60-case deterministic suite plus a mutation check run **locally**
before a release — kept in a gitignored `tests/`, not CI; skill *behaviour* stays with the
on-demand `repo-test` agent (ADR-0015). npm publish + `v0.1.6` tag pending.

## Shape
```mermaid
flowchart TD
  dev([Developer]) --> cc[Claude Code plugin]
  dev --> oc[opencode commands]
  dev --> cx[Codex skills]
  cc --> docs[(docs system: STATE, architecture, decisions)]
  oc --> docs
  cx --> docs
  npm[npm installer] -.->|installs| oc
  npm -.->|installs| cx
```

## Done
- Claude Code plugin: six skills, two read-only agents, session-start hook, marketplace
  manifest. Passes `validate --strict`.
- opencode and Codex ports, each with secret-blind + anti-injection guardrails.
- Security hardening: secret-blind agents, commit secret gate, gitleaks CI, SECURITY.md.
- npm/npx distribution (zero-dependency installer); published `@chaitanya299/orient`, live
  through 0.1.2.
- Version-sync gate (ADR-0011): plugin.json is source of truth, package.json mirrors it,
  enforced on publish + CI.
- `decide` is proactive and keeps architecture.md + a STATE Shape diagram in sync.
- Published to github.com/Chaitanya299/Orient; installed from the marketplace, dogfooding.
- Decisions recorded: ADR-0001 through ADR-0015.
- Test suite (ADR-0015): 60 deterministic cases + 10 automated mutants, run locally
  before releases (gitignored, not in CI). Found and fixed on the way in: the installer
  clobbered user-edited command files (later upgraded to a hash-manifest model — untouched
  files auto-update, edited files are preserved as `.new`); the opencode commit port's
  secret patterns had lost their length bounds; `pre-commit.sh` interpolated the docs dir
  into a regex unquoted.

## In progress
- 0.1.6: bumped, committed, pushed. Suite green, validate passes; the `npm publish` and the
  `v0.1.6` tag are the only remaining steps (maintainer runs them).

## Next up
- Bump to 0.1.6 (plugin.json first — ADR-0011), publish to npm, `claude plugin update`.
- Tag `v0.1.6` on GitHub (triggers the provenance publish workflow once trusted publishing is set up).
- Submit to the official directories (Claude Code: clau.de/plugin-directory-submission;
  Codex: package skills + OpenAI portal — see local PUBLISHING.md).

## Blocked / needs research
- Does decision-capture fire reliably? A full review (ADR-0014) cut the `decide`-sweep idea
  (a step inside `decide` can't catch a forgotten decision, and ADR-to-change pairing isn't
  computable from git) and reframed to a plain commit reminder + an opt-in hook. The real
  miss rate is still unmeasured — needs a week of use to confirm.
- Does `scripts/orient.sh` work under Git Bash and WSL on Windows? Untested — the suite
  runs on Linux and macOS only, so this gap is now explicit rather than assumed.

## Known issues
- Shape diagram lives in a volatile file (`sync` rewrites STATE.md); mitigated by the 6-node
  cap and `decide` maintaining it, but drift is possible if a structural change skips `decide`.
