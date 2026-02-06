import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Plus } from 'lucide-react';
import { Habit, HabitCategory, CATEGORY_CONFIG } from '@/types/habit';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'notes'>) => void;
  editHabit?: Habit;
}

const HABIT_ICONS = ['⭐', '💪', '📚', '🧘', '🏃', '💊', '🥗', '💧', '😴', '🎯', '✍️', '🎨'];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  editHabit,
}) => {
  const [name, setName] = useState(editHabit?.name || '');
  const [description, setDescription] = useState(editHabit?.description || '');
  const [category, setCategory] = useState<HabitCategory>(editHabit?.category || 'productivity');
  const [icon, setIcon] = useState(editHabit?.icon || '⭐');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(editHabit?.frequency || 'daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      icon,
      color: CATEGORY_CONFIG[category].color,
      frequency,
    });

    // Reset form
    setName('');
    setDescription('');
    setCategory('productivity');
    setIcon('⭐');
    setFrequency('daily');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editHabit ? 'Edit Habit' : 'Create New Habit'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Read for 30 minutes"
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this habit..."
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
              rows={2}
            />
          </div>

          {/* Icon selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {HABIT_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={cn(
                    "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                    icon === i 
                      ? "bg-primary/20 ring-2 ring-primary" 
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(CATEGORY_CONFIG) as [HabitCategory, typeof CATEGORY_CONFIG[HabitCategory]][]).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-center",
                    category === key
                      ? "ring-2 ring-primary"
                      : "hover:bg-secondary"
                  )}
                  style={{
                    backgroundColor: category === key ? `${config.color}15` : undefined,
                  }}
                >
                  <span className="text-lg">{config.icon}</span>
                  <span className="text-xs font-medium">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Frequency
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={cn(
                  "flex-1 py-3 rounded-xl font-medium transition-all",
                  frequency === 'daily'
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekly')}
                className={cn(
                  "flex-1 py-3 rounded-xl font-medium transition-all",
                  frequency === 'weekly'
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Weekly
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              {editHabit ? 'Save Changes' : 'Add Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
