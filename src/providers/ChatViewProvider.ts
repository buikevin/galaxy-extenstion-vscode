import * as vscode from 'vscode';
import { GalaxyOrchestrator } from '../utils/GalaxyOrchestrator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export class ChatViewProvider {
  private panels: Set<vscode.WebviewPanel> = new Set();
  private orchestrator: GalaxyOrchestrator;
  private messageHistory: Message[] = [];

  constructor(private readonly extensionUri: vscode.Uri) {
    this.orchestrator = new GalaxyOrchestrator();
  }

  public getWebviewContent(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'webview-dist', 'index.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'webview-dist', 'index.css')
    );

    const nonce = this.getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <link href="${styleUri}" rel="stylesheet">
  <title>Galaxy Code Chat</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  public async handleMessage(
    message: any,
    webview: vscode.Webview
  ): Promise<void> {
    switch (message.type) {
      case 'sendMessage':
        await this.handleUserMessage(message.content, webview);
        break;
      case 'getHistory':
        webview.postMessage({
          type: 'history',
          data: this.messageHistory
        });
        break;
      case 'clearHistory':
        this.clearHistory();
        break;
      case 'executeCommand':
        await this.executeCommand(message.command);
        break;
      case 'openFile':
        await this.openFile(message.filePath, message.line);
        break;
      case 'applyEdit':
        await this.applyEdit(message.filePath, message.edits);
        break;
    }
  }

  private async handleUserMessage(
    content: string,
    webview: vscode.Webview
  ): Promise<void> {
    // Add user message to history
    const userMessage: Message = {
      id: this.generateId(),
      role: 'user',
      content,
      timestamp: Date.now()
    };
    this.messageHistory.push(userMessage);

    // Send user message to webview
    webview.postMessage({
      type: 'message',
      data: userMessage
    });

    try {
      // Get workspace context
      const workspaceContext = await this.getWorkspaceContext();

      // Send to orchestrator
      webview.postMessage({
        type: 'status',
        data: { status: 'thinking' }
      });

      const response = await this.orchestrator.processMessage(
        content,
        workspaceContext
      );

      // Add assistant message to history
      const assistantMessage: Message = {
        id: this.generateId(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      this.messageHistory.push(assistantMessage);

      // Send assistant message to webview
      webview.postMessage({
        type: 'message',
        data: assistantMessage
      });

      webview.postMessage({
        type: 'status',
        data: { status: 'idle' }
      });
    } catch (error) {
      const errorMessage: Message = {
        id: this.generateId(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      };
      this.messageHistory.push(errorMessage);

      webview.postMessage({
        type: 'message',
        data: errorMessage
      });

      webview.postMessage({
        type: 'status',
        data: { status: 'error' }
      });
    }
  }

  private async getWorkspaceContext(): Promise<any> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const activeEditor = vscode.window.activeTextEditor;

    return {
      workspaceRoot: workspaceFolders?.[0]?.uri.fsPath,
      activeFile: activeEditor?.document.fileName,
      language: activeEditor?.document.languageId,
      selection: activeEditor?.selection
        ? {
            start: activeEditor.selection.start,
            end: activeEditor.selection.end,
            text: activeEditor.document.getText(activeEditor.selection)
          }
        : null
    };
  }

  private async executeCommand(command: string): Promise<void> {
    const terminal = vscode.window.createTerminal('Galaxy Code');
    terminal.show();
    terminal.sendText(command);
  }

  private async openFile(filePath: string, line?: number): Promise<void> {
    const uri = vscode.Uri.file(filePath);
    const document = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(document);

    if (line !== undefined) {
      const position = new vscode.Position(line - 1, 0);
      editor.selection = new vscode.Selection(position, position);
      editor.revealRange(
        new vscode.Range(position, position),
        vscode.TextEditorRevealType.InCenter
      );
    }
  }

  private async applyEdit(
    filePath: string,
    edits: Array<{ range: any; newText: string }>
  ): Promise<void> {
    const uri = vscode.Uri.file(filePath);
    await vscode.workspace.openTextDocument(uri);
    const edit = new vscode.WorkspaceEdit();

    for (const e of edits) {
      const range = new vscode.Range(
        new vscode.Position(e.range.start.line, e.range.start.character),
        new vscode.Position(e.range.end.line, e.range.end.character)
      );
      edit.replace(uri, range, e.newText);
    }

    await vscode.workspace.applyEdit(edit);
  }

  public clearHistory(): void {
    this.messageHistory = [];
    for (const panel of this.panels) {
      panel.webview.postMessage({
        type: 'clearHistory'
      });
    }
  }

  public disposePanel(panel: vscode.WebviewPanel): void {
    this.panels.delete(panel);
  }

  public dispose(): void {
    for (const panel of this.panels) {
      panel.dispose();
    }
    this.panels.clear();
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getNonce(): string {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
