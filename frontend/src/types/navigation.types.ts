export type PageRoute = 'home' | 'study' | 'chat' | 'relax' | 'journal';

export interface NavTabItem {
  id: PageRoute;
  label: string;
  iconName: string;
  badge?: string;
}

export type StudentMood = 'happy' | 'tired' | 'anxious' | 'peaceful' | 'burnout';
