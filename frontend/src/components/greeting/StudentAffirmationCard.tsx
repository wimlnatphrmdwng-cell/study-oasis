import React, { useState } from 'react';
import { STUDENT_QUOTES } from '../../constants/studentQuotes';
import { RefreshCw, Copy, Check, Heart } from 'lucide-react';
import { audioService } from '../../services/audioService';

export const StudentAffirmationCard: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuote = STUDENT_QUOTES[index];

  const handleNextQuote = () => {
    audioService.playPop();
    setIsAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % STUDENT_QUOTES.length);
      setIsAnimating(false);
    }, 200);
  };

  const handleCopy = () => {
    audioService.playPop();
    navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{
      padding: '24px 28px',
      position: 'relative',
      overflow: 'hidden',
      maxWidth: '680px',
      margin: '0 auto 28px',
      textAlign: 'center',
      border: '1.5px solid rgba(255, 255, 255, 0.85)',
    }}>
      {/* Background soft glow accent */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        right: '-10%',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(254, 240, 138, 0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--blue-600)',
        fontSize: '0.82rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        marginBottom: '12px'
      }}>
        <Heart size={14} fill="var(--peach-pink)" color="var(--blue-400)" />
        <span>ข้อความโอบกอดใจวันนี้</span>
      </div>

      <div style={{
        minHeight: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? 'scale(0.96)' : 'scale(1)',
      }}>
        <p style={{
          fontSize: '1.22rem',
          fontWeight: 500,
          lineHeight: 1.6,
          color: 'var(--text-dark)',
        }}>
          "{currentQuote.text}"
        </p>
      </div>

      <p style={{
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginTop: '8px',
        fontStyle: 'italic',
      }}>
        — {currentQuote.author}
      </p>

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '18px'
      }}>
        <button
          onClick={handleNextQuote}
          className="cozy-btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={15} />
          <span>ขอคำคมใหม่</span>
        </button>

        <button
          onClick={handleCopy}
          className="cozy-btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          {copied ? <Check size={15} color="#16a34a" /> : <Copy size={15} />}
          <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกข้อความ'}</span>
        </button>
      </div>
    </div>
  );
};
