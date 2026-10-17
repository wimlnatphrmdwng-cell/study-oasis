import React, { useState, useEffect } from 'react';
import { audioService } from '../../services/audioService';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

export const CloudBreathing: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    let timer: number | null = null;
    if (isRunning) {
      timer = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Switch phases: Inhale (4s) -> Hold (7s) -> Exhale (8s)
            if (phase === 'inhale') {
              audioService.playPop();
              setPhase('hold');
              return 7;
            } else if (phase === 'hold') {
              audioService.playPop();
              setPhase('exhale');
              return 8;
            } else {
              audioService.playChime();
              setPhase('inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, phase]);

  const toggleExercise = () => {
    audioService.playPop();
    setIsRunning(!isRunning);
  };

  const resetExercise = () => {
    audioService.playPop();
    setIsRunning(false);
    setPhase('inhale');
    setCountdown(4);
  };

  const phaseDetails = {
    inhale: { label: 'หายใจเข้าช้าๆ ทางจมูก...', color: 'var(--blue-500)', scale: 1.35 },
    hold: { label: 'กลั้นหายใจเบาๆ ทำใจให้นิ่ง...', color: '#d97706', scale: 1.35 },
    exhale: { label: 'หายใจออกช้าๆ ทางปาก...', color: '#16a34a', scale: 0.85 }
  };

  return (
    <div className="glass-panel" style={{
      padding: '26px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--blue-600)',
        fontSize: '0.9rem',
        fontWeight: 600,
        marginBottom: '6px'
      }}>
        <Wind size={18} />
        <span>เกมก้อนเมฆฝึกสมาธิ 4-7-8 (Cloud Breathing)</span>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '480px', marginBottom: '20px' }}>
        เทคนิคการหายใจที่ช่วยลดอัตราการเต้นของหัวใจ ดับความฟุ้งซ่าน และเพิ่มสมาธิก่อนเริ่มอ่านหนังสือ
      </p>

      {/* Breathing Cloud Visualization */}
      <div style={{
        width: '200px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        margin: '10px 0 20px',
      }}>
        {/* Soft Background Aura */}
        <div style={{
          position: 'absolute',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(186, 230, 253, 0.6) 0%, rgba(224, 242, 254, 0) 70%)',
          transform: `scale(${isRunning ? phaseDetails[phase].scale : 1})`,
          transition: phase === 'hold' ? 'none' : 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />

        {/* Cloud Mascot in Center */}
        <div style={{
          fontSize: '4.8rem',
          lineHeight: 1,
          transform: `scale(${isRunning ? phaseDetails[phase].scale : 1})`,
          transition: phase === 'hold' ? 'none' : 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: 'drop-shadow(0 6px 14px rgba(56, 189, 248, 0.3))'
        }}>
          ☁️
        </div>

        {/* Counter Number */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          fontSize: '1.4rem',
          fontWeight: 700,
          color: phaseDetails[phase].color,
          fontFamily: 'var(--font-en)'
        }}>
          {isRunning ? countdown : 'Ready'}
        </div>
      </div>

      {/* Phase Instruction Text */}
      <div style={{
        fontSize: '1.05rem',
        fontWeight: 600,
        color: phaseDetails[phase].color,
        minHeight: '28px',
        marginBottom: '16px'
      }}>
        {isRunning ? phaseDetails[phase].label : 'กดเริ่มเพื่อฝึกหายใจรีเซ็ตสมอง'}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={toggleExercise}
          className="cozy-btn-primary"
          style={{ padding: '10px 22px', fontSize: '0.95rem' }}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          <span>{isRunning ? 'หยุดชั่วคราว' : 'เริ่มฝึกหายใจ'}</span>
        </button>

        <button
          onClick={resetExercise}
          className="glass-card"
          title="รีเซ็ต"
          style={{
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            color: 'var(--text-muted)'
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};
