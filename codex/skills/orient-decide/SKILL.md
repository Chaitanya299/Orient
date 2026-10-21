---
name: orient-decide
description: Record an architectural decision as a numbered ADR and update architecture.md to match. Use right after a decision is made in conversation.
---

# orient-decide

Record one architectural decision as a numbered, append-only ADR.

The docs directory is `docs` unless the user named a different one.

1. Find the highest existing ADR number in `<docs_dir>/decisions/` and add one.
   Filenames are the number alone, `NNNN.md`, numbered from 0001 (count older
   `NNNN-title.md` files too). Never reuse a number. The number-only name is what makes
   two branches that pick the same number hit a git merge conflict.
2. Fill the ADR shape (Context / Decision / Why over alternatives / Trade-offs /
   Consequences). Interview the user **only** for what can't be inferred from the
   session — the alternatives considered and the trade-off accepted are the parts
   worth asking about. Infer the rest.
3. Show the drafted ADR and write it on approval.

Supersede rule: if this decision supersedes an earlier ADR, set `Supersedes:` in the
new file and update **only** the `Superseded by:` line of the old one. No other edit
to a past ADR is permitted — decisions are append-only.

Number clash: a merge conflict on `<docs_dir>/decisions/NNNN.md` means another branch
took that number first. Keep the base branch's file, save this ADR as the next free
number, update its `# ADR-NNNN:` heading and any reference to it, then commit.

## Keep architecture and the shape diagram in sync
After the ADR is written, check whether this decision changes structure — entry points,
module boundaries, or critical paths. If so, update two things, each shown as a
before/after preview and written **only after a separate approval** (the user can accept
the ADR but decline these):
- `<docs_dir>/architecture.md` — touch only the affected lines, refresh the `updated:` marker.
- the `## Shape` mermaid diagram in `<docs_dir>/STATE.md` — only if the decision adds,
  removes, or reconnects a major component. Keep it to 6 nodes.

Skip whichever target doesn't exist, and skip these edits for a non-structural decision.
Whatever the outcome, set `architecture.md`'s `updated:` marker to today as part of the ADR
write (show it in the draft). It records that architecture was checked against this decision,
and the drift warning (ADR-0020) relies on it.
