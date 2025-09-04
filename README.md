# Decky Speech Plugin

A simple clipboard manager plugin for Steam Deck that allows you to save and manage frequently used text values.

## Features

- **Speech to Text**: Use voice to generate a keyboard input
- **Multi Language**: Select the input voice language
- **Simple Interface**: Clean, Steam Deck-optimized UI

## Installation

This plugin can be installed through the Decky Plugin Store or by building from source.

### Building from Source

1. Clone this repository
2. Install dependencies: `pnpm i`
3. Build the plugin: `pnpm run build`
4. Install the plugin to your Steam Deck

## Development

This plugin is built using the [decky-plugin-template](https://github.com/SteamDeckHomebrew/decky-plugin-template) and follows the standard Decky plugin development patterns.

### Dependencies

- Node.js v16.14+
- pnpm v9
- Python 3.x (for backend functionality)

### Backend

Not used

### Frontend

The frontend is built with React and TypeScript using the Decky UI library, providing a native Steam Deck experience.

## License

This project is licensed under the BSD-3-Clause License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built on the [decky-plugin-template](https://github.com/SteamDeckHomebrew/decky-plugin-template)
- Uses the [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) framework
