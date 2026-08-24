// Printed once after `npm i @chaitanya299/orient`. It writes NOTHING — it only
// tells you how to enable orient for your agent, because the three platforms load
// differently: Claude Code through its marketplace, opencode/Codex from directories.
// ponytail: a console.log, not an installer — silent file writes on install would
// contradict orient's "nothing writes silently" promise, and wouldn't even make
// Claude Code load a plugin (that only happens through the marketplace).
console.log(`
orient installed. Enable it for your agent:

  Claude Code   claude plugin marketplace add Chaitanya299/Orient
                claude plugin install orient@chaitanya299-plugins

  opencode      npx @chaitanya299/orient opencode
  Codex         npx @chaitanya299/orient codex

Then, in a repo you want to track, run init:
  /orient:init   (Claude Code)   /orient-init   (opencode)   $orient-init   (Codex)

Docs and a live example: https://github.com/Chaitanya299/Orient
`);
