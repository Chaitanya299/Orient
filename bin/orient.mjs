#!/usr/bin/env node
// orient installer. Copies the bundled command/skill files into place for the
// agent you name. Zero dependencies — Node stdlib only. The plugin content it
// installs stays pure markdown/JSON; this is just delivery.
// ponytail: per-file copy with a tiny hash manifest — the dpkg/.new model. Lets
// untouched files update on their own while never clobbering one you edited.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const pkg = dirname(dirname(fileURLToPath(import.meta.url))); // package root
const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith("-"));
const global = args.includes("--global") || args.includes("-g");

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

// Files under `dir`, as paths relative to `base` (recurses into subdirs).
function listRel(dir, base = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const abs = join(dir, e.name);
    return e.isDirectory() ? listRel(abs, base) : [abs.slice(base.length + 1)];
  });
}

// The manifest records the hash of every file orient last shipped here, so a
// later install can tell "you edited this" (disk != what we shipped) from "this
// is just old" (disk == what we last shipped) — the distinction a blind copy
// can't make. On the very first install under this scheme there's no manifest,
// so a differing file is treated as edited (safe: written as .new, never lost).
const manifestPath = (root) => join(root, ".orient-manifest.json");
function readManifest(root) {
  try { return JSON.parse(readFileSync(manifestPath(root), "utf8")); } catch { return {}; }
}

// Install every mapping [srcRelToPkg, destSubdir] under `root`, tracked by one
// manifest at the root. New files are written; files you never touched (or that
// are already current) update in place; files you edited are never overwritten —
// the incoming version lands beside them as `<file>.new`.
function install(root, mappings) {
  mkdirSync(root, { recursive: true });
  const prev = readManifest(root);
  const next = {};
  const preserved = [];
  let installed = 0, updated = 0, current = 0;

  for (const [srcRel, destSub] of mappings) {
    const srcDir = join(pkg, srcRel);
    for (const rel of listRel(srcDir)) {
      const key = destSub === "." ? rel : join(destSub, rel);
      const shipped = readFileSync(join(srcDir, rel));
      next[key] = sha256(shipped);
      const destPath = join(root, key);
      mkdirSync(dirname(destPath), { recursive: true });

      if (!existsSync(destPath)) {
        writeFileSync(destPath, shipped);
        installed++;
        continue;
      }
      const diskHash = sha256(readFileSync(destPath));
      if (diskHash === next[key]) { current++; continue; }     // already current
      if (prev[key] !== undefined && diskHash === prev[key]) {  // old but untouched
        writeFileSync(destPath, shipped);
        updated++;
      } else {                                                 // you edited it
        writeFileSync(`${destPath}.new`, shipped);
        preserved.push(key);
      }
    }
  }
  writeFileSync(manifestPath(root), JSON.stringify(next, null, 2) + "\n");
  return { installed, updated, current, preserved };
}

function report({ installed, updated, current, preserved }) {
  if (installed + updated + preserved.length === 0) {
    console.log("  already up to date.");
    return;
  }
  console.log(`  ${installed} new, ${updated} updated, ${current} unchanged, ${preserved.length} you edited (kept)`);
  for (const key of preserved) console.log(`    kept your ${key} — new version saved as ${key}.new`);
  if (preserved.length) {
    console.log(`\nFiles you changed were left as-is; review each *.new, merge what you want,`);
    console.log(`then delete the .new file. Files you never touched updated on their own.`);
  }
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
    const root = global ? join(homedir(), ".config", "opencode") : join(process.cwd(), ".opencode");
    console.log(`Installing orient for opencode${global ? " (global)" : ""}:`);
    report(install(root, [["opencode/commands", "commands"], ["opencode/agents", "agents"]]));
    console.log("Done. Restart opencode, then run /orient-init in a repo.");
    break;
  }
  case "codex": {
    const root = global ? join(homedir(), ".agents", "skills") : join(process.cwd(), ".agents", "skills");
    console.log(`Installing orient for Codex${global ? " (global)" : ""}:`);
    report(install(root, [["codex/skills", "."]]));
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
