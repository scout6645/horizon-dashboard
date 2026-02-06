import React from 'react';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const Achievements: React.FC = () => {
  const { stats } = useHabits();

  const unlockedCount = stats.achievements.filter(a => a.unlockedAt).length;

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
            {unlockedCount} of {stats.achievements.length} unlocked
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8 p-4 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Collection Progress</span>
          <span className="text-sm text-muted-foreground">
            {Math.round((unlockedCount / stats.achievements.length) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full gradient-accent rounded-full transition-all duration-1000"
            style={{ width: `${(unlockedCount / stats.achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.achievements.map((achievement) => {
          const isUnlocked = !!achievement.unlockedAt;
          
          return (
            <div
              key={achievement.id}
              className={cn(
                "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
                isUnlocked 
                  ? "bg-card border-accent/30 hover:shadow-lg hover:scale-[1.02]" 
                  : "bg-muted/30 border-border opacity-60"
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
                  {isUnlocked && achievement.unlockedAt && (
                    <p className="text-xs text-success mt-2">
                      Unlocked {format(new Date(achievement.unlockedAt), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress for locked achievements */}
              {!isUnlocked && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>0 / {achievement.requirement}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full">
                    <div className="h-full bg-muted-foreground/30 rounded-full" style={{ width: '0%' }} />
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
