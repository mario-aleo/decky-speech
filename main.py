import os
import json
import asyncio
from typing import List

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code repo
# and add the `decky-loader/plugin/imports` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky



class Plugin:
    def __init__(self):
        pass

    async def add(self, left: int, right: int) -> int:
        return left + right

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        pass

    # Function called first during the unload process, utilize this to handle your plugin being stopped, but not
    # completely removed
    async def _unload(self):
        pass

    # Function called after `_unload` during uninstall, utilize this to clean up processes and other remnants of your
    # plugin that may remain on the system
    async def _uninstall(self):
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        # Here's a migration example for logs:
        # - `~/.config/decky-clipboard/clipboard.log` will be migrated to `decky.decky_LOG_DIR/clipboard.log`
        decky.migrate_logs(os.path.join(decky.DECKY_USER_HOME,
                                               ".config", "decky-clipboard", "clipboard.log"))
        # Here's a migration example for settings:
        # - `~/homebrew/settings/clipboard.json` is migrated to `decky.decky_SETTINGS_DIR/clipboard.json`
        # - `~/.config/decky-clipboard/` all files and directories under this root are migrated to `decky.decky_SETTINGS_DIR/`
        decky.migrate_settings(
            os.path.join(decky.DECKY_HOME, "settings", "clipboard.json"),
            os.path.join(decky.DECKY_USER_HOME, ".config", "decky-clipboard"))
        # Here's a migration example for runtime data:
        # - `~/homebrew/clipboard/` all files and directories under this root are migrated to `decky.decky_RUNTIME_DIR/`
        # - `~/.local/share/decky-clipboard/` all files and directories under this root are migrated to `decky.decky_RUNTIME_DIR/`
        decky.migrate_runtime(
            os.path.join(decky.DECKY_HOME, "clipboard"),
            os.path.join(decky.DECKY_USER_HOME, ".local", "share", "decky-clipboard"))
