---
description: Scaffold or repair the Orient docs system (STATE.md, decisions/, architecture.md) in this repo. Run once per project.
---

Scaffold a small, context-cheap documentation system into this repo, or repair an
existing one. This writes files, so every write is a proposal the user approves —
never a silent write. Show the drafted content before writing it.

Work through these steps in order.

## 1. Resolve the docs directory
If an argument was passed (`$ARGUMENTS`), use it as the docs directory. Otherwise use
`docs`. Call this `$DOCS_DIR` for the rest of the run. Every path below is relative to
the repo root.

## 2. Detect an existing setup (repair mode)
If `$DOCS_DIR/STATE.md` or `$DOCS_DIR/decisions/` already exists, switch to repair
mode: report what exists, propose only additions, and never overwrite an existing
file. `orient-init` must be safe to run repeatedly.

## 3. Survey the repo with a subagent
Say one line first so the wait is expected, not a suspected hang:
`Surveying the repo (runs in a subagent, ~30-60s on large repos)...`
Then invoke the `repo-cartographer` subagent. Do not read the repo yourself — the
point is that the survey burns the subagent's context window, not this one.

## 4. Draft the core docs
From the survey, draft (do not write yet) these three files. Use the skeletons at the
bottom of this command, filling `<...>` placeholders and dating the `updated:` marker.

- `$DOCS_DIR/STATE.md` — `## Current focus` first; fill the `## Shape` mermaid diagram
  from the survey (major components and how they connect, 6 nodes max, not a call graph).
- `$DOCS_DIR/architecture.md` — entry points, module boundaries, the three or four
  critical paths. Not a call graph, not a file listing.
- `$DOCS_DIR/decisions/0001-record-architecture-decisions.md` — the ADR that
  establishes the practice.

Never write a secret value into any doc. If the survey surfaced credentials, name the
file, not its contents — these docs get committed and pushed.

## 5. Seed candidate ADRs from git history
Read `git log --oneline -n 200`. Identify commits that look like real architectural
decisions — dependency additions, framework or database choices, auth or API
redesigns, migrations. Draft these as **candidate** ADRs with the commit SHA in the
Context section. Present the candidate list and write only the ones the user approves.
Never bulk-generate ADRs unattended.

## 6. Write the AGENTS.md pointer block
Add the block below to `AGENTS.md` at the repo root, substituting `$DOCS_DIR`. This is
pointers only — it names the docs and tells the agent to read them on demand, so the
real content costs no tokens until something reads it.

- No `AGENTS.md` → create it with the block.
- `AGENTS.md` has both `<!-- ORIENT:START -->` and `<!-- ORIENT:END -->` markers →
  replace only the text between them.
- Markers absent → append the block.
- Missing or duplicated end marker, or CRLF line endings → report it and stop rather
  than corrupt the file; let the user fix or confirm.

Never touch content outside the markers.

## 7. Print a summary
Files created, files skipped (repair mode), and the exact next commands to run
(`/orient-status`, `/orient-sync`, `/orient-decide`).

The whole flow is a proposal the user approves, not a silent write.

---

## Skeletons

### AGENTS.md block (substitute `$DOCS_DIR`)

```markdown
<!-- ORIENT:START -->
## Project docs — read on demand, never preload

- `$DOCS_DIR/STATE.md` — what's built, in progress, blocked. Read this first when picking up work.
- `$DOCS_DIR/decisions/` — one file per architectural decision. Read the relevant one before changing that area.
- `$DOCS_DIR/architecture.md` — entry points and module boundaries. Read before cross-module work.

## Workflow

- Before reporting a task complete: update `$DOCS_DIR/STATE.md`, and if an architectural decision was made with no ADR recorded, offer to record it.
- When a real architectural decision is made in conversation, proactively offer to record it with `/orient-decide` — don't wait to be asked. It also updates `architecture.md`.
- When a plan is approved before a build, treat any architectural choices inside it as decisions — offer to record them before starting.
- Never edit a past decision file. Supersede it with a new one.
- Trace execution paths on demand with `/orient-trace` instead of maintaining a flow doc.
<!-- ORIENT:END -->
```

### STATE.md

```markdown
# STATE — <!-- updated: YYYY-MM-DD -->

## Current focus
<the one thing being worked on right now, in a sentence>

## Shape
```mermaid
flowchart TD
  %% High-level map: the major components (6 nodes max) and how they connect.
  %% Not a call graph.
```

## Done
- <shipped and working>

## In progress
- <started, not finished — note what's left>

## Next up
- <agreed, not started>

## Blocked / needs research
- <open question that must be answered before building>

## Known issues
- <known-broken, deliberately deferred>
```

### architecture.md

```markdown
# Architecture — <!-- updated: YYYY-MM-DD -->

Only what a new engineer can't read off the code at a glance. Not a file listing,
not a call graph, not a dependency inventory.

## Entry points
- <where execution actually starts: the CLI command, the server bootstrap, the request handler>

## Module boundaries and ownership
- `<module/dir>` — <what it owns, and where its responsibility stops>

## Critical paths
The three or four flows that matter most, one line each:

- <name> — <entry> → <the two or three hops that matter> → <edge>

## Conventions that differ from the framework default
- <the thing a newcomer would get wrong because the framework would suggest otherwise>
```

### ADR (decisions/NNNN-kebab-title.md)

```markdown
# ADR-NNNN: <title>

- Date: <YYYY-MM-DD>
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
<the forces at play — what made this a decision rather than an obvious step>

## Decision
<what was chosen, in one or two sentences>

## Why this over the alternatives
- <option considered> — rejected because <reason>

## Trade-offs accepted
<what got worse, knowingly>

## Consequences
<what this now constrains or unlocks>
```
