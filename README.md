# Galaxy Code - VSCode Extension

AI-powered coding assistant extension for Visual Studio Code with an intuitive chat interface, similar to Claude Code.

## Features

- **Chat Interface**: Interactive chat UI for conversations with AI
- **Command Palette Integration**: Quick access via `Cmd+P` > `Galaxy Code: Open new Tab`
- **Multiple AI Providers**: Support for Gemini, Claude, and Ollama
- **Code Understanding**: Ask questions about your code, get explanations
- **Code Generation**: Generate code snippets, functions, and entire files
- **Bug Fixing**: Get help debugging and fixing issues
- **Test Generation**: Automatically generate tests for your code
- **File Operations**: Execute commands, open files, apply edits directly from chat
- **Workspace Context**: AI understands your current workspace, active file, and selections

## Installation

### From Source

1. Clone this repository
2. Navigate to `apps/extension/vscode`
3. Install dependencies:
   ```bash
   bun install
   ```
4. Build the extension:
   ```bash
   bun run build
   ```
5. Press `F5` in VSCode to launch the Extension Development Host

### From VSIX

1. Download the `.vsix` file from releases
2. In VSCode, go to Extensions view (`Cmd+Shift+X`)
3. Click the `...` menu at the top right
4. Select "Install from VSIX..."
5. Choose the downloaded file

## Configuration

1. Open VSCode Settings (`Cmd+,` or `Ctrl+,`)
2. Search for "Galaxy Code"
3. Configure the following:

```json
{
  "galaxy-code.provider": "gemini",  // or "claude", "ollama"
  "galaxy-code.apiKey": "your-api-key-here"
}
```

### Get API Keys

- **Gemini**: [https://ai.google.dev/](https://ai.google.dev/)
- **Claude**: [https://www.anthropic.com/](https://www.anthropic.com/)
- **Ollama**: No API key needed (runs locally)

## Usage

### Opening Galaxy Code Chat

1. **Command Palette**:
   - Press `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux)
   - Type `>Galaxy Code: Open new Tab`
   - Press Enter

2. **Keyboard Shortcut**:
   - Press `Cmd+Shift+G` (Mac) or `Ctrl+Shift+G` (Windows/Linux)

### Chat Commands

Once the chat is open:

- **Ask Questions**: Type your question in the input box
- **Send Messages**: Press `Enter` to send (or click the send button)
- **New Line**: Press `Shift+Enter` for multi-line input
- **Clear History**: Click the trash icon in the header

### Example Prompts

```
Explain what this function does
```

```
Generate a React component for a user profile card
```

```
Find and fix the bug in the selected code
```

```
Write unit tests for this function
```

```
Refactor this code to use async/await
```

## Features in Detail

### Code Context Awareness

Galaxy Code automatically includes context about your workspace:

- Current active file
- Programming language
- Selected code (if any)
- Workspace root directory

### Code Execution

When the AI suggests shell commands, you can click on code blocks to execute them directly in the integrated terminal.

### File Navigation

The AI can reference specific files and line numbers. Click on file references to open them directly in the editor.

### Markdown Support

All AI responses are rendered with full markdown support:

- Code syntax highlighting
- Tables
- Lists
- Blockquotes
- Links

## Development

### Project Structure

```
apps/extension/vscode/
├── src/
│   ├── extension.ts           # Extension entry point
│   ├── providers/
│   │   └── ChatViewProvider.ts # Chat webview provider
│   ├── utils/
│   │   └── GalaxyOrchestrator.ts # AI orchestrator integration
│   └── webview/               # React chat UI
│       ├── App.tsx
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── MessageList.tsx
│       │   ├── MessageItem.tsx
│       │   └── InputBox.tsx
│       └── index.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Build Scripts

- `bun run compile` - Compile TypeScript extension code
- `bun run build:webview` - Build React webview UI
- `bun run build` - Build both extension and webview
- `bun run watch` - Watch mode for development
- `bun run package` - Package extension as .vsix

### Running in Development

1. Open the project in VSCode
2. Run `bun install` to install dependencies
3. Press `F5` to start debugging
4. A new VSCode window will open with the extension loaded

### Debugging

- Extension code: Use VSCode debugger (F5)
- Webview: Open Developer Tools (`Help` > `Toggle Developer Tools`)

## Integration with Galaxy CLI

This extension integrates with the [Galaxy CLI](../../terminal/galaxy_cli) orchestrator for AI capabilities.

If Galaxy CLI is present in your workspace at `terminal/galaxy_cli/`, the extension will use it directly. Otherwise, it will use a built-in fallback.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Shift+G` (Mac) / `Ctrl+Shift+G` (Win/Linux) | Open Galaxy Code Chat |
| `Enter` | Send message |
| `Shift+Enter` | New line in message |

## Troubleshooting

### Extension not loading

- Check that you've built the extension with `bun run build`
- Reload VSCode window (`Cmd+R` or `Ctrl+R`)
- Check the Output panel for errors

### API key errors

- Verify your API key is correct in settings
- Check that you've selected the right provider
- Ensure you have internet connection (for Gemini/Claude)

### Webview not displaying

- Check browser console in Developer Tools
- Rebuild webview: `bun run build:webview`
- Clear VSCode cache and reload

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

Built with:

- [VSCode Extension API](https://code.visualstudio.com/api)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Marked](https://marked.js.org/)
- [Highlight.js](https://highlightjs.org/)
- Galaxy CLI Orchestrator

---

Made with ❤️ by the Galaxy Code team
