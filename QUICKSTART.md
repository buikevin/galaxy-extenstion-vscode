# Quick Start - Galaxy Code VSCode Extension

## 5-Minute Setup Guide

### Step 1: Install Dependencies (1 min)

```bash
cd apps/extension/vscode
bun install
```

### Step 2: Build Extension (1 min)

```bash
bun run build
```

### Step 3: Launch Development Host (1 min)

1. Open the extension folder in VSCode:
   ```bash
   code apps/extension/vscode
   ```

2. Press `F5` to launch Extension Development Host

3. A new VSCode window will open with the extension loaded

### Step 4: Open Galaxy Code Chat (30 seconds)

In the Extension Development Host window:

**Method 1 - Command Palette:**
1. Press `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux)
2. Type `>Galaxy Code: Open new Tab`
3. Press Enter

**Method 2 - Keyboard Shortcut:**
- Press `Cmd+Shift+G` (Mac) or `Ctrl+Shift+G` (Windows/Linux)

### Step 5: Configure AI Provider (1 min)

1. Open Settings: `Cmd+,` (Mac) or `Ctrl+,` (Windows/Linux)
2. Search for "Galaxy Code"
3. Set your preferences:
   ```json
   {
     "galaxy-code.provider": "gemini",
     "galaxy-code.apiKey": "your-api-key-here"
   }
   ```

**Get API Keys:**
- Gemini: https://ai.google.dev/
- Claude: https://www.anthropic.com/
- Ollama: No key needed (runs locally)

### Step 6: Start Chatting! (30 seconds)

Try these example prompts:

```
Explain what this code does
```

```
Generate a React component for a login form
```

```
Help me debug this error
```

```
Write unit tests for this function
```

## Development Workflow

### Watch Mode for Quick Iteration

Terminal 1 - Watch Extension:
```bash
bun run watch
```

Terminal 2 - Watch Webview:
```bash
bun run dev:webview
```

Then press `F5` to launch. Changes will auto-reload!

### Debugging

**Extension Code:**
- Set breakpoints in `.ts` files
- Use VSCode debugger (already running when you press F5)

**Webview Code:**
- Open Developer Tools in Extension Development Host
- `Help` → `Toggle Developer Tools`
- Check Console tab for errors

## Common Commands

```bash
# Build everything
bun run build

# Compile extension only
bun run compile

# Build webview only
bun run build:webview

# Watch extension
bun run watch

# Watch webview
bun run dev:webview

# Package extension
bun run package

# Lint code
bun run lint
```

## Troubleshooting

### Extension doesn't load
```bash
# Clean and rebuild
rm -rf dist webview-dist
bun run build
```

### Webview is blank
- Check Developer Tools console
- Verify `webview-dist/` folder exists
- Try rebuilding: `bun run build:webview`

### TypeScript errors
```bash
# Check for errors
bun run compile

# If errors persist, clean install
rm -rf node_modules bun.lock
bun install
```

## Next Steps

1. **Read Documentation:**
   - [README.md](README.md) - User guide
   - [DEVELOPMENT.md](DEVELOPMENT.md) - Developer guide
   - [SUMMARY.md](SUMMARY.md) - Project overview

2. **Explore the Code:**
   - `src/extension.ts` - Start here
   - `src/providers/ChatViewProvider.ts` - Webview logic
   - `src/webview/App.tsx` - React app

3. **Make Changes:**
   - Modify UI in `src/webview/components/`
   - Update styles in `.css` files
   - Add features in `src/providers/`

4. **Test Your Changes:**
   - Press `Cmd+R` to reload Extension Development Host
   - Check for errors in console
   - Try different scenarios

## Tips

- **Fast Reload**: Use `Cmd+R` in Extension Development Host instead of restarting
- **Debug Console**: Check Output panel → Extension Host for logs
- **Hot Reload**: Webview hot-reloads automatically in dev mode
- **State Reset**: Clear history to test fresh state

## Resources

- VSCode Extension API: https://code.visualstudio.com/api
- React Docs: https://react.dev/
- Vite Guide: https://vitejs.dev/guide/

---

Happy coding! 🚀

Need help? Check [DEVELOPMENT.md](DEVELOPMENT.md) for detailed guides.
