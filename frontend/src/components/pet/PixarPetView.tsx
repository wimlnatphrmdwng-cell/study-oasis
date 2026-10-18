import React, { useState, useEffect } from 'react';
import type { PetState } from '../../types/gamification.types';
import { gamificationService, PET_SPECIES } from '../../services/gamificationService';
import { audioService } from '../../services/audioService';
import { ThreePetSanctuary } from './ThreePetSanctuary';
import { Utensils } from 'lucide-react';

interface PixarPetViewProps {
  onGoToPetCare?: () => void;
}

export const PixarPetView: React.FC<PixarPetViewProps> = ({ onGoToPetCare }) => {
  const [petState, setPetState] = useState<PetState>(gamificationService.getPetState());
  const petInfo = PET_SPECIES.find((s) => s.type === petState.type) || PET_SPECIES[0];

  useEffect(() => {
    const handleUpdate = () => {
      setPetState(gamificationService.getPetState());
    };
    window.addEventListener('focus', handleUpdate);
    window.addEventListener('pet-updated', handleUpdate);
    return () => {
      window.removeEventListener('focus', handleUpdate);
      window.removeEventListener('pet-updated', handleUpdate);
    };
  }, []);

  const handleFeed = () => {
    audioService.playChime();
    const result = gamificationService.feedPet();
    if (result.success) {
      setPetState(result.newState);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px',
        textAlign: 'center',
        position: 'relative',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* 3D Living Sanctuary Viewport */}
      <ThreePetSanctuary
        petType={petState.type}
        petNickname={petState.nickname}
        level={petState.level}
        affection={petState.affection}
        favoriteSnack={petInfo.favoriteSnack}
        isStudying={true}
        onFeed={handleFeed}
        height={330}
        compact={true}
      />

      {/* Description & Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', padding: '0 4px' }}>
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            margin: 0,
            textAlign: 'left',
            flex: 1,
            minWidth: '180px',
          }}
        >
          🐾 <strong>{petInfo.name}:</strong> {petInfo.description}
        </p>

        {onGoToPetCare && (
          <button
            onClick={onGoToPetCare}
            className="cozy-btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Utensils size={13} />
            <span>เข้าห้องดูแล & สลับสัตว์เลี้ยง</span>
          </button>
        )}
      </div>
    </div>
  );
};

