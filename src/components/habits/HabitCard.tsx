import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Flame, MoreVertical, Pencil, Trash2, StickyNote, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    color: string;
    category: string;
    priority: string;
    habit_type: string;
    target_value: number | null;
    unit_label: string | null;
  };
  streak: number;
  isCompleted: boolean;
  loggedValue: number | null;
  note?: string;
  onToggle: () => void;
  onLogValue: (value: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: (note: string) => void;
  className?: string;
}

const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  streak,
  isCompleted,
  loggedValue,
  note,
  onToggle,
  onLogValue,
  onEdit,
  onDelete,
  onAddNote,
  className,
}) => {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [showValueInput, setShowValueInput] = useState(false);
  const categoryConfig = CATEGORY_CONFIG[habit.category] || CATEGORY_CONFIG.productivity;

  const isValueType = habit.habit_type === 'number' || habit.habit_type === 'time_duration' || habit.habit_type === 'custom_unit';
  const progress = isValueType && habit.target_value && loggedValue
    ? Math.min(100, (loggedValue / habit.target_value) * 100)
    : 0;

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText);
      setNoteText('');
      setShowNoteInput(false);
    }
  };

  const handleLogValue = () => {
    const val = parseFloat(valueInput);
    if (!isNaN(val) && val >= 0) {
      onLogValue(val);
      setValueInput('');
      setShowValueInput(false);
    }
  };

  const renderValueDisplay = () => {
    if (!isValueType) return null;

    const unit = habit.unit_label || '';
    const target = habit.target_value;

    if (habit.habit_type === 'time_duration') {
      const logged = loggedValue ? formatDuration(loggedValue) : '0m';
      const targetStr = target ? formatDuration(target) : '—';
      return (
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{logged}</span>
            <span>{targetStr}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      );
    }

    return (
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{loggedValue ?? 0} {unit}</span>
          {target && <span>{target} {unit}</span>}
        </div>
        {target && <Progress value={progress} className="h-2" />}
      </div>
    );
  };

  return (
    <div className={cn(
      "group relative rounded-2xl border transition-all duration-300 animate-scale-in",
      isCompleted 
        ? "bg-success/5 border-success/30" 
        : "bg-card border-border hover:border-primary/30 hover:shadow-lg",
      className
    )}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <div className="shrink-0 pt-1 opacity-0 group-hover:opacity-50 transition-opacity cursor-grab">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Checkbox (only for checkbox type) */}
          {habit.habit_type === 'checkbox' || habit.habit_type === 'fixed_time' ? (
            <button
              onClick={onToggle}
              className={cn(
                "shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
                isCompleted
                  ? "bg-success border-success"
                  : "border-border hover:border-primary hover:bg-primary/5"
              )}
            >
              {isCompleted && (
                <Check className="w-4 h-4 text-success-foreground animate-scale-in" />
              )}
            </button>
          ) : (
            <button
              onClick={() => setShowValueInput(!showValueInput)}
              className={cn(
                "shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 text-xs font-bold",
                progress >= 100
                  ? "bg-success border-success text-success-foreground"
                  : "border-primary/50 text-primary hover:bg-primary/5"
              )}
            >
              {progress >= 100 ? <Check className="w-4 h-4" /> : '+'}
            </button>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{habit.icon}</span>
                  <h3 className={cn(
                    "font-semibold text-foreground transition-all duration-200 truncate",
                    (isCompleted || progress >= 100) && "line-through opacity-60"
                  )}>
                    {habit.name}
                  </h3>
                </div>
                {habit.description && (
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                    {habit.description}
                  </p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowNoteInput(!showNoteInput)}>
                    <StickyNote className="w-4 h-4 mr-2" />
                    Add Note
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={onDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Value display for number/time habits */}
            {renderValueDisplay()}

            {/* Value input */}
            {showValueInput && isValueType && (
              <div className="mt-3 flex gap-2">
                <Input
                  type="number"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  placeholder={habit.habit_type === 'time_duration' ? 'Minutes' : `Value (${habit.unit_label || ''})`}
                  className="flex-1 h-9"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogValue()}
                  autoFocus
                  min="0"
                />
                <Button size="sm" onClick={handleLogValue}>Log</Button>
              </div>
            )}

            {/* Tags row */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {/* Category tag */}
              <span 
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                style={{ 
                  backgroundColor: `${categoryConfig.color}15`,
                  color: categoryConfig.color
                }}
              >
                <span>{categoryConfig.icon}</span>
                {categoryConfig.label}
              </span>

              {/* Habit type badge */}
              {habit.habit_type !== 'checkbox' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                  {habit.habit_type === 'number' && '🔢'}
                  {habit.habit_type === 'time_duration' && '⏱️'}
                  {habit.habit_type === 'fixed_time' && '⏰'}
                  {habit.habit_type === 'custom_unit' && '📏'}
                  {habit.habit_type.replace('_', ' ')}
                </span>
              )}

              {/* Priority */}
              {habit.priority === 'high' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium">
                  🔥 High
                </span>
              )}

              {/* Streak */}
              {streak > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-streak/10 text-streak text-xs font-medium">
                  <Flame className="w-3 h-3" />
                  {streak}d
                </span>
              )}

              {/* XP indicator */}
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-xp/10 text-xp text-xs font-medium">
                +10 XP
              </span>
            </div>

            {/* Today's note */}
            {note && (
              <div className="mt-3 p-2 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                📝 {note}
              </div>
            )}

            {/* Note input */}
            {showNoteInput && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  autoFocus
                />
                <Button size="sm" onClick={handleAddNote}>Save</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
