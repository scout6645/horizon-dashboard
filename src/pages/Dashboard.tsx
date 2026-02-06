import React from 'react';
import { format } from 'date-fns';
import { Plus, Flame, Target, Trophy, Zap } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useAIInsights } from '@/hooks/useAIInsights';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { XPProgress } from '@/components/dashboard/XPProgress';
import { TodayProgress } from '@/components/dashboard/TodayProgress';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { HeatmapCalendar } from '@/components/dashboard/HeatmapCalendar';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { HabitCard } from '@/components/habits/HabitCard';
import { AddHabitModal } from '@/components/habits/AddHabitModal';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const {
    habits,
    stats,
    addHabit,
    toggleHabitCompletion,
    deleteHabit,
    addNote,
    getHabitStreak,
    getTodayProgress,
    getWeeklyStats,
    getCompletionHeatmap,
  } = useHabits();
  const { insights } = useAIInsights(habits, stats);

  const todayProgress = getTodayProgress();
  const weeklyStats = getWeeklyStats();
  const heatmapData = getCompletionHeatmap();
  const todayKey = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Button 
          variant="gradient" 
          size="lg"
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Habit
        </Button>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="mb-6 space-y-3">
          {insights.slice(0, 2).map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Current Streak"
          value={`${stats.currentStreak}d`}
          subtitle="Keep it going!"
          icon={Flame}
          variant="accent"
        />
        <StatsCard
          title="Habits Today"
          value={`${todayProgress.completed}/${todayProgress.total}`}
          subtitle={`${Math.round(todayProgress.percentage)}% complete`}
          icon={Target}
          variant="success"
        />
        <StatsCard
          title="Total XP"
          value={stats.totalXP.toLocaleString()}
          subtitle={`Level ${stats.level}`}
          icon={Zap}
          variant="level"
        />
        <StatsCard
          title="Achievements"
          value={stats.achievements.filter(a => a.unlockedAt).length}
          subtitle={`of ${stats.achievements.length} unlocked`}
          icon={Trophy}
          variant="primary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Today's Habits */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Today's Habits</h2>
            <span className="text-sm text-muted-foreground">
              {todayProgress.completed} of {todayProgress.total} completed
            </span>
          </div>

          {habits.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No habits yet
              </h3>
              <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                Start building your routine by adding your first habit. Small consistent actions lead to big results!
              </p>
              <Button variant="gradient" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Habit
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  streak={getHabitStreak(habit)}
                  isCompleted={habit.completions[todayKey] || false}
                  onToggle={() => toggleHabitCompletion(habit.id)}
                  onEdit={() => {}}
                  onDelete={() => deleteHabit(habit.id)}
                  onAddNote={(note) => addNote(habit.id, note)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          <TodayProgress 
            completed={todayProgress.completed} 
            total={todayProgress.total} 
          />
          <XPProgress xp={stats.totalXP} level={stats.level} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <WeeklyChart data={weeklyStats} />
        <HeatmapCalendar data={heatmapData} maxHabits={habits.length} />
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addHabit}
      />
    </div>
  );
};

export default Dashboard;
