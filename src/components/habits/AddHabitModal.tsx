import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: {
    name: string;
    description: string | null;
    icon: string;
    color: string;
    category: string;
    frequency: string;
    priority: string;
  }) => Promise<any>;
  editHabit?: {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    color: string;
    category: string;
    frequency: string;
    priority: string;
  };
}

const HABIT_ICONS = ['⭐', '💪', '📚', '🧘', '🏃', '💊', '🥗', '💧', '😴', '🎯', '✍️', '🎨'];

const CATEGORIES = [
  { key: 'health', label: 'Health', icon: '💚', color: 'hsl(160 84% 39%)' },
  { key: 'fitness', label: 'Fitness', icon: '💪', color: 'hsl(25 95% 53%)' },
  { key: 'mindfulness', label: 'Mind', icon: '🧘', color: 'hsl(280 67% 52%)' },
  { key: 'productivity', label: 'Work', icon: '⚡', color: 'hsl(199 89% 48%)' },
  { key: 'learning', label: 'Learn', icon: '📚', color: 'hsl(38 92% 50%)' },
  { key: 'social', label: 'Social', icon: '👥', color: 'hsl(340 82% 52%)' },
  { key: 'creativity', label: 'Create', icon: '🎨', color: 'hsl(300 67% 52%)' },
  { key: 'finance', label: 'Finance', icon: '💰', color: 'hsl(140 70% 35%)' },
];

const PRIORITIES = [
  { key: 'low', label: 'Low', color: 'text-muted-foreground' },
  { key: 'medium', label: 'Medium', color: 'text-accent' },
  { key: 'high', label: 'High', color: 'text-destructive' },
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  editHabit,
}) => {
  const [name, setName] = useState(editHabit?.name || '');
  const [description, setDescription] = useState(editHabit?.description || '');
  const [category, setCategory] = useState(editHabit?.category || 'productivity');
  const [icon, setIcon] = useState(editHabit?.icon || '⭐');
  const [frequency, setFrequency] = useState(editHabit?.frequency || 'daily');
  const [priority, setPriority] = useState(editHabit?.priority || 'medium');
  const [loading, setLoading] = useState(false);

  const selectedCategory = CATEGORIES.find(c => c.key === category) || CATEGORIES[3];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onAdd({
        name: name.trim(),
        description: description.trim() || null,
        category,
        icon,
        color: selectedCategory.color,
        frequency,
        priority,
      });

      // Reset form
      setName('');
      setDescription('');
      setCategory('productivity');
      setIcon('⭐');
      setFrequency('daily');
      setPriority('medium');
      onClose();
    } catch (error) {
      console.error('Error adding habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setCategory('productivity');
    setIcon('⭐');
    setFrequency('daily');
    setPriority('medium');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editHabit ? 'Edit Habit' : 'Create New Habit'}
          </DialogTitle>
          <DialogDescription>
            {editHabit ? 'Update your habit details below.' : 'Add a new habit to track your progress.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="habitName">Habit Name *</Label>
            <Input
              id="habitName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Read for 30 minutes"
              required
              autoFocus
              className="h-12"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Icon selector */}
          <div className="space-y-2">
            <Label>Icon</Label>
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
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCategory(cat.key)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all text-center",
                    category === cat.key
                      ? "ring-2 ring-primary"
                      : "hover:bg-secondary"
                  )}
                  style={{
                    backgroundColor: category === cat.key ? `${cat.color}15` : undefined,
                  }}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPriority(p.key)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl font-medium transition-all text-sm",
                    priority === p.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label>Frequency</Label>
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
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              className="flex-1"
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  {editHabit ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {editHabit ? 'Save Changes' : 'Add Habit'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
