# orient (Claude Code plugin)

Know where you are in a codebase — current state, past decisions, and the *why* behind
them — without burning context. This is the Claude Code build; full pitch, the opencode
and Codex ports, and security details live in the [repo README](../../README.md).

## Install

```
/plugin marketplace add Chaitanya299/Orient
/plugin install orient@chaitanya299-plugins
```

Then run `/orient:init` in a repo you want to track. It surveys the repo in a read-only
subagent, shows you everything it plans to write, and writes nothing until you approve.

Skills: `/orient:init`, `/orient:status`, `/orient:sync`, `/orient:decide`,
`/orient:commit`, `/orient:trace`.

## Limitations

Docs are context, not enforcement. orient makes the right thing cheap and easy, but it
can't *make* anyone keep `STATE.md` current. Anything that must hold — an invariant, a
convention — belongs in a test, a lint rule, or a hook, not a doc.

## License & Trademark

See the root [`LICENSE`](../../LICENSE) (Apache 2.0), [`CONTRIBUTING.md`](../../CONTRIBUTING.md),
and [`TRADEMARK.md`](../../TRADEMARK.md) for full details.

© 2026 Parasana Sai Chaitanya
