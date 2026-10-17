import React, { useState } from 'react';
import type { PetState } from '../../types/gamification.types';
import { gamificationService, PET_SPECIES } from '../../services/gamificationService';
import { audioService } from '../../services/audioService';
import { Heart, Sparkles } from 'lucide-react';

interface CozyPetViewProps {
  onGoToPetCare?: () => void;
}

export const CozyPetView: React.FC<CozyPetViewProps> = ({ onGoToPetCare }) => {
  const [petState] = useState<PetState>(gamificationService.getPetState());
  const [speechBubble, setSpeechBubble] = useState('เค้านั่งอ่านหนังสือเป็นเพื่อนนะ 🐾');
  const [isWiggling, setIsWiggling] = useState(false);

  const petInfo = PET_SPECIES.find(s => s.type === petState.type) || PET_SPECIES[0];

  const petDialogue: Record<string, string[]> = {
    gecko: [
      'หางอวบๆ ของเค้าเก็บพลังใจไว้ให้เธอเพียบเลยนะ 🦎✨',
      'กะพริบตาแป๋วๆ เป็นกำลังใจให้อยู่นะคนเก่ง!',
      'อ่านชีทจบ 1 หัวข้อแล้ว เค้าจะปรบมือให้!',
      'พักจิบน้ำก่อนไหม เดี๋ยวสมองกระหายน้ำนะ'
    ],
    cat: [
      'เมี๊ยว~ เค้าจะนอนเฝ้ากองหนังสือตรงนี้ ไม่หนีไปไหน 🐱',
      'เธอขยันจัง... ภูมิใจในตัวเธอจังเลย',
      'อย่ายอมแพ้นะ คนเก่งของเค้า!',
    ],
    dog: [
      'โฮ่ง! สู้ๆ นะ! อ่านจบแล้วไปกินของอร่อยกัน 🐶🦴',
      'เค้าสวมแว่นรออ่านหนังสือกับเธอแล้ว!',
      'มีสมาธิมากเลย สุดยอด!',
    ],
    rabbit: [
      'ดุ๊กดิ๊กๆ อ่านจบรอบนี้เค้าจะกระโดดดีใจให้ดูนะ 🐰🥕',
      'หายใจลึกๆ นะ ไม่ต้องกดดันตัวเอง!',
    ],
    squirrel: [
      'เค้าแอบซ่อนลูกโอ๊กแห่งความสำเร็จไว้ให้เธอแล้วนะ 🐿️🌰',
      'เก็บความรู้ทีละนิด เหมือนเค้าเก็บลูกโอ๊กเลย!',
    ],
    turtle: [
      'ค่อยๆ ไปทีละก้าว เหมือนเต่าอย่างเค้า ก็ถึงเส้นชัยได้เหมือนกันนะ 🐢🎓',
      'ช้าแต่สม่ำเสมอ คือความลับของคนเก่ง!',
    ]
  };

  const handlePetClick = () => {
    audioService.playPop();
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);

    const dialogues = petDialogue[petState.type] || petDialogue.gecko;
    const randomText = dialogues[Math.floor(Math.random() * dialogues.length)];
    setSpeechBubble(randomText);
  };

  return (
    <div className="glass-panel" style={{
      padding: '20px 24px',
      textAlign: 'center',
      position: 'relative',
      userSelect: 'none',
    }}>
      {/* Affection & Level Badges */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(254, 240, 138, 0.4)',
          color: '#854d0e',
          fontSize: '0.8rem',
          fontWeight: 600,
          border: '1px solid rgba(234, 179, 8, 0.3)'
        }}>
          <Sparkles size={13} />
          <span>Lv.{petState.level} {petState.nickname}</span>
        </div>

        {/* Affection Hearts */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.8rem',
          color: '#e11d48',
          fontWeight: 600
        }}>
          <Heart size={14} fill="#e11d48" />
          <span>{petState.affection}%</span>
        </div>
      </div>

      {/* Speech Bubble */}
      <div
        onClick={handlePetClick}
        className="glass-card"
        style={{
          padding: '8px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.86rem',
          color: 'var(--text-dark)',
          fontWeight: 500,
          marginBottom: '14px',
          display: 'inline-block',
          boxShadow: '0 4px 12px rgba(56, 189, 248, 0.15)',
          cursor: 'pointer',
          animation: 'floatSlow 4s ease-in-out infinite',
          maxWidth: '90%',
        }}
      >
        <span>{speechBubble}</span>
      </div>

      {/* Pet Avatar Graphic */}
      <div
        onClick={handlePetClick}
        style={{
          cursor: 'pointer',
          margin: '4px auto 10px',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isWiggling ? 'scale(1.2) rotate(8deg)' : 'scale(1)',
        }}
        title="คลิกเล่นกับน้องสัตว์เลี้ยง"
      >
        {/* Cute Mascot Sphere with Pet Emoji and Accessories */}
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(224, 242, 254, 0.8))',
          border: '3px solid #ffffff',
          boxShadow: '0 8px 24px rgba(56, 189, 248, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3.2rem',
          position: 'relative',
        }}>
          <span>{petInfo.emoji}</span>
          {/* Glasses or Graduation Accessory */}
          <span style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            fontSize: '1.2rem',
          }}>
            👓
          </span>
        </div>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 10px' }}>
        {petInfo.description}
      </p>

      {onGoToPetCare && (
        <button
          onClick={onGoToPetCare}
          className="cozy-btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
        >
          🥣 ให้อาหาร & เปลี่ยนสัตว์เลี้ยง
        </button>
      )}
    </div>
  );
};
