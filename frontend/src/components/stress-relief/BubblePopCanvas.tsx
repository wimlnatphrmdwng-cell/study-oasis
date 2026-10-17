import React, { useState, useEffect } from 'react';
import { audioService } from '../../services/audioService';

interface Bubble {
  id: number;
  x: number;
  size: number;
  speed: number;
  popped: boolean;
}

export const BubblePopCanvas: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate gentle bubbles periodically
    const interval = setInterval(() => {
      setBubbles((prev) => {
        if (prev.length > 10) return prev; // max 10 bubbles at a time
        const newBubble: Bubble = {
          id: Date.now() + Math.random(),
          x: Math.random() * 85 + 5, // percentage across screen
          size: Math.random() * 26 + 32, // 32px to 58px
          speed: Math.random() * 12 + 16, // duration in seconds
          popped: false,
        };
        return [...prev, newBubble];
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const popBubble = (id: number) => {
    audioService.playPop();
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 2,
      overflow: 'hidden',
    }}>
      {bubbles.map((b) => {
        if (b.popped) return null;
        return (
          <div
            key={b.id}
            onClick={() => popBubble(b.id)}
            style={{
              position: 'absolute',
              left: `${b.x}%`,
              bottom: '-60px',
              width: `${b.size}px`,
              height: `${b.size}px`,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.95), rgba(186, 230, 253, 0.45) 60%, rgba(125, 211, 252, 0.3) 100%)',
              boxShadow: '0 4px 15px rgba(56, 189, 248, 0.25), inset 0 0 10px rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              pointerEvents: 'auto',
              animation: `bubbleFloatUp ${b.speed}s linear forwards`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
            }}
            title="จิ้มให้แตกคลายเครียด!"
          >
            <div style={{
              width: '25%',
              height: '25%',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              position: 'absolute',
              top: '18%',
              left: '20%',
            }} />
          </div>
        );
      })}
    </div>
  );
};
