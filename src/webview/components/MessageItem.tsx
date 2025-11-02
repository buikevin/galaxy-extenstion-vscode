import React from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import './MessageItem.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface MessageItemProps {
  message: Message;
  onExecuteCommand: (command: string) => void;
  onOpenFile: (filePath: string, line?: number) => void;
}

// Configure marked to use highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error(err);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onExecuteCommand,
  onOpenFile
}) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCodeBlockClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check if clicked on a code block
    if (target.tagName === 'CODE' && target.parentElement?.tagName === 'PRE') {
      const code = target.textContent || '';
      const lang = target.className.replace('language-', '');

      // Check if it's a command (bash, sh, shell)
      if (['bash', 'sh', 'shell'].includes(lang)) {
        if (window.confirm('Execute this command in terminal?')) {
          onExecuteCommand(code);
        }
      }
    }

    // Check if clicked on a file reference
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('file://')) {
      e.preventDefault();
      const href = target.getAttribute('href') || '';
      const match = href.match(/file:\/\/(.+?)(?:#L(\d+))?$/);
      if (match) {
        const filePath = match[1];
        const line = match[2] ? parseInt(match[2]) : undefined;
        onOpenFile(filePath, line);
      }
    }
  };

  const renderContent = () => {
    if (message.role === 'user') {
      return <div className="message-text">{message.content}</div>;
    }

    // Parse markdown for assistant messages
    const html = marked.parse(message.content) as string;
    return (
      <div
        className="message-markdown"
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={handleCodeBlockClick}
      />
    );
  };

  return (
    <div className={`message-item message-${message.role}`}>
      <div className="message-avatar">
        {message.role === 'user' ? (
          <span className="avatar-icon">👤</span>
        ) : (
          <span className="avatar-icon">🤖</span>
        )}
      </div>
      <div className="message-body">
        <div className="message-header">
          <span className="message-role">
            {message.role === 'user' ? 'You' : 'Galaxy Code'}
          </span>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
        <div className="message-content">{renderContent()}</div>
      </div>
    </div>
  );
};
