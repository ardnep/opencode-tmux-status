# opencode-tmux-status

See what OpenCode is doing without switching to its tmux window.

This OpenCode V2 TUI plugin puts a small status icon in a pane-level tmux option, `@opencode_status`. Your tmux theme decides where to show it. It doesn't rename your windows.

## What you'll see

- An animated hourglass while the agent works.
- A question mark when it needs input or permission.
- Separate icons for retrying, finishing, failing, and stopping.
- No icon when idle or outside a session.

You'll need tmux, OpenCode V2, and a Nerd Font that includes Material Design icons. Node.js is also needed for the tests and preview script.

## Set it up

Clone it into OpenCode's global plugin directory:

```sh
git clone https://github.com/ardnep/opencode-tmux-status.git \
  ~/.config/opencode/plugins/tmux-status
```

OpenCode discovers the plugin there. Run OpenCode inside tmux; outside tmux, the plugin does nothing.

Next, tell tmux where to display the icon. For Catppuccin, put these lines before the theme loads:

```tmux
set -g @catppuccin_window_number '#{?@opencode_status,#{@opencode_status},}'
set -g @catppuccin_window_current_number '#{?@opencode_status,#{@opencode_status},}'
```

This replaces the window number with the status icon, falling back to a terminal icon. With another theme, use the same format expression in its window status format.

Reload your tmux config after editing it.

## How it works

Every 450 ms, the plugin checks the session currently shown in that OpenCode TUI. Pending prompts take priority over other states. It writes only changed icons and refreshes tmux's status bar.

The value belongs to the pane, so a window's status normally reflects its active pane. This isn't an aggregate of every agent or session. On normal plugin cleanup, the icon is cleared; a forced process kill can leave a stale value.

## Try it or run the tests

From the cloned directory:

```sh
npm test

# Inside tmux: preview the animation without running an agent.
node preview.js working
```

Other preview states: `input`, `retry`, `done`, `failed`, `stopped`, and `idle`. Stop the preview with Ctrl+C, then clear its icon:

```sh
tmux set-option -pu @opencode_status
```
