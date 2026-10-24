# STATE — <!-- updated: 2026-10-24 -->

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
- 0.1.10 architecture drift warning (ADR-0020), plus this repo's CLAUDE.md block refreshed and
  architecture.md rewritten. Verified through a real marketplace install and an `npm pack` +
  `npx` install for opencode and Codex.
- Decisions recorded: ADR-0001 through ADR-0020.
- Local e2e suite `tests/e2e.test.mjs` (gitignored, ADR-0015), run by `npm test` and the
  `repo-test` agent: 76 cases across solo, team, fork and mixed-agent setups. Replaces the earlier 60-case suite, which
  was lost because it was never committed.

## In progress
- Push `main`: 7e71693 and df58c20 are local only, and Claude Code users install from GitHub's main.
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
- Windows (Git Bash, WSL) and Linux untested for `orient.sh` and `migrate-adrs.sh`; the suite
  has only been run on macOS.

## Known issues
- Shape diagram lives in a volatile file (`sync` rewrites STATE.md); drift is possible if a
  structural change skips `decide`.
- `decide` can record the wrong *why*: it infers Context and reason and only asks for alternatives
  and trade-offs. Options: ask for the why in one sentence; mark inferred vs stated fields.
- Existing Claude Code repos keep their old CLAUDE.md block until `/orient:init` is re-run, so
  their agents may still write ADRs without `decide`; the drift warning is the backstop.

## Temporary context (2026-10-24, delete in the next step)
Session notes that live nowhere else in the repo. Over the 70-line cap on purpose.

**Local-only state (not in git)**
- Your installed Claude Code plugin is 0.1.3. `/orient:sync` runs that old skill (no drift check)
  until `claude plugin update orient@chaitanya299-plugins`.
- `git stash` entry `sync-backup-state-notes-2026-10-21` holds the original, longer text of the
  "decide records the wrong why" and "architecture.md is stale" notes. Both are condensed here or
  fixed; drop the stash when no longer needed.
- `tests/e2e.test.mjs` and `.claude/agents/repo-test.md` exist only on this machine (gitignored).
  `ORIENT_SRC=<dir>` points the suite at another checkout or an export (`git checkout-index -a
  --prefix=<dir>/` for staged work, `git archive <ref> | tar -x -C <dir>` for a ref).
- Memory note: old-version users (≤0.1.7, 2–3 people) are out of scope for compat work.

**Live tests run with real Claude Code agents (scripts were in the session scratchpad, now gone)**
- Clash (0.1.8): Alice and Bob (0.1.8) both wrote `0018.md`; Bob's merge hit `CONFLICT (add/add)`
  and `git merge-tree` exited 1. Bob's agent, told only "resolve it the way decide says", kept
  main's 0018, moved its own to 0019, fixed the heading and committed. Carol on 0.1.7 wrote
  `0018-use-grpc-….md`, which merged silently (the mixed-version gap, accepted as out of scope).
- Migration (0.1.9): a session in an old repo printed the rename at startup; files renamed,
  link fixed, staged as R100, nothing committed.
- Architecture (decide, Postgres → MongoDB): with the architecture updates pre-approved it
  rewrote every Postgres line and the Shape node; with only the ADR approved it proposed the
  exact diff and asked. Side finding: it wrote `Superseded by: 0003` without the `ADR-` prefix,
  so that format isn't pinned in the skill.
- Drift (0.1.10, marketplace-installed copy): startup warned "ADR-0002 (2026-10-01) is newer than
  its updated: marker (2026-09-01)"; a real decide (REST → GraphQL) set the marker and the
  warning cleared.

**How to rerun those checks**
- Headless agents need the CLI logged in (`claude /login`); the desktop app login doesn't carry over.
- `claude -p --setting-sources project --plugin-dir <plugin> --model sonnet --max-budget-usd 1
  --permission-mode acceptEdits --allowedTools "Read,Write,Edit,Glob,Grep,Bash(git:*)"`, with the
  prompt piped on stdin (`--allowedTools` swallows a trailing prompt argument).
- Isolated marketplace install: `CLAUDE_CONFIG_DIR=<tmp> claude plugin marketplace add <repo>`,
  then `claude plugin install orient@chaitanya299-plugins`.
- npm as users get it: `npm pack`, then `npx --yes --package=<tgz> orient opencode` in a fresh repo.

**Friend's team review: where each point stands**
- 1 number clash: solved (ADR-0018), plus auto-rename of old names (ADR-0019).
- 2 STATE.md conflicts on sync: open. Idea: run `sync` on main only; make current focus a list
  with an owner per line.
- 3 opposite decisions both land: open; a people problem, caught in review.
- 4 two PRs supersede the same ADR: git conflicts on the `Superseded by:` line; just document it.
- 5 code built on a superseded ADR: open. Idea: `commit` notes the ADRs a change relies on; a
  check warns when one is superseded on main.
- 6 ADR and code drift apart: open. Idea: ship an ADR in the same PR as its code by default.
- 7 PM never sees a decision: `CODEOWNERS` on `docs/decisions/`, no orient code needed.

**Releases and repo**
- Merged: #1 README rewrite (outside contributor), #3 gitleaks fix, #2 0.1.8, #4 0.1.9. Their
  branches are deleted locally and on GitHub.
- The marketplace serves `main`, so plugin users get a change as soon as it's pushed. npm only
  updates when a `v*` tag runs `publish.yml` (OIDC trusted publishing; whether that's set up on
  npm isn't confirmed). npm is on 0.1.7.
