import * as vscode from 'vscode';
import { ChatViewProvider } from './providers/ChatViewProvider';

let chatViewProvider: ChatViewProvider | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('Galaxy Code extension is now active!');

  // Initialize chat view provider
  chatViewProvider = new ChatViewProvider(context.extensionUri);

  // Register command to open chat in new tab
  const openChatCommand = vscode.commands.registerCommand(
    'galaxy-code.openChat',
    () => {
      // Create a new webview panel for chat
      const panel = vscode.window.createWebviewPanel(
        'galaxyCodeChat',
        'Galaxy Code Chat',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, 'dist'),
            vscode.Uri.joinPath(context.extensionUri, 'webview-dist')
          ]
        }
      );

      // Set webview content
      if (chatViewProvider) {
        panel.webview.html = chatViewProvider.getWebviewContent(panel.webview);

        // Handle messages from webview
        panel.webview.onDidReceiveMessage(
          async (message) => {
            await chatViewProvider?.handleMessage(message, panel.webview);
          },
          undefined,
          context.subscriptions
        );
      }

      // Handle panel disposal
      panel.onDidDispose(
        () => {
          chatViewProvider?.disposePanel(panel);
        },
        null,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(openChatCommand);

  // Register additional commands
  const clearHistoryCommand = vscode.commands.registerCommand(
    'galaxy-code.clearHistory',
    () => {
      chatViewProvider?.clearHistory();
      vscode.window.showInformationMessage('Chat history cleared');
    }
  );

  context.subscriptions.push(clearHistoryCommand);
}

export function deactivate() {
  if (chatViewProvider) {
    chatViewProvider.dispose();
  }
}
