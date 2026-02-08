import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Flame, MoreVertical, Pencil, Trash2, StickyNote, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
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
  };
  streak: number;
  isCompleted: boolean;
  note?: string;
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
  note,
  onToggle,
  onEdit,
  onDelete,
  onAddNote,
  className,
}) => {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const categoryConfig = CATEGORY_CONFIG[habit.category] || CATEGORY_CONFIG.productivity;

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText);
      setNoteText('');
      setShowNoteInput(false);
    }
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
          {/* Drag handle placeholder */}
          <div className="shrink-0 pt-1 opacity-0 group-hover:opacity-50 transition-opacity cursor-grab">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>

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
              <Check className="w-4 h-4 text-success-foreground animate-scale-in" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{habit.icon}</span>
                  <h3 className={cn(
                    "font-semibold text-foreground transition-all duration-200 truncate",
                    isCompleted && "line-through opacity-60"
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
                  {streak} day{streak > 1 ? 's' : ''}
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
