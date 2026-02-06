import React from 'react';
import { Sparkles, Lightbulb, TrendingUp, AlertCircle, PartyPopper, Brain } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useAIInsights } from '@/hooks/useAIInsights';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { CATEGORY_CONFIG } from '@/types/habit';

const Insights: React.FC = () => {
  const { habits, stats } = useHabits();
  const { insights, getWeeklySummary } = useAIInsights(habits, stats);
  const weeklySummary = getWeeklySummary;

  // Generate category insights
  const categoryStats = Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
    const categoryHabits = habits.filter(h => h.category === key);
    const last7Days = Array.from({ length: 7 }, (_, i) => 
      format(subDays(new Date(), i), 'yyyy-MM-dd')
    );
    
    let completions = 0;
    categoryHabits.forEach(habit => {
      last7Days.forEach(day => {
        if (habit.completions[day]) completions++;
      });
    });
    
    const possible = categoryHabits.length * 7;
    const rate = possible > 0 ? (completions / possible) * 100 : 0;
    
    return {
      category: key,
      ...config,
      habitCount: categoryHabits.length,
      completionRate: Math.round(rate),
    };
  }).filter(c => c.habitCount > 0).sort((a, b) => b.completionRate - a.completionRate);

  // Best performing habit
  const habitPerformance = habits.map(habit => {
    const last30Days = Array.from({ length: 30 }, (_, i) => 
      format(subDays(new Date(), i), 'yyyy-MM-dd')
    );
    const completions = last30Days.filter(day => habit.completions[day]).length;
    return { habit, rate: (completions / 30) * 100 };
  }).sort((a, b) => b.rate - a.rate);

  const bestHabit = habitPerformance[0];
  const needsAttention = habitPerformance.filter(h => h.rate < 30).slice(0, 3);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl gradient-level">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Insights</h1>
          <p className="text-sm text-muted-foreground">Smart analysis of your habits</p>
        </div>
      </div>

      {/* AI Badge */}
      <div className="mb-6 p-4 rounded-2xl border border-level/30 bg-level/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-level/20">
            <Brain className="w-5 h-5 text-level" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Powered by Smart Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Rule-based AI that learns from your habit patterns
            </p>
          </div>
        </div>
      </div>

      {/* Live Insights */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          Today's Insights
        </h2>
        <div className="space-y-3">
          {insights.map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>

      {/* Weekly Summary */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Weekly Summary
        </h2>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className={cn(
              "text-2xl font-bold",
              weeklySummary.completionRate >= 70 ? "text-success" :
              weeklySummary.completionRate >= 40 ? "text-accent" : "text-destructive"
            )}>
              {weeklySummary.completionRate}%
            </span>
          </div>
          <p className="text-foreground">{weeklySummary.summary}</p>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              {weeklySummary.totalCompletions} habits completed this week
            </span>
          </div>
        </div>
      </section>

      {/* Category Analysis */}
      {categoryStats.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Category Performance
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {categoryStats.map((cat) => (
              <div 
                key={cat.category}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h3 className="font-medium text-foreground">{cat.label}</h3>
                    <p className="text-xs text-muted-foreground">{cat.habitCount} habit{cat.habitCount > 1 ? 's' : ''}</p>
                  </div>
                  <span className="ml-auto text-lg font-bold" style={{ color: cat.color }}>
                    {cat.completionRate}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.completionRate}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Best Performing */}
      {bestHabit && bestHabit.rate > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <PartyPopper className="w-5 h-5 text-success" />
            Top Performer
          </h2>
          <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{bestHabit.habit.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{bestHabit.habit.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {Math.round(bestHabit.rate)}% completion rate in the last 30 days
                </p>
              </div>
              <span className="text-2xl font-bold text-success">🏆</span>
            </div>
          </div>
        </section>
      )}

      {/* Needs Attention */}
      {needsAttention.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Needs Attention
          </h2>
          <div className="space-y-3">
            {needsAttention.map(({ habit, rate }) => (
              <div 
                key={habit.id}
                className="rounded-xl border border-destructive/20 bg-destructive/5 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{habit.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Only {Math.round(rate)}% completion - try making it smaller or pairing with another habit
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {habits.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Data Yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Start adding and tracking habits to receive personalized AI insights and recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default Insights;
