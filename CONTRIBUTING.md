# Contributing to Orient

Thanks for your interest in contributing. Orient is open-source under the
[Apache License 2.0](./LICENSE), and contributions are welcome from
individuals and organizations alike.

By submitting a contribution, you agree to the terms below.

---

## 1. Code of Conduct

- Be respectful. Disagree on ideas, not on people.
- No harassment, discrimination, or personal attacks.
- Assume good intent; ask before assuming bad.

Violations can be reported privately to the maintainer listed in the
README. Reports are kept confidential.

---

## 2. How to Contribute

### Reporting bugs

Open a GitHub issue using the **Bug report** template. Include:

- Steps to reproduce.
- What you expected vs. what happened.
- Agent you were running in (Claude Code, opencode, Codex).
- Plugin version (`/orient-status` shows it).

### Suggesting features

Open a GitHub issue using the **Feature request** template. Explain the
problem before the solution — "what's broken" before "what to build".

### Pull requests

1. **Fork the repo** and create a branch from `main`:
   ```
   git checkout -b fix/short-description
   ```
2. **Make your change.** Keep it focused. One PR = one concern.
3. **Run the validation locally** before pushing:
   ```
   npm run validate
   npm test
   ```
4. **Sign the CLA** when the bot prompts you on the PR (see below).
5. **Open the PR.** Fill out the template. Link any related issue.

A maintainer will review within a few days. Reviews may request changes —
this is normal, not a rejection.

---

## 3. Contributor License Agreement (CLA)

**Every contributor must sign a CLA before their PR can be merged.** The
CLA Assistant bot will post a comment on your PR; click the link, sign in
with GitHub, and approve.

What you're agreeing to (in plain language):

- You keep copyright on your contribution.
- You grant the project a broad license to use, modify, sublicense, and
  relicense your contribution under any license — including, but not
  limited to, Apache 2.0, AGPL, BSL, or a closed-source commercial
  license.
- You confirm the contribution is your own work, or that you have the
  right to submit it.
- You grant a patent license covering any patents your contribution
  reads on.

**Why this matters:** without a CLA, every contributor retains the right
to revoke the project's license to their code. One disgruntled past
contributor could later force the whole project to be taken down or
relicensed — which has happened to real OSS projects. The CLA protects
the project and everyone who depends on it.

If you cannot or will not sign the CLA, your PR cannot be merged. You are
still welcome to fork the project under the Apache 2.0 license for your
own use.

---

## 4. Style & Conventions

- **Markdown only.** Orient ships as `.md` skill files. No build step,
  no transpiled output. Keep it that way.
- **Pointers, not content.** The always-on CLAUDE.md / AGENTS.md block
  added by `/orient-init` stays under ~14 lines. Anything substantial
  belongs in a doc file, not in instructions.
- **No silent writes.** Every agent that touches the repo must show its
  plan before writing. Survey and trace agents must be read-only.
- **No secrets in skills.** Skills must never read `.env*`, `*.pem`,
  `*.key`, `id_rsa*`, or `credentials.*`. A test asserts this.
- **Run `npm run validate` before pushing.** Both Claude Code plugin
  validation paths must pass.

If in doubt, look at the existing skills (`plugins/orient/skills/`) for
the style. Match it.

---

## 5. Commit Messages

`orient-commit` will draft one for you. The format is:

```
<scope>: <what changed>

<why it changed>

Findings:
- <what we learned while doing it>
```

Scopes: `init`, `status`, `sync`, `decide`, `commit`, `trace`, `installer`,
`docs`, `hooks`.

---

## 6. What We Don't Accept

- Changes that add telemetry, network calls, or anything that leaves the
  user's machine. Orient is local-only by design and we intend to keep
  it that way.
- Skills that wrap cloud APIs. Orient helps people stay oriented in their
  own repos; it's not a cloud-service host.
- PRs that touch many unrelated concerns in one commit. Split them.
- Reformatting-only PRs. If a file is being rewritten for clarity,
  the clarity change has to be the point, not drive-by whitespace.

---

## 7. Security

Found a vulnerability? **Do not open a public issue.** Email the
maintainer privately (see README) or use GitHub's private vulnerability
reporting. See [SECURITY.md](./SECURITY.md).

---

## 8. License

By contributing, you agree your contributions are licensed under the
Apache License 2.0 (the project's license) **and** that you have signed
the CLA granting the broader relicensing rights described above.

Full Apache 2.0 text: [LICENSE](./LICENSE).

© 2026 Parasana Sai Chaitanya
