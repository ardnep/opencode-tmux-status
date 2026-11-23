# opencode-tmux-status

Status indicators for OpenCode sessions running within tmux. Shows whether a session is working, waiting for input, or done in the tmux window list.

## Setup

Requires OpenCode V2, tmux, and a Nerd Font with Material Design icons.

Clone the repo into your OpenCode plugins folder:

```sh
git clone https://github.com/ardnep/opencode-tmux-status.git \
  ~/.config/opencode/plugins/tmux-status
```

OpenCode loads the plugin from this folder. The plugin only runs inside tmux.

If you use Catppuccin, add these lines to your tmux config before the theme loads:

```tmux
set -g @catppuccin_window_number '#{?@opencode_status,#{@opencode_status},}'
set -g @catppuccin_window_current_number '#{?@opencode_status,#{@opencode_status},}'
```

This replaces the window number with the status icon. A terminal icon is shown when no status is set.

For other themes, use the same `#{?...}` expression in the window status format. It reads the pane-level tmux option `@opencode_status`.

Reload your tmux config after editing it.

## Supported icons

- Working (animated hourglass)
- Waiting for input or permission (question mark)
- Retrying (circular arrow)
- Done (circle)
- Failed (cross)
- Stopped (pause)

The indicator clears when OpenCode is idle or on its home screen.

## Preview and tests

Run the preview from the repo folder inside tmux. It requires Node.js and doesn't start an agent:

```sh
node preview.js working
```

Other preview states: `input`, `retry`, `done`, `failed`, `stopped`, and `idle`.

Press Ctrl+C to stop the preview, then clear the icon:

```sh
tmux set-option -pu @opencode_status
```

Use the same command to clear a stale icon after a forced exit. The plugin clears it automatically on normal cleanup.

To run the tests:

```sh
npm test
```
