import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LifeScore } from '@/hooks/useLifeScore';

interface Props {
  score: LifeScore;
}

export const LifePerformanceScore: React.FC<Props> = ({ score }) => {
  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-success';
    if (val >= 50) return 'text-accent';
    return 'text-destructive';
  };

  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (score.overall / 100) * circumference;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
        {/* Score ring */}
        <div className="relative w-36 h-36 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64" cy="64" r="58"
              strokeWidth="8"
              fill="none"
              className="stroke-secondary"
            />
            <circle
              cx="64" cy="64" r="58"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="stroke-primary transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-3xl font-bold", getScoreColor(score.overall))}>
              {score.overall}
            </span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">Life Performance Score</h3>
            <div className="flex items-center gap-2 justify-center sm:justify-start mt-1">
              <span className="text-2xl">{score.levelIcon}</span>
              <span className="text-sm font-medium text-muted-foreground">{score.level}</span>
              {score.trend !== 0 && (
                <span className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                  score.trend > 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                )}>
                  {score.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {score.trend > 0 ? '+' : ''}{score.trend}%
                </span>
              )}
            </div>
          </div>

          {/* Mini stat bars */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Completion', value: score.completion },
              { label: 'Consistency', value: score.consistency },
              { label: 'Streak Power', value: score.streakStrength },
              { label: 'Perfect Days', value: score.perfectDays },
            ].map(stat => (
              <div key={stat.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-medium text-foreground">{stat.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
