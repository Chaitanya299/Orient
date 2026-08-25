---
description: Draft a git commit message (what / why / findings) for review before committing.
---

Draft a commit message and commit only after explicit approval.

**Secret gate first.** From `git diff --staged`, refuse if a staged file is a `.env`
(non-`.example`) or the diff contains a key literal (`AKIA…`, `ghp_…`, `sk-…`,
`BEGIN … PRIVATE KEY`). Name it, tell the user to unstage (`git restore --staged`) and
rotate, and stop.

If nothing is staged, list the changed files and ask which to stage. Never `git add -A`.

If the staged diff shows a structural change (new module/service, swapped dependency or
datastore, changed boundary) with no matching ADR in `docs/decisions/`, say so and offer
`/orient-decide` first — a backstop for a decision the proactive offer missed.

Draft this shape, then show it and stop — commit only on approval via a
`git commit -F -` heredoc. Never `--amend`, `push`, or `--no-verify`.

```
<type>(<scope>): <summary under 72 chars>

What changed
- <specific, file-level>
Why
- <the reasoning, not a diff restatement>
Findings
- <root cause / measurement discovered; omit the section if none>
Trade-offs
- <what was knowingly accepted, if any>
```

No invented findings. No "improved/enhanced" without a measurement. Trivial change → a
one-line message.
