import React from 'react';
import { cn } from '@/lib/utils';
import { Zap, Star } from 'lucide-react';
import { xpForNextLevel, xpProgress } from '@/types/habit';

interface XPProgressProps {
  xp: number;
  level: number;
  className?: string;
}

export const XPProgress: React.FC<XPProgressProps> = ({ xp, level, className }) => {
  const progress = xpProgress(xp);
  const nextLevelXP = xpForNextLevel(level);
  const currentLevelXP = xpForNextLevel(level - 1);
  const xpInCurrentLevel = xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl p-5 border border-border bg-card", className)}>
      {/* Background gradient effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full gradient-level blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl gradient-level shadow-lg">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Experience Points</h3>
              <p className="text-sm text-muted-foreground">Level up by completing habits</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-level/10">
            <Star className="w-5 h-5 text-level fill-level" />
            <span className="text-xl font-bold text-level">Lvl {level}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-4 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full gradient-level rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 animate-shimmer" />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {xpInCurrentLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
            </span>
            <span className="font-medium text-level">
              {Math.round(progress)}% to Level {level + 1}
            </span>
          </div>
        </div>

        {/* Total XP */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total XP Earned</span>
            <span className="text-lg font-bold text-foreground">{xp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
