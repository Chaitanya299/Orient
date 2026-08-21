# Architecture — <!-- updated: YYYY-MM-DD -->

Only what a new engineer can't read off the code at a glance. Not a file listing,
not a call graph, not a dependency inventory.

## Entry points
- <where execution actually starts: the CLI command, the server bootstrap, the request handler>

## Module boundaries and ownership
- `<module/dir>` — <what it owns, and where its responsibility stops>

## Critical paths
The three or four flows that matter most, one line each:

- <name> — <entry> → <the two or three hops that matter> → <edge>

## Conventions that differ from the framework default
- <the thing a newcomer would get wrong because the framework would suggest otherwise>
