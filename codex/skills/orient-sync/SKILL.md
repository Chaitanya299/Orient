---
name: orient-sync
description: Update STATE.md to match what actually changed this session — moving items between done, in progress, and blocked.
---

# orient-sync

Reconcile `STATE.md` with what actually changed.

The docs directory is `docs` unless the user named a different one.

1. Read `<docs_dir>/STATE.md`.
2. Read `git status` and `git diff --stat` for the uncommitted work.
3. Reconcile the two: move finished items to Done, add new blockers and open
   questions, refresh the `<!-- updated: YYYY-MM-DD -->` marker.

Show the diff and get approval before writing.

Keep the file under 70 lines, and preserve the `## Shape` diagram — don't drop it when
condensing. When Done grows long, condense old entries into a one-line summary rather than
letting the file grow forever.
