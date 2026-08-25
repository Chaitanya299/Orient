---
name: commit
description: Draft a git commit message documenting what changed and why, with the findings that drove it, for review before committing.
disable-model-invocation: true
---

# /orient:commit

Draft a git commit message that documents what changed and why, present it for
review, and commit only after explicit approval. User-invoked only.

## 0. Secret gate (run first)
Before anything else, refuse to commit a secret. From `git diff --staged`:
- If a staged file is a `.env` (any name except `*.example`), STOP.
- If the staged diff contains a secret literal — `AKIA[0-9A-Z]{16}`, `ghp_[A-Za-z0-9]{36}`,
  `sk-[A-Za-z0-9]{20,}`, or `-----BEGIN [A-Z ]*PRIVATE KEY-----` — STOP.

On a match: name the file and line, tell the user to unstage it
(`git restore --staged <file>`) and rotate the key. Never commit it, never work around this.

## 1. Determine what's staged
Read `git diff --staged`. If nothing is staged, read `git diff` and `git status`,
list the changed files, and ask which to stage. Never run `git add -A` unprompted.

## 1b. Backstop: check for an unrecorded decision
If the staged diff shows a structural change — a new module or service, a swapped
dependency or datastore, a changed module boundary — and no matching ADR exists in the
decisions directory, say so and offer to record it with `/orient:decide` before drafting
the message. This catches decisions the proactive offer missed. If the user declines, or
the change isn't structural, continue.

## 2. Draft the message
Use this shape:

```
<type>(<scope>): <imperative summary, under 72 chars>

What changed
- <concrete, file-level, specific>

Why
- <the reasoning, not a restatement of the diff>

Findings
- <what was discovered while doing this: the actual root cause, the
  measurement, the constraint hit, the thing that turned out not to
  be true. Cite file:line or a command's output. If nothing was
  discovered, omit this section entirely rather than padding it.>

Trade-offs
- <what was knowingly accepted, if any>

Decision: ADR-NNNN   <- only when an ADR covers this change
```

## 3. Present and stop
Show the full message and stop. State plainly that nothing has been committed. Offer
three responses: approve, edit, or regenerate.

## 4. Commit only after approval
Commit only after explicit approval, using a heredoc to preserve formatting:

```bash
git commit -F - <<'EOF'
<the approved message>
EOF
```

Never `--amend`, never `push`, never `--no-verify`.

## Anti-slop rules
- No invented findings. If nothing was discovered, omit the Findings section.
- No marketing adjectives. No "improved" or "enhanced" without a measurement.
- If the change is trivial, a one-line message is the correct output.
