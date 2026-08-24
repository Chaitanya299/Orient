---
name: decide
description: Record an architectural decision as a numbered ADR and update architecture.md to match. Use right after a decision is made in conversation.
---

# /orient:decide

Record one architectural decision as a numbered, append-only ADR.

Resolve the docs directory from `CLAUDE_PLUGIN_OPTION_DOCS_DIR` (default `docs`).

1. Find the highest existing ADR number in `<docs_dir>/decisions/` and add one.
   Filenames are `NNNN-kebab-title.md`, numbered from 0001.
2. Fill `templates/adr.md`. Interview the user **only** for what can't be inferred
   from the session — the alternatives that were considered and the trade-off
   accepted are the parts worth asking about. Infer the rest.
3. Show the drafted ADR and write it on approval.

Supersede rule: if this decision supersedes an earlier ADR, set `Supersedes:` in the
new file and update **only** the `Superseded by:` line of the old one. No other edit
to a past ADR is permitted — decisions are append-only.

## Keep architecture.md in sync
After the ADR is written, read `<docs_dir>/architecture.md`. If this decision changes
what it describes — entry points, module boundaries, or critical paths — draft the
specific edit: touch only the affected lines and refresh the `updated:` marker. Show a
before/after preview and write it **only after a separate approval** — the user can accept
the ADR but decline the architecture change. If `architecture.md` does not exist, or the
decision isn't structural, skip this step silently.
