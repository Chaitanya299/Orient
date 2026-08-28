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

// The AGENTS.md pointer block is what makes decision-capture work every session
// (it carries the "offer an ADR" triggers). It used to be written only by the
// model-driven `init` step 6 — which can be skipped or paraphrased, leaving a repo
// with no triggers at all. We write it here deterministically instead. Source of
// truth is the block the init command already documents, so there's nothing to keep
// in sync: we read it straight out of the shipped init file and substitute the docs
// dir. ponytail: default docs dir; a custom one is picked up when the user runs init.
function agentsBlock(srcRel, docsDir) {
  const txt = readFileSync(join(pkg, srcRel), "utf8");
  const head = txt.indexOf("### AGENTS.md block");
  const fence = txt.indexOf("```markdown", head);
  const bodyStart = txt.indexOf("\n", fence) + 1;
  const fenceClose = txt.indexOf("```", bodyStart);
  const block = txt.slice(bodyStart, fenceClose).trimEnd().replaceAll("$DOCS_DIR", docsDir);
  // Fail loud if the init file's shape ever drifts from what we parse for.
  if (head < 0 || fence < 0 || fenceClose < 0 ||
      !block.includes("<!-- ORIENT:START -->") || !block.includes("plan is approved")) {
    throw new Error(`orient: could not extract the AGENTS.md block from ${srcRel}`);
  }
  return block;
}

// Inject the block into <projectRoot>/AGENTS.md using init's marker rules:
// replace between the markers if both are present, append if neither is, create the
// file if absent. Refuse to touch a file with CRLF or a lone/duplicated marker rather
// than corrupt it — that case is rare and init (or the user) can sort it out.
const START = "<!-- ORIENT:START -->", END = "<!-- ORIENT:END -->";
function injectAgentsBlock(projectRoot, block) {
  const file = join(projectRoot, "AGENTS.md");
  if (!existsSync(file)) { writeFileSync(file, block + "\n"); return "created AGENTS.md with the orient block"; }
  const txt = readFileSync(file, "utf8");
  if (txt.includes("\r\n")) return "left AGENTS.md untouched (CRLF line endings — run /orient-init to add the block)";
  const starts = txt.split(START).length - 1, ends = txt.split(END).length - 1;
  if (starts > 1 || ends > 1) return "left AGENTS.md untouched (duplicated orient markers — fix them, then re-run)";
  if (starts === 1 && ends === 1) {
    const s = txt.indexOf(START), e = txt.indexOf(END);
    if (e < s) return "left AGENTS.md untouched (orient markers out of order — run /orient-init)";
    writeFileSync(file, txt.slice(0, s) + block + txt.slice(e + END.length));
    return "refreshed the orient block in AGENTS.md";
  }
  if (starts !== ends) return "left AGENTS.md untouched (only one orient marker present — run /orient-init)";
  writeFileSync(file, txt.trimEnd() + "\n\n" + block + "\n");
  return "appended the orient block to AGENTS.md";
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
    if (global) {
      console.log("  (global install — run /orient-init in each repo to add the AGENTS.md block.)");
    } else {
      console.log(`  ${injectAgentsBlock(process.cwd(), agentsBlock("opencode/commands/orient-init.md", "docs"))}`);
    }
    console.log("Done. Restart opencode, then run /orient-init in a repo.");
    break;
  }
  case "codex": {
    const root = global ? join(homedir(), ".agents", "skills") : join(process.cwd(), ".agents", "skills");
    console.log(`Installing orient for Codex${global ? " (global)" : ""}:`);
    report(install(root, [["codex/skills", "."]]));
    if (global) {
      console.log("  (global install — run $orient-init in each repo to add the AGENTS.md block.)");
    } else {
      console.log(`  ${injectAgentsBlock(process.cwd(), agentsBlock("codex/skills/orient-init/SKILL.md", "docs"))}`);
    }
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
