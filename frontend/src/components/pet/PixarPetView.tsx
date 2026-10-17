import React, { useState, useEffect, useRef } from 'react';
import type { PetState } from '../../types/gamification.types';
import { gamificationService, PET_SPECIES } from '../../services/gamificationService';
import { audioService } from '../../services/audioService';
import { ThreePetCanvas } from './ThreePetCanvas';
import { Heart, Sparkles, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PixarPetViewProps {
  onGoToPetCare?: () => void;
}

export const PixarPetView: React.FC<PixarPetViewProps> = ({ onGoToPetCare }) => {
  const [petState] = useState<PetState>(gamificationService.getPetState());
  const [speechBubble, setSpeechBubble] = useState('เค้านั่งอ่านหนังสือเป็นเพื่อนนะ 🐾');
  const [renderMode, setRenderMode] = useState<'pixar' | 'clay'>('pixar');
  const [isHopping, setIsHopping] = useState(false);

  // 4D Parallax Mouse Tracking State
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseRot, setMouseRot] = useState({ x: 0, y: 0 });

  const petInfo = PET_SPECIES.find((s) => s.type === petState.type) || PET_SPECIES[0];

  const petDialogue: Record<string, string[]> = {
    cat: [
      'เมี๊ยว~ ยืนสองขาให้กำลังใจคนเก่งอยู่นะ! 🐱✨',
      'เค้าชอบแสงแดดตรงนี้จัง... อ่านหนังสือเหนื่อยไหม?',
      'พุงนุ่มๆ ของเค้าพร้อมให้กอดเสมอเวลาเครียดนะ!',
      'จำไว้นะ! เธอพยายามได้ดีที่สุดแล้วในวันนี้ 💖',
    ],
    gecko: [
      'หางอวบๆ ของเค้าเก็บพลังใจไว้ให้เธอเพียบเลยนะ 🦎✨',
      'เค้าสวมแว่นตาเตรียมลุยชีทสรุปไปพร้อมกับเธอแล้ว!',
      'กะพริบตาแป๋วๆ คอยเชียร์อยู่ข้างโต๊ะนะคนเก่ง 👓',
      'อ่านจบ 1 หัวข้อแล้ว พักสายตามองเพดานสักนิดนะ!',
    ],
    dog: [
      'โฮ่ง! คอร์กี้อย่างเค้าพร้อมวิ่งเป็นเพื่อนทุกความฝัน! 🐶🦴',
      'กระดิกหูทักทายคนขยัน... สู้เขานะ!',
      'อ่านจบแล้วอย่าลืมให้รางวัลตัวเองด้วยนะ!',
    ],
    rabbit: [
      'ดุ๊กดิ๊กๆ เค้าเปิดสมุดจดบันทึกตามเธออยู่เลยนะ 🐰🥕',
      'ขนนุ่มๆ ส่งกอดอุ่นๆ ไปให้คนอ่านหนังสือคนนี้นะ!',
    ],
    squirrel: [
      'ลูกโอ๊กทองคำนี้ เค้าขอมอบเป็นรางวัลให้ความพยายามของเธอ 🐿️🌰',
      'สะบัดพวงหางฟูๆ พัดความง่วงออกไปให้หมด!',
    ],
    turtle: [
      'ช้าแต่มั่นคง... เหมือนเต่าอย่างเค้า ก็คว้าใบปริญญาได้เหมือนกันนะ 🐢🎓',
      'ก้าวไปทีละก้าว ไม่ต้องเทียบกับใครเลยนะคนเก่ง!',
    ],
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || renderMode !== 'pixar') return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Clamp degrees for subtle natural 4D parallax
      setMouseRot({
        y: Math.max(-12, Math.min(12, deltaX * 14)),
        x: Math.max(-10, Math.min(10, -deltaY * 12)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [renderMode]);

  const handlePetClick = () => {
    audioService.playPop();
    setIsHopping(true);
    setTimeout(() => setIsHopping(false), 600);

    confetti({
      particleCount: 20,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#fdba74', '#fef08a', '#fbcfe8'],
    });

    const dialogues = petDialogue[petState.type] || petDialogue.cat;
    const randomText = dialogues[Math.floor(Math.random() * dialogues.length)];
    setSpeechBubble(randomText);
  };

  const toggleRenderMode = () => {
    audioService.playPop();
    setRenderMode((prev) => (prev === 'pixar' ? 'clay' : 'pixar'));
  };

  return (
    <div
      ref={containerRef}
      className="glass-panel"
      style={{
        padding: '22px 24px',
        textAlign: 'center',
        position: 'relative',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Top Controls: Level & Mode Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        {/* Level Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(254, 240, 138, 0.5)',
            color: '#854d0e',
            fontSize: '0.82rem',
            fontWeight: 600,
            border: '1px solid rgba(234, 179, 8, 0.4)',
          }}
        >
          <Sparkles size={13} />
          <span>
            Lv.{petState.level} {petState.nickname}
          </span>
        </div>

        {/* Switch Between Pixar Cinematic and 3D Clay Toy */}
        <button
          onClick={toggleRenderMode}
          className="glass-card"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--blue-600)',
            background: 'rgba(255, 255, 255, 0.85)',
          }}
          title="สลับโหมดการแสดงผล (Pixar Cinematic / 3D Clay Toy)"
        >
          <Wand2 size={13} />
          <span>{renderMode === 'pixar' ? '🎬 Pixar 3D' : '🧸 3D Toy'}</span>
        </button>

        {/* Affection Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.82rem',
            color: '#e11d48',
            fontWeight: 600,
          }}
        >
          <Heart size={14} fill="#e11d48" />
          <span>{petState.affection}%</span>
        </div>
      </div>

      {/* Speech Bubble */}
      <div
        onClick={handlePetClick}
        className="glass-card"
        style={{
          padding: '8px 18px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.88rem',
          color: 'var(--text-dark)',
          fontWeight: 500,
          marginBottom: '14px',
          display: 'inline-block',
          boxShadow: '0 4px 14px rgba(56, 189, 248, 0.16)',
          cursor: 'pointer',
          animation: 'floatSlow 4s ease-in-out infinite',
          maxWidth: '92%',
        }}
      >
        <span>{speechBubble}</span>
      </div>

      {/* Main Character Display Area */}
      {renderMode === 'pixar' ? (
        /* ========================================================
           🌟 4D Pixar Live-Motion Character
           ======================================================== */
        <div
          onClick={handlePetClick}
          style={{
            perspective: '1000px',
            margin: '6px auto 14px',
            cursor: 'pointer',
            display: 'inline-block',
          }}
          title="คลิกเพื่อลูบตัวและทักทายน้อง!"
        >
          {/* Parallax Card Shell */}
          <div
            style={{
              position: 'relative',
              width: '210px',
              height: '210px',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow:
                '0 16px 36px rgba(0, 0, 0, 0.15), 0 0 20px rgba(254, 240, 138, 0.25)',
              border: '3px solid rgba(255, 255, 255, 0.95)',
              transform: `rotateX(${mouseRot.x}deg) rotateY(${mouseRot.y}deg) ${
                isHopping ? 'scale(1.08) translateY(-12px)' : 'scale(1)'
              }`,
              transition: isHopping
                ? 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'transform 0.12s ease-out',
            }}
          >
            {/* Photorealistic Pixar Character Artwork */}
            <img
              src={petInfo.image}
              alt={petInfo.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                animation: 'pulseSoft 4s ease-in-out infinite',
                transform: `scale(1.04) translate(${mouseRot.y * 0.4}px, ${-mouseRot.x * 0.4}px)`,
                transition: 'transform 0.1s ease-out',
              }}
            />

            {/* Volumetric Sunlight Glare Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'radial-gradient(circle at 75% 25%, rgba(254, 240, 138, 0.3) 0%, transparent 60%)',
                pointerEvents: 'none',
              }}
            />

            {/* Pixar 4D Live Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.4px',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <span>4D Live</span>
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#22c55e',
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================
           🧸 Three.js Procedural 3D Clay Toy Mode
           ======================================================== */
        <div style={{ margin: '4px 0 10px' }}>
          <ThreePetCanvas petType={petState.type} size={175} onClick={handlePetClick} />
        </div>
      )}

      {/* Description */}
      <p
        style={{
          fontSize: '0.84rem',
          color: 'var(--text-body)',
          margin: '4px 0 12px',
          lineHeight: 1.45,
          fontWeight: 450,
        }}
      >
        {petInfo.description}
      </p>

      {/* Action to switch or feed */}
      {onGoToPetCare && (
        <button
          onClick={onGoToPetCare}
          className="cozy-btn-secondary"
          style={{ padding: '6px 16px', fontSize: '0.82rem' }}
        >
          🥣 ให้อาหาร & เปลี่ยนสัตว์เลี้ยง
        </button>
      )}
    </div>
  );
};
