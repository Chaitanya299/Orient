---
description: Draft a git commit message (what / why / findings) for review before committing.
---

Draft a commit message and commit only after explicit approval.

**Secret gate first.** From `git diff --staged`, refuse if a staged file is a `.env`
(non-`.example`) or the diff contains a key literal (`AKIA…`, `ghp_…`, `sk-…`,
`BEGIN … PRIVATE KEY`). Name it, tell the user to unstage (`git restore --staged`) and
rotate, and stop.

If nothing is staged, list the changed files and ask which to stage. Never `git add -A`.

From `git diff --staged --name-only`: if a dependency/build manifest is staged
(`package.json`, `go.mod`, `Cargo.toml`, `requirements.txt`, `pyproject.toml`, `Gemfile`,
`pom.xml`, `build.gradle`, `composer.json`, `Dockerfile`, `docker-compose.yml`; not
lockfiles) and no ADR is staged here, check the diff — if it added or swapped a dependency
or datastore (not a version bump), offer `/orient-decide` first. Routine bump → continue.
Non-blocking, a reminder not a guarantee.

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
