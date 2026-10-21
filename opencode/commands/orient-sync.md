---
description: Update STATE.md to match what actually changed this session.
---

Reconcile `docs/STATE.md` with reality:
1. Read `docs/STATE.md`.
2. Read `git status` and `git diff --stat`.
3. Move finished items to Done, add new blockers, refresh the `updated:` date.
4. Drift check: if any ADR's `- Date:` in `docs/decisions/` is newer than
   `docs/architecture.md`'s `updated:` marker, that decision skipped `decide`'s architecture
   step (ADR-0020). Say so in the diff and offer to update `architecture.md` and set its marker,
   as a separate approval.

Show the diff and get approval before writing. Keep the file under 70 lines and preserve
the `## Shape` diagram; condense old Done entries rather than letting it grow.
