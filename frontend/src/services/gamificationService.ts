import type { PetState, PetType, CheerNote, DailyQuest, VisionGoal } from '../types/gamification.types';

const STORAGE_KEYS = {
  STARS: 'cloud_oasis_stars',
  PET_STATE: 'cloud_oasis_pet_state',
  CHEER_NOTES: 'cloud_oasis_cheer_notes',
  DAILY_QUESTS: 'cloud_oasis_daily_quests',
  VISION_GOAL: 'cloud_oasis_vision_goal',
};

export const PET_SPECIES = [
  { type: 'gecko' as PetType, name: 'ตุ๊กแกหางอ้วน', defaultNickname: 'น้องกุมิ (Gumi)', emoji: '🦎', description: 'ตัวพาสเทล หางอวบดุ๊กดิ๊ก ตาโตแป๋ว เกาะโต๊ะอ่านหนังสือคอยให้กำลังใจ', favoriteSnack: 'เยลลี่แมลงหวาน 🪲' },
  { type: 'cat' as PetType, name: 'น้องแมวส้ม', defaultNickname: 'โมจิ (Mochi)', emoji: '🐱', description: 'นอนขดตัวบนกองหนังสือ กระดิกหางเบาๆ เมื่อเปิดโหมดอ่านหนังสือ', favoriteSnack: 'ปลาแห้งกรอบ 🐟' },
  { type: 'dog' as PetType, name: 'น้องหมาคอร์กี้', defaultNickname: 'พุดดิ้ง (Pudding)', emoji: '🐶', description: 'สวมแว่นตาขยับหูทักทาย ร่าเริงคอยเชียร์ไม่ให้ง่วง', favoriteSnack: 'บิสกิตกระดูก 🦴' },
  { type: 'rabbit' as PetType, name: 'น้องกระต่ายขาว', defaultNickname: 'สโนวี่ (Snowy)', emoji: '🐰', description: 'แทะแครอท กระโดดดีใจเวลารอบ Pomodoro จบลง', favoriteSnack: 'เบบี้แครอท 🥕' },
  { type: 'squirrel' as PetType, name: 'น้องกระรอกหางฟู', defaultNickname: 'เชสนัท (Chestnut)', emoji: '🐿️', description: 'กอดลูกโอ๊ก มีสมุดโน้ตจิ๋ววางข้างๆ ขยันเก็บชีท', favoriteSnack: 'ลูกโอ๊กทองคำ 🌰' },
  { type: 'turtle' as PetType, name: 'น้องเต่าตัวน้อย', defaultNickname: 'เปโปะ (Pepo)', emoji: '🐢', description: 'สวมหมวกรับปริญญา สื่อถึงความพยายามช้าๆ แต่มั่นคง', favoriteSnack: 'ใบโคลเวอร์ 4 แฉก 🍀' },
];

