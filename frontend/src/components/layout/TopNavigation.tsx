import React from 'react';
import { Volume2, VolumeX, MessageCircleHeart, Users, Sparkles } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface TopNavigationProps {
  onOpenChat: () => void;
  onOpenShredder: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeOnlineCount: number;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onOpenChat,
  onOpenShredder,
  isMuted,
  onToggleMute,
  activeOnlineCount
}) => {
  return (
    <header className="glass-panel" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      margin: '16px auto',
      maxWidth: '1200px',
      width: '92%',
      zIndex: 10,
    }}>
      {/* Brand & Mascot Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          fontSize: '2rem',
          lineHeight: 1,
          animation: 'floatSlow 3s ease-in-out infinite'
        }}>
          ☁️
        </div>
        <div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text-dark)',
            letterSpacing: '-0.3px',
            lineHeight: 1.2
          }}>
            Little Cloud <span style={{ color: 'var(--blue-500)', fontWeight: 400 }}>Oasis</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            พื้นที่ฮีลใจ & Study Buddy สำหรับนักเรียน
          </p>
        </div>
      </div>

      {/* Online Buddies Counter */}
      <div className="glass-card" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.85rem',
        color: 'var(--blue-600)',
        fontWeight: 500,
      }}>
        <Users size={16} />
        <span>เพื่อนร่วมท้องฟ้า <strong>{activeOnlineCount.toLocaleString()}</strong> คน</span>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#22c55e',
          display: 'inline-block',
          animation: 'pulseSoft 1.5s infinite'
        }} />
      </div>

      {/* Actions (Shredder, Audio, Chat) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => {
            audioService.playPop();
            onOpenShredder();
          }}
          className="cozy-btn-secondary"
          title="ระบายความกังวลเรื่องการบ้าน/สอบ"
          style={{ padding: '8px 16px', fontSize: '0.88rem' }}
        >
          <Sparkles size={16} />
          <span>ทิ้งความเครียด</span>
        </button>

        <button
          onClick={onToggleMute}
          className="glass-card"
          title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            color: isMuted ? 'var(--text-muted)' : 'var(--blue-500)'
          }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          onClick={() => {
            audioService.playPop();
            onOpenChat();
          }}
          className="cozy-btn-primary"
          style={{ padding: '8px 18px', fontSize: '0.88rem' }}
        >
          <MessageCircleHeart size={18} />
          <span>คุยกับน้องเมฆ</span>
        </button>
      </div>
    </header>
  );
};
