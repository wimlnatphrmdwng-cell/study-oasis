import React from 'react';

export const SkyBackground: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      background: 'var(--sky-bg-gradient)',
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {/* Soft Sunlight Orb */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '15%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(254, 240, 138, 0.45) 0%, rgba(254, 240, 138, 0) 70%)',
        filter: 'blur(30px)',
      }} />

      {/* Floating Cloud 1 */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '5%',
        width: '260px',
        height: '80px',
        borderRadius: '100px',
        background: 'rgba(255, 255, 255, 0.65)',
        filter: 'blur(10px)',
        animation: 'cloudDrift1 22s ease-in-out infinite',
      }} />

      {/* Floating Cloud 2 */}
      <div style={{
        position: 'absolute',
        top: '28%',
        right: '8%',
        width: '320px',
        height: '95px',
        borderRadius: '100px',
        background: 'rgba(255, 255, 255, 0.55)',
        filter: 'blur(14px)',
        animation: 'cloudDrift2 26s ease-in-out infinite',
      }} />

      {/* Floating Cloud 3 - Lower Sky */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '18%',
        width: '380px',
        height: '110px',
        borderRadius: '100px',
        background: 'rgba(255, 255, 255, 0.7)',
        filter: 'blur(12px)',
        animation: 'cloudDrift1 30s ease-in-out infinite reverse',
      }} />
    </div>
  );
};
