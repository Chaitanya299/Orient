# ADR-0006: Commit messages require an approval turn

- Date: 2026-08-19
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
Git history is the decision log — the one record of why a change happened that travels with the code forever. A wrong or invented commit message does not just miss; it poisons that record permanently, and every future reader inherits the error as fact.

## Decision
`/orient:commit` drafts a message, presents it, and stops. It commits only after an explicit approval turn from the human. The `Findings` section is omitted entirely when nothing was actually discovered, rather than filled to satisfy a template.

## Why this over the alternatives
Auto-commit was rejected: unreviewed history is worse than no history, because it carries the authority of the record without the scrutiny. Always emitting a `Findings` section was rejected because a model asked to always find something will always invent something — the empty section is the honest one.

## Trade-offs accepted
One extra turn on every commit.

## Consequences
`git log` becomes trustworthy enough to serve as the decision log, which is the entire point of treating it as one.
