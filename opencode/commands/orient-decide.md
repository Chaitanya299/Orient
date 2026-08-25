---
description: Record an architectural decision as an ADR and update architecture.md to match. Use right after a decision is made.
---

Record one architectural decision as a numbered, append-only ADR in `docs/decisions/`.

1. Next number after the highest in `docs/decisions/` (`NNNN-kebab-title.md`, from 0001).
2. Fill the ADR: Context / Decision / Why over alternatives / Trade-offs / Consequences.
   Interview the user only for the alternatives considered and the trade-off accepted —
   infer the rest from the session. Show it, write on approval.
3. Supersede rule: never edit a past ADR except its `Superseded by:` line.
4. If this decision changes structure (entry points, module boundaries, critical paths),
   update both — each as a before/after preview, written only after a **separate** approval:
   `docs/architecture.md` (affected lines only, refresh `updated:`), and the `## Shape`
   mermaid diagram in `docs/STATE.md` (if a major component was added, removed, or
   reconnected; 6 nodes max). Skip whichever doesn't exist, and skip all of step 4 for a
   non-structural decision.
