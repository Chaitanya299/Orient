---
name: status
description: Report where this project stands — current focus, in progress, blocked — by reading STATE.md.
---

# /orient:status

Report where the project stands, cheaply.

Resolve the docs directory from `CLAUDE_PLUGIN_OPTION_DOCS_DIR` (default `docs`).
Read `<docs_dir>/STATE.md` and **only** that file. Answer in under 10 lines:
current focus, what's in progress, what's blocked.

If `STATE.md` is missing, say so and suggest `/orient:init`. Do not explore the
repo. Do not read the decisions. This skill exists to be nearly free.
