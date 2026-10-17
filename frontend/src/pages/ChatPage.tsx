import React, { useState } from 'react';
import type { ChatMessage } from '../types/chat.types';
import { sendChatMessage } from '../services/chatApi';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { audioService } from '../services/audioService';
import { RotateCcw, Sparkles } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'สวัสดีนะคนเก่ง! เค้าคือน้องเมฆ Study Buddy ของเธอเอง ☁️ ยินดีต้อนรับสู่ห้องคุยส่วนตัวนะ วันนี้มีเรื่องอะไรไม่สบายใจ เรื่องสอบ การบ้าน หรือหมดไฟ เล่าให้เค้าฟังได้หมดเลยนะ เค้าพร้อมรับฟังและอยู่ข้างๆ เสมอ!'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleClearChat = () => {
    audioService.playPop();
    setMessages([
      {
        role: 'assistant',
        content: 'เริ่มบทสนทนาใหม่แล้วนะ วันนี้อยากคุยเรื่องอะไรดีคนเก่ง? ☁️'
      }
    ]);
  };

  return (
    <div style={{
      maxWidth: '840px',
      margin: '0 auto',
      height: 'calc(100vh - 140px)',
      minHeight: '560px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Chat Room Panel */}
      <div className="glass-panel" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: 'var(--glass-shadow-lg)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(224, 242, 254, 0.8)',
          background: 'rgba(240, 249, 255, 0.85)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '2rem', lineHeight: 1 }}>☁️</div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
                ห้องคุยกับน้องเมฆ (Cloudy Companion AI)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--blue-500)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} /> บัดดี้ใจดี รับฟังทุกเรื่องเรียน ไม่ตัดสินใคร
              </p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="cozy-btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            title="ล้างการสนทนา"
          >
            <RotateCcw size={14} />
            <span>เริ่มคุยใหม่</span>
          </button>
        </div>

        {/* Message List */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
