# opencode-tmux-status

Status indicators for OpenCode sessions running within tmux. Shows whether a session is working, waiting for input, or done in the tmux window list.

## Setup

Requires OpenCode V2, tmux, and a Nerd Font with Material Design icons.

1. **Install the plugin**

   Add the package to `plugins` in `~/.config/opencode/cli.json`, keeping any existing entries:

   ```json
   {
     "plugins": ["@ardnep/opencode-tmux-status"]
   }
   ```

   OpenCode installs and loads the package. The plugin only runs inside tmux.

   For local development, clone the repo into `~/.config/opencode/plugins/tmux-status` instead. Use one method, not both.

2. **Configure the tmux status bar**

   For Catppuccin, add these lines to your tmux config before the theme loads:

   ```tmux
   set -g @catppuccin_window_number '#{?@opencode_status,#{@opencode_status},}'
   set -g @catppuccin_window_current_number '#{?@opencode_status,#{@opencode_status},}'
   set -g @catppuccin_window_text ' #{?@opencode_title,#{@opencode_title},#W}'
   set -g @catppuccin_window_current_text ' #{?@opencode_title,#{@opencode_title},#W}'
   ```

   This replaces the window number with the status icon. A terminal icon is shown when no status is set.

   For other themes, use the same `#{?...}` expression in the window status format. It reads the pane-level tmux option `@opencode_status`.

3. **Reload the tmux config**

   For a config at `~/.config/tmux/tmux.conf`:

   ```sh
   tmux source-file ~/.config/tmux/tmux.conf
   ```

   Use your config's path if it differs.

## Supported icons

- Working (animated hourglass)
- Waiting for input or permission (question mark)
- Retrying (circular arrow)
- Done (circle)
- Failed (cross)
- Stopped (pause)

The indicator clears when OpenCode is idle or on its home screen.

## Optional session titles

By default, tab names remain unchanged. Enable `sessionTitle` in your plugin
entry in `cli.json` to display the active OpenCode session's title:

```json
{
  "plugins": [{
    "package": "@ardnep/opencode-tmux-status",
    "options": { "sessionTitle": true }
  }]
}
```

For a local install, use the plugin directory path as `package` instead.
Titles follow session switches and renames. The Catppuccin text formats above
read the pane-level `@opencode_title` option; other themes can use the same
expression. The underlying tmux window name is never changed, and is shown
again on the home screen or normal cleanup. In split windows, the active
pane supplies the title. Control characters are removed and `#` is displayed
as `＃` to prevent tmux formatting injection.

After a forced exit, clear a stale title with `tmux set-option -pu @opencode_title`.

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

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
