# ADR-0003: One file per decision

- Date: 2026-08-19
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
A single decisions file has one property that gets worse with age: to find the one decision you care about, something has to read the whole thing. The cost of a lookup scales with the number of decisions ever made — precisely backwards, since the project you most need to navigate is the one where this is most expensive.

## Decision
One decision per file, named `docs/decisions/NNNN-title.md`. A reader — human or model — pulls in exactly the record it needs and nothing else.

## Why this over the alternatives
A single `decisions.md` was rejected: its read cost grows with project age, penalizing exactly the long-lived projects that most benefit from having a decision log at all.

## Trade-offs accepted
More files in the tree. Superseding a decision means touching two files — the old record and the new one — rather than editing one in place.

## Consequences
Reads stay surgical no matter how long the project runs or how many decisions accumulate.
