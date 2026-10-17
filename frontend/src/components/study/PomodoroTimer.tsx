import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Sparkles } from 'lucide-react';
import type { PomodoroMode } from '../../types/study.types';
import { audioService } from '../../services/audioService';
import { storageService } from '../../services/storageService';
import confetti from 'canvas-confetti';

const DURATIONS: Record<PomodoroMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(storageService.getCompletedPomodoros());

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed session
      audioService.playChime();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7dd3fc', '#bae6fd', '#fef08a', '#fbcfe8']
      });

      if (mode === 'work') {
        const count = storageService.incrementPomodoro();
        setCompletedSessions(count);
        setMode('shortBreak');
        setTimeLeft(DURATIONS.shortBreak);
      } else {
        setMode('work');
        setTimeLeft(DURATIONS.work);
      }
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode: PomodoroMode) => {
    audioService.playPop();
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
  };

  const toggleTimer = () => {
    audioService.playPop();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    audioService.playPop();
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = ((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100;

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
    }}>
      {/* Mode Switches */}
      <div style={{
        display: 'flex',
        gap: '8px',
        background: 'rgba(224, 242, 254, 0.6)',
        padding: '5px',
        borderRadius: 'var(--radius-full)',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => switchMode('work')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.88rem',
            fontWeight: 500,
            background: mode === 'work' ? '#ffffff' : 'transparent',
            color: mode === 'work' ? 'var(--blue-600)' : 'var(--text-muted)',
            boxShadow: mode === 'work' ? '0 2px 8px rgba(56, 189, 248, 0.2)' : 'none',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={14} /> โฟกัส (25m)
          </span>
        </button>

        <button
          onClick={() => switchMode('shortBreak')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.88rem',
            fontWeight: 500,
            background: mode === 'shortBreak' ? '#ffffff' : 'transparent',
            color: mode === 'shortBreak' ? 'var(--blue-600)' : 'var(--text-muted)',
            boxShadow: mode === 'shortBreak' ? '0 2px 8px rgba(56, 189, 248, 0.2)' : 'none',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Coffee size={14} /> พักสั้น (5m)
          </span>
        </button>

        <button
          onClick={() => switchMode('longBreak')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.88rem',
            fontWeight: 500,
            background: mode === 'longBreak' ? '#ffffff' : 'transparent',
            color: mode === 'longBreak' ? 'var(--blue-600)' : 'var(--text-muted)',
            boxShadow: mode === 'longBreak' ? '0 2px 8px rgba(56, 189, 248, 0.2)' : 'none',
          }}
        >
          <span>พักยาว (15m)</span>
        </button>
      </div>

      {/* Timer Display with Circular Glow */}
      <div style={{
        position: 'relative',
        width: '210px',
        height: '210px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px 0 20px',
      }}>
        {/* SVG Progress Ring */}
        <svg width="210" height="210" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
          <circle
            cx="105"
            cy="105"
            r="90"
            stroke="rgba(224, 242, 254, 0.6)"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="105"
            cy="105"
            r="90"
            stroke="url(#blueGradient)"
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={2 * Math.PI * 90 * (1 - progressPercent / 100)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--blue-300)" />
              <stop offset="100%" stopColor="var(--blue-500)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Digital Time */}
        <span style={{
          fontSize: '3.1rem',
          fontWeight: 700,
          fontFamily: 'var(--font-en)',
          color: 'var(--text-dark)',
          lineHeight: 1,
          letterSpacing: '-1px'
        }}>
          {formattedTime}
        </span>
        <span style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginTop: '6px'
        }}>
          {mode === 'work' ? '✨ กำลังตั้งใจอ่าน' : '☕ เวลาพักสมอง'}
        </span>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
        <button
          onClick={toggleTimer}
          className="cozy-btn-primary"
          style={{ minWidth: '130px', padding: '12px 24px', fontSize: '1.05rem' }}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          <span>{isRunning ? 'หยุดพัก' : 'เริ่มอ่าน'}</span>
        </button>

        <button
          onClick={resetTimer}
          className="glass-card"
          title="รีเซ็ตเวลา"
          style={{
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            color: 'var(--text-muted)'
          }}
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Stats Counter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        background: 'rgba(255, 255, 255, 0.6)',
        padding: '6px 14px',
        borderRadius: 'var(--radius-full)'
      }}>
        <Sparkles size={14} color="#f59e0b" />
        <span>สะสมความพยายามไปแล้ว <strong>{completedSessions}</strong> รอบ</span>
      </div>
    </div>
  );
};
