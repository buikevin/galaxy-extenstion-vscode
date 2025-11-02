import * as vscode from 'vscode';

/**
 * Wrapper for Galaxy CLI orchestrator
 * Integrates with the orchestrator from terminal/galaxy_cli
 */
export class GalaxyOrchestrator {
  private apiKey: string | undefined;
  private provider: 'gemini' | 'claude' | 'ollama' = 'gemini';

  constructor() {
    this.loadConfiguration();
  }

  private loadConfiguration() {
    const config = vscode.workspace.getConfiguration('galaxy-code');
    this.apiKey = config.get<string>('apiKey');
    this.provider = config.get<'gemini' | 'claude' | 'ollama'>('provider') || 'gemini';
  }

  async processMessage(message: string, context?: any): Promise<string> {
    try {
      // Check if API key is configured
      if (!this.apiKey && this.provider !== 'ollama') {
        return this.getApiKeyPrompt();
      }

      // Import orchestrator dynamically
      const { OrchestratorAgent } = await this.importOrchestrator();
      const orchestrator = new OrchestratorAgent();

      // Build context message
      const contextMessage = this.buildContextMessage(message, context);

      // Process with orchestrator
      const result = await orchestrator.handleUserInput(
        contextMessage,
        {
          gitEnabled: true,
          testEnabled: true,
          reviewEnabled: true
        },
        (_author: string, content: string, toolName?: string, _toolInfo?: any) => {
          // Handle tool execution messages
          if (toolName) {
            console.log(`Tool: ${toolName}`, content);
          }
        }
      );

      return result.content || 'No response received';
    } catch (error) {
      console.error('Orchestrator error:', error);
      return this.handleError(error);
    }
  }

  private async importOrchestrator() {
    // Try to import from workspace
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    if (workspaceRoot) {
      try {
        // Try to import from terminal/galaxy_cli if it exists
        const orchestratorPath = `${workspaceRoot}/terminal/galaxy_cli/source/ai/orchestrator.js`;
        return await import(orchestratorPath);
      } catch (e) {
        console.warn('Could not import from workspace, using fallback');
      }
    }

    // Fallback: use built-in simplified version
    return this.getFallbackOrchestrator();
  }

  private getFallbackOrchestrator() {
    // Simplified orchestrator for when the full version isn't available
    return {
      OrchestratorAgent: class {
        async handleUserInput(message: string, _options?: any, _callback?: any) {
          return {
            content: `Echo: ${message}\n\nNote: Full Galaxy CLI orchestrator not found. This is a fallback response. To use the full features, ensure the Galaxy CLI is installed in your workspace at terminal/galaxy_cli/`
          };
        }
      }
    };
  }

  private buildContextMessage(message: string, context?: any): string {
    if (!context) {
      return message;
    }

    let contextInfo = '';

    if (context.activeFile) {
      contextInfo += `\n[Active File: ${context.activeFile}]`;
    }

    if (context.language) {
      contextInfo += `\n[Language: ${context.language}]`;
    }

    if (context.selection?.text) {
      contextInfo += `\n[Selected Code:\n${context.selection.text}\n]`;
    }

    if (context.workspaceRoot) {
      contextInfo += `\n[Workspace: ${context.workspaceRoot}]`;
    }

    return contextInfo ? `${contextInfo}\n\nUser Question: ${message}` : message;
  }

  private getApiKeyPrompt(): string {
    return `# API Key Required

To use Galaxy Code, you need to configure an API key.

## Steps:
1. Open VSCode Settings (Cmd+, or Ctrl+,)
2. Search for "Galaxy Code"
3. Enter your API key for ${this.provider}

### Get API Keys:
- **Gemini**: https://ai.google.dev/
- **Claude**: https://www.anthropic.com/
- **Ollama**: No API key needed (local)

Alternatively, you can add to your settings.json:
\`\`\`json
{
  "galaxy-code.provider": "${this.provider}",
  "galaxy-code.apiKey": "your-api-key-here"
}
\`\`\`
`;
  }

  private handleError(error: any): string {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return `# Error Processing Request

An error occurred while processing your request:

\`\`\`
${errorMessage}
\`\`\`

## Troubleshooting:
- Check your API key configuration
- Ensure your internet connection is stable
- Try reloading the VSCode window
- Check the VSCode Developer Console for more details

If the problem persists, please report it on GitHub.
`;
  }

  public async changeProvider(provider: 'gemini' | 'claude' | 'ollama') {
    const config = vscode.workspace.getConfiguration('galaxy-code');
    await config.update('provider', provider, vscode.ConfigurationTarget.Global);
    this.provider = provider;
    this.loadConfiguration();
  }

  public async setApiKey(apiKey: string) {
    const config = vscode.workspace.getConfiguration('galaxy-code');
    await config.update('apiKey', apiKey, vscode.ConfigurationTarget.Global);
    this.apiKey = apiKey;
  }
}
