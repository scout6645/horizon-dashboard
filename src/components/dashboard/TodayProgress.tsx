import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Target } from 'lucide-react';

interface TodayProgressProps {
  completed: number;
  total: number;
  className?: string;
}

export const TodayProgress: React.FC<TodayProgressProps> = ({ 
  completed, 
  total, 
  className 
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 border border-border bg-card",
      className
    )}>
      {/* Background effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full gradient-success blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl gradient-success shadow-lg">
            <Target className="w-5 h-5 text-success-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Today's Progress</h3>
            <p className="text-sm text-muted-foreground">Complete all habits for bonus XP!</p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          {/* Circular progress */}
          <div className="relative w-36 h-36">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="72"
                cy="72"
                r="45"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="72"
                cy="72"
                r="45"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--success))" />
                  <stop offset="100%" stopColor="hsl(160 84% 50%)" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">{Math.round(percentage)}%</span>
              <span className="text-sm text-muted-foreground">{completed}/{total}</span>
            </div>
          </div>
        </div>

        {/* Status message */}
        <div className="mt-4 text-center">
          {percentage === 100 ? (
            <div className="flex items-center justify-center gap-2 text-success">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Perfect Day! 🎉</span>
            </div>
          ) : percentage >= 50 ? (
            <p className="text-muted-foreground">
              Great progress! {total - completed} more to go
            </p>
          ) : total > 0 ? (
            <p className="text-muted-foreground">
              Let's get started! Complete your first habit
            </p>
          ) : (
            <p className="text-muted-foreground">
              Add habits to track your progress
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
