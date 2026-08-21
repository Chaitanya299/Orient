---
name: init
description: Scaffold or repair the Orient docs system (STATE.md, decisions/, architecture.md) in this repo. Run once per project.
disable-model-invocation: true
---

# /orient:init

Scaffold a small, context-cheap documentation system into this repo, or repair an
existing one. This writes files, so it is user-invoked only and every write is a
proposal the user approves — never a silent write. Show the drafted content before
writing it.

Work through these steps in order.

## 1. Resolve the docs directory
Read `CLAUDE_PLUGIN_OPTION_DOCS_DIR` from the environment. If unset or empty, use
`docs`. Call this `$DOCS_DIR` for the rest of the run. Every path below is relative
to the repo root.

## 2. Detect an existing setup (repair mode)
If `$DOCS_DIR/STATE.md` or `$DOCS_DIR/decisions/` already exists, switch to repair
mode: report what exists, propose only additions, and never overwrite an existing
file. `init` must be safe to run repeatedly.

## 3. Survey the repo with a subagent
Say one line first so the wait is expected, not a suspected hang:
`Surveying the repo (runs in a subagent, ~30-60s on large repos)...`
Then dispatch the `repo-cartographer` agent. Do not read the repo yourself — the
point is that the survey burns the subagent's context window, not this one.

## 4. Draft the core docs
From the survey, draft (do not write yet):
- `$DOCS_DIR/STATE.md` — from the `templates/STATE.md` shape, `## Current focus` first.
- `$DOCS_DIR/architecture.md` — from `templates/architecture.md`: entry points, module
  boundaries, the three or four critical paths. Not a call graph, not a file listing.
- `$DOCS_DIR/decisions/0001-record-architecture-decisions.md` — the ADR that establishes
  the practice, from `templates/adr.md`.

## 5. Seed candidate ADRs from git history
Read `git log --oneline -n 200`. Identify commits that look like real architectural
decisions — dependency additions, framework or database choices, auth or API
redesigns, migrations. Draft these as **candidate** ADRs with the commit SHA in the
Context section. Present the candidate list and write only the ones the user approves.
Never bulk-generate ADRs unattended.

## 6. Write the CLAUDE.md block
Use `templates/claude-md-block.md`, substituting `{{DOCS_DIR}}` with `$DOCS_DIR`.
- No `CLAUDE.md` → create it with the block.
- `CLAUDE.md` has both `<!-- ORIENT:START -->` and `<!-- ORIENT:END -->` markers →
  replace only the text between them.
- Markers absent → append the block.
- Missing or duplicated end marker, or CRLF line endings → report it and stop rather
  than corrupt the file; let the user fix or confirm.
Never touch content outside the markers.

## 7. Offer a path-scoped rule (do not create without a yes)
Offer, but do not create without approval, a starter rule at `.claude/rules/`, showing
the `paths:` frontmatter form so conventions cost nothing until a matching file is
touched. Example to show:

```markdown
---
paths:
  - "src/**"
---
Conventions that apply when editing files under src/.
```

## 8. Print a summary
Files created, files skipped (repair mode), and the exact next commands to run.

The whole flow is a proposal the user approves, not a silent write.
