import React, { useState } from 'react';
import { SmallWinsList } from '../components/study/SmallWinsList';
import { DailyQuestsList } from '../components/quests/DailyQuestsList';
import { PetCareRoom } from '../components/pet/PetCareRoom';
import { VisionBoardCard } from '../components/goals/VisionBoardCard';
import { storageService } from '../services/storageService';
import { Award, CheckCircle2, Bookmark, Target, Sparkles } from 'lucide-react';
import { STUDENT_QUOTES } from '../constants/studentQuotes';
import { audioService } from '../services/audioService';

type JournalSubTab = 'quests' | 'pet' | 'vision' | 'album';

export const JournalPage: React.FC = () => {
  const completedPomo = storageService.getCompletedPomodoros();
  const [activeTab, setActiveTab] = useState<JournalSubTab>('quests');

  const badges = [
    { title: 'ก้าวแรกของการเรียน', desc: 'ทำรอบ Pomodoro แรกสำเร็จ', unlocked: completedPomo >= 1, emoji: '🌱' },
    { title: 'ผู้พยายามไม่ย่อท้อ', desc: 'สะสมการอ่านครบ 5 รอบ', unlocked: completedPomo >= 5, emoji: '⭐' },
    { title: 'ปรมาจารย์ก้อนเมฆ', desc: 'สะสมการอ่านครบ 10 รอบ', unlocked: completedPomo >= 10, emoji: '👑' },
  ];

  const tabs: { id: JournalSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'quests', label: 'เควส & ความสำเร็จ', icon: <CheckCircle2 size={16} /> },
    { id: 'pet', label: 'สัตว์เลี้ยงของฉัน', icon: <Sparkles size={16} /> },
    { id: 'vision', label: 'เป้าหมายของฉัน', icon: <Target size={16} /> },
    { id: 'album', label: 'คลังการ์ดพลังใจ', icon: <Bookmark size={16} /> },
  ];

  return (
    <div style={{
      maxWidth: '960px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
          สมุดบันทึกพลังใจ & ความก้าวหน้า 🌱
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: '6px 0 0' }}>
          ทุกก้าวเล็กๆ ที่เธอทำในแต่ละวัน ล้วนมีความหมายและน่าภาคภูมิใจ
        </p>
      </div>

      {/* 4 Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audioService.playPop();
                setActiveTab(tab.id);
              }}
              className="glass-card"
              style={{
                padding: '9px 18px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 500,
                fontSize: '0.92rem',
                background: isActive ? 'linear-gradient(135deg, var(--blue-400), var(--blue-500))' : 'rgba(255, 255, 255, 0.7)',
                color: isActive ? '#ffffff' : 'var(--text-dark)',
                border: isActive ? 'none' : '1px solid var(--blue-200)',
                boxShadow: isActive ? '0 4px 12px rgba(14, 165, 233, 0.3)' : 'none',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {tab.icon} {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Quests & Small Wins */}
      {activeTab === 'quests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <DailyQuestsList />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'start'
          }}>
            <SmallWinsList />

            {/* Badges and Milestones */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-dark)',
                fontWeight: 600,
                fontSize: '1rem',
                marginBottom: '16px'
              }}>
                <Award size={20} color="#f59e0b" />
                <span>เหรียญรางวัลความพยายาม</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {badges.map((b, i) => (
                  <div
                    key={i}
                    className="glass-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      opacity: b.unlocked ? 1 : 0.6,
                      background: b.unlocked ? 'rgba(254, 240, 138, 0.25)' : 'rgba(255, 255, 255, 0.6)',
                      borderColor: b.unlocked ? '#f59e0b' : 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    <div style={{ fontSize: '2rem' }}>{b.emoji}</div>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
                        {b.title} {b.unlocked && <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>(ปลดล็อกแล้ว!)</span>}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pet Care Room */}
      {activeTab === 'pet' && (
        <PetCareRoom />
      )}

      {/* Tab 3: Vision Board */}
      {activeTab === 'vision' && (
        <VisionBoardCard isPinnedBannerOnly={false} />
      )}

      {/* Tab 4: Affirmation Album */}
      {activeTab === 'album' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px'
        }}>
          {STUDENT_QUOTES.map((q) => (
            <div
              key={q.id}
              className="glass-card"
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                borderLeft: '4px solid var(--blue-400)',
              }}
            >
              <p style={{ fontSize: '1rem', color: 'var(--text-dark)', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{q.text}"
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}>
                <span>— {q.author}</span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(224, 242, 254, 0.8)',
                  color: 'var(--blue-600)'
                }}>
                  พลังบวก
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
