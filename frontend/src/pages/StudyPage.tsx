import React, { useState } from 'react';
import { PomodoroTimer } from '../components/study/PomodoroTimer';
import { AmbientSoundMixer } from '../components/study/AmbientSoundMixer';
import { PixarPetView } from '../components/pet/PixarPetView';
import { VisionBoardCard } from '../components/goals/VisionBoardCard';
import { Maximize2, Minimize2, Lightbulb, Coffee } from 'lucide-react';
import { audioService } from '../services/audioService';

export const StudyPage: React.FC = () => {
  const [isZenMode, setIsZenMode] = useState(false);

  const toggleZenMode = () => {
    audioService.playPop();
    setIsZenMode(!isZenMode);
  };

  return (
    <div style={{
      maxWidth: isZenMode ? '600px' : '960px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      transition: 'all 0.3s ease',
    }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
            {isZenMode ? 'โหมดสมาธิเซน 🧘' : 'ห้องอ่านหนังสือ & โฟกัส 📖'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            {isZenMode ? 'สงบนิ่ง ตัดสิ่งรบกวน แล้วอ่านไปทีละหน้า' : 'โฟกัส 25 นาที แล้วพักเบรก 5 นาทีอย่างสบายใจ'}
          </p>
        </div>

        <button
          onClick={toggleZenMode}
          className="cozy-btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          title={isZenMode ? 'ออกจากโหมดเซน' : 'เปิดโหมดเซน (ตัดสิ่งรบกวน)'}
        >
          {isZenMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          <span>{isZenMode ? 'โหมดปกติ' : 'โหมดเซน'}</span>
        </button>
      </div>

      {/* Pinned Vision Goal Banner */}
      {!isZenMode && <VisionBoardCard isPinnedBannerOnly={true} />}

      {/* Main Focus Area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isZenMode ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: Pomodoro Timer & Pet Companion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <PomodoroTimer />
          {!isZenMode && <PixarPetView onGoToPetCare={() => window.location.hash = '#/journal'} />}
        </div>

        {/* Right Column: Sound Mixer & Focus Environment (Hidden in Zen Mode) */}
        {!isZenMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <AmbientSoundMixer />

            {/* Quick Study Tip */}
            <div className="glass-card" style={{
              padding: '16px 20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              fontSize: '0.88rem',
              color: 'var(--text-body)',
              lineHeight: 1.5
            }}>
              <Lightbulb size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>เทคนิคจากสัตว์เลี้ยง:</strong> ถ้าเริ่มอ่านแล้วรู้สึกหนืด ให้บอกตัวเองว่า <em>"ขอแค่ 5 นาทีนี้เท่านั้น"</em> เมื่อเริ่มได้แล้ว สมองจะปรับเข้าสู่ Flow State ได้ง่ายขึ้นเองนะ ✨
              </div>
            </div>

            {/* Live Study Companion Banner */}
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>☁️☕</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                เพื่อนๆ อีกกว่า 1,420 คนกำลังอ่านไปด้วยกัน
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                เธอไม่ได้สู้อยู่คนเดียวนะ ค่อยๆ เก็บความรู้ทีละหน้า
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(224, 242, 254, 0.7)',
                color: 'var(--blue-600)',
                fontSize: '0.82rem',
                fontWeight: 500,
              }}>
                <Coffee size={14} />
                <span>อย่าลืมจิบน้ำและขยับตัวเมื่อหมดรอบนะ</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
