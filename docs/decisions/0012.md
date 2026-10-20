# ADR-0012: Plan approval is a decision point, with a commit backstop

- Date: 2026-08-25
- Status: accepted
- Supersedes: none
- Superseded by: none

## Context
ADR-0010 made `decide` proactive by telling the agent to offer an ADR when a decision is
made in conversation. Real use exposed its blind spot: the common flow is to write a plan,
approve it, and let the agent build. The decisions live in the approved plan, and by the
time the agent is building they read as instructions to execute, not choices to record —
so the agent, heads-down in execution, never reflects and the whole class of decision
slips. A single conversational trigger also has no backstop: a miss is silent and lost.

## Decision
Add a second, event-based trigger and a backstop. The workflow block now also says: when a
plan is approved before a build, treat the architectural choices inside it as decisions and
offer to record them before starting. As a safety net, the "before reporting a task
complete" step offers to record any decision that has no ADR, and `commit` — which already
reads the staged diff — flags a structural change with no matching ADR and offers `decide`
before drafting the message.

## Why this over the alternatives
Relying on the conversational trigger alone was rejected — it demonstrably missed the
plan→build path in real use. Auto-recording on plan approval was rejected: it violates the
"every write is a proposal" rule and would fire on trivial plans. A dedicated `plan` hook
was rejected because plan approval isn't an event orient can intercept; the reliable signal
is the agent noticing the approval it just processed.

## Trade-offs accepted
Both new prompts still depend on the model recognizing the moment, so capture is improved,
not guaranteed. The `commit` backstop adds one check to a path that already reads the diff.

## Consequences
Decisions now have three chances to be caught — on approval, on completion, and at commit —
instead of one. The failure mode stays "offer missed, user runs `decide` by hand," never a
silent auto-write.
