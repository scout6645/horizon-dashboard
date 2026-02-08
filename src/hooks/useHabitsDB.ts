import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export interface DBHabit {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  category: string;
  frequency: string;
  priority: string;
  sort_order: number;
  created_at: string;
  user_id: string;
}

export interface DBCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  note: string | null;
  created_at: string;
}

export interface DBProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  theme: string;
  created_at: string;
  updated_at: string;
}

export interface DailyStats {
  date: string;
  completed: number;
  total: number;
  xpEarned: number;
}

const XP_PER_COMPLETION = 10;

export const useHabitsDB = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<DBHabit[]>([]);
  const [completions, setCompletions] = useState<DBCompletion[]>([]);
  const [profile, setProfile] = useState<DBProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [habitsRes, completionsRes, profileRes] = await Promise.all([
        supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id)
          .order('sort_order'),
        supabase
          .from('habit_completions')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      if (habitsRes.error) throw habitsRes.error;
      if (completionsRes.error) throw completionsRes.error;

      setHabits(habitsRes.data || []);
      setCompletions(completionsRes.data || []);
      setProfile(profileRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getTodayKey = () => format(new Date(), 'yyyy-MM-dd');

  // Add habit
  const addHabit = useCallback(async (habit: Omit<DBHabit, 'id' | 'created_at' | 'user_id' | 'sort_order'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          ...habit,
          user_id: user.id,
          sort_order: habits.length,
        })
        .select()
        .single();

      if (error) throw error;

      setHabits(prev => [...prev, data]);
      toast({ title: "Habit created! 🎯", description: `"${habit.name}" has been added.` });
      return data;
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({ 
        title: "Failed to create habit", 
        description: "Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [user, habits.length, toast]);

  // Update habit
  const updateHabit = useCallback(async (id: string, updates: Partial<DBHabit>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    } catch (error) {
      console.error('Error updating habit:', error);
      toast({ 
        title: "Failed to update habit", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Delete habit
  const deleteHabit = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHabits(prev => prev.filter(h => h.id !== id));
      setCompletions(prev => prev.filter(c => c.habit_id !== id));
      toast({ title: "Habit deleted", description: "The habit has been removed." });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({ 
        title: "Failed to delete habit", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Toggle completion
  const toggleHabitCompletion = useCallback(async (habitId: string, date?: string) => {
    if (!user) return;

    const dateKey = date || getTodayKey();
    const existingCompletion = completions.find(
      c => c.habit_id === habitId && c.completed_date === dateKey
    );

    try {
      if (existingCompletion) {
        // Remove completion
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('id', existingCompletion.id);

        if (error) throw error;

        setCompletions(prev => prev.filter(c => c.id !== existingCompletion.id));
        
        // Update XP
        if (profile) {
          const newXP = Math.max(0, profile.total_xp - XP_PER_COMPLETION);
          await supabase
            .from('profiles')
            .update({ total_xp: newXP, level: Math.floor(Math.sqrt(newXP / 100)) + 1 })
            .eq('user_id', user.id);
          setProfile(prev => prev ? { ...prev, total_xp: newXP, level: Math.floor(Math.sqrt(newXP / 100)) + 1 } : null);
        }
      } else {
        // Add completion
        const { data, error } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completed_date: dateKey,
          })
          .select()
          .single();

        if (error) throw error;

        setCompletions(prev => [...prev, data]);
        
        // Update XP
        if (profile) {
          const newXP = profile.total_xp + XP_PER_COMPLETION;
          await supabase
            .from('profiles')
            .update({ total_xp: newXP, level: Math.floor(Math.sqrt(newXP / 100)) + 1 })
            .eq('user_id', user.id);
          setProfile(prev => prev ? { ...prev, total_xp: newXP, level: Math.floor(Math.sqrt(newXP / 100)) + 1 } : null);
        }
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  }, [user, completions, profile]);

  // Add note to completion
  const addNote = useCallback(async (habitId: string, note: string, date?: string) => {
    if (!user) return;

    const dateKey = date || getTodayKey();
    const existingCompletion = completions.find(
      c => c.habit_id === habitId && c.completed_date === dateKey
    );

    try {
      if (existingCompletion) {
        const { error } = await supabase
          .from('habit_completions')
          .update({ note })
          .eq('id', existingCompletion.id);

        if (error) throw error;

        setCompletions(prev => prev.map(c => 
          c.id === existingCompletion.id ? { ...c, note } : c
        ));
      } else {
        const { data, error } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completed_date: dateKey,
            note,
          })
          .select()
          .single();

        if (error) throw error;

        setCompletions(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  }, [user, completions]);

  // Check if habit is completed for a date
  const isCompleted = useCallback((habitId: string, date?: string) => {
    const dateKey = date || getTodayKey();
    return completions.some(c => c.habit_id === habitId && c.completed_date === dateKey);
  }, [completions]);

  // Get note for a habit on a date
  const getNote = useCallback((habitId: string, date?: string) => {
    const dateKey = date || getTodayKey();
    return completions.find(c => c.habit_id === habitId && c.completed_date === dateKey)?.note || '';
  }, [completions]);

  // Get streak for a habit
  const getHabitStreak = useCallback((habitId: string): number => {
    let streak = 0;
    let currentDate = startOfDay(new Date());
    
    const habitCompletions = completions.filter(c => c.habit_id === habitId);
    const completionDates = new Set(habitCompletions.map(c => c.completed_date));
    
    const todayKey = format(currentDate, 'yyyy-MM-dd');
    if (!completionDates.has(todayKey)) {
      currentDate = subDays(currentDate, 1);
    }
    
    while (true) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      if (completionDates.has(dateKey)) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  }, [completions]);

  // Get today's progress
  const getTodayProgress = useCallback(() => {
    const todayKey = getTodayKey();
    const todayCompletions = completions.filter(c => c.completed_date === todayKey);
    
    return {
      completed: todayCompletions.length,
      total: habits.length,
      percentage: habits.length > 0 ? (todayCompletions.length / habits.length) * 100 : 0,
    };
  }, [habits, completions]);

  // Get weekly stats
  const getWeeklyStats = useCallback((): DailyStats[] => {
    const stats: DailyStats[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      const dayCompletions = completions.filter(c => c.completed_date === dateKey);
      
      stats.push({
        date: dateKey,
        completed: dayCompletions.length,
        total: habits.length,
        xpEarned: dayCompletions.length * XP_PER_COMPLETION,
      });
    }
    
    return stats;
  }, [habits, completions]);

  // Get completion heatmap
  const getCompletionHeatmap = useCallback(() => {
    const heatmap: Record<string, number> = {};
    
    completions.forEach(completion => {
      heatmap[completion.completed_date] = (heatmap[completion.completed_date] || 0) + 1;
    });
    
    return heatmap;
  }, [completions]);

  // Get overall streak
  const getOverallStreak = useCallback(() => {
    if (habits.length === 0) return 0;
    
    let streak = 0;
    let currentDate = startOfDay(new Date());
    
    while (true) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const dayCompletions = completions.filter(c => c.completed_date === dateKey);
      
      if (dayCompletions.length === habits.length) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else if (dateKey === format(new Date(), 'yyyy-MM-dd')) {
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  }, [habits, completions]);

  return {
    habits,
    completions,
    profile,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    addNote,
    isCompleted,
    getNote,
    getHabitStreak,
    getTodayProgress,
    getWeeklyStats,
    getCompletionHeatmap,
    getOverallStreak,
    refetch: fetchData,
  };
};
