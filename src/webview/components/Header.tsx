import React from 'react';
import './Header.css';

interface HeaderProps {
  onClearHistory: () => void;
  status: 'idle' | 'thinking' | 'error';
  messageCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onClearHistory,
  status,
  messageCount
}) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'thinking':
        return { text: 'Processing...', color: '#0078d4' };
      case 'error':
        return { text: 'Error', color: '#e51400' };
      default:
        return { text: 'Ready', color: '#16825d' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="header">
      <div className="header-left">
        <div className="header-logo">
          <span className="logo-icon">🌌</span>
          <span className="logo-text">Galaxy Code</span>
        </div>
        <div className="header-status">
          <span
            className="status-indicator"
            style={{ backgroundColor: statusInfo.color }}
          ></span>
          <span className="status-text">{statusInfo.text}</span>
        </div>
      </div>
      <div className="header-right">
        <div className="message-count">
          {messageCount} {messageCount === 1 ? 'message' : 'messages'}
        </div>
        <button
          className="header-button"
          onClick={onClearHistory}
          title="Clear chat history"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4H14M6 4V2H10V4M3 4V14H13V4H3Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
