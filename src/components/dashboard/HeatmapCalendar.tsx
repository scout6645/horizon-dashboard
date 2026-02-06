import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { format, subDays, startOfWeek, addDays } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapCalendarProps {
  data: Record<string, number>;
  maxHabits: number;
  className?: string;
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ 
  data, 
  maxHabits,
  className 
}) => {
  // Generate last 12 weeks of dates
  const today = new Date();
  const weeks: Date[][] = [];
  
  // Start from 12 weeks ago, aligned to week start
  let currentDate = startOfWeek(subDays(today, 84), { weekStartsOn: 0 });
  
  for (let week = 0; week < 13; week++) {
    const weekDays: Date[] = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(addDays(currentDate, day));
    }
    weeks.push(weekDays);
    currentDate = addDays(currentDate, 7);
  }

  const getIntensity = (count: number): string => {
    if (count === 0) return 'bg-secondary';
    const ratio = count / Math.max(maxHabits, 1);
    if (ratio >= 1) return 'bg-success';
    if (ratio >= 0.75) return 'bg-success/80';
    if (ratio >= 0.5) return 'bg-success/60';
    if (ratio >= 0.25) return 'bg-success/40';
    return 'bg-success/20';
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn(
      "rounded-2xl p-5 border border-border bg-card overflow-hidden",
      className
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-success/10">
          <Calendar className="w-5 h-5 text-success" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Activity Heatmap</h3>
          <p className="text-sm text-muted-foreground">Last 3 months</p>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 hide-scrollbar">
        {/* Day labels */}
        <div className="flex flex-col gap-1.5 shrink-0 pr-2">
          {dayLabels.map((day, i) => (
            <div 
              key={day} 
              className={cn(
                "h-3.5 text-[10px] text-muted-foreground flex items-center",
                i % 2 === 0 ? "opacity-100" : "opacity-0"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1.5">
            {week.map((date) => {
              const dateKey = format(date, 'yyyy-MM-dd');
              const count = data[dateKey] || 0;
              const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
              const isFuture = date > today;

              return (
                <Tooltip key={dateKey}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "w-3.5 h-3.5 rounded-sm transition-all duration-200",
                        isFuture ? "bg-secondary/50" : getIntensity(count),
                        isToday && "ring-1 ring-primary ring-offset-1 ring-offset-background",
                        !isFuture && "hover:scale-125 cursor-pointer"
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <p className="font-medium">{format(date, 'MMM d, yyyy')}</p>
                    <p className="text-muted-foreground">
                      {count} habit{count !== 1 ? 's' : ''} completed
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">Less</span>
        <div className="flex gap-1">
          {['bg-secondary', 'bg-success/20', 'bg-success/40', 'bg-success/60', 'bg-success/80', 'bg-success'].map((color) => (
            <div key={color} className={cn("w-3 h-3 rounded-sm", color)} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
};
