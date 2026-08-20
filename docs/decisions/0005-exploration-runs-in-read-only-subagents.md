# ADR-0005: Exploration runs in read-only subagents

- Date: 2026-08-19
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
Answering one question about an unfamiliar repo often means surveying it — opening tens of files, chasing imports, reading more than the answer is worth. Done in the main conversation, that survey burns the very context window the work depends on, and the noise lingers for the rest of the session.

## Decision
Two agents, `repo-cartographer` and `flow-tracer`, do the exploring in their own context and return compact summaries. Both are strictly read-only, enforced through `disallowedTools` rather than convention.

## Why this over the alternatives
Exploring in the main conversation was rejected — that is the exact problem being solved. Letting the agents write was rejected too: an agent that both explores and edits is far harder to reason about, and the added capability does not earn the loss in predictability.

## Trade-offs accepted
A subagent round trip is slower than reading a file directly in the main thread.

## Consequences
The main window stays clean. Exploration cost is paid in a sandbox, and only the conclusion comes back.
