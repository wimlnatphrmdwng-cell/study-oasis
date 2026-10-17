import React, { useState } from 'react';
import { Sparkles, Heart, Gift } from 'lucide-react';
import { CloudBreathing } from '../components/mindfulness/CloudBreathing';
import { audioService } from '../services/audioService';
import confetti from 'canvas-confetti';

const GASHAPON_REWARDS = [
  { id: '1', title: 'การ์ดเมฆสายรุ้ง 🌈', desc: 'ท้องฟ้าหลังพายุฝนมักงดงามที่สุดเสมอ ขอให้สิ่งดีๆ กำลังเดินทางมาหานะ' },
  { id: '2', title: 'การ์ดดาวนำโชค ⭐', desc: 'การสอบครั้งนี้ ขอให้เธอทำได้เกินกว่าที่คิด ข้อไหนไม่มั่นใจขอให้เดาถูก!' },
  { id: '3', title: 'การ์ดแก้วชานมหวาน 🧃', desc: 'วันนี้อนุญาตให้ตัวเองกินของหวานที่ชอบได้ 1 อย่างเพื่อเติมพลังสมอง' },
  { id: '4', title: 'การ์ดหมอนขนเป็ด 💤', desc: 'สมองเรียนรู้ได้ดีที่สุดตอนเรานอนหลับ คืนนี้อย่านอนดึกเกินไปนะ' },
  { id: '5', title: 'การ์ดต้นกล้าแห่งปัญญา 🌱', desc: 'สิ่งที่เธออ่านในวันนี้ แม้จะจำได้ไม่หมด แต่ได้ฝังลงในความทรงจำแล้วนะ' }
];

export const RelaxPage: React.FC = () => {
  // Anxiety Shredder state
  const [worryText, setWorryText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [released, setReleased] = useState(false);

  // Gashapon state
  const [isSpinning, setIsSpinning] = useState(false);
  const [reward, setReward] = useState<typeof GASHAPON_REWARDS[0] | null>(null);

  // Bubble counter
  const [popCount, setPopCount] = useState(0);

  const handleReleaseWorry = () => {
    if (!worryText.trim()) return;
    setIsReleasing(true);
    audioService.playPop();

    setTimeout(() => {
      audioService.playChime();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#fbcfe8', '#fef08a', '#7dd3fc', '#bbf7d0']
      });
      setIsReleasing(false);
      setReleased(true);
    }, 1200);
  };

  const handleSpinGashapon = () => {
    audioService.playPop();
    setIsSpinning(true);
    setReward(null);

    setTimeout(() => {
      audioService.playChime();
      const random = GASHAPON_REWARDS[Math.floor(Math.random() * GASHAPON_REWARDS.length)];
      setReward(random);
      setIsSpinning(false);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const handlePopFidget = () => {
    audioService.playPop();
    setPopCount(prev => prev + 1);
  };

  return (
    <div style={{
      maxWidth: '960px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
          ลานคลายเครียด & ปลดปล่อยความกังวล 🎈
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: '6px 0 0' }}>
          พื้นที่ทิ้งความเหนื่อยล้า พักผ่อนสมอง และเติมความสดใสให้ตัวเอง
        </p>
      </div>

      {/* Cloud Breathing 4-7-8 Focus Game */}
      <CloudBreathing />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* Module 1: Exam Anxiety Shredder */}
        <div className="glass-panel" style={{ padding: '26px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '50%',
            background: 'rgba(56, 189, 248, 0.2)',
            color: 'var(--blue-600)',
            marginBottom: '12px',
          }}>
            <Sparkles size={26} />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
            ทิ้งความกังวลเรื่องเรียน/สอบ
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
            พิมพ์เรื่องที่ทำให้เธอหนักใจ... แล้วปล่อยลอยไปเปลี่ยนเป็นดอกไม้
          </p>

          {!released ? (
            <div>
              <textarea
                value={worryText}
                onChange={(e) => setWorryText(e.target.value)}
                placeholder="เช่น กลัวสอบตกแคลคูลัส, งานกลุ่มยังไม่เสร็จ, เหนื่อยมาก..."
                rows={3}
                disabled={isReleasing}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(240, 249, 255, 0.7)',
                  border: '1px solid var(--blue-200)',
                  fontSize: '0.9rem',
                  color: 'var(--text-dark)',
                  resize: 'none',
                  marginBottom: '14px',
                }}
              />
              <button
                onClick={handleReleaseWorry}
                disabled={isReleasing || !worryText.trim()}
                className="cozy-btn-primary"
                style={{ width: '100%', padding: '10px' }}
              >
                {isReleasing ? 'กำลังปล่อยลอยไปกับสายลม...' : 'ปล่อยลอยไป 🎈'}
              </button>
            </div>
          ) : (
            <div style={{ padding: '14px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🌸✨</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                เรื่องแย่ๆ ได้ถูกพัดพาไปแล้วนะ
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', margin: '8px 0 16px', lineHeight: 1.5 }}>
                เธอเก่งและมีคุณค่าในตัวเองเสมอ วันนี้ยิ้มให้ตัวเองสักนิดนะ
              </p>
              <button
                onClick={() => {
                  setWorryText('');
                  setReleased(false);
                }}
                className="cozy-btn-secondary"
                style={{ padding: '6px 16px', fontSize: '0.85rem' }}
              >
                <Heart size={14} /> ทิ้งเรื่องอื่นเพิ่ม
              </button>
            </div>
          )}
        </div>

        {/* Module 2: Fortune Gashapon */}
        <div className="glass-panel" style={{ padding: '26px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '50%',
            background: 'rgba(254, 240, 138, 0.4)',
            color: '#d97706',
            marginBottom: '12px',
          }}>
            <Gift size={26} />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
            ตู้กาชาปองการ์ดพลังใจ 🎁
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            กดหมุนรับการ์ดคำอวยพรและกำลังใจประจำวัน
          </p>

          <div style={{
            fontSize: '4.5rem',
            margin: '10px 0',
            animation: isSpinning ? 'floatSlow 0.3s infinite' : 'floatSlow 4s infinite'
          }}>
            {isSpinning ? '🎰' : '🔮'}
          </div>

          <button
            onClick={handleSpinGashapon}
            disabled={isSpinning}
            className="cozy-btn-primary"
            style={{ width: '100%', padding: '10px', marginBottom: '14px' }}
          >
            {isSpinning ? 'กำลังหมุนตู้...' : 'หมุนกาชาปองเลย! ✨'}
          </button>

          {reward && (
            <div className="glass-card" style={{
              padding: '14px 18px',
              textAlign: 'center',
              border: '1.5px solid var(--sun-yellow)',
              background: 'rgba(254, 252, 232, 0.85)'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#b45309', marginBottom: '4px' }}>
                🎉 {reward.title}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: 1.5 }}>
                {reward.desc}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Module 3: Fidget Bubble Popper */}
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
          บับเบิ้ลป๊อปคลายเครียด (Fidget Pop) 🫧
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
          จิ้มฟองสบู่ให้แตกเพื่อบริหารนิ้วและคลายความเมื่อยล้า (จิ้มไปแล้ว <strong>{popCount}</strong> ครั้ง)
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <button
              key={i}
              onClick={handlePopFidget}
              className="glass-card"
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: '0 4px 10px rgba(56, 189, 248, 0.2)',
                background: 'rgba(255, 255, 255, 0.85)',
              }}
            >
              🫧
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
