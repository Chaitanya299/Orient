#!/bin/sh
# Orient session-start orientation. POSIX sh, no bashisms. Never fails the session.

ao=${CLAUDE_PLUGIN_OPTION_AUTO_ORIENT:-true}
case "$ao" in false|0|no|off|FALSE|NO|OFF) exit 0 ;; esac

dd=${CLAUDE_PLUGIN_OPTION_DOCS_DIR:-docs}
[ -z "$dd" ] && dd=docs
case "$dd" in /*|*..*) dd=docs ;; esac   # reject absolute / parent-escaping values

state="${CLAUDE_PROJECT_DIR:-.}/$dd/STATE.md"

if [ -f "$state" ]; then
  printf '%s\n' "Orient — current focus (from $dd/STATE.md):"
  awk '/^## Current focus/{f=1;next} /^## /{f=0} f' "$state" 2>/dev/null | head -14
  exit 0
fi

# STATE.md absent: stay silent, except a one-time global discovery nudge.
mk=${CLAUDE_PLUGIN_DATA:-${XDG_STATE_HOME:-$HOME/.local/state}/orient}
marker="$mk/.init-nudged"
if [ ! -f "$marker" ]; then
  mkdir -p "$mk" 2>/dev/null
  if { : > "$marker"; } 2>/dev/null; then
    printf '%s\n' "Orient is installed — run /orient:init in a repo you want to track."
  fi
fi
exit 0
