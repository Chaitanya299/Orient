#!/usr/bin/env node
// orient installer. Copies the bundled command/skill files into place for the
// agent you name. Zero dependencies — Node stdlib only. The plugin content it
// installs stays pure markdown/JSON; this is just delivery.
// ponytail: stdlib fs.cpSync, no copy library — a directory copy is one call.

import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const pkg = dirname(dirname(fileURLToPath(import.meta.url))); // package root
const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith("-"));
const global = args.includes("--global") || args.includes("-g");

function copyInto(fromRel, toDir) {
  const from = join(pkg, fromRel);
  mkdirSync(toDir, { recursive: true });
  cpSync(from, toDir, { recursive: true });
  console.log(`  ${fromRel}  ->  ${toDir}`);
}

function usage() {
  console.log(`orient — never lose the thread of what you're building

Usage:
  npx @chaitanya299/orient <agent> [--global]

Agents:
  opencode        Install commands + agents into .opencode/ (or ~/.config/opencode with --global)
  codex           Install skills into .agents/skills/ (or ~/.agents/skills with --global)
  claude          Print the Claude Code marketplace install commands

After installing, open your agent in a repo and run orient's init
(/orient:init, /orient-init, or $orient-init) to scaffold the docs.

Docs and a live example (this repo runs orient on itself — see docs/):
  https://github.com/Chaitanya299/Orient`);
}

switch (target) {
  case "opencode": {
    const base = global ? join(homedir(), ".config", "opencode") : join(process.cwd(), ".opencode");
    console.log(`Installing orient for opencode${global ? " (global)" : ""}:`);
    copyInto("opencode/commands", join(base, "commands"));
    copyInto("opencode/agents", join(base, "agents"));
    console.log("Done. Restart opencode, then run /orient-init in a repo.");
    break;
  }
  case "codex": {
    const dest = global ? join(homedir(), ".agents", "skills") : join(process.cwd(), ".agents", "skills");
    console.log(`Installing orient for Codex${global ? " (global)" : ""}:`);
    copyInto("codex/skills", dest);
    console.log("Done. Restart Codex, then run $orient-init in a repo.");
    break;
  }
  case "claude":
    console.log(`Install orient in Claude Code with two commands:

  /plugin marketplace add Chaitanya299/Orient
  /plugin install orient@chaitanya299-plugins

Then run /orient:init in a repo you want to track.`);
    break;
  default:
    usage();
    process.exit(target ? 1 : 0);
}
