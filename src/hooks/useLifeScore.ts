import { useMemo } from 'react';
import { format, subDays, startOfDay, subMonths } from 'date-fns';
import { DBHabit, DBCompletion, DBProfile } from './useHabitsDB';

export interface LifeScore {
  overall: number;
  consistency: number;
  completion: number;
  streakStrength: number;
  perfectDays: number;
  perfectDaysCount: number;
  perfectDaysThisMonth: number;
  trend: number; // % change vs last month
  level: string;
  levelIcon: string;
}

const LEVELS = [
  { min: 0, label: 'Beginner', icon: '🌱' },
  { min: 30, label: 'Disciplined', icon: '⚡' },
  { min: 50, label: 'Warrior', icon: '🔥' },
  { min: 75, label: 'Elite', icon: '💎' },
  { min: 90, label: 'Legend', icon: '👑' },
];

export const useLifeScore = (
  habits: DBHabit[],
  completions: DBCompletion[],
  profile: DBProfile | null
): LifeScore => {
  return useMemo(() => {
    if (habits.length === 0) {
      return {
        overall: 0,
        consistency: 0,
        completion: 0,
        streakStrength: 0,
        perfectDays: 0,
        perfectDaysCount: 0,
        perfectDaysThisMonth: 0,
        trend: 0,
        level: 'Beginner',
        levelIcon: '🌱',
      };
    }

    const today = startOfDay(new Date());
    const last30Days: string[] = [];
    const last60Days: string[] = [];
    for (let i = 0; i < 30; i++) {
      last30Days.push(format(subDays(today, i), 'yyyy-MM-dd'));
    }
    for (let i = 0; i < 60; i++) {
      last60Days.push(format(subDays(today, i), 'yyyy-MM-dd'));
    }

    // Completion rate (last 30 days)
    const totalPossible30 = habits.length * 30;
    const completedLast30 = completions.filter(c =>
      last30Days.includes(c.completed_date)
    ).length;
    const completion = Math.min(100, Math.round((completedLast30 / totalPossible30) * 100));

    // Consistency: how many of the last 30 days had at least 1 completion
    const daysWithCompletions = new Set(
      completions.filter(c => last30Days.includes(c.completed_date)).map(c => c.completed_date)
    ).size;
    const consistency = Math.round((daysWithCompletions / 30) * 100);

    // Streak strength (current streak / 30, capped at 100)
    let streak = 0;
    let checkDate = today;
    while (true) {
      const key = format(checkDate, 'yyyy-MM-dd');
      const dayCompletions = completions.filter(c => c.completed_date === key);
      if (dayCompletions.length === habits.length) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else if (key === format(today, 'yyyy-MM-dd')) {
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
    const streakStrength = Math.min(100, Math.round((streak / 30) * 100));

    // Perfect days
    const perfectDaysSet = new Set<string>();
    const thisMonth = format(today, 'yyyy-MM');
    let perfectDaysThisMonth = 0;

    last30Days.forEach(day => {
      const dayComps = completions.filter(c => c.completed_date === day);
      if (dayComps.length >= habits.length && habits.length > 0) {
        perfectDaysSet.add(day);
        if (day.startsWith(thisMonth)) perfectDaysThisMonth++;
      }
    });
    const perfectDaysScore = Math.min(100, Math.round((perfectDaysSet.size / 30) * 100));

    // Overall score (weighted)
    const overall = Math.round(
      completion * 0.35 +
      consistency * 0.25 +
      streakStrength * 0.2 +
      perfectDaysScore * 0.2
    );

    // Trend: compare this month vs last month
    const prevMonthDays = last60Days.slice(30);
    const completedPrev30 = completions.filter(c =>
      prevMonthDays.includes(c.completed_date)
    ).length;
    const prevCompletion = totalPossible30 > 0 ? (completedPrev30 / totalPossible30) * 100 : 0;
    const trend = Math.round(completion - prevCompletion);

    // Level
    const levelEntry = [...LEVELS].reverse().find(l => overall >= l.min) || LEVELS[0];

    return {
      overall,
      consistency,
      completion,
      streakStrength,
      perfectDays: perfectDaysScore,
      perfectDaysCount: perfectDaysSet.size,
      perfectDaysThisMonth,
      trend,
      level: levelEntry.label,
      levelIcon: levelEntry.icon,
    };
  }, [habits, completions, profile]);
};
