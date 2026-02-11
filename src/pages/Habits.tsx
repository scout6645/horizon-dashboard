import React, { useState, useMemo } from 'react';
import { format, subDays, addDays } from 'date-fns';
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  ListChecks,
  Loader2
} from 'lucide-react';
import { useHabitsDB } from '@/hooks/useHabitsDB';
import { HabitCard } from '@/components/habits/HabitCard';
import { AddHabitModal } from '@/components/habits/AddHabitModal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  health: { label: 'Health', icon: '💚', color: 'hsl(160 84% 39%)' },
  fitness: { label: 'Fitness', icon: '💪', color: 'hsl(25 95% 53%)' },
  mindfulness: { label: 'Mind', icon: '🧘', color: 'hsl(280 67% 52%)' },
  productivity: { label: 'Work', icon: '⚡', color: 'hsl(199 89% 48%)' },
  learning: { label: 'Learn', icon: '📚', color: 'hsl(38 92% 50%)' },
  social: { label: 'Social', icon: '👥', color: 'hsl(340 82% 52%)' },
  creativity: { label: 'Create', icon: '🎨', color: 'hsl(300 67% 52%)' },
  finance: { label: 'Finance', icon: '💰', color: 'hsl(140 70% 35%)' },
};

const Habits: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const {
    habits,
    loading,
    addHabit,
    updateHabit,
    toggleHabitCompletion,
    deleteHabit,
    addNote,
    getHabitStreak,
    isCompleted,
    getNote,
  } = useHabitsDB();

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const isToday = format(new Date(), 'yyyy-MM-dd') === dateKey;

  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        habit.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [habits, searchQuery, selectedCategory]);

  const completedCount = filteredHabits.filter(h => isCompleted(h.id, dateKey)).length;

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
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl gradient-primary">
              <ListChecks className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Habits</h1>
              <p className="text-sm text-muted-foreground">
                {habits.length} habit{habits.length !== 1 ? 's' : ''} • {completedCount} completed
              </p>
            </div>
          </div>
          <Button 
            variant="gradient" 
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </Button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-card border border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all",
              isToday 
                ? "gradient-primary text-primary-foreground" 
                : "hover:bg-secondary"
            )}
          >
            {isToday ? 'Today' : format(selectedDate, 'MMM d, yyyy')}
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            disabled={format(addDays(selectedDate, 1), 'yyyy-MM-dd') > format(new Date(), 'yyyy-MM-dd')}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search habits..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === 'all'
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              All
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
                  selectedCategory === key
                    ? "text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
                style={{
                  background: selectedCategory === key ? config.color : undefined,
                }}
              >
                <span>{config.icon}</span>
                <span className="hidden sm:inline">{config.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Habits List */}
      {filteredHabits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          {habits.length === 0 ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
                <ListChecks className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Start Your Journey
              </h3>
              <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                Create your first habit to begin tracking your progress and building better routines.
              </p>
              <Button variant="gradient" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Habit
              </Button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No habits found
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={{
                id: habit.id,
                name: habit.name,
                description: habit.description,
                icon: habit.icon,
                color: habit.color,
                category: habit.category,
                priority: habit.priority,
              }}
              streak={getHabitStreak(habit.id)}
              isCompleted={isCompleted(habit.id, dateKey)}
              note={getNote(habit.id, dateKey)}
              onToggle={() => toggleHabitCompletion(habit.id, dateKey)}
              onEdit={() => setEditingHabit(habit)}
              onDelete={() => deleteHabit(habit.id)}
              onAddNote={(note) => addNote(habit.id, note, dateKey)}
            />
          ))}
        </div>
      )}

      {/* Floating Add Button (Mobile) */}
      <Button
        variant="gradient"
        size="lg"
        className="fixed bottom-24 right-4 md:hidden rounded-full w-14 h-14 p-0 shadow-lg"
        onClick={() => setShowAddModal(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addHabit}
      />
      <AddHabitModal
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        onAdd={async (data) => {
          if (editingHabit) {
            await updateHabit(editingHabit.id, data);
          }
        }}
        editHabit={editingHabit}
      />
    </div>
  );
};

export default Habits;
