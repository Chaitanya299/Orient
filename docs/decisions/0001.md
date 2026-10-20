# ADR-0001: Record architecture decisions

- Date: 2026-08-19
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
Code is a precise record of what the system does and a silent one about why it does it that way. A diff shows that a check moved into a shared function; it never shows the outage that made someone move it. Six months later that reasoning is gone, and the only thing standing between the team and a re-run of a settled argument is whoever happens to remember. Memory is not a durable medium — it does not survive a context reset for a model, or a quarter for a person.

## Decision
Every meaningful design decision gets a numbered, append-only file in `docs/decisions/`. The record captures the context, the choice, and the roads not taken, so the reasoning outlives the sessions and people that produced it.

## Why this over the alternatives
A single growing `decisions.md` was rejected — see ADR-0003 for why one-file-per-decision wins. Relying on memory was rejected outright: it is the exact failure mode this practice exists to prevent.

## Trade-offs accepted
A small, ongoing writing cost at the moment each decision is made.

## Consequences
Settled questions stay settled. A newcomer — human or model — can reconstruct the reasoning without interrupting anyone.
