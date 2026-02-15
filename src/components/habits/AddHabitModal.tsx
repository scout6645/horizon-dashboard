import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Plus, Save, Clock, Hash, CheckSquare, Timer, Ruler } from 'lucide-react';
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

interface HabitFormData {
  name: string;
  description: string | null;
  icon: string;
  color: string;
  category: string;
  frequency: string;
  priority: string;
  habit_type: string;
  target_value: number | null;
  unit_label: string | null;
  reminder_time: string | null;
}

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: HabitFormData) => Promise<any>;
  editHabit?: Partial<HabitFormData> & { id: string };
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
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
];

const HABIT_TYPES = [
  { key: 'checkbox', label: 'Checkbox', icon: CheckSquare, desc: 'Done / Not done' },
  { key: 'number', label: 'Number', icon: Hash, desc: 'Track a count' },
  { key: 'time_duration', label: 'Duration', icon: Timer, desc: 'Track HH:MM' },
  { key: 'fixed_time', label: 'Fixed Time', icon: Clock, desc: 'Wake/sleep time' },
  { key: 'custom_unit', label: 'Custom Unit', icon: Ruler, desc: '₹, km, cal...' },
];

const FREQUENCIES = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'weekdays', label: 'Weekdays' },
  { key: 'weekends', label: 'Weekends' },
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  editHabit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('productivity');
  const [icon, setIcon] = useState('⭐');
  const [frequency, setFrequency] = useState('daily');
  const [priority, setPriority] = useState('medium');
  const [habitType, setHabitType] = useState('checkbox');
  const [targetValue, setTargetValue] = useState('');
  const [unitLabel, setUnitLabel] = useState('');
  const [targetHours, setTargetHours] = useState('');
  const [targetMinutes, setTargetMinutes] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (editHabit) {
      setName(editHabit.name || '');
      setDescription(editHabit.description || '');
      setCategory(editHabit.category || 'productivity');
      setIcon(editHabit.icon || '⭐');
      setFrequency(editHabit.frequency || 'daily');
      setPriority(editHabit.priority || 'medium');
      setHabitType(editHabit.habit_type || 'checkbox');
      setUnitLabel(editHabit.unit_label || '');
      setReminderTime(editHabit.reminder_time || '');
      
      if (editHabit.habit_type === 'time_duration' && editHabit.target_value) {
        setTargetHours(String(Math.floor(editHabit.target_value / 60)));
        setTargetMinutes(String(editHabit.target_value % 60));
      } else {
        setTargetValue(editHabit.target_value ? String(editHabit.target_value) : '');
        setTargetHours('');
        setTargetMinutes('');
      }
    } else {
      resetForm();
    }
  }, [editHabit]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('productivity');
    setIcon('⭐');
    setFrequency('daily');
    setPriority('medium');
    setHabitType('checkbox');
    setTargetValue('');
    setUnitLabel('');
    setTargetHours('');
    setTargetMinutes('');
    setReminderTime('');
  };

  const selectedCategory = CATEGORIES.find(c => c.key === category) || CATEGORIES[3];

  const computeTargetValue = (): number | null => {
    if (habitType === 'checkbox') return null;
    if (habitType === 'time_duration') {
      const h = parseInt(targetHours) || 0;
      const m = parseInt(targetMinutes) || 0;
      return h * 60 + m || null;
    }
    if (habitType === 'fixed_time' && targetValue) {
      const [h, m] = targetValue.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) return h * 60 + m;
    }
    return parseFloat(targetValue) || null;
  };

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
        habit_type: habitType,
        target_value: computeTargetValue(),
        unit_label: (habitType === 'number' || habitType === 'custom_unit') ? (unitLabel.trim() || null) : null,
        reminder_time: reminderTime || null,
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
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

          {/* Habit Type */}
          <div className="space-y-2">
            <Label>Habit Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {HABIT_TYPES.map((ht) => {
                const Icon = ht.icon;
                return (
                  <button
                    key={ht.key}
                    type="button"
                    onClick={() => setHabitType(ht.key)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-center border",
                      habitType === ht.key
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border hover:border-primary/30 hover:bg-secondary"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{ht.label}</span>
                    <span className="text-[10px] text-muted-foreground">{ht.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional: Target Value for number/custom_unit */}
          {(habitType === 'number' || habitType === 'custom_unit') && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Target Value</Label>
                <Input
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="e.g., 50"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input
                  type="text"
                  value={unitLabel}
                  onChange={(e) => setUnitLabel(e.target.value)}
                  placeholder={habitType === 'custom_unit' ? '₹, km, cal...' : 'reps, pages...'}
                />
              </div>
            </div>
          )}

          {/* Conditional: Time Duration (HH:MM) */}
          {habitType === 'time_duration' && (
            <div className="space-y-2">
              <Label>Target Duration (HH:MM)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={targetHours}
                  onChange={(e) => setTargetHours(e.target.value)}
                  placeholder="HH"
                  min="0"
                  max="23"
                  className="w-20 text-center"
                />
                <span className="text-lg font-bold text-muted-foreground">:</span>
                <Input
                  type="number"
                  value={targetMinutes}
                  onChange={(e) => setTargetMinutes(e.target.value)}
                  placeholder="MM"
                  min="0"
                  max="59"
                  className="w-20 text-center"
                />
              </div>
            </div>
          )}

          {/* Conditional: Fixed Time */}
          {habitType === 'fixed_time' && (
            <div className="space-y-2">
              <Label>Target Time</Label>
              <Input
                type="time"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">e.g., Wake up at 5:45 AM</p>
            </div>
          )}

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
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFrequency(f.key)}
                  className={cn(
                    "py-2.5 rounded-xl font-medium transition-all text-sm",
                    frequency === f.key
                      ? "gradient-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Time */}
          <div className="space-y-2">
            <Label>Reminder Time (optional)</Label>
            <Input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
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
