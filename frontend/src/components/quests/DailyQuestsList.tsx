import React, { useState } from 'react';
import type { DailyQuest } from '../../types/gamification.types';
import { gamificationService } from '../../services/gamificationService';
import { audioService } from '../../services/audioService';
import { CheckCircle2, Gift, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyQuestsListProps {
  onQuestsUpdated?: () => void;
}

export const DailyQuestsList: React.FC<DailyQuestsListProps> = ({ onQuestsUpdated }) => {
  const [quests, setQuests] = useState<DailyQuest[]>(gamificationService.getDailyQuests());
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  const handleClaim = (questId: string) => {
    audioService.playChime();
    const result = gamificationService.claimQuest(questId);
    if (result.success) {
      setQuests(result.quests);
      setClaimMessage(`ได้รับ ⭐ +${result.starsEarned} ดาวเรียบร้อยแล้ว!`);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#facc15', '#fef08a', '#7dd3fc']
      });
      if (onQuestsUpdated) onQuestsUpdated();
      setTimeout(() => setClaimMessage(null), 3000);
    }
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
        marginBottom: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(254, 240, 138, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b45309'
          }}>
            <Award size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
              ภารกิจเควสรายวัน (Daily Quests) 📜
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              ทำภารกิจง่ายๆ แต่ละวันเพื่อสะสมดาว ⭐ ไว้ให้อาหารสัตว์เลี้ยง
            </p>
          </div>
        </div>

        <div style={{
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.7)',
          border: '1px solid var(--blue-200)'
        }}>
          รีเฟรชทุก 00:00 น.
        </div>
      </div>

      {claimMessage && (
        <div style={{
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(254, 252, 232, 0.9)',
          border: '1px solid #facc15',
          color: '#854d0e',
          fontSize: '0.86rem',
          textAlign: 'center',
          marginBottom: '14px',
          fontWeight: 600
        }}>
          {claimMessage}
        </div>
      )}

      {/* Quests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {quests.map((q) => {
          const isDone = q.progress >= q.maxProgress;
          return (
            <div
              key={q.id}
              className="glass-card"
              style={{
                padding: '12px 18px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                background: q.claimed
                  ? 'rgba(241, 245, 249, 0.6)'
                  : isDone
                  ? 'rgba(254, 252, 232, 0.8)'
                  : 'rgba(255, 255, 255, 0.7)',
                border: isDone && !q.claimed ? '1.5px solid #facc15' : '1px solid rgba(255, 255, 255, 0.7)'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    color: q.claimed ? 'var(--text-muted)' : 'var(--text-dark)',
                    textDecoration: q.claimed ? 'line-through' : 'none'
                  }}>
                    {q.title}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px'
                }}>
                  <span>รางวัล: <strong>⭐ {q.rewardStars} ดาว</strong></span>
                  <span>•</span>
                  <span>ความคืบหน้า: {q.progress} / {q.maxProgress}</span>
                </div>
              </div>

              {/* Claim Action */}
              <div>
                {q.claimed ? (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    color: '#16a34a',
                    fontWeight: 500
                  }}>
                    <CheckCircle2 size={15} /> รับแล้ว
                  </span>
                ) : isDone ? (
                  <button
                    onClick={() => handleClaim(q.id)}
                    className="cozy-btn-primary"
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.82rem',
                      background: 'linear-gradient(135deg, #eab308, #ca8a04)'
                    }}
                  >
                    <Gift size={14} />
                    <span>รับดาว ⭐</span>
                  </button>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    กำลังทำ...
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
