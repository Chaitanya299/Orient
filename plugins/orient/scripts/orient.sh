#!/bin/sh
# Orient session-start orientation. POSIX sh, no bashisms. Never fails the session.

ao=${CLAUDE_PLUGIN_OPTION_AUTO_ORIENT:-true}
case "$ao" in false|0|no|off|FALSE|NO|OFF) exit 0 ;; esac

dd=${CLAUDE_PLUGIN_OPTION_DOCS_DIR:-docs}
[ -z "$dd" ] && dd=docs
case "$dd" in /*|*..*) dd=docs ;; esac   # reject absolute / parent-escaping values

state="${CLAUDE_PROJECT_DIR:-.}/$dd/STATE.md"

if [ -f "$state" ]; then
  # Rename pre-0.1.8 NNNN-title.md ADRs to NNNN.md (ADR-0019). Silent unless it changes something.
  sh "$(dirname "$0")/migrate-adrs.sh" "${CLAUDE_PROJECT_DIR:-.}" "$dd" 2>/dev/null
  printf '%s\n' "Orient — current focus (from $dd/STATE.md):"
  awk '/^## Current focus/{f=1;next} /^## /{f=0} f' "$state" 2>/dev/null | head -14
  # Drift check (ADR-0020): decide sets architecture.md's updated: marker on every ADR, so an
  # ADR dated after the marker was written without decide. One line; silent otherwise.
  root="${CLAUDE_PROJECT_DIR:-.}/$dd"
  marked=$(sed -n 's/.*updated: *\([0-9]\{4\}-[0-9][0-9]-[0-9][0-9]\).*/\1/p' "$root/architecture.md" 2>/dev/null | head -1)
  if [ -n "$marked" ]; then
    newest=$(awk -v m="$marked" '$1 == "-" && $2 == "Date:" && $3 > m && $3 > best { best = $3; f = FILENAME }
      END { if (best) { n = f; sub(/.*\//, "", n); print substr(n, 1, 4), best } }' "$root"/decisions/*.md 2>/dev/null)
    [ -n "$newest" ] && printf 'Orient — architecture.md may be stale: ADR-%s (%s) is newer than its updated: marker (%s). If that decision changed structure, update architecture.md; either way, set the marker to today.\n' \
      "${newest% *}" "${newest#* }" "$marked"
  fi
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
