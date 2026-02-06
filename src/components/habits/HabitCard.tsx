import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Flame, MoreVertical, Pencil, Trash2, StickyNote } from 'lucide-react';
import { Habit, CATEGORY_CONFIG } from '@/types/habit';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HabitCardProps {
  habit: Habit;
  streak: number;
  isCompleted: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: (note: string) => void;
  className?: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  streak,
  isCompleted,
  onToggle,
  onEdit,
  onDelete,
  onAddNote,
  className,
}) => {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState('');
  const categoryConfig = CATEGORY_CONFIG[habit.category];
  const todayNote = habit.notes[format(new Date(), 'yyyy-MM-dd')];

  const handleAddNote = () => {
    if (note.trim()) {
      onAddNote(note);
      setNote('');
      setShowNoteInput(false);
    }
  };

  return (
    <div className={cn(
      "group relative rounded-2xl border transition-all duration-300",
      isCompleted 
        ? "bg-success/5 border-success/30" 
        : "bg-card border-border hover:border-primary/30",
      className
    )}>
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
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
              <Check className="w-4 h-4 text-success-foreground animate-check-mark" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={cn(
                  "font-semibold text-foreground transition-all duration-200",
                  isCompleted && "line-through opacity-60"
                )}>
                  {habit.name}
                </h3>
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
                    size="icon-sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
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

              {/* Streak */}
              {streak > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-streak/10 text-streak text-xs font-medium">
                  <Flame className="w-3 h-3" />
                  {streak} day{streak > 1 ? 's' : ''}
                </span>
              )}

              {/* XP indicator */}
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-xp/10 text-xp text-xs font-medium">
                +10 XP
              </span>
            </div>

            {/* Today's note */}
            {todayNote && (
              <div className="mt-3 p-2 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                📝 {todayNote}
              </div>
            )}

            {/* Note input */}
            {showNoteInput && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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
