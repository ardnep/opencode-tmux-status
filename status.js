// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Aaradh Nepal
export function sessionState(context) {
  const route = context.ui.router.current()
  if (route.type !== "session") return ""
  const id = route.sessionID
  const permissions = context.data.session.permission.list(id) ?? []
  const forms = context.data.session.form.list(id, context.location) ?? []
  if (permissions.length || forms.length) return "input"
  const status = context.data.session.status(id)
  const kind = typeof status === "string" ? status : status?.type
  if (kind === "retry") return "retry"
  if (kind === "running" || kind === "busy") return "working"
  const session = context.data.session.get(id)
  if (session?.outcome === "failed") return "failed"
  if (session?.outcome === "interrupted") return "stopped"
  if (session?.outcome === "succeeded") return "done"
  return "idle"
}

export function indicator(state, frame = 0) {
  // Material Design hourglasses share the completed icon's font metrics.
  const spinner = ["󰞌", "󰔟", "󱦟", "󰚭"]
  if (state === "working") return spinner[frame % spinner.length]
  return {
    input: "󰋖",
    retry: "󰑐",
    failed: "󱎘",
    stopped: "󰏤",
    done: "󰝥",
    idle: "",
  }[state] ?? ""
}

export function sessionTitle(context) {
  if (context.options?.sessionTitle !== true) return undefined
  const route = context.ui.router.current()
  if (route.type !== "session") return ""
  // Keep titles on one line and prevent tmux style/format injection.
  return (context.data.session.get(route.sessionID)?.title ?? "")
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, " ")
    .replace(/#/g, "＃")
    .trim()
}

export function createWriter(run, pane) {
  let queue = Promise.resolve()
  let previous
  let previousTitle
  return (text, title) => {
    if (text === previous && title === previousTitle) return queue
    const statusChanged = text !== previous
    const titleChanged = title !== previousTitle
    previous = text
    previousTitle = title
    queue = queue.then(async () => {
      if (statusChanged) await run(["set-option", "-p", "-t", pane, "@opencode_status", text])
      if (titleChanged && title !== undefined) {
        await run(["set-option", "-p", "-t", pane, "@opencode_title", title])
      }
      await run(["refresh-client", "-S"])
    }).catch(() => { previous = undefined; previousTitle = undefined })
    return queue
  }
}
