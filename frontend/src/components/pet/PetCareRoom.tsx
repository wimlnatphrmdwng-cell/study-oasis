import React, { useState } from 'react';
import type { PetState, PetType } from '../../types/gamification.types';
import { gamificationService, PET_SPECIES } from '../../services/gamificationService';
import { audioService } from '../../services/audioService';
import { ThreePetSanctuary } from './ThreePetSanctuary';
import { Heart, Check, Utensils, Sparkles, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PetCareRoomProps {
  onPetUpdated?: () => void;
}

export const PetCareRoom: React.FC<PetCareRoomProps> = ({ onPetUpdated }) => {
  const [pet, setPet] = useState<PetState>(gamificationService.getPetState());
  const [stars, setStars] = useState<number>(gamificationService.getStars());
  const [feedMessage, setFeedMessage] = useState<string | null>(null);

  const activeSpecies = PET_SPECIES.find(s => s.type === pet.type) || PET_SPECIES[0];

  const handleSelectSpecies = (type: PetType) => {
    audioService.playPop();
    audioService.playPetVoice(type);
    const updated = gamificationService.switchPet(type);
    setPet(updated);
    window.dispatchEvent(new Event('pet-updated'));
    if (onPetUpdated) onPetUpdated();
  };

  const handleFeed = () => {
    audioService.playChime();
    const result = gamificationService.feedPet();
    setFeedMessage(result.message);
    if (result.success) {
      setPet(result.newState);
      setStars(gamificationService.getStars());
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.55 },
        colors: ['#f472b6', '#fef08a', '#38bdf8', '#4ade80']
      });
      window.dispatchEvent(new Event('pet-updated'));
      if (onPetUpdated) onPetUpdated();
    }
    setTimeout(() => setFeedMessage(null), 4000);
  };

  // Species personality metadata for immersive realism
  const SPECIES_PERSONALITY: Record<PetType, { trait: string; benefit: string; quote: string }> = {
    cat: {
      trait: 'ขี้อ้อน & ผ่อนคลาย',
      benefit: 'ลดความเครียดขณะอ่านหนังสือ ช่วยให้สมองคลายกังวล',
      quote: 'เมี๊ยว~ อ่านเหนื่อยแล้วมาลูบพุงเค้าได้นะ 🐱'
    },
    gecko: {
      trait: 'นิ่งสงบ & โฟกัสลึก',
      benefit: 'เพิ่มสมาธิในการอ่านเนื้อหายากๆ ไม่ว่อกแว่ก',
      quote: 'หางอวบนุ่มเก็บความตั้งใจไว้ให้เธอเพียบเลย! 🦎'
    },
    dog: {
      trait: 'ร่าเริง & เติมไฟใจ',
      benefit: 'ปลุกพลังความกระตือรือร้น สู้กับความง่วง',
      quote: 'โฮ่ง! วิ่งไปด้วยกันสู่เป้าหมายของเธอนะคนเก่ง! 🐶'
    },
    rabbit: {
      trait: 'ละเอียด & ขยันจดบันทึก',
      benefit: 'ช่วยสร้างระเบียบในการจัดตารางเวลาและสรุปชีท',
      quote: 'ดุ๊กดิ๊กๆ เปิดสมุดทบทวนไปพร้อมกันนะ 🐰'
    },
    squirrel: {
      trait: 'ว่องไว & สะสมแต้มเก่ง',
      benefit: 'กระตุ้นให้พิชิตโจทย์ทีละข้ออย่างเพลิดเพลิน',
      quote: 'สะบัดหางฟูๆ ปัดความเหนื่อยล้าทิ้งไปเลย! 🐿️'
    },
    turtle: {
      trait: 'หนักแน่น & ไม่ยอมแพ้',
      benefit: 'ย้ำเตือนว่าค่อยๆ ไปทีละก้าว ย่อมถึงเส้นชัย',
      quote: 'ช้าแต่มั่นคง คือกุญแจสำคัญของความสำเร็จ 🐢'
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%' }}>
      {/* Header & Star Currency */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.6), rgba(253, 186, 116, 0.4))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            boxShadow: '0 4px 12px rgba(250, 204, 21, 0.25)'
          }}>
            🏡
          </div>
          <div>
            <h3 style={{ fontSize: '1.28rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
              ห้องเลี้ยงสัตว์เสมือนจริง 3D & เพื่อนคู่ใจ 🐾
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
              สัมผัสเพื่อนร่วมโต๊ะอ่านหนังสือแบบ 3 มิติ มีชีวิตจริง หันมองตามเมาส์ ลูบหัวได้ และกินขนมตกจากฟ้าได้จริง!
            </p>
          </div>
        </div>

        {/* Star Wallet */}
        <div className="glass-card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(254, 240, 138, 0.7)',
          border: '1.5px solid #facc15',
          color: '#854d0e',
          fontWeight: 700,
          fontSize: '0.92rem',
          boxShadow: '0 4px 14px rgba(234, 179, 8, 0.2)'
        }}>
          <span>⭐ ดาวสะสม: {stars} ดวง</span>
        </div>
      </div>

      {/* ========================================================
          🌟 MAIN LIVING 3D VIRTUAL SANCTUARY (NO MORE FLAT CARDS!)
          ======================================================== */}
      <ThreePetSanctuary
        petType={pet.type}
        petNickname={pet.nickname}
        level={pet.level}
        affection={pet.affection}
        favoriteSnack={activeSpecies.favoriteSnack}
        onFeed={handleFeed}
        height={420}
        compact={false}
      />

      {/* Feed Feedback Banner */}
      {feedMessage && (
        <div style={{
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(240, 253, 244, 0.95)',
          border: '1.5px solid #86efac',
          color: '#166534',
          fontSize: '0.92rem',
          fontWeight: 600,
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(34, 197, 94, 0.15)',
          animation: 'floatSlow 3s ease-in-out infinite'
        }}>
          {feedMessage}
        </div>
      )}

      {/* Companion Realism Stats & Care Dashboard */}
      <div className="glass-panel" style={{ padding: '22px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          alignItems: 'center'
        }}>
          {/* Personality Card */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.4rem' }}>{activeSpecies.emoji}</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                {pet.nickname} ({activeSpecies.name})
              </h4>
              <span style={{
                fontSize: '0.78rem',
                padding: '2px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--blue-100)',
                color: 'var(--blue-600)',
                fontWeight: 700
              }}>
                Lv.{pet.level}
              </span>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(254, 240, 138, 0.5)',
              color: '#854d0e',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '10px'
            }}>
              <Compass size={13} />
              <span>ลักษณะเด่น: {SPECIES_PERSONALITY[pet.type].trait}</span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-body)', margin: '0 0 6px', lineHeight: 1.5 }}>
              ✨ <strong>พลังช่วยเรียน:</strong> {SPECIES_PERSONALITY[pet.type].benefit}
            </p>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
              "{SPECIES_PERSONALITY[pet.type].quote}"
            </p>
          </div>

          {/* Affection & Snack Requirement */}
          <div className="glass-card" style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.75)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#e11d48', fontWeight: 700, marginBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Heart size={15} fill="#e11d48" /> ความสนิทสนม
              </span>
              <span>{pet.affection} / 100%</span>
            </div>
            <div style={{
              width: '100%',
              height: '10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(244, 114, 182, 0.25)',
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              <div style={{
                width: `${pet.affection}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #f472b6, #e11d48)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease'
              }} />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.84rem',
              color: 'var(--text-dark)'
            }}>
              <span>ขนมโปรด: <strong>{activeSpecies.favoriteSnack}</strong></span>
              <button
                onClick={handleFeed}
                className="cozy-btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Utensils size={14} />
                <span>ป้อนขนม (-15 ⭐)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          🐾 3D CHARACTER SELECTOR PEDESTALS (6 ANIMALS)
          ======================================================== */}
      <div className="glass-panel" style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={18} color="#0284c7" />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
            เลือกเพื่อนสัตว์เลี้ยง 3D มาประจำห้องอ่านหนังสือ (6 ชนิด):
          </h4>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '14px'
        }}>
          {PET_SPECIES.map((s) => {
            const isSelected = pet.type === s.type;
            const personality = SPECIES_PERSONALITY[s.type];
            return (
              <div
                key={s.type}
                onClick={() => handleSelectSpecies(s.type)}
                className="glass-card"
                style={{
                  padding: '16px 14px',
                  borderRadius: '18px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  border: isSelected ? '2.5px solid var(--blue-500)' : '1px solid rgba(255, 255, 255, 0.8)',
                  background: isSelected
                    ? 'linear-gradient(180deg, rgba(224, 242, 254, 0.9) 0%, rgba(186, 230, 253, 0.5) 100%)'
                    : 'rgba(255, 255, 255, 0.75)',
                  transform: isSelected ? 'translateY(-4px)' : 'none',
                  boxShadow: isSelected
                    ? '0 10px 24px rgba(14, 165, 233, 0.28), 0 0 12px rgba(186, 230, 253, 0.6)'
                    : '0 4px 12px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {/* 3D Animal Emoji Badge */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  background: isSelected ? 'rgba(255, 255, 255, 0.9)' : 'rgba(240, 249, 255, 0.6)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  border: '1.5px solid #ffffff'
                }}>
                  {s.emoji}
                </div>

                {/* Name */}
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '3px' }}>
                  {s.name}
                </div>

                {/* Trait Tag */}
                <div style={{
                  fontSize: '0.74rem',
                  color: isSelected ? 'var(--blue-700)' : 'var(--text-muted)',
                  fontWeight: 600,
                  marginBottom: '8px'
                }}>
                  {personality.trait}
                </div>

                {/* Favorite Snack Tag */}
                <div style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-body)',
                  background: 'rgba(255, 255, 255, 0.7)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '8px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {s.favoriteSnack}
                </div>

                {/* Selection Status */}
                {isSelected ? (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: '#0284c7',
                    fontWeight: 700,
                    background: '#e0f2fe',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    <Check size={13} /> กำลังเลี้ยงอยู่ 3D
                  </div>
                ) : (
                  <div style={{
                    fontSize: '0.74rem',
                    color: 'var(--text-muted)',
                    fontWeight: 500
                  }}>
                    แตะเพื่อสลับ 3D
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
