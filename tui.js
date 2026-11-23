// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Aaradh Nepal
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { Plugin } from "@opencode/plugin/tui"
import { createWriter, indicator, sessionState } from "./status.js"

const exec = promisify(execFile)

export default Plugin.define({
  id: "local.tmux-status",
  setup(context) {
    const pane = process.env.TMUX_PANE
    if (!process.env.TMUX || !/^%\d+$/.test(pane ?? "")) return
    const write = createWriter((args) => exec("tmux", args, { timeout: 2000 }), pane)
    let frame = 0
    let sessionID
    let disposed = false

    function update() {
      if (disposed) return
      const route = context.ui.router.current()
      const next = route.type === "session" ? route.sessionID : undefined
      if (next !== sessionID) {
        sessionID = next
        if (next) {
          // Refresh pending prompts on attach and when switching sessions.
          Promise.allSettled([
            context.data.session.permission.sync(next),
            context.data.session.form.sync(next, context.location),
          ]).then(() => { if (!disposed) update() })
        }
      }
      void write(indicator(sessionState(context), frame++))
    }

    // Cached reads only; this also detects route changes without private APIs.
    const timer = setInterval(update, 450)
    update()
    return () => {
      disposed = true
      clearInterval(timer)
      return write("")
    }
  },
})
