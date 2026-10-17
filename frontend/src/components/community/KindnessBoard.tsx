import React, { useState } from 'react';
import type { CheerNote } from '../../types/gamification.types';
import { gamificationService } from '../../services/gamificationService';
import { audioService } from '../../services/audioService';
import { Heart, Send, Plus, MessageSquareHeart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const KindnessBoard: React.FC = () => {
  const [notes, setNotes] = useState<CheerNote[]>(gamificationService.getCheerNotes());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');

  const randomAliases = [
    'เด็กสายวิทย์นอนตีสอง',
    'มนุษย์ชีทสรุปสีพาสเทล',
    'นักเรียนเตรียมสอบนอนเช้า',
    'เพื่อนร่วมท้องฟ้า',
    'เด็กหลังห้องหัวใจสู้',
    'คนเก่งของวันพรุ่งนี้'
  ];

  const handleHeart = (id: string) => {
    audioService.playPop();
    const updated = gamificationService.heartNote(id);
    setNotes(updated);
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#f472b6', '#fbcfe8', '#fef08a']
    });
  };

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    audioService.playChime();
    const finalName = senderName.trim() || randomAliases[Math.floor(Math.random() * randomAliases.length)];
    const updated = gamificationService.addCheerNote(finalName, message.trim());
    setNotes(updated);
    setIsModalOpen(false);
    setMessage('');
    setSenderName('');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#7dd3fc', '#bae6fd', '#fef08a', '#fbcfe8']
    });
  };

  const setRandomAlias = () => {
    audioService.playPop();
    const alias = randomAliases[Math.floor(Math.random() * randomAliases.length)];
    setSenderName(alias);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', width: '100%', position: 'relative' }}>
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
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(251, 207, 232, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#be185d'
          }}>
            <MessageSquareHeart size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
              กระดานส่งกำลังใจจากเพื่อนๆ 💌
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              โน้ตฮีลใจแบบไม่ระบุชื่อ จากเพื่อนๆ ที่กำลังตั้งใจอ่านหนังสือสอบเหมือนกัน
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            audioService.playPop();
            setIsModalOpen(true);
          }}
          className="cozy-btn-primary"
          style={{ padding: '8px 18px', fontSize: '0.88rem' }}
        >
          <Plus size={16} />
          <span>เขียนโน้ตให้เพื่อน</span>
        </button>
      </div>

      {/* Sticky Notes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
      }}>
        {notes.map((note, index) => {
          const rotation = index % 3 === 0 ? '-1deg' : index % 3 === 1 ? '1.5deg' : '-0.5deg';
          return (
            <div
              key={note.id}
              style={{
                background: note.bgPastel,
                padding: '18px',
                borderRadius: '14px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                position: 'relative',
                transform: `rotate(${rotation})`,
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03) rotate(0deg)';
                e.currentTarget.style.zIndex = '5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotate(${rotation})`;
                e.currentTarget.style.zIndex = '1';
              }}
            >
              {/* Tape Accent */}
              <div style={{
                position: 'absolute',
                top: '-7px',
                left: '40%',
                width: '32px',
                height: '14px',
                background: 'rgba(254, 240, 138, 0.7)',
                border: '0.5px dashed rgba(0, 0, 0, 0.15)',
                borderRadius: '2px',
              }} />

              {/* Message */}
              <p style={{
                fontSize: '0.92rem',
                color: '#1e293b',
                lineHeight: 1.55,
                margin: '6px 0 14px',
                fontWeight: 450,
              }}>
                "{note.message}"
              </p>

              {/* Note Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: '#64748b',
                borderTop: '1px dashed rgba(0, 0, 0, 0.1)',
                paddingTop: '8px',
              }}>
                <span style={{ fontWeight: 500 }}>✍️ {note.senderName}</span>

                <button
                  onClick={() => handleHeart(note.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: '#e11d48',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
                  }}
                  title="ส่งหัวใจให้กำลังใจ"
                >
                  <Heart size={14} fill="#e11d48" />
                  <span>{note.hearts}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Creating Note */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '460px',
            width: '100%',
            padding: '26px',
            background: 'rgba(255, 255, 255, 0.95)',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
              เขียนโน้ตส่งกำลังใจให้เพื่อน 💌
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              พิมพ์คำพูดน่ารักๆ หรือคำเตือนใจสั้นๆ ให้เพื่อนที่กำลังเหนื่อยกับการอ่านหนังสือ
            </p>

            <form onSubmit={handlePostNote}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  นามสมมุติ (หรือกดสุ่มชื่อน่ารักๆ)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="เช่น นักเรียนเตรียมสอบ..."
                    maxLength={30}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--blue-200)',
                      background: '#ffffff',
                      fontSize: '0.88rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={setRandomAlias}
                    className="cozy-btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    🎲 สุ่มชื่อ
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  ข้อความให้กำลังใจ (ไม่เกิน 120 ตัวอักษร)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="สู้ๆ นะทุกคน วันนี้ทำได้แค่ไหนก็เก่งมากแล้ว พักผ่อนด้วยนะ..."
                  maxLength={120}
                  rows={3}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--blue-200)',
                    background: '#ffffff',
                    fontSize: '0.9rem',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cozy-btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="cozy-btn-primary"
                  style={{ padding: '8px 20px' }}
                >
                  <Send size={15} /> โพสต์โน้ตเลย
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
