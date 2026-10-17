import type { ChatMessage, ChatRequestPayload, ChatResponsePayload } from '../types/chat.types';

const API_BASE_URL = 'http://localhost:8000';

export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<{ reply: string; isLiveBackend: boolean }> {
  const systemInstruction = 
    "คุณคือน้องเมฆ (Nong Cloud) บัดดี้อ่านหนังสือและผู้ช่วยใจดีของนักเรียน/นักศึกษา " +
    "หน้าที่ของคุณคือให้กำลังใจอย่างอบอุ่น รับฟังเวลาเครียดเรื่องสอบ ปลอบใจเวลาหมดไฟ ไม่ตัดสินเรื่องเกรด " +
    "ตอบสั้น กระชับ ใช้ภาษาวัยรุ่นสุภาพ น่ารัก และมีอีโมจิฟรุ้งฟริ้ง เช่น ☁️✨🌱";

  const payload: ChatRequestPayload = {
    message,
    history,
    system_instruction: systemInstruction,
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 600
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Server Error' }));
      throw new Error(err.detail || `HTTP Error ${response.status}`);
    }

    const data: ChatResponsePayload = await response.json();
    return {
      reply: data.reply,
      isLiveBackend: true,
    };
  } catch (error) {
    console.warn('Backend API not reachable or timeout, using cozy offline companion:', error);
    
    // Cozy fallback messages if FastAPI server isn't running yet
    const fallbackResponses = [
      "น้องเมฆได้ยินแล้วนะ! คนเก่งเหนื่อยมากเลยใช่ไหม... พักจิบน้ำเย็นๆ สักแก้วก่อนนะ เกรดหรือการบ้านไม่ได้กำหนดความสุขทั้งหมดของเธอนะคนดี ☁️🤍",
      "กอดแน่นๆ เลยนะ! ไม่เป็นไรเลยที่จะรู้สึกหมดไฟบ้าง การพักผ่อนก็คืองานที่สำคัญอย่างหนึ่ง หลับตาสัก 5 นาทีแล้วค่อยมาสู้ใหม่นะ ✨",
      "เธอเก่งมากแล้วที่พยายามมาถึงจุดนี้! วันนี้ทำได้แค่นี้ก็นับว่ายอดเยี่ยมแล้ว อย่าลืมชมตัวเองบ้างนะ น้องเมฆคอยเอาใจช่วยเสมอ 🌱",
      "หายใจเข้าลึกๆ นะ... เรื่องที่เครียดอยู่เดี๋ยวมันก็ผ่านไป เหมือนก้อนเมฆที่พัดผ่านท้องฟ้า เธอไม่ได้อยู่คนเดียวนะ น้องเมฆนั่งอยู่ตรงนี้ด้วยเสมอ ☕🌈"
    ];

    const randomReply = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return {
      reply: `${randomReply}\n\n*(หมายเหตุ: เชื่อมต่อผ่านโหมดสำรอง หากต้องการใช้ OpenAI เต็มรูปแบบ กรุณารัน \`python main.py\` ที่พอร์ต 8000 นะครับ)*`,
      isLiveBackend: false,
    };
  }
}
