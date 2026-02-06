import { useMemo } from 'react';
import { Habit, UserStats, AIInsight } from '@/types/habit';
import { format, subDays, differenceInDays, parseISO } from 'date-fns';

const MOTIVATIONAL_QUOTES = [
  "Every day is a fresh start. Make it count! 🌟",
  "Small steps lead to big transformations. Keep going! 🚀",
  "Consistency is the key to unlocking your potential. 🔑",
  "You're building something amazing, one habit at a time. 💪",
  "Progress, not perfection. You're doing great! ⭐",
  "The only bad workout is the one that didn't happen. Same goes for habits! 🏃",
  "Your future self will thank you for starting today. 🙏",
  "Believe in the power of compound progress. 📈",
];

const CELEBRATION_MESSAGES = [
  "🎉 Incredible! You're on fire today!",
  "🌟 Amazing work! Your consistency is inspiring!",
  "🏆 Champion status! Keep crushing those habits!",
  "💫 You're unstoppable! What a streak!",
  "🚀 To the moon! Your dedication is paying off!",
];

const WARNING_MESSAGES = [
  "⚠️ Don't break the chain! You've got habits waiting for you.",
  "🔔 Gentle reminder: Your habits miss you today!",
  "⏰ Time flies! Make sure to complete your daily habits.",
];

export const useAIInsights = (habits: Habit[], stats: UserStats) => {
  const insights = useMemo((): AIInsight[] => {
    const insightsList: AIInsight[] = [];
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayCompletions = habits.filter(h => h.completions[today]).length;
    const totalHabits = habits.length;
    
    if (totalHabits === 0) {
      insightsList.push({
        id: 'welcome',
        type: 'suggestion',
        message: "Welcome to HabitFlow! Start by adding your first habit. Small, consistent actions lead to remarkable results. 🌱",
        createdAt: new Date().toISOString(),
      });
      return insightsList;
    }

    // Check completion rate for today
    const completionRate = totalHabits > 0 ? (todayCompletions / totalHabits) * 100 : 0;

    if (completionRate === 100 && totalHabits > 0) {
      insightsList.push({
        id: 'perfect_day',
        type: 'celebration',
        message: CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)],
        createdAt: new Date().toISOString(),
      });
    } else if (completionRate >= 75) {
      insightsList.push({
        id: 'almost_there',
        type: 'motivation',
        message: `Almost there! Just ${totalHabits - todayCompletions} more habit${totalHabits - todayCompletions > 1 ? 's' : ''} to complete today. You've got this! 💪`,
        createdAt: new Date().toISOString(),
      });
    } else if (completionRate < 50 && new Date().getHours() >= 18) {
      insightsList.push({
        id: 'evening_reminder',
        type: 'warning',
        message: WARNING_MESSAGES[Math.floor(Math.random() * WARNING_MESSAGES.length)],
        createdAt: new Date().toISOString(),
      });
    }

    // Streak-based insights
    if (stats.currentStreak >= 7) {
      insightsList.push({
        id: 'streak_praise',
        type: 'celebration',
        message: `🔥 ${stats.currentStreak}-day streak! You're building unstoppable momentum. Keep it going!`,
        createdAt: new Date().toISOString(),
      });
    } else if (stats.currentStreak >= 3) {
      insightsList.push({
        id: 'streak_motivation',
        type: 'motivation',
        message: `Nice ${stats.currentStreak}-day streak! You're creating a powerful habit loop. 🔄`,
        createdAt: new Date().toISOString(),
      });
    }

    // Find struggling habits
    const strugglingHabits = habits.filter(habit => {
      const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd'));
      const completions = last7Days.filter(day => habit.completions[day]).length;
      return completions < 3;
    });

    if (strugglingHabits.length > 0 && habits.length > 1) {
      const habit = strugglingHabits[0];
      insightsList.push({
        id: 'struggling_habit',
        type: 'suggestion',
        message: `💡 "${habit.name}" needs attention. Try pairing it with an existing habit or making it smaller to build consistency.`,
        createdAt: new Date().toISOString(),
      });
    }

    // Level-up message
    if (stats.level > 1) {
      insightsList.push({
        id: 'level_status',
        type: 'motivation',
        message: `🎮 Level ${stats.level} achieved with ${stats.totalXP} XP! You're becoming a habit master.`,
        createdAt: new Date().toISOString(),
      });
    }

    // Add a motivational quote if we don't have many insights
    if (insightsList.length < 2) {
      insightsList.push({
        id: 'quote',
        type: 'motivation',
        message: MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)],
        createdAt: new Date().toISOString(),
      });
    }

    return insightsList.slice(0, 3);
  }, [habits, stats]);

  const getWeeklySummary = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd'));
    
    let totalCompletions = 0;
    let possibleCompletions = habits.length * 7;
    
    habits.forEach(habit => {
      last7Days.forEach(day => {
        if (habit.completions[day]) totalCompletions++;
      });
    });

    const rate = possibleCompletions > 0 ? (totalCompletions / possibleCompletions) * 100 : 0;

    let summary = '';
    if (rate >= 90) {
      summary = "Outstanding week! You've maintained exceptional consistency. 🏆";
    } else if (rate >= 70) {
      summary = "Great week! You're building solid habits. Keep pushing! 💪";
    } else if (rate >= 50) {
      summary = "Good effort this week! Focus on your top 3 habits to build momentum. 📈";
    } else {
      summary = "Room for growth! Try reducing your habit list and focusing on consistency. 🎯";
    }

    return {
      completionRate: Math.round(rate),
      totalCompletions,
      summary,
    };
  }, [habits]);

  return { insights, getWeeklySummary };
};
