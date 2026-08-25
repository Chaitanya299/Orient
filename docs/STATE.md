# STATE — <!-- updated: 2026-08-24 -->

## Current focus
v0.1.0 shipped and live. The Claude Code plugin is built, secured, ported to
opencode and Codex, published to npm, and installable from the marketplace. Now in
real use and validation.

## Done
- Claude Code plugin: six skills, two read-only agents, session-start hook, marketplace
  manifest. Passes `validate --strict`.
- opencode port (.opencode commands + agents) and Codex port (native .agents/skills),
  each with secret-blind + anti-injection guardrails.
- Security hardening: secret-blind survey/trace agents, commit secret gate, defensive
  .gitignore, SECURITY.md, SHA-pinned gitleaks CI, removed the phantom .claudeignore.
- npm/npx distribution: zero-dependency installer (`bin/orient.mjs`), print-only
  postinstall. Published `@chaitanya299/orient`.
- Identity unified to Chaitanya299; marketplace `chaitanya299-plugins`. README rewritten
  human-first.
- Published to github.com/Chaitanya299/Orient; installed from the marketplace and
  dogfooding in-session.
- Decisions recorded: ADR-0001 through ADR-0009.

## In progress
- Nothing mid-edit. Working tree clean, all pushed.

## Next up
- Republish npm as 0.1.1 (fixes the self-dependency, adds the postinstall) — needs an OTP.
- Tag `v0.1.0` on GitHub.
- Submit to the official directories: Claude Code via clau.de/plugin-directory-submission;
  Codex by packaging the skills and using the OpenAI portal (see local PUBLISHING.md).

## Blocked / needs research
- Does the proactive decision-capture actually fire in practice? Shipped in 0.1.2
  (ADR-0010); needs a week of real use to confirm the agent offers `decide` reliably.
- Does `scripts/orient.sh` work under Git Bash and WSL on Windows? Untested.

## Known issues
- npm 0.1.0 shipped with a self-dependency; fixed in the tree and in 0.1.1, not yet republished.
