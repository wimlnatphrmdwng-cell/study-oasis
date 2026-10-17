import React, { useState } from 'react';
import type { PageRoute, StudentMood } from '../types/navigation.types';
import { TimeGreeting } from '../components/greeting/TimeGreeting';
import { StudentAffirmationCard } from '../components/greeting/StudentAffirmationCard';
import { KindnessBoard } from '../components/community/KindnessBoard';
import { StudyMascot } from '../components/mascot/StudyMascot';
import { BookOpen, MessageCircleHeart, Sparkles, BookHeart } from 'lucide-react';
import { audioService } from '../services/audioService';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

const MOODS: { id: StudentMood; emoji: string; label: string; response: string }[] = [
  { id: 'happy', emoji: '😊', label: 'สดใส มีพลัง', response: 'ยอดเยี่ยมเลย! ขอให้พลังบวกนี้พาเธอผ่านวันนี้ไปได้อย่างราบรื่นนะ 🌟' },
  { id: 'peaceful', emoji: '🌿', label: 'สงบ สบายใจ', response: 'ความสงบคือสมาธิที่ดีที่สุด ค่อยๆ ทำทีละอย่างอย่างผ่อนคลายนะ ☁️' },
  { id: 'tired', emoji: '🥱', label: 'เหนื่อยล้า', response: 'กอดแน่นๆ นะคนเก่ง วันนี้ไม่ต้องฝืน พักผ่อนบ้าง ร่างกายต้องการชาร์จแบต 🧃' },
  { id: 'anxious', emoji: '🥺', label: 'กังวลเรื่องเรียน', response: 'ความกังวลไม่ได้แปลว่าเธอทำไม่ได้ หายใจเข้าลึกๆ ค่อยๆ เริ่มจากข้อที่ง่ายก่อนนะ 💡' },
  { id: 'burnout', emoji: '🥀', label: 'หมดไฟ', response: 'ไม่เป็นไรเลยที่จะหมดไฟ การหยุดพักไม่ใช่ความล้มเหลว พักให้เต็มที่แล้วค่อยเริ่มใหม่นะ 💖' }
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [selectedMood, setSelectedMood] = useState<StudentMood | null>(null);

  const handleMoodSelect = (mood: StudentMood) => {
    audioService.playPop();
    setSelectedMood(mood);
  };

  const activeMoodInfo = MOODS.find(m => m.id === selectedMood);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '960px', margin: '0 auto' }}>
      {/* 1. Time-based Warm Greeting */}
      <TimeGreeting />

      {/* 2. Mood Check-in Widget */}
      <div className="glass-panel" style={{ padding: '20px 24px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '14px' }}>
          วันนี้ใจของเธอรู้สึกอย่างไรบ้าง? ☁️
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: activeMoodInfo ? '16px' : '0'
        }}>
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => handleMoodSelect(m.id)}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                background: selectedMood === m.id ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.7)',
                borderColor: selectedMood === m.id ? 'var(--blue-400)' : 'rgba(255, 255, 255, 0.8)',
                transform: selectedMood === m.id ? 'scale(1.05)' : 'scale(1)',
                color: 'var(--text-dark)',
                fontSize: '0.9rem',
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {activeMoodInfo && (
          <div style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(240, 249, 255, 0.85)',
            border: '1px solid var(--blue-200)',
            color: 'var(--blue-600)',
            fontSize: '0.92rem',
            animation: 'floatSlow 4s ease-in-out infinite'
          }}>
            💬 {activeMoodInfo.response}
          </div>
        )}
      </div>

      {/* 3. Daily Student Affirmation */}
      <StudentAffirmationCard />

      {/* 4. Quick Portals (Jump to dedicated rooms) */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '14px', textAlign: 'center' }}>
          เลือกห้องที่เธอต้องการใช้ตอนนี้ 🌈
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {/* Study Lounge Portal */}
          <div
            onClick={() => {
              audioService.playPop();
              onNavigate('study');
            }}
            className="glass-card"
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              textAlign: 'left'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--blue-600)'
            }}>
              <BookOpen size={24} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              ห้องอ่านหนังสือ (Study)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              นาฬิกา Pomodoro จับเวลาโฟกัส พร้อมมิกเซอร์เสียงฝนและ Lo-fi
            </p>
          </div>

          {/* AI Chat Portal */}
          <div
            onClick={() => {
              audioService.playPop();
              onNavigate('chat');
            }}
            className="glass-card"
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              textAlign: 'left'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(251, 207, 232, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#db2777'
            }}>
              <MessageCircleHeart size={24} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              คุยกับน้องเมฆ (Chat)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              เพื่อนคุยปรับทุกข์ ให้กำลังใจ และช่วยวางแผนการอ่านหนังสือ
            </p>
          </div>

          {/* De-Stress Portal */}
          <div
            onClick={() => {
              audioService.playPop();
              onNavigate('relax');
            }}
            className="glass-card"
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              textAlign: 'left'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(254, 240, 138, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706'
            }}>
              <Sparkles size={24} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              ลานคลายเครียด (Relax)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              ทิ้งความกังวลเรื่องสอบ และจิ้มฟองสบู่บดเคี้ยวความเครียด
            </p>
          </div>

          {/* Journal Portal */}
          <div
            onClick={() => {
              audioService.playPop();
              onNavigate('journal');
            }}
            className="glass-card"
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              textAlign: 'left'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(187, 247, 208, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16a34a'
            }}>
              <BookHeart size={24} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              สมุดบันทึก (Journal)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              เช็คลิสต์ Small Wins และดูบันทึกความก้าวหน้าของตัวเอง
            </p>
          </div>
        </div>
      </div>

      {/* 5. Anonymous Kindness Board from Friends */}
      <KindnessBoard />

      {/* 6. Mascot Presence */}
      <StudyMascot onOpenChat={() => onNavigate('chat')} />
    </div>
  );
};
