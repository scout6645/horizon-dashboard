import React from 'react';
import { BarChart3, TrendingUp, Calendar, Target, Flame, Award, Loader2 } from 'lucide-react';
import { useHabitsDB } from '@/hooks/useHabitsDB';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { HeatmapCalendar } from '@/components/dashboard/HeatmapCalendar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { format, subDays } from 'date-fns';

const Analytics: React.FC = () => {
  const { habits, profile, loading, getWeeklyStats, getCompletionHeatmap, getTodayProgress, completions, getOverallStreak } = useHabitsDB();
  
  const weeklyStats = getWeeklyStats();
  const heatmapData = getCompletionHeatmap();

  // Calculate additional stats
  const totalCompletionsAllTime = Object.values(heatmapData).reduce((sum, count) => sum + count, 0);
  const averageDaily = habits.length > 0 ? (totalCompletionsAllTime / Math.max(90, 1)).toFixed(1) : '0';
  
  // Weekly summary calculation
  const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd'));
  const weeklyCompletions = completions.filter(c => last7Days.includes(c.completed_date)).length;
  const possibleWeekly = habits.length * 7;
  const weeklyCompletionRate = possibleWeekly > 0 ? Math.round((weeklyCompletions / possibleWeekly) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl gradient-primary">
          <BarChart3 className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your progress and patterns</p>
        </div>
      </div>

      {/* Weekly Summary Card */}
      <div className="mb-6 p-5 rounded-2xl border border-border bg-card">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Weekly Report</h3>
            <p className="text-sm text-muted-foreground">
              {format(subDays(new Date(), 7), 'MMM d')} - {format(new Date(), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary">{weeklyCompletionRate}%</span>
            <p className="text-sm text-muted-foreground">completion rate</p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-sm text-foreground">
            {weeklyCompletionRate >= 70 
              ? "🎉 Excellent week! You're building strong habits."
              : weeklyCompletionRate >= 40
              ? "📈 Good progress! Keep pushing for consistency."
              : "💪 Room for improvement. Try starting smaller!"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Longest Streak"
          value={`${profile?.longest_streak || 0}d`}
          subtitle="Personal best"
          icon={Flame}
          variant="accent"
        />
        <StatsCard
          title="Total Completions"
          value={totalCompletionsAllTime}
          subtitle="All time"
          icon={Target}
          variant="success"
        />
        <StatsCard
          title="Daily Average"
          value={averageDaily}
          subtitle="Last 90 days"
          icon={TrendingUp}
          variant="primary"
        />
        <StatsCard
          title="Active Habits"
          value={habits.length}
          subtitle="Currently tracking"
          icon={Calendar}
          variant="level"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <WeeklyChart data={weeklyStats} />
        <HeatmapCalendar data={heatmapData} maxHabits={habits.length} />
      </div>

      {/* Habit Performance */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/10">
            <Award className="w-5 h-5 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground">Habit Performance</h3>
        </div>

        {habits.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Add habits to see performance analytics
          </p>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              // Calculate completion rate for last 30 days
              const last30Days = Array.from({ length: 30 }, (_, i) => 
                format(subDays(new Date(), i), 'yyyy-MM-dd')
              );
              const habitCompletions = completions.filter(
                c => c.habit_id === habit.id && last30Days.includes(c.completed_date)
              ).length;
              const rate = (habitCompletions / 30) * 100;

              return (
                <div key={habit.id} className="flex items-center gap-4">
                  <span className="text-xl w-8 text-center">{habit.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground truncate">{habit.name}</span>
                      <span className="text-sm text-muted-foreground shrink-0 ml-2">
                        {Math.round(rate)}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-primary rounded-full transition-all duration-500"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
