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

export function createWriter(run, pane) {
  let queue = Promise.resolve()
  let previous
  return (text) => {
    if (text === previous) return queue
    previous = text
    queue = queue.then(async () => {
      await run(["set-option", "-p", "-t", pane, "@opencode_status", text])
      await run(["refresh-client", "-S"])
    }).catch(() => { previous = undefined })
    return queue
  }
}
