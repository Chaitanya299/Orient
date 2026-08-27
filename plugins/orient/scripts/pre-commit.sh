#!/bin/sh
# orient pre-commit hook — opt-in, git-native decision-capture reminder.
# POSIX sh, no bashisms. Non-blocking by default: it nudges, it never stops a
# commit unless you ask it to. Install is opt-in (see README); nothing auto-wires it.
#
# ponytail: matches manifest *filenames*, not added-dependency lines. So a version
# bump nudges the same as adding a datastore. Accept it (non-blocking, opt-in); add
# content-classification only if the noise actually bothers you.

# Where ADRs live (mirrors the plugin's docs_dir option); reject unsafe values.
dd=${ORIENT_DOCS_DIR:-docs}
[ -z "$dd" ] && dd=docs
case "$dd" in /*|*..*) dd=docs ;; esac

staged=$(git diff --cached --name-only 2>/dev/null) || exit 0
[ -z "$staged" ] && exit 0

# An ADR staged in this very commit means the decision is already being recorded.
if printf '%s\n' "$staged" | grep -q "^$dd/decisions/"; then
  exit 0
fi

# Dependency/build manifests worth a second look. Lockfiles deliberately excluded.
# Match the basename at the end of any staged path.
hit=$(printf '%s\n' "$staged" | grep -E '(^|/)(package\.json|go\.mod|Cargo\.toml|requirements\.txt|pyproject\.toml|Gemfile|pom\.xml|build\.gradle|composer\.json|Dockerfile|docker-compose\.yml)$')

[ -z "$hit" ] && exit 0

first=$(printf '%s\n' "$hit" | head -1)

# Colour only when stderr is a real terminal; plain text in logs/CI.
if [ -t 2 ]; then
  y=$(printf '\033[1;33m'); d=$(printf '\033[2m'); r=$(printf '\033[0m')
else
  y=''; d=''; r=''
fi

{
  printf '\n'
  printf '%s────────────────────────────────────────────────────────%s\n' "$y" "$r"
  printf '%s  ⚠  orient — possible unrecorded decision%s\n' "$y" "$r"
  printf '%s────────────────────────────────────────────────────────%s\n' "$y" "$r"
  printf '   %s changed, with no ADR staged.\n' "$first"
  printf '   Was this a real decision?  run  %s/orient:decide%s\n' "$y" "$r"
  printf '   Just a routine bump?         nothing to do — this commit continues.\n'
  printf '   %sskip this hook:  git commit --no-verify%s\n' "$d" "$r"
  printf '\n'
} >&2

# Non-blocking by default. Set ORIENT_BLOCK=1 to make an unrecorded manifest change
# fail the commit until you record it or pass --no-verify.
case "${ORIENT_BLOCK:-}" in
  ''|0|false|no|off) exit 0 ;;
  *) exit 1 ;;
esac
