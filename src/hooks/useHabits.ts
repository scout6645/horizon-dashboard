import { useState, useEffect, useCallback } from 'react';
import { 
  Habit, 
  UserStats, 
  Achievement, 
  DailyStats,
  XP_PER_COMPLETION,
  XP_PER_STREAK_DAY,
  XP_PER_PERFECT_DAY,
  calculateLevel 
} from '@/types/habit';
import { format, subDays, differenceInDays, parseISO, startOfDay } from 'date-fns';

const STORAGE_KEY = 'habitflow_data';

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_habit', name: 'First Step', description: 'Complete your first habit', icon: '🌱', requirement: 1, type: 'completion' },
  { id: 'streak_3', name: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥', requirement: 3, type: 'streak' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚔️', requirement: 7, type: 'streak' },
  { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '👑', requirement: 30, type: 'streak' },
  { id: 'perfect_3', name: 'Triple Threat', description: '3 perfect days', icon: '⭐', requirement: 3, type: 'perfect_day' },
  { id: 'perfect_7', name: 'Perfect Week', description: '7 perfect days', icon: '🌟', requirement: 7, type: 'perfect_day' },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '🚀', requirement: 5, type: 'level' },
  { id: 'level_10', name: 'Habit Hero', description: 'Reach level 10', icon: '🦸', requirement: 10, type: 'level' },
  { id: 'completion_50', name: 'Fifty Strong', description: 'Complete 50 habits', icon: '💯', requirement: 50, type: 'completion' },
  { id: 'completion_100', name: 'Centurion', description: 'Complete 100 habits', icon: '🏆', requirement: 100, type: 'completion' },
];

interface StoredData {
  habits: Habit[];
  stats: UserStats;
}

const getDefaultStats = (): UserStats => ({
  totalXP: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  habitsCompleted: 0,
  perfectDays: 0,
  achievements: DEFAULT_ACHIEVEMENTS,
});

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<UserStats>(getDefaultStats());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StoredData = JSON.parse(stored);
        setHabits(data.habits || []);
        setStats({ ...getDefaultStats(), ...data.stats });
      } catch {
        console.error('Failed to parse stored data');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits, stats }));
    }
  }, [habits, stats, isLoaded]);

  const getTodayKey = () => format(new Date(), 'yyyy-MM-dd');

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'notes'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completions: {},
      notes: {},
    };
    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  }, []);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const toggleHabitCompletion = useCallback((habitId: string, date?: string) => {
    const dateKey = date || getTodayKey();
    
    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id !== habitId) return h;
        const wasCompleted = h.completions[dateKey];
        return {
          ...h,
          completions: {
            ...h.completions,
            [dateKey]: !wasCompleted,
          },
        };
      });
      return updated;
    });

    // Update stats
    setStats(prev => {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return prev;
      
      const wasCompleted = habit.completions[dateKey];
      const xpChange = wasCompleted ? -XP_PER_COMPLETION : XP_PER_COMPLETION;
      const completionChange = wasCompleted ? -1 : 1;
      
      const newXP = Math.max(0, prev.totalXP + xpChange);
      const newLevel = calculateLevel(newXP);
      
      return {
        ...prev,
        totalXP: newXP,
        level: newLevel,
        habitsCompleted: Math.max(0, prev.habitsCompleted + completionChange),
      };
    });
  }, [habits]);

  const addNote = useCallback((habitId: string, note: string, date?: string) => {
    const dateKey = date || getTodayKey();
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      return {
        ...h,
        notes: { ...h.notes, [dateKey]: note },
      };
    }));
  }, []);

  const getHabitStreak = useCallback((habit: Habit): number => {
    let streak = 0;
    let currentDate = startOfDay(new Date());
    
    // Check if today is completed, if not start from yesterday
    const todayKey = format(currentDate, 'yyyy-MM-dd');
    if (!habit.completions[todayKey]) {
      currentDate = subDays(currentDate, 1);
    }
    
    while (true) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      if (habit.completions[dateKey]) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  }, []);

  const getTodayProgress = useCallback(() => {
    const todayKey = getTodayKey();
    const todayHabits = habits.filter(h => {
      if (h.frequency === 'daily') return true;
      if (h.frequency === 'weekly' && h.targetDays) {
        const today = new Date().getDay();
        return h.targetDays.includes(today);
      }
      return true;
    });
    
    const completed = todayHabits.filter(h => h.completions[todayKey]).length;
    return {
      completed,
      total: todayHabits.length,
      percentage: todayHabits.length > 0 ? (completed / todayHabits.length) * 100 : 0,
    };
  }, [habits]);

  const getWeeklyStats = useCallback((): DailyStats[] => {
    const stats: DailyStats[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      const completed = habits.filter(h => h.completions[dateKey]).length;
      
      stats.push({
        date: dateKey,
        completed,
        total: habits.length,
        xpEarned: completed * XP_PER_COMPLETION,
      });
    }
    
    return stats;
  }, [habits]);

  const getCompletionHeatmap = useCallback(() => {
    const heatmap: Record<string, number> = {};
    
    habits.forEach(habit => {
      Object.entries(habit.completions).forEach(([date, completed]) => {
        if (completed) {
          heatmap[date] = (heatmap[date] || 0) + 1;
        }
      });
    });
    
    return heatmap;
  }, [habits]);

  const calculateOverallStreak = useCallback(() => {
    if (habits.length === 0) return 0;
    
    let streak = 0;
    let currentDate = startOfDay(new Date());
    const todayKey = format(currentDate, 'yyyy-MM-dd');
    
    // Check if all habits are completed today
    const allCompletedToday = habits.every(h => h.completions[todayKey]);
    if (!allCompletedToday) {
      currentDate = subDays(currentDate, 1);
    }
    
    while (true) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const allCompleted = habits.every(h => h.completions[dateKey]);
      
      if (allCompleted && habits.length > 0) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  }, [habits]);

  // Update streak in stats when habits change
  useEffect(() => {
    if (isLoaded && habits.length > 0) {
      const newStreak = calculateOverallStreak();
      setStats(prev => ({
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
      }));
    }
  }, [habits, isLoaded, calculateOverallStreak]);

  // Check achievements
  useEffect(() => {
    if (!isLoaded) return;
    
    setStats(prev => {
      const updatedAchievements = prev.achievements.map(achievement => {
        if (achievement.unlockedAt) return achievement;
        
        let unlocked = false;
        switch (achievement.type) {
          case 'completion':
            unlocked = prev.habitsCompleted >= achievement.requirement;
            break;
          case 'streak':
            unlocked = prev.currentStreak >= achievement.requirement;
            break;
          case 'perfect_day':
            unlocked = prev.perfectDays >= achievement.requirement;
            break;
          case 'level':
            unlocked = prev.level >= achievement.requirement;
            break;
        }
        
        if (unlocked) {
          return { ...achievement, unlockedAt: new Date().toISOString() };
        }
        return achievement;
      });
      
      return { ...prev, achievements: updatedAchievements };
    });
  }, [stats.habitsCompleted, stats.currentStreak, stats.perfectDays, stats.level, isLoaded]);

  return {
    habits,
    stats,
    isLoaded,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    addNote,
    getHabitStreak,
    getTodayProgress,
    getWeeklyStats,
    getCompletionHeatmap,
  };
};
