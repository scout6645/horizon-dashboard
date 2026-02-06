export type HabitCategory = 
  | 'health' 
  | 'fitness' 
  | 'mindfulness' 
  | 'productivity' 
  | 'learning' 
  | 'social' 
  | 'creativity' 
  | 'finance';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  targetDays?: number[]; // 0-6 for Sun-Sat
  createdAt: string;
  completions: Record<string, boolean>; // date string -> completed
  notes: Record<string, string>; // date string -> note
}

export interface UserStats {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  habitsCompleted: number;
  perfectDays: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: number;
  type: 'streak' | 'completion' | 'perfect_day' | 'xp' | 'level';
}

export interface DailyStats {
  date: string;
  completed: number;
  total: number;
  xpEarned: number;
}

export interface AIInsight {
  id: string;
  type: 'motivation' | 'suggestion' | 'warning' | 'celebration';
  message: string;
  createdAt: string;
}

export const CATEGORY_CONFIG: Record<HabitCategory, { label: string; icon: string; color: string }> = {
  health: { label: 'Health', icon: '💚', color: 'hsl(160 84% 39%)' },
  fitness: { label: 'Fitness', icon: '💪', color: 'hsl(25 95% 53%)' },
  mindfulness: { label: 'Mindfulness', icon: '🧘', color: 'hsl(280 67% 52%)' },
  productivity: { label: 'Productivity', icon: '⚡', color: 'hsl(199 89% 48%)' },
  learning: { label: 'Learning', icon: '📚', color: 'hsl(38 92% 50%)' },
  social: { label: 'Social', icon: '👥', color: 'hsl(340 82% 52%)' },
  creativity: { label: 'Creativity', icon: '🎨', color: 'hsl(300 67% 52%)' },
  finance: { label: 'Finance', icon: '💰', color: 'hsl(140 70% 35%)' },
};

export const XP_PER_COMPLETION = 10;
export const XP_PER_STREAK_DAY = 5;
export const XP_PER_PERFECT_DAY = 25;

export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const xpForNextLevel = (level: number): number => {
  return Math.pow(level, 2) * 100;
};

export const xpProgress = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  const currentLevelXP = xpForNextLevel(currentLevel - 1);
  const nextLevelXP = xpForNextLevel(currentLevel);
  return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
};
