import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const quickPrompts = [
    'หมดไฟอ่านหนังสือมากเลย ทำไงดี 🥺',
    'ใกล้สอบแล้ว เครียดจนนอนไม่หลับ 📚',
    'เหนื่อยมาก ขอกำลังใจหน่อยได้ไหม ☁️'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    audioService.playPop();
    onSendMessage(text.trim());
    setText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    audioService.playPop();
    onSendMessage(prompt);
  };

  return (
    <div style={{
      padding: '12px 16px',
      borderTop: '1px solid rgba(224, 242, 254, 0.8)',
      background: 'rgba(255, 255, 255, 0.75)',
    }}>
      {/* Quick Prompts */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '6px',
      }}>
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickPrompt(q)}
            disabled={isLoading}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '0.78rem',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(224, 242, 254, 0.7)',
              color: 'var(--blue-600)',
              border: '1px solid var(--blue-200)',
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์คุยกับน้องเมฆได้ทุกเรื่องเลยนะ..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid var(--blue-300)',
            fontSize: '0.9rem',
            color: 'var(--text-dark)',
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="cozy-btn-primary"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            padding: 0,
            opacity: isLoading || !text.trim() ? 0.5 : 1,
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
