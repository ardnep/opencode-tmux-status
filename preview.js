// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Aaradh Nepal
// Visual-only tmux previews; no OpenCode sessions or agent requests are created.
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { createWriter, indicator } from "./status.js"

const state = process.argv[2]
const exec = promisify(execFile)
const pane = process.env.TMUX_PANE
if (!pane || !["working", "done", "stopped", "failed", "input", "retry", "idle"].includes(state)) {
  throw new Error("Run inside tmux with a valid preview state")
}
const write = createWriter((args) => exec("tmux", args, { timeout: 2000 }), pane)
let frame = 0
console.log(`Visual preview: ${state}\nNo agent is running. Close this tab when finished reviewing.`)
await write(indicator(state, frame++))
setInterval(() => { void write(indicator(state, frame++)) }, 450)
