# STATE — <!-- updated: 2026-08-19 -->

## Current focus
Building v0.1.0 of the `orient` plugin — six skills, two read-only subagents, one session-start hook, packaged in a marketplace repo.

## Done
- Design settled. Decisions recorded as ADR-0001 through ADR-0007.

## In progress
- Nothing yet. Next session starts the build.

## Next up
- Scaffold the marketplace + plugin manifests
- Write the six skills: init, status, sync, decide, commit, trace
- Write the two agents: repo-cartographer, flow-tracer
- Write hooks.json + scripts/orient.sh
- Validate with `claude plugin validate . --strict` and check cost with `claude plugin details`

## Blocked / needs research
- Do the skill descriptions actually trigger reliably? Only learnable from real use — plan a tuning pass after a week.
- Should the SessionStart hook default to on? It costs tokens on every session in every repo, including ones that never installed the docs.
- Does `scripts/orient.sh` work under Git Bash and WSL on Windows? Untested.
- Is submitting to the official Anthropic plugin directory worth it, and what does it require?

## Known issues
- None yet — nothing is built.
