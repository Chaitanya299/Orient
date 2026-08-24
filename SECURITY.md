# Security

orient is an orientation plugin for AI coding agents (Claude Code, opencode, Codex).
It runs on your machine and reads your repositories, so its security properties matter.

## Security properties

- **No network.** orient makes no HTTP requests, opens no sockets, and ships no MCP
  server. It cannot send your code or data anywhere.
- **No telemetry.** Nothing is logged, phoned home, or collected.
- **Read-only survey agents.** `repo-cartographer` and `flow-tracer` run with write and
  edit denied — they can read and analyze, never modify your code.
- **Secret-blind.** The survey and trace agents are instructed never to open
  secret-bearing files (`.env*`, `*.pem`, `*.key`, `id_rsa*`, credentials) and never to
  copy a secret value into any generated doc.
- **Injection-resistant.** The agents treat repository content as data to analyze, not
  as instructions to follow — a malicious file in a repo cannot redirect them.
- **Nothing writes silently.** `init`, `sync`, `decide`, and `commit` draft their output
  and wait for your approval before writing.
- **Minimal footprint.** The Claude Code session-start hook does nothing in a repo that
  hasn't been set up with orient, and always exits cleanly.

## The `.env` / secrets standard

orient commits none of these, and its ignore rules exclude them defensively so a fork or
a co-located project can't leak one by accident. For any repo:

- Add `.env` and `.env.*` to `.gitignore`; commit only a `.env.example` with placeholder
  values, never real ones.
- Load secrets from the environment at runtime; never hardcode them in source.
- If a real secret was ever committed: **rotate it first** (deleting the file does not
  un-leak it), then scrub history (`git filter-repo` or BFG), force-push, and check the
  provider's audit log for abuse during the exposure window.
- A committed `.env` is read by any agent that opens the repo — the ignore rule protects
  the secret from git *and* from the model.

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue. Open a
[GitHub security advisory](https://github.com/Chaitanya299/Orient/security/advisories/new)
on the repository, or contact the maintainer directly. We'll acknowledge and work a fix
before any public disclosure.
