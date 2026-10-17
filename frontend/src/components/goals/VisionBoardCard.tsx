import React, { useState } from 'react';
import type { VisionGoal } from '../../types/gamification.types';
import { gamificationService } from '../../services/gamificationService';
import { audioService } from '../../services/audioService';
import { Target, CheckCircle2, Circle, Edit3, Save } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VisionBoardCardProps {
  isPinnedBannerOnly?: boolean;
}

export const VisionBoardCard: React.FC<VisionBoardCardProps> = ({ isPinnedBannerOnly }) => {
  const [goal, setGoal] = useState<VisionGoal>(gamificationService.getVisionGoal());
  const [isEditing, setIsEditing] = useState(false);
  const [editDream, setEditDream] = useState(goal.mainDream);

  const handleToggleMilestone = (id: string) => {
    audioService.playPop();
    const updatedMilestones = goal.milestones.map((m) => {
      if (m.id === id) {
        const next = !m.done;
        if (next) {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.6 }
          });
        }
        return { ...m, done: next };
      }
      return m;
    });

    const updated = { ...goal, milestones: updatedMilestones };
    setGoal(updated);
    gamificationService.saveVisionGoal(updated);
  };

  const handleSaveDream = (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playChime();
    const updated = { ...goal, mainDream: editDream.trim() || goal.mainDream };
    setGoal(updated);
    gamificationService.saveVisionGoal(updated);
    setIsEditing(false);
  };

  // If this is rendered as a top pinned banner in Study Page:
  if (isPinnedBannerOnly) {
    return (
      <div className="glass-card" style={{
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.45), rgba(224, 242, 254, 0.7))',
        border: '1px solid rgba(234, 179, 8, 0.35)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} color="#b45309" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#854d0e', textTransform: 'uppercase' }}>
            เป้าหมายของฉัน:
          </span>
          <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-dark)' }}>
            {goal.mainDream}
          </span>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#854d0e', fontStyle: 'italic' }}>
          ✨ สู้เพื่ออนาคตของตัวเองนะ!
        </span>
      </div>
    );
  }

  // Full Vision Board in Journal Page
  return (
    <div className="glass-panel" style={{ padding: '24px', width: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(254, 240, 138, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b45309'
          }}>
            <Target size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
              เป้าหมายของฉัน (My Vision Board) 🎯
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              ระบุเป้าหมายเพื่อสร้างความมุ่งมั่น และเตือนใจในทุกๆ วันที่เริ่มอ่านหนังสือ
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            audioService.playPop();
            setIsEditing(!isEditing);
          }}
          className="cozy-btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
        >
          <Edit3 size={14} />
          <span>{isEditing ? 'ปิดการแก้ไข' : 'แก้ไขเป้าหมาย'}</span>
        </button>
      </div>

      {/* Main Big Dream Banner */}
      {!isEditing ? (
        <div style={{
          padding: '18px 22px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.5), rgba(186, 230, 253, 0.5))',
          border: '1.5px solid rgba(250, 204, 21, 0.4)',
          marginBottom: '20px',
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#854d0e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            🌟 เป้าหมายหลักที่ต้องทำให้ได้
          </span>
          <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-dark)', margin: '6px 0 4px' }}>
            {goal.mainDream}
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            "{goal.motivationQuote}"
          </p>
        </div>
      ) : (
        <form onSubmit={handleSaveDream} style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
            พิมพ์เป้าหมายหลักของเธอ (เช่น คณะ, เกรดเฉลี่ย, การสอบ):
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={editDream}
              onChange={(e) => setEditDream(e.target.value)}
              placeholder="เป้าหมายของฉัน..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--blue-300)',
                background: '#ffffff',
                fontSize: '0.95rem'
              }}
            />
            <button type="submit" className="cozy-btn-primary" style={{ padding: '8px 18px' }}>
              <Save size={16} /> บันทึก
            </button>
          </div>
        </form>
      )}

      {/* Milestones Checklist */}
      <div>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '10px' }}>
          ก้าวสำคัญประจำสัปดาห์ (Weekly Milestones):
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {goal.milestones.map((m) => (
            <div
              key={m.id}
              onClick={() => handleToggleMilestone(m.id)}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                background: m.done ? 'rgba(240, 253, 244, 0.75)' : 'rgba(255, 255, 255, 0.7)',
              }}
            >
              {m.done ? (
                <CheckCircle2 size={18} color="#16a34a" />
              ) : (
                <Circle size={18} color="var(--blue-400)" />
              )}
              <span style={{
                fontSize: '0.9rem',
                color: m.done ? 'var(--text-muted)' : 'var(--text-dark)',
                textDecoration: m.done ? 'line-through' : 'none'
              }}>
                {m.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
