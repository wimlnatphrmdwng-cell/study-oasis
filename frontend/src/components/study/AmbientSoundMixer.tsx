import React, { useState } from 'react';
import { CloudRain, Music, Volume2 } from 'lucide-react';
import { audioService } from '../../services/audioService';

export const AmbientSoundMixer: React.FC = () => {
  const [rainActive, setRainActive] = useState(false);
  const [rainVol, setRainVol] = useState(0.25);

  const [lofiActive, setLofiActive] = useState(false);
  const [lofiVol, setLofiVol] = useState(0.18);

  const toggleRain = () => {
    audioService.playPop();
    if (rainActive) {
      audioService.stopRain();
      setRainActive(false);
    } else {
      audioService.startRain(rainVol);
      setRainActive(true);
    }
  };

  const handleRainVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setRainVol(val);
    if (rainActive) {
      audioService.startRain(val);
    }
  };

  const toggleLofi = () => {
    audioService.playPop();
    if (lofiActive) {
      audioService.stopLofi();
      setLofiActive(false);
    } else {
      audioService.startLofi(lofiVol);
      setLofiActive(true);
    }
  };

  const handleLofiVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setLofiVol(val);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        color: 'var(--text-dark)',
        fontWeight: 600,
        fontSize: '1rem',
      }}>
        <Volume2 size={18} color="var(--blue-500)" />
        <span>เสียงบรรยากาศช่วยสมาธิ (Sound Mixer)</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Track 1: Rain */}
        <div className="glass-card" style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <button
            onClick={toggleRain}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: rainActive ? 'var(--blue-600)' : 'var(--text-muted)',
              fontWeight: rainActive ? 600 : 400,
            }}
          >
            <CloudRain size={18} color={rainActive ? 'var(--blue-500)' : 'currentColor'} />
            <span style={{ fontSize: '0.9rem' }}>เสียงฝนตกริมหน้าต่าง</span>
          </button>

          <input
            type="range"
            min="0.05"
            max="0.6"
            step="0.01"
            value={rainVol}
            onChange={handleRainVolChange}
            style={{
              width: '100px',
              accentColor: 'var(--blue-400)',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Track 2: Lo-fi Pad Chords */}
        <div className="glass-card" style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <button
            onClick={toggleLofi}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: lofiActive ? 'var(--blue-600)' : 'var(--text-muted)',
              fontWeight: lofiActive ? 600 : 400,
            }}
          >
            <Music size={18} color={lofiActive ? 'var(--blue-500)' : 'currentColor'} />
            <span style={{ fontSize: '0.9rem' }}>Lo-fi คาลิมบาฮีลใจ</span>
          </button>

          <input
            type="range"
            min="0.05"
            max="0.4"
            step="0.01"
            value={lofiVol}
            onChange={handleLofiVolChange}
            style={{
              width: '100px',
              accentColor: 'var(--blue-400)',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>
    </div>
  );
};
