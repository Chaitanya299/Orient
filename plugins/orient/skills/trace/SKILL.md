---
name: trace
description: Trace how execution travels for one path — entry point through to the edges — to locate where behavior breaks.
---

# /orient:trace

Trace one execution path on demand, so you never have to maintain a flow doc that
goes stale the moment code changes.

Take a starting point from the user: a route, a CLI command, or a function. Dispatch
the `flow-tracer` agent with that starting point. Return the compact ordered path it
produces, with `file:line` references and the boundaries where control leaves the
codebase.

Write nothing to disk. If the user asks to save the trace, say that a saved flow doc
goes stale as soon as the code changes — that's why this traces on demand instead.
