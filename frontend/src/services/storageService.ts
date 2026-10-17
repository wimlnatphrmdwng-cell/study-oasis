import type { SmallWinItem } from '../types/study.types';

const STORAGE_KEYS = {
  SMALL_WINS: 'cloud_oasis_small_wins',
  POMODORO_COUNT: 'cloud_oasis_pomo_count',
  SAVED_QUOTES: 'cloud_oasis_saved_quotes',
};

export const storageService = {
  getSmallWins(): SmallWinItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SMALL_WINS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    // Default initial starter wins
    return [
      { id: '1', text: 'อ่านหนังสือหรือชีท 1 หน้า 📖', completed: false, timestamp: Date.now() },
      { id: '2', text: 'ดื่มน้ำเปล่า 1 แก้วเต็มๆ 💧', completed: false, timestamp: Date.now() },
      { id: '3', text: 'ยืดเหยียดกล้ามเนื้อ 3 นาที 🧘', completed: false, timestamp: Date.now() },
    ];
  },

  saveSmallWins(items: SmallWinItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.SMALL_WINS, JSON.stringify(items));
    } catch {
      // ignore
    }
  },

  getCompletedPomodoros(): number {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.POMODORO_COUNT) || '0', 10);
    } catch {
      return 0;
    }
  },

  incrementPomodoro(): number {
    const current = this.getCompletedPomodoros() + 1;
    try {
      localStorage.setItem(STORAGE_KEYS.POMODORO_COUNT, current.toString());
    } catch {
      // ignore
    }
    return current;
  }
};
