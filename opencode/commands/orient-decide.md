---
description: Record an architectural decision as an ADR and update architecture.md to match. Use right after a decision is made.
---

Record one architectural decision as a numbered, append-only ADR in `docs/decisions/`.

1. Next number after the highest in `docs/decisions/`, from 0001 (count older
   `NNNN-title.md` files too). Name the file by the number alone, `NNNN.md`, and never
   reuse a number: that is what makes two branches picking the same number hit a git
   merge conflict. On such a conflict, keep the base branch's file, save this ADR as the
   next free number, update its `# ADR-NNNN:` heading and any reference to it, commit.
2. Fill the ADR: Context / Decision / Why over alternatives / Trade-offs / Consequences.
   Interview the user only for the alternatives considered and the trade-off accepted —
   infer the rest from the session. Show it, write on approval.
3. Supersede rule: never edit a past ADR except its `Superseded by:` line.
4. If this decision changes structure (entry points, module boundaries, critical paths),
   update both — each as a before/after preview, written only after a **separate** approval:
   `docs/architecture.md` (affected lines only, refresh `updated:`), and the `## Shape`
   mermaid diagram in `docs/STATE.md` (if a major component was added, removed, or
   reconnected; 6 nodes max). Skip whichever doesn't exist, and skip these edits for a
   non-structural decision. Either way, set `docs/architecture.md`'s `updated:` marker to today
   as part of the ADR write (show it in the draft); the drift warning (ADR-0020) relies on it.
