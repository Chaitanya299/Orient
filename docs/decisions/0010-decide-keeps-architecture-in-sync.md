# ADR-0010: decide captures decisions proactively and keeps architecture.md in sync

- Date: 2026-08-25
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
A DX review found `decide` had the weakest real-world adoption of the six commands. As a
pull-only command, it required a human to notice a decision, remember the command, break
flow, and run it — so most decisions, made mid-conversation in plan or auto mode, were
never captured. Separately, `architecture.md` drifted: an ADR recorded the *why* of a
structural change, but the architecture doc that described the structure went stale
because nothing updated it.

## Decision
Two changes. First, shift the remembering from the human to the agent: the workflow block
that `init` writes now tells the agent to proactively offer `decide` when a decision
surfaces in conversation, and `decide`'s description cues the model to self-recognize
those moments. Second, `decide` now keeps `architecture.md` in sync — after writing the
ADR, it checks whether the decision changes entry points, module boundaries, or critical
paths, and if so proposes the edit as a separate preview the user approves.

## Why this over the alternatives
Leaving `decide` as a manual command was rejected: it demonstrably under-captures, which
defeats orient's purpose. A session-start or Stop hook that auto-records was rejected as a
silent write that breaks the "every write is a proposal" rule and would misfire constantly.
Auto-editing `architecture.md` without a preview was rejected for the same reason.

## Trade-offs accepted
Proactive offering depends on the model recognizing a decision, which is imperfect and
only tunable from real use. The architecture-sync step adds a second approval to `decide`
when a decision is structural.

## Consequences
`decide` becomes agent-driven rather than memory-driven, and `architecture.md` stays
current at the one moment it is most likely to go stale. Both remain proposals the user
approves; nothing writes silently.
