import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'accent' | 'level';
  className?: string;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'gradient-primary text-primary-foreground',
  success: 'gradient-success text-success-foreground',
  accent: 'gradient-accent text-accent-foreground',
  level: 'gradient-level text-primary-foreground',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}) => {
  const isColoredVariant = variant !== 'default';

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
      variantStyles[variant],
      !isColoredVariant && "border border-border shadow-sm",
      className
    )}>
      {/* Background decoration */}
      {isColoredVariant && (
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <Icon className="w-full h-full" />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className={cn(
            "p-2.5 rounded-xl",
            isColoredVariant 
              ? "bg-white/20" 
              : "bg-primary/10"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              isColoredVariant ? "" : "text-primary"
            )} />
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              isColoredVariant 
                ? "bg-white/20" 
                : trend.isPositive 
                  ? "bg-success/10 text-success" 
                  : "bg-destructive/10 text-destructive"
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>

        <div className="mt-4">
          <h3 className={cn(
            "text-sm font-medium",
            isColoredVariant ? "opacity-80" : "text-muted-foreground"
          )}>
            {title}
          </h3>
          <p className="text-3xl font-bold mt-1 animate-number-pop">
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-sm mt-1",
              isColoredVariant ? "opacity-70" : "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
