# Publishing orient

How to get orient into the official directories for each agent. orient already
self-distributes from this repo (`/plugin marketplace add Chaitanya299/Orient`); this
doc is about the *curated* directories where users discover plugins.

Verified against the platform docs (August 2026). Links at the bottom.

---

## Claude Code

Two levels of distribution.

### 1. Your own marketplace (already live)

This repo *is* a marketplace — `.claude-plugin/marketplace.json` names `orient`. Anyone
can already install it:

```
/plugin marketplace add Chaitanya299/Orient
/plugin install orient@chaitanya299-plugins
```

No submission needed for this. It's the fallback that always works.

### 2. The official Anthropic directory

Anthropic runs a curated directory, `anthropics/claude-plugins-official` (installs as
`@claude-plugins-official`), with a community mirror at `anthropics/claude-plugins-community`.
You don't PR those repos directly — they're read-only mirrors. You submit through
claude.ai:

**Submit at → https://clau.de/plugin-directory-submission**

Every listed plugin was submitted via claude.ai, passed **automated security scanning**,
and was approved for distribution. Before you submit:

- [ ] Repo is public (`Chaitanya299/Orient`).
- [ ] `claude plugin validate . --strict` and `claude plugin validate ./plugins/orient --strict` both pass.
- [ ] Marketplace name is not a reserved Anthropic name (`chaitanya299-plugins` is fine).
- [ ] Secrets scan is clean (the `secret-scan` CI gate and [SECURITY.md](./SECURITY.md) cover this — the security scanner will check too).
- [ ] `plugin.json` has `author`, `repository`, `license`, `keywords` filled (it does).
- [ ] A tagged release exists (e.g. `v0.1.0`) so the version is pinnable.

After approval it appears in the in-product `/plugin` directory. Review timelines vary.

---

## Codex (and ChatGPT)

As of July 2026, ChatGPT and Codex share **one universal Plugins Directory**. orient's
Codex port is **skills-only** (no MCP server), which is a supported plugin type.

### Steps

1. **Package the skills as a plugin.** Bundle `codex/skills/*` into a plugin per
   [Package your plugin](https://developers.openai.com/plugins/build/plugins). A plugin
   can hold one or more skills; ours holds the six `orient-*` skills.
2. **Submit through the plugin submission portal**
   ([Submit plugins](https://developers.openai.com/plugins/deploy/submission)).
   Submitting starts review — it does not publish immediately. The form collects:
   listing info, skills, starter prompts, test cases, country availability, and policy
   attestations. In the release notes, say what orient does, that this is an initial
   submission, and note there are no test credentials (it's local, no network).
3. **OpenAI reviews** the submission.
4. **After approval, publish from the portal** — you choose when. It then appears in the
   universal Plugins Directory for both ChatGPT and Codex.

### Alternative: the curated skills repo

Skills can also be installed from `openai/skills` (or any repo) via the built-in Skill
Installer. Opening a PR to `openai/skills` is a lighter, community route that doesn't
require the full plugin submission — good for reach before the directory listing lands.

---

## opencode

opencode has **no central plugin directory**. Distribution options:

- This repo + the copy-in instructions in [opencode/README.md](./opencode/README.md).
- List it in community catalogs (the `awesome-opencode` type lists, GitHub topic
  `opencode`).
- opencode *plugins* (the TS/Bun kind) can be published to npm and referenced in config,
  but orient's opencode port is commands + agents (plain files), not a runtime plugin —
  so file-copy or this git repo is the distribution path.

---

## Before any submission — shared checklist

- [ ] `gitleaks detect` clean (or the CI gate green) — no secrets in tree or history.
- [ ] Both `claude plugin validate --strict` commands pass.
- [ ] Version bumped in `plugin.json` only; a matching git tag pushed.
- [ ] README and per-port READMEs current; install commands correct.
- [ ] `SECURITY.md` present with a disclosure contact.

## Links

- Claude Code — [Create and distribute a marketplace](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces) · [Submit to the directory](https://clau.de/plugin-directory-submission) · [Official directory](https://github.com/anthropics/claude-plugins-official)
- Codex / ChatGPT — [Plugins overview](https://developers.openai.com/plugins) · [Package a plugin](https://developers.openai.com/plugins/build/plugins) · [Submit plugins](https://developers.openai.com/plugins/deploy/submission) · [Build skills](https://developers.openai.com/plugins/build/skills)
