#!/usr/bin/env node
// Version sync gate (ADR-0011). plugin.json is the source of truth; package.json
// mirrors it exactly. Runs on prepublishOnly and in CI, so a drifted pair fails
// before it can ship instead of after.
// ponytail: two JSON.parse calls and a string compare — no semver library needed
// for an equality check.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ORIENT_ROOT is a test seam: the drift branch is otherwise unreachable, since
// this resolves from its own file location rather than cwd.
const root = process.env.ORIENT_ROOT ?? dirname(dirname(fileURLToPath(import.meta.url)));
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8")).version;

const plugin = read("plugins/orient/.claude-plugin/plugin.json");
const pkg = read("package.json");

if (plugin !== pkg) {
  console.error(
    `version drift: plugin.json is ${plugin}, package.json is ${pkg}.\n` +
      `plugin.json is the source of truth — set package.json to ${plugin} and retry.`,
  );
  process.exit(1);
}
console.log(`versions in sync: ${plugin}`);
