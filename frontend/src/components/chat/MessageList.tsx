import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types/chat.types';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {messages.map((msg, index) => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              gap: '8px',
            }}
          >
            {!isUser && (
              <div style={{
                fontSize: '1.4rem',
                lineHeight: 1,
                alignSelf: 'flex-start',
                marginTop: '4px',
              }}>
                ☁️
              </div>
            )}

            <div
              style={{
                maxWidth: '78%',
                padding: '12px 16px',
                borderRadius: '18px',
                borderBottomRightRadius: isUser ? '4px' : '18px',
                borderBottomLeftRadius: !isUser ? '4px' : '18px',
                background: isUser
                  ? 'linear-gradient(135deg, var(--blue-400), var(--blue-500))'
                  : 'rgba(255, 255, 255, 0.88)',
                color: isUser ? '#ffffff' : 'var(--text-dark)',
                boxShadow: '0 2px 8px rgba(56, 189, 248, 0.12)',
                fontSize: '0.92rem',
                lineHeight: 1.55,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {msg.content}
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '1.4rem', lineHeight: 1 }}>☁️</div>
          <div style={{
            padding: '10px 16px',
            borderRadius: '18px',
            background: 'rgba(255, 255, 255, 0.85)',
            display: 'inline-flex',
            gap: '4px',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              น้องเมฆกำลังพิมพ์...
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
