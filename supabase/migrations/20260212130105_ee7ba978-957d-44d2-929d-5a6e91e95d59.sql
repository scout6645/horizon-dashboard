
-- Phase 2: Advanced habit types
ALTER TABLE public.habits ADD COLUMN habit_type text NOT NULL DEFAULT 'checkbox';
ALTER TABLE public.habits ADD COLUMN target_value numeric;
ALTER TABLE public.habits ADD COLUMN unit_label text;
ALTER TABLE public.habits ADD COLUMN reminder_time time;

ALTER TABLE public.habit_completions ADD COLUMN value numeric;
