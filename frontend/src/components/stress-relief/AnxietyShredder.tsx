import React, { useState } from 'react';
import { X, Sparkles, Heart } from 'lucide-react';
import { audioService } from '../../services/audioService';
import confetti from 'canvas-confetti';

interface AnxietyShredderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnxietyShredder: React.FC<AnxietyShredderProps> = ({ isOpen, onClose }) => {
  const [worryText, setWorryText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [released, setReleased] = useState(false);

  if (!isOpen) return null;

  const handleRelease = () => {
    if (!worryText.trim()) return;

    setIsReleasing(true);
    audioService.playPop();

    setTimeout(() => {
      audioService.playChime();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#fbcfe8', '#fef08a', '#7dd3fc', '#bbf7d0']
      });

      setIsReleasing(false);
      setReleased(true);
    }, 1200);
  };

  const handleReset = () => {
    setWorryText('');
    setReleased(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '30px',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.92)',
        textAlign: 'center',
      }}>
        {/* Close Button */}
        <button
          onClick={handleReset}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: 'var(--text-muted)',
            padding: '6px',
            borderRadius: '50%',
          }}
        >
          <X size={20} />
        </button>

        {!released ? (
          <div>
            <div style={{
              display: 'inline-flex',
              padding: '12px',
              borderRadius: '50%',
              background: 'var(--blue-100)',
              color: 'var(--blue-500)',
              marginBottom: '14px',
            }}>
              <Sparkles size={28} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>
              ทิ้งความกังวลเรื่องเรียนลงที่นี่
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              พิมพ์เรื่องที่ทำให้เธอหนักใจ เช่น กลัวสอบตก, โปรเจกต์ไม่ทัน, หรือรู้สึกเหนื่อยล้า... เราจะเปลี่ยนมันเป็นปุ๋ยบำรุงหัวใจ
            </p>

            <textarea
              value={worryText}
              onChange={(e) => setWorryText(e.target.value)}
              placeholder="เรื่องที่เครียดอยู่ตอนนี้..."
              rows={4}
              disabled={isReleasing}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(240, 249, 255, 0.7)',
                border: '1.5px solid var(--blue-200)',
                fontSize: '0.95rem',
                color: 'var(--text-dark)',
                resize: 'none',
                marginBottom: '18px',
                transition: 'all 0.3s ease',
                opacity: isReleasing ? 0.3 : 1,
                transform: isReleasing ? 'translateY(-20px) scale(0.95)' : 'none',
              }}
            />

            <button
              onClick={handleRelease}
              disabled={isReleasing || !worryText.trim()}
              className="cozy-btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
            >
              {isReleasing ? 'กำลังปล่อยลอยไปกับสายลม...' : 'ปล่อยลอยไป 🎈'}
            </button>
          </div>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🌸</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '10px' }}>
              เรื่องแย่ๆ ได้ถูกพัดพาไปแล้วนะ
            </h3>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '22px' }}>
              "ไม่ว่าอะไรจะเกิดขึ้นในวันพรุ่งนี้ เธอก็ยังคงเป็นคนเก่งที่ควรค่าแก่ความสุขเสมอ วันนี้ปล่อยวางแล้วยิ้มให้ตัวเองสักนิดนะ"
            </p>
            <button
              onClick={handleReset}
              className="cozy-btn-primary"
              style={{ padding: '10px 24px' }}
            >
              <Heart size={16} /> รู้สึกโล่งขึ้นแล้ว
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
