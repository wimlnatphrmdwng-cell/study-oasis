import React from 'react';
import type { PageRoute } from '../../types/navigation.types';
import { Home, BookOpen, MessageCircleHeart, Sparkles, BookHeart, Volume2, VolumeX, Users } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface TopNavigationProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeOnlineCount: number;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentRoute,
  onNavigate,
  isMuted,
  onToggleMute,
  activeOnlineCount
}) => {
  const navTabs: { id: PageRoute; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'หน้าแรก', icon: <Home size={17} /> },
    { id: 'study', label: 'ห้องอ่านหนังสือ', icon: <BookOpen size={17} /> },
    { id: 'chat', label: 'คุยกับน้องเมฆ', icon: <MessageCircleHeart size={17} /> },
    { id: 'relax', label: 'ลานคลายเครียด', icon: <Sparkles size={17} /> },
    { id: 'journal', label: 'สมุดบันทึก', icon: <BookHeart size={17} /> },
  ];

  const handleTabClick = (route: PageRoute) => {
    audioService.playPop();
    onNavigate(route);
  };

  return (
    <header className="glass-panel" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      margin: '14px auto 20px',
      maxWidth: '1100px',
      width: '92%',
      zIndex: 20,
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Brand & Mascot */}
      <div
        onClick={() => handleTabClick('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
      >
        <div style={{
          fontSize: '1.8rem',
          lineHeight: 1,
          animation: 'floatSlow 3s ease-in-out infinite'
        }}>
          ☁️
        </div>
        <div>
          <h1 style={{
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--text-dark)',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
            margin: 0
          }}>
            Little Cloud <span style={{ color: 'var(--blue-500)', fontWeight: 400 }}>Oasis</span>
          </h1>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
            พื้นที่ฮีลใจของเด็กเรียน
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(224, 242, 254, 0.55)',
        padding: '4px',
        borderRadius: 'var(--radius-full)',
        overflowX: 'auto',
      }}>
        {navTabs.map((tab) => {
          const isActive = currentRoute === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.86rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--blue-600)' : 'var(--text-dark)',
                background: isActive ? '#ffffff' : 'transparent',
                boxShadow: isActive ? '0 2px 8px rgba(56, 189, 248, 0.25)' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Actions (Online counter & Audio) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Live Buddy Counter */}
        <div className="glass-card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          color: 'var(--blue-600)',
          fontWeight: 500,
        }}>
          <Users size={14} />
          <span>{activeOnlineCount.toLocaleString()} คน</span>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            display: 'inline-block',
            animation: 'pulseSoft 1.5s infinite'
          }} />
        </div>

        {/* Mute Button */}
        <button
          onClick={onToggleMute}
          className="glass-card"
          title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            color: isMuted ? 'var(--text-muted)' : 'var(--blue-500)'
          }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </header>
  );
};
