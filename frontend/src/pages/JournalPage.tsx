import React, { useState } from 'react';
import { SmallWinsList } from '../components/study/SmallWinsList';
import { storageService } from '../services/storageService';
import { Award, CheckCircle2, Bookmark } from 'lucide-react';
import { STUDENT_QUOTES } from '../constants/studentQuotes';
import { audioService } from '../services/audioService';

export const JournalPage: React.FC = () => {
  const completedPomo = storageService.getCompletedPomodoros();
  const [activeTab, setActiveTab] = useState<'wins' | 'album'>('wins');

  const badges = [
    { title: 'ก้าวแรกของการเรียน', desc: 'ทำรอบ Pomodoro แรกสำเร็จ', unlocked: completedPomo >= 1, emoji: '🌱' },
    { title: 'ผู้พยายามไม่ย่อท้อ', desc: 'สะสมการอ่านครบ 5 รอบ', unlocked: completedPomo >= 5, emoji: '⭐' },
    { title: 'ปรมาจารย์ก้อนเมฆ', desc: 'สะสมการอ่านครบ 10 รอบ', unlocked: completedPomo >= 10, emoji: '👑' },
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

      {/* Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
      }}>
        <button
          onClick={() => {
            audioService.playPop();
            setActiveTab('wins');
          }}
          className="glass-card"
          style={{
            padding: '10px 22px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 500,
            fontSize: '0.95rem',
            background: activeTab === 'wins' ? 'linear-gradient(135deg, var(--blue-400), var(--blue-500))' : 'rgba(255, 255, 255, 0.7)',
            color: activeTab === 'wins' ? '#ffffff' : 'var(--text-dark)',
            border: activeTab === 'wins' ? 'none' : '1px solid var(--blue-200)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> Small Wins & ความสำเร็จ
          </span>
        </button>

        <button
          onClick={() => {
            audioService.playPop();
            setActiveTab('album');
          }}
          className="glass-card"
          style={{
            padding: '10px 22px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 500,
            fontSize: '0.95rem',
            background: activeTab === 'album' ? 'linear-gradient(135deg, var(--blue-400), var(--blue-500))' : 'rgba(255, 255, 255, 0.7)',
            color: activeTab === 'album' ? '#ffffff' : 'var(--text-dark)',
            border: activeTab === 'album' ? 'none' : '1px solid var(--blue-200)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bookmark size={16} /> คลังการ์ดพลังใจ
          </span>
        </button>
      </div>

      {activeTab === 'wins' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Small Wins List */}
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
      ) : (
        /* Affirmation Album */
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
