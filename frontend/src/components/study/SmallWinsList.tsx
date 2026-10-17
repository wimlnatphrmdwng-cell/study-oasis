import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Sparkles } from 'lucide-react';
import type { SmallWinItem } from '../../types/study.types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';
import confetti from 'canvas-confetti';

export const SmallWinsList: React.FC = () => {
  const [wins, setWins] = useState<SmallWinItem[]>(storageService.getSmallWins());
  const [newText, setNewText] = useState('');

  const toggleWin = (id: string) => {
    audioService.playPop();
    const updated = wins.map((item) => {
      if (item.id === id) {
        const nextState = !item.completed;
        if (nextState) {
          confetti({
            particleCount: 40,
            spread: 45,
            origin: { y: 0.7 },
            colors: ['#7dd3fc', '#fef08a', '#bbf7d0']
          });
        }
        return { ...item, completed: nextState };
      }
      return item;
    });
    setWins(updated);
    storageService.saveSmallWins(updated);
  };

  const addWin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    audioService.playPop();

    const newItem: SmallWinItem = {
      id: Date.now().toString(),
      text: newText.trim(),
      completed: false,
      timestamp: Date.now()
    };
    const updated = [...wins, newItem];
    setWins(updated);
    storageService.saveSmallWins(updated);
    setNewText('');
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-dark)',
          fontWeight: 600,
          fontSize: '1rem',
        }}>
          <Sparkles size={18} color="#f59e0b" />
          <span>Small Wins วันนี้ (ทำนิดเดียวก็เก่งแล้ว)</span>
        </div>
      </div>

      {/* Wins List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {wins.map((win) => (
          <div
            key={win.id}
            onClick={() => toggleWin(win.id)}
            className="glass-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              cursor: 'pointer',
              background: win.completed ? 'rgba(240, 253, 244, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            }}
          >
            {win.completed ? (
              <CheckCircle2 size={18} color="#16a34a" />
            ) : (
              <Circle size={18} color="var(--blue-400)" />
            )}
            <span style={{
              fontSize: '0.92rem',
              color: win.completed ? 'var(--text-muted)' : 'var(--text-dark)',
              textDecoration: win.completed ? 'line-through' : 'none',
              transition: 'all 0.2s ease',
            }}>
              {win.text}
            </span>
          </div>
        ))}
      </div>

      {/* Add New Small Win Form */}
      <form onSubmit={addWin} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="เพิ่มเป้าหมายเล็กๆ วันนี้..."
          style={{
            flex: 1,
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid var(--blue-200)',
            fontSize: '0.88rem',
            color: 'var(--text-dark)'
          }}
        />
        <button
          type="submit"
          className="cozy-btn-primary"
          style={{ padding: '8px 14px', borderRadius: 'var(--radius-full)' }}
        >
          <Plus size={16} />
        </button>
      </form>
    </div>
  );
};
