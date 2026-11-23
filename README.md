# opencode-tmux-status

Status indicators for OpenCode sessions running within tmux. Shows whether a session is working, waiting for input, or done, right in your tmux window list.

## Setup

You'll need OpenCode V2, tmux, and a Nerd Font with Material Design icons.

Clone the repo into your OpenCode plugins folder:

```sh
git clone https://github.com/ardnep/opencode-tmux-status.git \
  ~/.config/opencode/plugins/tmux-status
```

OpenCode picks it up from there. Just make sure you're running OpenCode inside tmux.

If you use Catppuccin, add these lines to your tmux config before the theme loads:

```tmux
set -g @catppuccin_window_number '#{?@opencode_status,#{@opencode_status},}'
set -g @catppuccin_window_current_number '#{?@opencode_status,#{@opencode_status},}'
```

These put the icon where the window number would be. When there's no status to show, you'll see a terminal icon instead.

Using a different theme? The plugin sets a tmux option called `@opencode_status`. You can use the same `#{?...}` expression in your theme's window status format.

Reload your tmux config once you've made the change.

## Supported icons

- 󰞌 󰔟 󱦟 󰚭 — Working (animated)
- 󰋖 — Waiting for input or permission
- 󰑐 — Retrying
- 󰝥 — Done
- 󱎘 — Failed
- 󰏤 — Stopped

The indicator clears when OpenCode is idle or on its home screen.

## Try it out

Want to see the animation without starting an agent? Run this from the repo folder, inside tmux. You'll need Node.js:

```sh
node preview.js working
```

You can swap `working` for `input`, `retry`, `done`, `failed`, `stopped`, or `idle`.

Press Ctrl+C to stop the preview, then clear the icon:

```sh
tmux set-option -pu @opencode_status
```

That command also helps if an icon gets stuck after OpenCode is forcibly killed. The plugin clears it on normal cleanup.

To run the tests:

```sh
npm test
```
