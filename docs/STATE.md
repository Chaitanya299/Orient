# STATE — <!-- updated: 2026-10-21 -->

## Current focus
0.1.10: architecture drift warning (ADR-0020). `decide` sets architecture.md's `updated:` marker
on every ADR; the session-start hook (Claude Code) and `sync` (all ports) flag an ADR newer than
it. Root cause of this repo's stale architecture.md: ADRs written without `decide`, steered by an
outdated CLAUDE.md block (now refreshed); architecture.md rewritten by hand. 0.1.9 (auto-rename,
ADR-0019) and 0.1.8 (number-only names, ADR-0018) are on main; npm is still on 0.1.7.

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
- Claude Code plugin (six skills, two read-only agents, session-start hook, marketplace) plus
  opencode and Codex ports, all with secret-blind + anti-injection guardrails.
- Security: secret-blind agents, commit secret gate, SECURITY.md, gitleaks CI, which now really
  scans PRs (`GITHUB_TOKEN` + `pull-requests: read`, #3).
- npm/npx distribution (zero-dependency installer), live through 0.1.7. Version-sync gate (ADR-0011).
- `decide` is proactive and keeps architecture.md + the Shape diagram in sync.
- README rewrite with flow diagrams and per-agent install dropdowns (#1, first outside PR).
- 0.1.8 number-only ADR names (ADR-0018): clash blocked for merge, rebase, squash, cherry-pick,
  fork PRs and `git merge-tree`. Live test with real agents: the second PR is blocked and the
  agent renumbers correctly. 0.1.9 auto-rename of old names (ADR-0019), confirmed live.
- Decisions recorded: ADR-0001 through ADR-0020.
- Local e2e suite `tests/e2e.test.mjs` (gitignored, ADR-0015): 70 cases across solo, team, fork
  and mixed-agent setups, run by the `repo-test` agent. Replaces the earlier 60-case suite, which
  was lost because it was never committed.

## In progress
- Publish 0.1.10: `git tag v0.1.10 && git push origin v0.1.10` runs the npm publish workflow.

## Next up
- Team gaps from the friend's review, still open (pinned as `[gap]` tests): STATE.md conflicts
  when two branches `sync` (2); opposite decisions both land (3); code built on a superseded ADR
  merges unwarned (5); a revert leaves its separate ADR "accepted" (6a); PM sign-off (7, CODEOWNERS).
- Submit to the official directories (Claude Code: clau.de/plugin-directory-submission;
  Codex: package skills + OpenAI portal; see local PUBLISHING.md).

## Blocked / needs research
- Does decision-capture fire reliably? The triggers now land deterministically (installer writes
  the block, ADR-0016); whether the model *acts* on them is still best-effort and unmeasured.
- Windows (Git Bash, WSL) untested for `orient.sh` and `migrate-adrs.sh`; the suite runs on
  macOS and Linux only.

## Known issues
- Shape diagram lives in a volatile file (`sync` rewrites STATE.md); drift is possible if a
  structural change skips `decide`.
- `decide` can record the wrong *why*: it infers Context and reason and only asks for alternatives
  and trade-offs. Options: ask for the why in one sentence; mark inferred vs stated fields.
