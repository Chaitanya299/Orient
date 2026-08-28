# ADR-0017: Drop the plugin's userConfig to remove the install-time nag

- Date: 2026-08-28
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
The Claude Code plugin declared two `userConfig` options, `docs_dir` (default `docs`) and
`auto_orient` (default `true`). Both already had working fallbacks in code: `scripts/orient.sh`
reads `${CLAUDE_PLUGIN_OPTION_AUTO_ORIENT:-true}` and `${CLAUDE_PLUGIN_OPTION_DOCS_DIR:-docs}`,
and every skill defaults the docs dir to `docs`. So a zero-config install already behaves
correctly.

But on install Claude Code prints `2 userConfig options not yet set — run /plugin configure`.
The notice fires for any declared option the user has not explicitly set, defaults
notwithstanding, and it counts every option, so keeping even one keeps the nag. For a public
launch that first-run warning reads as "you have setup to do" on a tool whose whole pitch is
that it just works.

## Decision
Remove the `userConfig` block entirely. The code defaults are the configuration.

- `docs_dir` → the `:-docs` fallback everywhere. A custom docs dir is still reachable on the
  opencode/Codex ports (init takes it as an argument); on Claude Code it is no longer a UI knob.
- `auto_orient` → the `:-true` fallback. Session-start orientation is on; a user who wants it
  off disables the plugin's SessionStart hook.

## Why this over the alternatives
- **Keep userConfig, suppress the notice** — the notice counts unset options regardless of
  defaults and there is no per-option "optional, don't nag" flag, so the only way to silence it
  is to declare nothing.
- **Keep only `auto_orient`** — still one unset option, still the nag. All-or-nothing.
- **Ship defaults via `/plugin configure` docs** — pushes setup onto every user to quiet a
  warning about settings they never needed to touch.

## Trade-offs accepted
- **No custom docs dir from the Claude Code UI.** Almost everyone uses `docs`; the ports still
  take a custom dir, and the knob can return later if there is real demand. YAGNI until then.
- **No UI toggle for session-start orientation.** It is a few lines of STATE.md focus and cheap
  by design; turning it off means disabling the hook, which is a reasonable ask for a rare case.

## Consequences
- A fresh Claude Code install is silent: no "options not yet set" notice, no `/plugin configure`
  step. Behaviour is identical to the previous defaults.
- Configuration now lives in one place (the code fallbacks), not split between a manifest schema
  and the fallbacks that shadowed it.
