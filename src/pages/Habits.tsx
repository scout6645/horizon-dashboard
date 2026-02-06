import React, { useState, useMemo } from 'react';
import { format, subDays, addDays } from 'date-fns';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ListChecks
} from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from '@/components/habits/HabitCard';
import { AddHabitModal } from '@/components/habits/AddHabitModal';
import { Button } from '@/components/ui/button';
import { CATEGORY_CONFIG, HabitCategory } from '@/types/habit';
import { cn } from '@/lib/utils';

const Habits: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const {
    habits,
    addHabit,
    toggleHabitCompletion,
    deleteHabit,
    addNote,
    getHabitStreak,
  } = useHabits();

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

  const completedCount = filteredHabits.filter(h => h.completions[dateKey]).length;

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
            size="icon-sm"
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
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
            size="icon-sm"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            disabled={format(addDays(selectedDate, 1), 'yyyy-MM-dd') > format(new Date(), 'yyyy-MM-dd')}
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
            {(Object.entries(CATEGORY_CONFIG) as [HabitCategory, typeof CATEGORY_CONFIG[HabitCategory]][]).map(([key, config]) => (
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
              habit={habit}
              streak={getHabitStreak(habit)}
              isCompleted={habit.completions[dateKey] || false}
              onToggle={() => toggleHabitCompletion(habit.id, dateKey)}
              onEdit={() => {}}
              onDelete={() => deleteHabit(habit.id)}
              onAddNote={(note) => addNote(habit.id, note, dateKey)}
            />
          ))}
        </div>
      )}

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addHabit}
      />
    </div>
  );
};

export default Habits;
