import React from 'react';
import { Flame, Star } from 'lucide-react';

interface Props {
  isPerfectDay: boolean;
  perfectDaysThisMonth: number;
  streak: number;
}

export const PerfectDayBanner: React.FC<Props> = ({ isPerfectDay, perfectDaysThisMonth, streak }) => {
  if (!isPerfectDay) return null;

  return (
    <div className="rounded-2xl gradient-accent p-4 text-accent-foreground animate-scale-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Flame className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">🔥 PERFECT DISCIPLINE DAY!</h3>
          <p className="text-sm opacity-90">
            All habits completed! {perfectDaysThisMonth} perfect day{perfectDaysThisMonth !== 1 ? 's' : ''} this month
            {streak > 1 && ` • ${streak} day streak`}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          {[...Array(Math.min(perfectDaysThisMonth, 5))].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-current" />
          ))}
        </div>
      </div>
    </div>
  );
};
