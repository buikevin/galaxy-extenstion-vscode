# Development Guide - Galaxy Code VSCode Extension

## Getting Started

### Prerequisites

- Bun runtime (or Node.js 20+)
- VSCode 1.85.0 or higher
- Git

### Installation

```bash
# Navigate to extension directory
cd apps/extension/vscode

# Install dependencies
bun install

# Build the extension
bun run build
```

## Project Structure

```
apps/extension/vscode/
├── src/
│   ├── extension.ts              # Main extension entry point
│   ├── providers/
│   │   └── ChatViewProvider.ts   # Webview panel provider
│   ├── utils/
│   │   └── GalaxyOrchestrator.ts # AI orchestrator wrapper
│   └── webview/                  # React UI
│       ├── App.tsx               # Main app component
│       ├── index.tsx             # Entry point
│       ├── components/
│       │   ├── Header.tsx        # Chat header
│       │   ├── MessageList.tsx   # Message list container
│       │   ├── MessageItem.tsx   # Individual message
│       │   └── InputBox.tsx      # Message input
│       └── *.css                 # Component styles
├── resources/
│   └── icon.svg                  # Extension icon
├── dist/                         # Compiled extension (gitignored)
├── webview-dist/                 # Built webview (gitignored)
├── package.json
├── tsconfig.json                 # Extension TypeScript config
├── tsconfig.webview.json         # Webview TypeScript config
└── vite.config.ts                # Vite build config
```

## Development Workflow

### Running in Development Mode

1. Open the extension folder in VSCode:
   ```bash
   code apps/extension/vscode
   ```

2. Start watch mode for auto-compilation:
   ```bash
   bun run watch
   ```

3. In another terminal, start webview dev server:
   ```bash
   bun run dev:webview
   ```

4. Press `F5` to launch Extension Development Host

5. Open command palette (`Cmd+P`) and run:
   ```
   >Galaxy Code: Open new Tab
   ```

### Making Changes

#### Extension Code Changes

Files in `src/` (except `src/webview/`):

1. Make your changes
2. TypeScript will recompile automatically if watch mode is running
3. Reload Extension Development Host: `Cmd+R` (Mac) or `Ctrl+R` (Win/Linux)

#### Webview Code Changes

Files in `src/webview/`:

1. Make your changes
2. Vite will hot-reload automatically if dev server is running
3. If hot-reload doesn't work, reload the webview panel

### Building for Production

```bash
# Build everything
bun run build

# Or build separately
bun run compile        # Build extension
bun run build:webview  # Build webview
```

## Architecture

### Extension Architecture

```
┌─────────────────────────────────────┐
│      VSCode Extension Host          │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  extension.ts                │  │
│  │  - Command registration      │  │
│  │  - Lifecycle management      │  │
│  └────────┬─────────────────────┘  │
│           │                         │
│  ┌────────▼─────────────────────┐  │
│  │  ChatViewProvider            │  │
│  │  - Webview panel management  │  │
│  │  - Message handling          │  │
│  │  - History management        │  │
│  └────────┬─────────────────────┘  │
│           │                         │
│  ┌────────▼─────────────────────┐  │
│  │  GalaxyOrchestrator          │  │
│  │  - AI integration            │  │
│  │  - Context building          │  │
│  │  - Error handling            │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Webview (React)             │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  App.tsx                     │  │
│  │  - State management          │  │
│  │  - VSCode API communication  │  │
│  └────────┬─────────────────────┘  │
│           │                         │
│  ┌────────▼─────────────────────┐  │
│  │  Components                  │  │
│  │  - Header                    │  │
│  │  - MessageList               │  │
│  │  - InputBox                  │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Communication Flow

```
User Input → InputBox → App.tsx → postMessage()
                                        ↓
                               ChatViewProvider
                                        ↓
                              GalaxyOrchestrator
                                        ↓
                                  AI Provider
                                        ↓
                               ChatViewProvider
                                        ↓
                                 postMessage()
                                        ↓
                    App.tsx → MessageList → MessageItem
