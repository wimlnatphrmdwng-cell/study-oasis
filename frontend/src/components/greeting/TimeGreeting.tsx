import React, { useMemo } from 'react';
import { Sun, CloudSun, Sunset, Moon } from 'lucide-react';

export const TimeGreeting: React.FC = () => {
  const greetingInfo = useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return {
        icon: <Sun size={26} color="#eab308" />,
        title: 'อรุณสวัสดิ์นะคนเก่ง ☀️',
        subtitle: 'ตื่นมาเริ่มต้นวันใหม่อย่างสดใส วันนี้ค่อยๆ ทำไปทีละนิด ไม่ต้องเร่งรีบนะ',
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        icon: <CloudSun size={26} color="#0284c7" />,
        title: 'สวัสดีตอนบ่ายนะ 🧃',
        subtitle: 'ช่วงบ่ายสมองอาจจะเริ่มล้า ดื่มน้ำเย็นๆ หรือขยับยืดเส้นยืดสายสักนิดก่อนลุยต่อนะ',
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        icon: <Sunset size={26} color="#f97316" />,
        title: 'ยามเย็นที่แสนสบาย 🌅',
        subtitle: 'วันนี้เธอใช้พลังงานไปเยอะมากแล้วนะ ภูมิใจในความพยายามของตัวเองด้วยล่ะ',
      };
    } else {
      return {
        icon: <Moon size={26} color="#6366f1" />,
        title: 'ดึกแล้วนะ... พักผ่อนบ้างนะ 🌙',
        subtitle: 'อย่ากดดันตัวเองจนดึกเกินไปนะคนดี นอนหลับให้เต็มอิ่ม สมองต้องการพักเพื่อรีชาร์จ',
      };
    }
  }, []);

  return (
    <div style={{
      textAlign: 'center',
      margin: '20px 0 28px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(255, 255, 255, 0.85)',
        padding: '8px 20px',
        borderRadius: 'var(--radius-full)',
        boxShadow: '0 4px 12px rgba(56, 189, 248, 0.15)',
      }}>
        {greetingInfo.icon}
        <h2 style={{
          fontSize: '1.45rem',
          fontWeight: 600,
          color: 'var(--text-dark)',
          margin: 0
        }}>
          {greetingInfo.title}
        </h2>
      </div>
      <p style={{
        fontSize: '0.98rem',
        color: 'var(--text-body)',
        maxWidth: '540px',
        lineHeight: 1.5,
        marginTop: '6px',
        opacity: 0.9,
      }}>
        {greetingInfo.subtitle}
      </p>
    </div>
  );
};
