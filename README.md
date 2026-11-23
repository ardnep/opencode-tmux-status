# opencode-tmux-status

If you leave OpenCode running in another tmux window, this gives you a way to check on it at a glance.

A small icon shows whether it's working, waiting for you, or done. Your window names stay as they are.

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

## Reading the icons

The hourglass animates while OpenCode is working. A question mark means it needs an answer or permission from you. There are also icons for done, retrying, failed, and stopped. When OpenCode is idle or you're on its home screen, the indicator clears.

It checks the session you're viewing every 450 ms. If you have several panes in a window, the window icon normally follows the active pane—not every agent running in that window.

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
