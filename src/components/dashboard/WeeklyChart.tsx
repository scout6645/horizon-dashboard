import React from 'react';
import { cn } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';
import { DailyStats } from '@/types/habit';
import { format, parseISO } from 'date-fns';

interface WeeklyChartProps {
  data: DailyStats[];
  className?: string;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, className }) => {
  const maxValue = Math.max(...data.map(d => d.completed), 1);

  return (
    <div className={cn(
      "rounded-2xl p-5 border border-border bg-card",
      className
    )}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Weekly Overview</h3>
          <p className="text-sm text-muted-foreground">Habits completed per day</p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((day, index) => {
          const height = (day.completed / maxValue) * 100;
          const isToday = index === data.length - 1;
          
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center justify-end h-32">
                <span className="text-xs font-medium text-muted-foreground mb-1">
                  {day.completed}
                </span>
                <div 
                  className={cn(
                    "w-full max-w-[32px] rounded-t-lg transition-all duration-500 ease-out",
                    isToday 
                      ? "gradient-primary shadow-lg" 
                      : "bg-secondary hover:bg-primary/20"
                  )}
                  style={{ 
                    height: `${Math.max(height, 8)}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
              </div>
              <span className={cn(
                "text-xs font-medium",
                isToday ? "text-primary" : "text-muted-foreground"
              )}>
                {format(parseISO(day.date), 'EEE')}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Total this week
        </span>
        <span className="text-lg font-bold text-foreground">
          {data.reduce((sum, d) => sum + d.completed, 0)} habits
        </span>
      </div>
    </div>
  );
};
