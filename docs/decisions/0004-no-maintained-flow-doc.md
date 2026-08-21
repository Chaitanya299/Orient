# ADR-0004: No maintained flow doc

- Date: 2026-08-19
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
A hand-maintained call graph is correct on the day it is written and wrong on the first refactor after. A stale flow doc is worse than no flow doc: it actively misleads, and it misleads both the human reading it and the model that trusts it as ground truth.

## Decision
No `flow.md` is maintained. `/orient:trace` generates the execution path on demand and writes nothing to disk. `architecture.md` keeps only the durable skeleton — entry points, module boundaries, critical paths — the parts that change slowly enough to be worth writing down.

## Why this over the alternatives
Maintaining a flow doc by hand was rejected because of drift. Generating one and committing it was rejected for the same drift, now dressed in false authority — a checked-in artifact reads as trustworthy long after it stops being true.

## Trade-offs accepted
Tracing costs a subagent run each time instead of being a free file read.

## Consequences
The prior art is Aider, which solves the same problem by generating a ranked repo map on demand rather than storing one. Structural context should be derived, not maintained.