export const gamificationService = {
  // Stars / Currency
  getStars(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.STARS);
      return val ? parseInt(val, 10) : 50; // Starter stars
    } catch {
      return 50;
    }
  },

  addStars(amount: number): number {
    const updated = this.getStars() + amount;
    try {
      localStorage.setItem(STORAGE_KEYS.STARS, updated.toString());
    } catch {}
    return updated;
  },

  spendStars(amount: number): boolean {
    const current = this.getStars();
    if (current < amount) return false;
    const updated = current - amount;
    try {
      localStorage.setItem(STORAGE_KEYS.STARS, updated.toString());
    } catch {}
    return true;
  },

  // Pet System
  getPetState(): PetState {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PET_STATE);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      type: 'gecko',
      nickname: 'น้องกุมิ (Gumi)',
      level: 1,
      affection: 35,
      lastFedTimestamp: Date.now(),
    };
  },

  savePetState(state: PetState) {
    try {
      localStorage.setItem(STORAGE_KEYS.PET_STATE, JSON.stringify(state));
    } catch {}
  },

  switchPet(type: PetType): PetState {
    const species = PET_SPECIES.find(s => s.type === type);
    const current = this.getPetState();
    const updated: PetState = {
      ...current,
      type,
      nickname: species?.defaultNickname || 'สัตว์เลี้ยงของฉัน',
    };
    this.savePetState(updated);
    return updated;
  },

  feedPet(): { success: boolean; newState: PetState; message: string } {
    const pet = this.getPetState();
    const cost = 15;
    if (!this.spendStars(cost)) {
      return { success: false, newState: pet, message: 'แต้มดาว ⭐ ไม่พอ (ต้องการ 15 ดาว ทำเควสเพื่อรับดาวนะ!)' };
    }

    let nextAffection = pet.affection + 25;
    let nextLevel = pet.level;
    let leveledUp = false;

    if (nextAffection >= 100) {
      nextLevel += 1;
      nextAffection = nextAffection - 100;
      leveledUp = true;
    }

    const updated: PetState = {
      ...pet,
      level: nextLevel,
      affection: nextAffection,
      lastFedTimestamp: Date.now(),
    };
    this.savePetState(updated);

    return {
      success: true,
      newState: updated,
      message: leveledUp
        ? `🎉 ยินดีด้วย! ${updated.nickname} เลเวลอัปเป็น Lv.${updated.level} แล้ว!`
        : `💖 ${updated.nickname} กินอิ่มอร่อยแล้ว ได้รับค่าความสนิท +25%!`
    };
  },

  // Kindness Board
  getCheerNotes(): CheerNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHEER_NOTES);
      if (data) return JSON.parse(data);
    } catch {}
    // Starter community notes
    return [
      { id: '1', senderName: 'เด็กสายวิทย์นอนตีสอง', message: 'ทุกคนที่กำลังอ่านหนังสืออยู่ตอนนี้ สู้ไปด้วยกันนะ เราจะผ่านมิดเทอมนี้ไปให้ได้! 🌟', hearts: 24, timestamp: Date.now() - 3600000 * 2, bgPastel: '#e0f2fe' },
      { id: '2', senderName: 'มนุษย์ชีทสรุปสีพาสเทล', message: 'อย่าลืมดื่มน้ำ พักสายตามองเพดานสัก 1 นาทีนะคนเก่ง สมองต้องการออกซิเจน 🧃', hearts: 18, timestamp: Date.now() - 3600000 * 5, bgPastel: '#fef9c3' },
      { id: '3', senderName: 'นักล่าเกรด A', message: 'จำไว้ว่าเกรดไม่ได้ตัดสินชีวิตทั้งหมด แต่ความพยายามในวันนี้จะทำให้เราภูมิใจแน่นอน 💖', hearts: 31, timestamp: Date.now() - 3600000 * 12, bgPastel: '#fce7f3' },
      { id: '4', senderName: 'เพื่อนร่วมห้องสมุด', message: 'แวะมาส่งกอดให้ทุกคนนะ พรุ่งนี้จะมีแต่เรื่องดีๆ รออยู่ สู้เขา! ☁️✨', hearts: 15, timestamp: Date.now() - 3600000 * 18, bgPastel: '#dcfce7' },
    ];
  },

  addCheerNote(senderName: string, message: string): CheerNote[] {
    const pastels = ['#e0f2fe', '#fef9c3', '#fce7f3', '#dcfce7', '#ede9fe'];
    const newNote: CheerNote = {
      id: Date.now().toString(),
      senderName: senderName.trim() || 'เพื่อนนิรนาม',
      message: message.trim(),
      hearts: 1,
      timestamp: Date.now(),
      bgPastel: pastels[Math.floor(Math.random() * pastels.length)],
      isUserNote: true,
    };
    const current = this.getCheerNotes();
    const updated = [newNote, ...current];
    try {
      localStorage.setItem(STORAGE_KEYS.CHEER_NOTES, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  heartNote(noteId: string): CheerNote[] {
    const current = this.getCheerNotes();
    const updated = current.map(note => note.id === noteId ? { ...note, hearts: note.hearts + 1 } : note);
    try {
      localStorage.setItem(STORAGE_KEYS.CHEER_NOTES, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // Daily Quests
  getDailyQuests(): DailyQuest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_QUESTS);
      if (data) return JSON.parse(data);
    } catch {}
    return [
      { id: 'q1', title: 'โฟกัสอ่านหนังสือครบ 1 รอบ Pomodoro (25 นาที)', rewardStars: 30, progress: 1, maxProgress: 1, completed: true, claimed: false },
      { id: 'q2', title: 'ดื่มน้ำ 2 แก้ว หรือทำ Small Wins ครบ 2 ข้อ', rewardStars: 20, progress: 1, maxProgress: 2, completed: false, claimed: false },
      { id: 'q3', title: 'เขียนหรือกดหัวใจบนกระดานให้กำลังใจเพื่อน 1 ครั้ง', rewardStars: 15, progress: 1, maxProgress: 1, completed: true, claimed: false },
    ];
  },

  claimQuest(questId: string): { success: boolean; quests: DailyQuest[]; starsEarned: number } {
    const current = this.getDailyQuests();
    let earned = 0;
    const updated = current.map(q => {
      if (q.id === questId && q.completed && !q.claimed) {
        earned = q.rewardStars;
        return { ...q, claimed: true };
      }
      return q;
    });

    if (earned > 0) {
      this.addStars(earned);
      try {
        localStorage.setItem(STORAGE_KEYS.DAILY_QUESTS, JSON.stringify(updated));
      } catch {}
      return { success: true, quests: updated, starsEarned: earned };
    }
    return { success: false, quests: current, starsEarned: 0 };
  },

  // Vision Goals
  getVisionGoal(): VisionGoal {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VISION_GOAL);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      mainDream: 'สอบติดคณะที่ฝันไว้ & คว้าเกรดเฉลี่ย 3.50+ 🎓',
      targetDate: 'สิ้นปีการศึกษานี้',
      motivationQuote: 'ความพยายามไม่เคยทรยศคนที่ตั้งใจจริง',
      milestones: [
        { id: 'm1', text: 'ทบทวนวิชาที่ยากที่สุดวันละ 1 บท', done: true },
        { id: 'm2', text: 'ทำข้อสอบย้อนหลัง 5 ปีย้อนหลัง', done: false },
        { id: 'm3', text: 'นอนหลับให้ครบ 7 ชั่วโมงก่อนวันสอบ', done: false },
      ]
    };
  },

  saveVisionGoal(goal: VisionGoal) {
    try {
      localStorage.setItem(STORAGE_KEYS.VISION_GOAL, JSON.stringify(goal));
    } catch {}
  }
};
