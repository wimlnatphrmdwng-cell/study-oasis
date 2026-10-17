export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroConfig {
  work: number;       // in seconds (e.g. 25 * 60)
  shortBreak: number; // in seconds (e.g. 5 * 60)
  longBreak: number;  // in seconds (e.g. 15 * 60)
}

export interface SmallWinItem {
  id: string;
  text: string;
  completed: boolean;
  timestamp: number;
}

export interface AmbientTrack {
  id: string;
  name: string;
  iconName: string;
  volume: number;
  isPlaying: boolean;
}

export interface StudentQuote {
  id: string;
  text: string;
  author: string;
  category: 'focus' | 'calm' | 'self-compassion' | 'grit';
}
