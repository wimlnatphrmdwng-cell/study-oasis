import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../../types/chat.types';
import { sendChatMessage } from '../../services/chatApi';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { audioService } from '../../services/audioService';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'สวัสดีนะคนเก่ง! เค้าคือน้องเมฆ Study Buddy ของเธอเอง ☁️ วันนี้เรียนหรืออ่านหนังสือเหนื่อยไหม มีเรื่องอะไรไม่สบายใจ หรืออยากให้ช่วยปลอบใจ เล่าให้เค้าฟังได้เลยนะ!'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text, messages);
      audioService.playChime();
      setMessages([...updatedHistory, { role: 'assistant', content: response.reply }]);
    } catch {
      setMessages([
        ...updatedHistory,
        {
          role: 'assistant',
          content: 'ขอโทษทีนะ สัญญาณก้อนเมฆติดขัดนิดหน่อย แต่เค้ายังอยู่เคียงข้างเสมอนะ ลองส่งใหม่อีกทีนะคนเก่ง 🤍'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '560px',
        width: '100%',
        height: '620px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.94)',
        boxShadow: '0 20px 50px rgba(56, 189, 248, 0.3)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(224, 242, 254, 0.8)',
          background: 'rgba(240, 249, 255, 0.8)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '1.8rem', lineHeight: 1 }}>☁️</div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
                น้องเมฆ (Study Companion AI)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--blue-500)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} /> รับฟังและให้กำลังใจเสมอ
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playPop();
              onClose();
            }}
            style={{
              padding: '6px',
              borderRadius: '50%',
              color: 'var(--text-muted)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Area */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Input Bar */}
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
