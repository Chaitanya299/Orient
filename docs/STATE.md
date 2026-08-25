# STATE — <!-- updated: 2026-08-25 -->

## Current focus
0.1.3 in progress. The plugin is built, secured, ported to opencode and Codex, published
to npm, and installable from the marketplace. Now hardening decision-capture from real use.

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
- Decisions recorded: ADR-0001 through ADR-0013.

## In progress
- 0.1.3: plan-approval decision trigger + commit backstop, and this Shape diagram.

## Next up
- Publish 0.1.3 to npm and `claude plugin update` to pull it.
- Tag `v0.1.0` (or current) on GitHub.
- Submit to the official directories (Claude Code: clau.de/plugin-directory-submission;
  Codex: package skills + OpenAI portal — see local PUBLISHING.md).

## Blocked / needs research
- Does decision-capture fire reliably? Real use showed the conversational trigger missed
  the plan→build path; 0.1.3 adds a plan-approval trigger + backstops. Needs a week to confirm.
- Does `scripts/orient.sh` work under Git Bash and WSL on Windows? Untested.

## Known issues
- Shape diagram lives in a volatile file (`sync` rewrites STATE.md); mitigated by the 6-node
  cap and `decide` maintaining it, but drift is possible if a structural change skips `decide`.