```

## Key Concepts

### VSCode API

The extension uses VSCode Extension API for:

- **Commands**: Registered in `package.json` and implemented in `extension.ts`
- **Webview**: Custom UI using HTML/CSS/JS
- **Configuration**: Settings under `galaxy-code.*`
- **Workspace**: File operations, terminal commands

### Webview Communication

Bi-directional messaging between extension and webview:

**Extension → Webview:**
```typescript
webview.postMessage({
  type: 'message',
  data: { ... }
});
```

**Webview → Extension:**
```typescript
vscode.postMessage({
  type: 'sendMessage',
  content: 'user message'
});
```

### Galaxy Orchestrator Integration

The extension integrates with Galaxy CLI orchestrator:

1. Tries to import from workspace (`terminal/galaxy_cli/`)
2. Falls back to built-in simplified version
3. Passes workspace context to AI
4. Handles tool execution results

## Testing

### Manual Testing

1. Launch Extension Development Host (`F5`)
2. Open a workspace with code
3. Open Galaxy Code chat
4. Test scenarios:
   - Send messages
   - Ask about code
   - Request code generation
   - Execute commands
   - Clear history
   - Multiple chat panels

### Debug Webview

1. In Extension Development Host, open Developer Tools:
   - `Help` → `Toggle Developer Tools`
2. Check Console for errors
3. Inspect React components
4. Monitor network requests

### Debug Extension

1. Set breakpoints in extension code
2. Use VSCode debugger (F5)
3. Check Debug Console for logs

## Common Tasks

### Add New Command

1. Register in `package.json`:
   ```json
   {
     "contributes": {
       "commands": [{
         "command": "galaxy-code.myCommand",
         "title": "My Command"
       }]
     }
   }
   ```

2. Implement in `extension.ts`:
   ```typescript
   const cmd = vscode.commands.registerCommand(
     'galaxy-code.myCommand',
     () => { /* implementation */ }
   );
   context.subscriptions.push(cmd);
   ```

### Add New Message Type

1. Update webview sender:
   ```typescript
   vscode.postMessage({
     type: 'newMessageType',
     data: { ... }
   });
   ```

2. Handle in `ChatViewProvider.ts`:
   ```typescript
   switch (message.type) {
     case 'newMessageType':
       // handle it
       break;
   }
   ```

### Add New React Component

1. Create component file:
   ```typescript
   // src/webview/components/MyComponent.tsx
   import React from 'react';
   import './MyComponent.css';

   export const MyComponent: React.FC = () => {
     return <div>My Component</div>;
   };
   ```

2. Import and use:
   ```typescript
   import { MyComponent } from './components/MyComponent';
   ```

## Packaging

### Create VSIX Package

```bash
# Package the extension
bun run package

# This creates galaxy-code-vscode-0.1.0.vsix
```

### Install VSIX Locally

```bash
code --install-extension galaxy-code-vscode-0.1.0.vsix
```

## Publishing

### Publish to VSCode Marketplace

1. Create publisher account at https://marketplace.visualstudio.com/
2. Get Personal Access Token
3. Login:
   ```bash
   vsce login <publisher-name>
   ```
4. Publish:
   ```bash
   vsce publish
   ```

## Troubleshooting

### Extension not loading

- Check `package.json` main field points to `./dist/extension.js`
- Verify build output exists: `ls dist/`
- Check Output panel: `View` → `Output` → `Extension Host`

### Webview blank

- Check webview build: `ls webview-dist/`
- Open Developer Tools and check Console
- Verify CSP in HTML template

### TypeScript errors

- Run `bun run compile` to see all errors
- Check `tsconfig.json` settings
- Ensure types are installed: `@types/vscode`, `@types/react`

### Build errors

- Clear and rebuild:
  ```bash
  rm -rf dist webview-dist node_modules
  bun install
  bun run build
  ```

## Best Practices

1. **Code Organization**
   - Keep extension logic in `src/`
   - Keep UI logic in `src/webview/`
   - Separate concerns: providers, utils, components

2. **Error Handling**
   - Always try-catch async operations
   - Show user-friendly error messages
   - Log errors for debugging

3. **Performance**
   - Lazy load heavy dependencies
   - Use React.memo for expensive components
   - Debounce user inputs

4. **Security**
   - Validate all user inputs
   - Use strict CSP for webview
   - Don't expose API keys in code

5. **User Experience**
   - Provide feedback for long operations
   - Save state when possible
   - Handle edge cases gracefully

## Resources

- [VSCode Extension API](https://code.visualstudio.com/api)
- [VSCode Extension Samples](https://github.com/microsoft/vscode-extension-samples)
- [Webview API Guide](https://code.visualstudio.com/api/extension-guides/webview)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Happy coding! 🚀
