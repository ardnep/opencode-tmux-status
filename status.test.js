// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Aaradh Nepal
import { test } from "node:test"
import assert from "node:assert/strict"
import { createWriter, indicator, sessionState } from "./status.js"

function context({ type = "idle", outcome, permissions = [], forms = [], route } = {}) {
  return {
    ui: { router: { current: () => route ?? { type: "session", sessionID: "ses_test" } } },
    data: { session: {
      status: () => ({ type }),
      get: () => ({ outcome }),
      permission: { list: () => permissions },
      form: { list: () => forms },
    } },
  }
}

test("maps cached session states and gives prompts priority", () => {
  for (const [input, expected] of [
    [{}, "idle"], [{ type: "busy" }, "working"], [{ type: "retry" }, "retry"],
    [{ outcome: "succeeded" }, "done"], [{ outcome: "failed" }, "failed"],
    [{ outcome: "interrupted" }, "stopped"],
    [{ type: "busy", permissions: [{}] }, "input"],
    [{ type: "busy", forms: [{}] }, "input"],
    [{ route: { type: "home" } }, ""],
  ]) assert.equal(sessionState(context(input)), expected)
})

test("status icons use single glyphs and the hourglass cycles", () => {
  assert.notEqual(indicator("working", 0), indicator("working", 1))
  assert.equal(indicator("working", 0), indicator("working", 4))
  assert.deepEqual(Array.from({ length: 4 }, (_, frame) => indicator("working", frame)),
    ["󰞌", "󰔟", "󱦟", "󰚭"])
  for (const state of ["working", "input", "retry", "failed", "stopped", "done"]) {
    assert.equal(Array.from(indicator(state)).length, 1)
  }
  assert.equal(indicator("done"), "󰝥")
  assert.equal(indicator("stopped"), "󰏤")
  assert.equal(indicator("failed"), "󱎘")
  assert.equal(indicator("input"), "󰋖")
  assert.equal(indicator(""), "")
})

test("installed TUI's running string overrides a previous completed outcome", () => {
  const ctx = context({ outcome: "succeeded" })
  ctx.data.session.status = () => "running"
  assert.equal(sessionState(ctx), "working")
  ctx.data.session.status = () => "idle"
  assert.equal(sessionState(ctx), "done")
})

test("tmux writes are serialized, deduplicated and cleared on exit", async () => {
  const calls = []
  const write = createWriter(async (args) => { calls.push(args) }, "%123")
  write("◐ working")
  write("◐ working")
  write("✓ done")
  await write("")
  assert.deepEqual(calls.filter(([command]) => command === "set-option").map((args) => args.at(-1)),
    ["◐ working", "✓ done", ""])
  assert.equal(calls.length, 6)
})

test("failed tmux writes can retry without an unhandled rejection", async () => {
  let attempts = 0
  const write = createWriter(async () => { if (++attempts === 1) throw Error("unavailable") }, "%123")
  await write("✓ done")
  await write("✓ done")
  assert.equal(attempts, 3)
})
