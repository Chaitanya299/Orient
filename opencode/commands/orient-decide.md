---
description: Record an architectural decision as an ADR and update architecture.md to match. Use right after a decision is made.
---

Record one architectural decision as a numbered, append-only ADR in `docs/decisions/`.

1. Next number after the highest in `docs/decisions/` (`NNNN-kebab-title.md`, from 0001).
2. Fill the ADR: Context / Decision / Why over alternatives / Trade-offs / Consequences.
   Interview the user only for the alternatives considered and the trade-off accepted —
   infer the rest from the session. Show it, write on approval.
3. Supersede rule: never edit a past ADR except its `Superseded by:` line.
4. Then check `docs/architecture.md`. If this decision changes entry points, module
   boundaries, or critical paths, draft the edit (touch only affected lines, refresh the
   `updated:` marker), show a before/after preview, and write it only after a **separate**
   approval. If `architecture.md` is missing or the decision isn't structural, skip this.
