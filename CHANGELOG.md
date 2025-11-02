# Change Log

All notable changes to the "Galaxy Code" extension will be documented in this file.

## [0.1.0] - 2025-11-02

### Added

#### Core Features
- Chat interface for AI coding assistant
- Command Palette integration: `Galaxy Code: Open new Tab`
- Keyboard shortcut: `Cmd+Shift+G` (Mac) / `Ctrl+Shift+G` (Win/Linux)
- Support for multiple AI providers:
  - Google Gemini
  - Anthropic Claude
  - Ollama (local)

#### UI Components
- Modern chat interface with React 18
- Message list with auto-scroll
- Markdown rendering with syntax highlighting
- Code block execution (click to run in terminal)
- File reference navigation (click to open files)
- Loading indicators and status display
- Empty state with suggestions
- Chat history management

#### Intelligence Features
- Workspace context awareness
- Active file detection
- Code selection support
- Language-aware responses
- File operations support

#### Developer Experience
- TypeScript with strict mode
- Vite for fast builds
- VSCode theming support
- Hot reload in development
- Comprehensive documentation

### Technical Details
- Built with VSCode Extension API 1.85.0+
- React 18 for webview UI
- Vite for bundling
- Marked.js for markdown
- Highlight.js for syntax highlighting
- Integration with Galaxy CLI orchestrator

### Documentation
- README.md - User guide
- DEVELOPMENT.md - Developer guide
- QUICKSTART.md - Quick start guide
- PUBLISHING.md - Publishing guide
- SUMMARY.md - Project overview

---

## Future Roadmap

### Planned for v0.2.0
- [ ] Sidebar view integration
- [ ] Multiple chat sessions
- [ ] Export conversation to markdown
- [ ] Custom prompt templates
- [ ] Settings UI panel

### Planned for v0.3.0
- [ ] Code diff viewer
- [ ] Voice input support
- [ ] Collaborative features
- [ ] Extension marketplace integration
- [ ] Performance optimizations

---

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.
