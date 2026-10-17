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

interface RibbonTabItem {
  id: PageRoute;
  label: string;
  icon: React.ReactNode;
  bgPastel: string;
  activeBg: string;
  borderColor: string;
  textColor: string;
  activeTextColor: string;
  tag: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentRoute,
  onNavigate,
  isMuted,
  onToggleMute,
  activeOnlineCount
}) => {
  const tabs: RibbonTabItem[] = [
    {
      id: 'home',
      label: 'หน้าแรก',
      icon: <Home size={16} />,
      bgPastel: '#f0f9ff',
      activeBg: '#bae6fd',
      borderColor: '#7dd3fc',
      textColor: '#0369a1',
      activeTextColor: '#0284c7',
      tag: '🏠'
    },
    {
      id: 'study',
      label: 'ห้องอ่านหนังสือ',
      icon: <BookOpen size={16} />,
      bgPastel: '#fefce8',
      activeBg: '#fef08a',
      borderColor: '#fde047',
      textColor: '#854d0e',
      activeTextColor: '#713f12',
      tag: '📖'
    },
    {
      id: 'chat',
      label: 'คุยกับน้องเมฆ',
      icon: <MessageCircleHeart size={16} />,
      bgPastel: '#fdf2f8',
      activeBg: '#fbcfe8',
      borderColor: '#f472b6',
      textColor: '#9d174d',
      activeTextColor: '#831843',
      tag: '☁️'
    },
    {
      id: 'relax',
      label: 'ลานคลายเครียด',
      icon: <Sparkles size={16} />,
      bgPastel: '#f0fdf4',
      activeBg: '#bbf7d0',
      borderColor: '#86efac',
      textColor: '#166534',
      activeTextColor: '#14532d',
      tag: '🎈'
    },
    {
      id: 'journal',
      label: 'สมุดบันทึก',
      icon: <BookHeart size={16} />,
      bgPastel: '#f5f3ff',
      activeBg: '#ddd6fe',
      borderColor: '#c4b5fd',
      textColor: '#5b21b6',
      activeTextColor: '#4c1d95',
      tag: '🌱'
    },
  ];

  const handleTabClick = (route: PageRoute) => {
    audioService.playPop();
    onNavigate(route);
  };

  return (
    <header style={{
      maxWidth: '1100px',
      margin: '16px auto 28px',
      width: '94%',
      position: 'relative',
      zIndex: 20,
    }}>
      {/* 1. Main Planner Binder Card */}
      <div className="glass-panel" style={{
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        borderBottom: '2px dashed rgba(186, 230, 253, 0.6)',
      }}>
        {/* Brand & Mascot Title */}
        <div
          onClick={() => handleTabClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{
            fontSize: '2rem',
            lineHeight: 1,
            animation: 'floatSlow 3s ease-in-out infinite',
            filter: 'drop-shadow(0 2px 4px rgba(56, 189, 248, 0.3))'
          }}>
            ☁️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-dark)',
                margin: 0,
                lineHeight: 1.2
              }}>
                Little Cloud <span style={{ color: 'var(--blue-500)', fontWeight: 400 }}>Oasis</span>
              </h1>
              <span style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(254, 240, 138, 0.5)',
                color: '#854d0e',
                fontWeight: 500,
                border: '1px dashed #eab308'
              }}>
                📓 Diary Edition
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              สมุดไดอารี่ฮีลใจ & Study Buddy สำหรับนักเรียน
            </p>
          </div>
        </div>

        {/* Right Info: Washi Tape Buddies + Audio Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Washi Tape Note */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #fef9c3, #fef08a)',
            border: '1px dashed #ca8a04',
            color: '#854d0e',
            fontSize: '0.82rem',
            fontWeight: 500,
            transform: 'rotate(-1deg)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}>
            <Users size={14} />
            <span>เพื่อนเปิดสมุดอยู่ <strong>{activeOnlineCount.toLocaleString()}</strong> คน</span>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#16a34a',
              display: 'inline-block',
              animation: 'pulseSoft 1.5s infinite'
            }} />
          </div>

          {/* Sound Toggle Button */}
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
              color: isMuted ? 'var(--text-muted)' : 'var(--blue-500)',
            }}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
        </div>
      </div>

      {/* 2. Integrated Ribbon Bookmark Tabs Row (ไม่บังเนื้อหาด้านล่าง จัดระยะสมดุล 100%) */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(12px)',
        borderBottomLeftRadius: 'var(--radius-lg)',
        borderBottomRightRadius: 'var(--radius-lg)',
        border: '1px solid var(--glass-border)',
        borderTop: 'none',
        boxShadow: '0 8px 24px rgba(56, 189, 248, 0.1)',
        padding: '0 16px 10px',
      }}>
        <nav style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
          alignItems: 'stretch',
          paddingTop: '6px',
        }}>
          {tabs.map((tab) => {
            const isActive = currentRoute === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  background: isActive ? tab.activeBg : tab.bgPastel,
                  color: isActive ? tab.activeTextColor : tab.textColor,
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.88rem',
                  border: `1.5px ${isActive ? 'solid' : 'dashed'} ${tab.borderColor}`,
                  boxShadow: isActive
                    ? '0 4px 14px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.8)'
                    : 'none',
                  transform: isActive ? 'translateY(1px)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  whiteSpace: 'nowrap',
                }}
              >
                {/* Cute Paperclip pin for active tab */}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    top: '-7px',
                    left: '12px',
                    fontSize: '0.85rem',
                    lineHeight: 1,
                  }}>
                    📎
                  </span>
                )}

                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {tab.icon}
                </span>

                <span>{tab.label}</span>

                <span style={{
                  fontSize: '0.72rem',
                  opacity: isActive ? 0.9 : 0.6,
                  marginLeft: '2px',
                }}>
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
