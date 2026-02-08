import React from 'react';
import { Trophy, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { useHabitsDB } from '@/hooks/useHabitsDB';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'completion' | 'perfect_day' | 'xp' | 'level';
  unlockedAt?: string;
}

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

const Achievements: React.FC = () => {
  const { profile, loading, completions, getOverallStreak } = useHabitsDB();

  // Calculate which achievements are unlocked based on current data
  const totalCompletions = completions.length;
  const currentStreak = getOverallStreak();
  const level = profile?.level || 1;

  const achievements = DEFAULT_ACHIEVEMENTS.map(achievement => {
    let isUnlocked = false;
    
    switch (achievement.type) {
      case 'completion':
        isUnlocked = totalCompletions >= achievement.requirement;
        break;
      case 'streak':
        isUnlocked = currentStreak >= achievement.requirement;
        break;
      case 'level':
        isUnlocked = level >= achievement.requirement;
        break;
      default:
        isUnlocked = false;
    }
    
    return {
      ...achievement,
      unlockedAt: isUnlocked ? new Date().toISOString() : undefined,
    };
  });

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl gradient-accent">
          <Trophy className="w-6 h-6 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
          <p className="text-sm text-muted-foreground">
            {unlockedCount} of {achievements.length} unlocked
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8 p-4 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Collection Progress</span>
          <span className="text-sm text-muted-foreground">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full gradient-accent rounded-full transition-all duration-1000"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => {
          const isUnlocked = !!achievement.unlockedAt;
          
          // Calculate progress for locked achievements
          let progress = 0;
          switch (achievement.type) {
            case 'completion':
              progress = Math.min((totalCompletions / achievement.requirement) * 100, 100);
              break;
            case 'streak':
              progress = Math.min((currentStreak / achievement.requirement) * 100, 100);
              break;
            case 'level':
              progress = Math.min((level / achievement.requirement) * 100, 100);
              break;
          }
          
          return (
            <div
              key={achievement.id}
              className={cn(
                "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
                isUnlocked 
                  ? "bg-card border-accent/30 hover:shadow-lg hover:scale-[1.02]" 
                  : "bg-muted/30 border-border opacity-70"
              )}
            >
              {/* Unlocked indicator */}
              {isUnlocked && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                  "text-4xl w-16 h-16 rounded-xl flex items-center justify-center shrink-0",
                  isUnlocked ? "bg-accent/10" : "bg-secondary"
                )}>
                  {isUnlocked ? (
                    achievement.icon
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "font-semibold",
                    isUnlocked ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                  {isUnlocked && (
                    <p className="text-xs text-success mt-2">
                      ✓ Unlocked!
                    </p>
                  )}
                </div>
              </div>

              {/* Progress for locked achievements */}
              {!isUnlocked && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/50 rounded-full transition-all" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
