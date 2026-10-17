import React, { useState } from 'react';
import { audioService } from '../../services/audioService';

interface StudyMascotProps {
  onOpenChat: () => void;
}

export const StudyMascot: React.FC<StudyMascotProps> = ({ onOpenChat }) => {
  const [bubbleText, setBubbleText] = useState('อ่านหนังสือเหนื่อยไหม? มาคุยกับเค้าได้นะ ☁️');
  const [wiggling, setWiggling] = useState(false);

  const bubblePhrases = [
    'อ่านหนังสือเหนื่อยไหม? มาคุยกับเค้าได้นะ ☁️',
    'อย่าลืมจิบน้ำด้วยนะคนเก่ง! 🧃',
    'วันนี้ทำได้ขนาดนี้ ยอดเยี่ยมมากแล้ว ✨',
    'พักสายตามองฟ้าสัก 1 นาทีนะ 🌱',
    'น้องเมฆนั่งเป็นเพื่อนอยู่ตรงนี้เสมอ 💖',
  ];

  const handleMascotClick = () => {
    audioService.playPop();
    setWiggling(true);
    setTimeout(() => setWiggling(false), 500);

    const nextPhrase = bubblePhrases[Math.floor(Math.random() * bubblePhrases.length)];
    setBubbleText(nextPhrase);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      margin: '20px 0',
      userSelect: 'none',
    }}>
      {/* Speech Bubble */}
      <div
        onClick={onOpenChat}
        className="glass-card"
        style={{
          padding: '8px 18px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.88rem',
          color: 'var(--blue-600)',
          fontWeight: 500,
          marginBottom: '10px',
          boxShadow: '0 4px 15px rgba(56, 189, 248, 0.18)',
          cursor: 'pointer',
          animation: 'floatSlow 4s ease-in-out infinite',
          maxWidth: '300px',
          textAlign: 'center',
        }}
      >
        <span>{bubbleText}</span>
      </div>

      {/* SVG Cartoon Mascot: Cute Nong Cloud with Glasses and Study Lamp */}
      <div
        onClick={handleMascotClick}
        style={{
          cursor: 'pointer',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: wiggling ? 'scale(1.15) rotate(5deg)' : 'scale(1)',
        }}
        title="คลิกที่น้องเมฆเพื่อทักทาย"
      >
        <svg width="170" height="130" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cloud Body with Soft Shadow */}
          <g filter="drop-shadow(0px 8px 16px rgba(56, 189, 248, 0.25))">
            {/* Outer Cloud Shape */}
            <path
              d="M50 115C33.4315 115 20 101.569 20 85C20 69.8732 31.2188 57.3601 45.8643 55.334C48.0934 32.5516 67.2407 15 90.5 15C108.577 15 124.168 25.1274 131.758 40.0211C135.539 37.9575 139.882 36.7857 144.5 36.7857C159.688 36.7857 172 49.0979 172 64.2857C172 66.0772 171.796 67.8213 171.411 69.4975C178.682 74.0041 183.5 81.9427 183.5 91C183.5 104.255 172.755 115 159.5 115H50Z"
              fill="#FFFFFF"
            />
            {/* Subtle Gradient Accent */}
            <path
              d="M50 115C33.4315 115 20 101.569 20 85C20 69.8732 31.2188 57.3601 45.8643 55.334C48.0934 32.5516 67.2407 15 90.5 15C108.577 15 124.168 25.1274 131.758 40.0211C135.539 37.9575 139.882 36.7857 144.5 36.7857C159.688 36.7857 172 49.0979 172 64.2857C172 66.0772 171.796 67.8213 171.411 69.4975C178.682 74.0041 183.5 81.9427 183.5 91C183.5 104.255 172.755 115 159.5 115H50Z"
              fill="url(#cloudGrad)"
              fillOpacity="0.4"
            />
          </g>

          {/* Rosy Cheeks */}
          <ellipse cx="65" cy="85" rx="8" ry="5" fill="#fbcfe8" opacity="0.8" />
          <ellipse cx="135" cy="85" rx="8" ry="5" fill="#fbcfe8" opacity="0.8" />

          {/* Round Student Glasses */}
          <circle cx="80" cy="74" r="14" stroke="#0284c7" strokeWidth="3" fill="none" opacity="0.85" />
          <circle cx="120" cy="74" r="14" stroke="#0284c7" strokeWidth="3" fill="none" opacity="0.85" />
          {/* Glasses Bridge */}
          <path d="M94 74H106" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />

          {/* Happy Eyes inside Glasses */}
          <circle cx="80" cy="74" r="3.5" fill="#1e293b" style={{ animation: 'blinkEyes 4s infinite' }} />
          <circle cx="120" cy="74" r="3.5" fill="#1e293b" style={{ animation: 'blinkEyes 4s infinite' }} />

          {/* Cute Smiling Mouth */}
          <path d="M94 88C94 88 97 94 100 94C103 94 106 88 106 88" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />

          {/* Tiny Sprout / Graduation Leaf on head */}
          <path d="M100 24C100 18 105 14 112 16C112 23 106 25 100 24Z" fill="#86efac" />
          <path d="M100 24C100 19 95 15 88 17C88 24 94 26 100 24Z" fill="#4ade80" />
          <path d="M100 24V28" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />

          <defs>
            <linearGradient id="cloudGrad" x1="100" y1="15" x2="100" y2="115" gradientUnits="userSpaceOnUse">
              <stop stopColor="#BAE6FD" />
              <stop offset="1" stopColor="#E0F2FE" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <button
        onClick={onOpenChat}
        className="cozy-btn-primary"
        style={{ marginTop: '8px', padding: '6px 16px', fontSize: '0.82rem' }}
      >
        💬 ปรึกษาน้องเมฆ
      </button>
    </div>
  );
};
