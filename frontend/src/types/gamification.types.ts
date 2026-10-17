export type PetType = 'cat' | 'dog' | 'rabbit' | 'squirrel' | 'turtle' | 'gecko';

export interface PetConfig {
  type: PetType;
  name: string;
  defaultNickname: string;
  emoji: string;
  description: string;
  favoriteSnack: string;
}

export interface PetState {
  type: PetType;
  nickname: string;
  level: number;
  affection: number; // 0 - 100
  lastFedTimestamp: number;
}

export interface CheerNote {
  id: string;
  senderName: string;
  message: string;
  hearts: number;
  timestamp: number;
  bgPastel: string;
  isUserNote?: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  rewardStars: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  claimed: boolean;
}

export interface VisionGoal {
  mainDream: string;
  targetDate: string;
  motivationQuote: string;
  milestones: { id: string; text: string; done: boolean }[];
}
