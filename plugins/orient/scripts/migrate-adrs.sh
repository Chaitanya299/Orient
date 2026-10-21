#!/bin/sh
# orient ADR migration (ADR-0019): renames pre-0.1.8 `decisions/NNNN-title.md` files to
# `NNNN.md` and fixes links to them. Run at session start and by the npm installer.
# POSIX sh, no bashisms. Always exits 0, never commits. Silent when there is nothing to do.
# usage: migrate-adrs.sh [repo_dir] [docs_dir]

repo=${1:-.}
dd=${2:-docs}
[ -z "$dd" ] && dd=docs
case "$dd" in /*|*..*) dd=docs ;; esac   # reject absolute / parent-escaping values

cd "$repo" 2>/dev/null || exit 0
dec="$dd/decisions"

# Cheapest check first: this runs every session, and almost always finds nothing.
set -- "$dec"/[0-9][0-9][0-9][0-9]-*.md
[ -e "$1" ] || exit 0

# Only orient-tracked repos. Other ADR tools (adr-tools, log4brains) use the same
# NNNN-title.md names, and those files are not ours to rename.
[ -f "$dd/STATE.md" ] || exit 0
grep -qsF '<!-- ORIENT:START -->' CLAUDE.md AGENTS.md || exit 0

# Never act while git is mid-operation: renames would tangle with the user's resolution.
ingit=0
if git rev-parse --git-dir >/dev/null 2>&1; then
  ingit=1
  for p in MERGE_HEAD CHERRY_PICK_HEAD REVERT_HEAD rebase-merge rebase-apply; do
    [ -e "$(git rev-parse --git-path "$p")" ] && exit 0
  done
  [ -n "$(git diff --name-only --diff-filter=U -- "$dec" 2>/dev/null)" ] && exit 0
fi

tmp="${TMPDIR:-/tmp}/orient-migrate.$$"
: > "$tmp.sed" || exit 0
renamed=0 example='' skipped=''
for f in "$@"; do
  base=${f##*/}
  n=$(printf '%s' "$base" | cut -c1-4)
  new="$dec/$n.md"
  if [ -e "$new" ]; then skipped="$skipped $base"; continue; fi   # number already taken
  if [ "$ingit" = 1 ] && git ls-files --error-unmatch -- "$f" >/dev/null 2>&1; then
    git mv -- "$f" "$new" 2>/dev/null || continue
  else
    mv -- "$f" "$new" 2>/dev/null || continue
  fi
  renamed=$((renamed + 1))
  [ -z "$example" ] && example="$base -> $n.md"
  # sed substitution for links: the old filename is literal text, so escape its metacharacters.
  printf 's|%s|%s.md|g\n' "$(printf '%s' "$base" | sed 's/[.[\*^$|]/\\&/g')" "$n" >> "$tmp.sed"
done

# Fix links to the renamed files in the repo's markdown (tracked + untracked, not ignored).
if [ "$renamed" -gt 0 ]; then
  if [ "$ingit" = 1 ]; then
    git ls-files -co --exclude-standard -- '*.md' 2>/dev/null
  else
    find . -name '*.md' -not -path './node_modules/*' -not -path './.git/*' 2>/dev/null
  fi | while IFS= read -r md; do
    [ -f "$md" ] || continue
    sed -f "$tmp.sed" "$md" > "$tmp.out" 2>/dev/null || continue
    cmp -s "$md" "$tmp.out" || cat "$tmp.out" > "$md"   # cat keeps the file's mode
  done
  printf 'orient: renamed %s old ADR file(s) to number-only names (ADR-0019), e.g. %s. Not committed; review with git status.\n' "$renamed" "$example"
fi
[ -n "$skipped" ] && printf 'orient: left%s as is; that number is already used by another ADR. Renumber it by hand (see /orient:decide).\n' "$skipped"
rm -f "$tmp.sed" "$tmp.out"
exit 0
