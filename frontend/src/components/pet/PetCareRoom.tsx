import React, { useState } from 'react';
import type { PetState, PetType } from '../../types/gamification.types';
import { gamificationService, PET_SPECIES } from '../../services/gamificationService';
import { audioService } from '../../services/audioService';
import { Heart, Check, Utensils } from 'lucide-react';
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
    const updated = gamificationService.switchPet(type);
    setPet(updated);
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
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fef08a', '#7dd3fc']
      });
      if (onPetUpdated) onPetUpdated();
    }
    setTimeout(() => setFeedMessage(null), 3500);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', width: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(254, 240, 138, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
          }}>
            🐾
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
              ห้องเลี้ยงสัตว์และเพื่อนคู่ใจ 🏠
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              เลือกเพื่อนร่วมอ่านหนังสือที่ชอบ และนำแต้มดาวมาให้อาหารเพิ่มความสนิท
            </p>
          </div>
        </div>

        {/* Star Wallet */}
        <div className="glass-card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(254, 240, 138, 0.6)',
          border: '1px solid #facc15',
          color: '#854d0e',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <span>⭐ ดาวสะสม: {stars}</span>
        </div>
      </div>

      {/* Current Pet Showcase */}
      <div className="glass-card" style={{
        padding: '20px',
        marginBottom: '22px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        background: 'rgba(255, 255, 255, 0.85)'
      }}>
        <div style={{
          width: '110px',
          height: '110px',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0,0,0,0.12), 0 0 15px rgba(254, 240, 138, 0.4)',
          border: '2.5px solid #ffffff',
          position: 'relative',
        }}>
          <img
            src={activeSpecies.image}
            alt={activeSpecies.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
              {pet.nickname} ({activeSpecies.name})
            </h4>
            <span style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--blue-100)',
              color: 'var(--blue-600)',
              fontWeight: 600
            }}>
              Lv.{pet.level}
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 10px' }}>
            ขนมโปรด: <strong>{activeSpecies.favoriteSnack}</strong>
          </p>

          {/* Affection Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#e11d48', fontWeight: 600, marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Heart size={13} fill="#e11d48" /> ความสนิทสนม
              </span>
              <span>{pet.affection} / 100%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(244, 114, 182, 0.2)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${pet.affection}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #f472b6, #e11d48)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Feed Button */}
        <div>
          <button
            onClick={handleFeed}
            className="cozy-btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <Utensils size={15} />
            <span>ป้อนขนม (-15 ⭐)</span>
          </button>
        </div>
      </div>

      {feedMessage && (
        <div style={{
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(240, 253, 244, 0.9)',
          border: '1px solid #86efac',
          color: '#166534',
          fontSize: '0.88rem',
          textAlign: 'center',
          marginBottom: '16px',
          animation: 'floatSlow 3s ease-in-out infinite'
        }}>
          {feedMessage}
        </div>
      )}

      {/* Species Selector Grid (6 Animals) */}
      <div>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '12px' }}>
          เลือกสัตว์เลี้ยงที่อยากให้มานั่งข้างๆ (6 ชนิด):
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
          gap: '12px'
        }}>
          {PET_SPECIES.map((s) => {
            const isSelected = pet.type === s.type;
            return (
              <div
                key={s.type}
                onClick={() => handleSelectSpecies(s.type)}
                className="glass-card"
                style={{
                  padding: '14px 10px',
                  borderRadius: '14px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--blue-400)' : '1px solid rgba(255, 255, 255, 0.7)',
                  background: isSelected ? 'rgba(224, 242, 254, 0.7)' : 'rgba(255, 255, 255, 0.65)',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  margin: '0 auto 6px',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
                  border: '1.5px solid #ffffff'
                }}>
                  <img
                    src={s.image}
                    alt={s.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                  {s.name}
                </div>
                {isSelected && (
                  <div style={{
                    marginTop: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '0.72rem',
                    color: 'var(--blue-600)',
                    fontWeight: 600
                  }}>
                    <Check size={12} /> เลี้ยงตัวนี้อยู่
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
