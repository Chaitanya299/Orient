# ADR-0007: Distribute as a marketplace plugin

- Date: 2026-08-19
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
This system has to be usable by someone who will not read a setup guide — the person who most needs a way to keep their bearings is the one with the least patience for installing one. The distribution mechanism is part of the design, not an afterthought.

## Decision
Ship Bearings as a plugin inside a marketplace repo, installed with two commands and updated through the same channel.

## Why this over the alternatives
A template repo to clone was rejected: once copied there is no update path, and every user drifts into their own fork. A shell script was rejected for having no versioning, no discovery, and nothing to trust. A plain skill was rejected because it cannot bundle the session-start hook and the two agents the system needs.

## Trade-offs accepted
Manifest and validation overhead, and a version bump required on every release — miss it and users silently keep the cached copy.

## Consequences
Installation and updates are two commands, and the version number is the contract that tells users what they actually have.
