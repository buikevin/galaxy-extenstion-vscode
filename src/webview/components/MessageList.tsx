import React, { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import './MessageList.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onExecuteCommand: (command: string) => void;
  onOpenFile: (filePath: string, line?: number) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  onExecuteCommand,
  onOpenFile
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="message-list">
      {messages.length === 0 && !isLoading && (
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <h2>Welcome to Galaxy Code</h2>
          <p>Start a conversation with your AI coding assistant</p>
          <div className="suggestions">
            <div className="suggestion-item">
              <span className="suggestion-icon">🔍</span>
              <span>Explain code</span>
            </div>
            <div className="suggestion-item">
              <span className="suggestion-icon">✨</span>
              <span>Generate code</span>
            </div>
            <div className="suggestion-item">
              <span className="suggestion-icon">🐛</span>
              <span>Fix bugs</span>
            </div>
            <div className="suggestion-item">
              <span className="suggestion-icon">📝</span>
              <span>Write tests</span>
            </div>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          onExecuteCommand={onExecuteCommand}
          onOpenFile={onOpenFile}
        />
      ))}

      {isLoading && (
        <div className="loading-message">
          <div className="loading-avatar">
            <div className="loading-spinner"></div>
          </div>
          <div className="loading-content">
            <div className="loading-text">Thinking...</div>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
