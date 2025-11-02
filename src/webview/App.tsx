import React, { useState, useEffect, useRef } from 'react';
import { MessageList } from './components/MessageList';
import { InputBox } from './components/InputBox';
import { Header } from './components/Header';
import './App.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface VSCodeAPI {
  postMessage: (message: any) => void;
}

declare const acquireVsCodeApi: () => VSCodeAPI;

const vscode = acquireVsCodeApi();

export const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'thinking' | 'error'>('idle');

  useEffect(() => {
    // Request message history on mount
    vscode.postMessage({ type: 'getHistory' });

    // Listen for messages from extension
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      switch (message.type) {
        case 'message':
          setMessages((prev) => [...prev, message.data]);
          setIsLoading(false);
          break;
        case 'history':
          setMessages(message.data);
          break;
        case 'clearHistory':
          setMessages([]);
          break;
        case 'status':
          setStatus(message.data.status);
          if (message.data.status === 'thinking') {
            setIsLoading(true);
          } else {
            setIsLoading(false);
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || isLoading) return;

    vscode.postMessage({
      type: 'sendMessage',
      content: content.trim()
    });

    setIsLoading(true);
  };

  const handleClearHistory = () => {
    vscode.postMessage({ type: 'clearHistory' });
    setMessages([]);
  };

  const handleExecuteCommand = (command: string) => {
    vscode.postMessage({
      type: 'executeCommand',
      command
    });
  };

  const handleOpenFile = (filePath: string, line?: number) => {
    vscode.postMessage({
      type: 'openFile',
      filePath,
      line
    });
  };

  return (
    <div className="app">
      <Header
        onClearHistory={handleClearHistory}
        status={status}
        messageCount={messages.length}
      />
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onExecuteCommand={handleExecuteCommand}
        onOpenFile={handleOpenFile}
      />
      <InputBox
        onSend={handleSendMessage}
        disabled={isLoading}
        placeholder="Ask Galaxy Code anything..."
      />
    </div>
  );
};
