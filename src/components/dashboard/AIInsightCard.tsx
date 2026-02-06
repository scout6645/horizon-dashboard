import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Lightbulb, AlertTriangle, PartyPopper, Flame } from 'lucide-react';
import { AIInsight } from '@/types/habit';

interface AIInsightCardProps {
  insight: AIInsight;
  className?: string;
}

const typeConfig = {
  motivation: {
    icon: Flame,
    bgClass: 'bg-primary/5 border-primary/20',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  suggestion: {
    icon: Lightbulb,
    bgClass: 'bg-accent/5 border-accent/20',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-destructive/5 border-destructive/20',
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
  },
  celebration: {
    icon: PartyPopper,
    bgClass: 'bg-success/5 border-success/20',
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
  },
};

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, className }) => {
  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl p-4 border transition-all duration-300 hover:scale-[1.01]",
      config.bgClass,
      className
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg shrink-0", config.iconBg)}>
          <Icon className={cn("w-4 h-4", config.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              AI Insight
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {insight.message}
          </p>
        </div>
      </div>
    </div>
  );
};
