# ADR-0008: init does not manage ignore files

- Date: 2026-08-19
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
Someone asked whether `/orient:init` should scaffold a `.claudeignore`. Claude Code does not read `.claudeignore` — the mechanisms that actually take effect are `.gitignore` (for git-aware operations) and `deny` rules in `.claude/settings.json`. So the question is really whether init should manage ignore files at all.

## Decision
`/orient:init` scaffolds orientation docs only — STATE.md, architecture.md, decisions/, and the CLAUDE.md pointer block. It does not create, edit, or manage any ignore file.

## Why this over the alternatives
Auto-writing `.claudeignore` was rejected as phantom enforcement: a file that ignores nothing invites a user to trust it with secret paths that Claude will still read — the one kind of "helpful" doc that can actively harm. Offering to write a real `settings.json` deny rule was set aside as a different concern from orientation, outside init's job. Orient also generates nothing that needs ignoring: its docs are meant to be committed and read, and its only transient marker lives in the XDG state dir, not the repo.

## Trade-offs accepted
Users who want Claude to skip large or irrelevant directories get no help from init; they reach for a `settings.json` deny rule themselves.

## Consequences
init's scope stays narrow: orient the repo, nothing else. A future contributor who considers adding `.claudeignore` scaffolding will find this reasoning first.
