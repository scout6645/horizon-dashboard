

# DisciplineX -- Enhancement Plan

This project already has a solid foundation with authentication, habit tracking, analytics, gamification, and a premium UI. Rather than rebuilding from scratch (which would break working features), this plan enhances the existing app with the highest-impact missing features.

**Note:** This project uses React + Vite + Tailwind (not Next.js), and Lovable Cloud for the backend (not Firebase). These are the right tools for this platform and cannot be changed.

---

## Phase 1: Rebrand and Fix Core Issues

**Rebrand to DisciplineX**
- Update Landing page: replace "HabitFlow" with "DisciplineX -- Life Operating System" throughout, update tagline and branding copy
- Update Auth page branding
- Update Settings footer and sidebar logo
- Update page title in index.html

**Fix Edit Habit (currently broken -- `onEdit` is `() => {}`)**
- Wire up the `AddHabitModal` in edit mode by passing `editHabit` prop and calling `updateHabit` from `useHabitsDB`
- Add edit state management in Dashboard and Habits pages

**Display Name Greeting**
- Dashboard greeting currently shows generic "Good Morning". Update to show `profile?.full_name` when available: "Good Morning, {name}"
- Settings page: add editable display name field that updates the `profiles` table

---

## Phase 2: Advanced Habit Types (Database Migration Required)

**New columns on `habits` table:**
- `habit_type` (text, default 'checkbox') -- checkbox, number, time_duration, fixed_time, custom_unit
- `target_value` (numeric, nullable) -- target number/minutes
- `unit_label` (text, nullable) -- custom unit label (reps, km, pages, etc.)
- `reminder_time` (time, nullable) -- for reminders

**New column on `habit_completions` table:**
- `value` (numeric, nullable) -- actual value logged (e.g., 45 minutes, 30 reps)

**UI Changes:**
- Update `AddHabitModal` with habit type selector and conditional fields (target value, unit, time picker)
- Update `HabitCard` to show progress bars for number/time habits instead of just checkboxes
- Add time duration input (HH:MM format) for time-based habits
- Add more frequency options: specific days, X times/week

---

## Phase 3: New Pages

**Goals Page (`/goals`)**
- Create `goals` table: id, user_id, title, description, target_date, progress, linked_habit_ids, created_at
- RLS policies for user-owned data
- UI: goal cards with progress rings, ability to link habits to goals

**Journal Page (`/journal`)**
- Create `journal_entries` table: id, user_id, content, mood (1-5), created_at
- RLS policies
- UI: daily journal with mood selector, rich text area, entry history

**Pricing Page (`/pricing`)**
- Static page with free tier highlighted, future pro/premium tiers shown as "Coming Soon"
- No backend needed

---

## Phase 4: Gamification and Engagement Enhancements

**Confetti Animation**
- Add confetti burst when a habit is completed (using CSS animation, no library needed)
- Trigger on perfect day completion

**Skeleton Loaders**
- Replace `Loader2` spinners with skeleton UI on Dashboard, Habits, and Analytics pages using the existing `Skeleton` component

**Share Card Generation**
- Canvas-based discipline score card generator
- Shows: Life Performance Score, streak, level, consistency
- Download as PNG button

---

## Phase 5: Focus Timer and Extra Features

**Pomodoro Timer**
- New component on Dashboard or separate route
- Configurable work/break intervals (default 25/5)
- Session counter, audio alert option
- Local state only (no database needed)

**CSV Export**
- Add CSV export option alongside existing JSON export in Settings
- Export habit completions with dates, values, and notes

**Drag and Reorder Habits**
- Implement drag-to-reorder on the Habits page using the existing `sort_order` column
- Update sort order in database on drop

---

## Technical Details

### Database Migration SQL (Phase 2 and 3)

**Habits table additions:**
```sql
ALTER TABLE habits ADD COLUMN habit_type text NOT NULL DEFAULT 'checkbox';
ALTER TABLE habits ADD COLUMN target_value numeric;
ALTER TABLE habits ADD COLUMN unit_label text;
ALTER TABLE habits ADD COLUMN reminder_time time;
```

**Completions table addition:**
```sql
ALTER TABLE habit_completions ADD COLUMN value numeric;
```

**Goals table:**
```sql
CREATE TABLE goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  target_date date,
  progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
-- RLS: users can only access own goals (SELECT, INSERT, UPDATE, DELETE)
```

**Journal table:**
```sql
CREATE TABLE journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL,
  mood integer DEFAULT 3,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
-- RLS: users can only access own entries
```

### Files to Create
- `src/pages/Goals.tsx`
- `src/pages/Journal.tsx`
- `src/pages/Pricing.tsx`
- `src/components/habits/EditHabitModal.tsx` (or reuse AddHabitModal)
- `src/components/dashboard/FocusTimer.tsx`
- `src/components/dashboard/ShareCard.tsx`
- `src/components/ui/confetti.tsx`

### Files to Modify
- `src/App.tsx` -- add new routes
- `src/pages/Landing.tsx` -- rebrand
- `src/pages/Auth.tsx` -- rebrand
- `src/pages/Dashboard.tsx` -- greeting with name, confetti, skeleton loaders, focus timer
- `src/pages/Habits.tsx` -- edit habit wiring, drag reorder
- `src/pages/Settings.tsx` -- rebrand, display name editor, CSV export
- `src/components/layout/Sidebar.tsx` -- add Goals, Journal nav items
- `src/components/layout/MobileNav.tsx` -- update nav items
- `src/components/habits/AddHabitModal.tsx` -- habit type fields
- `src/components/habits/HabitCard.tsx` -- progress bar for number/time habits
- `src/hooks/useHabitsDB.ts` -- handle new columns and tables
- `index.html` -- update title

### Implementation Order
1. Rebrand + fix edit habit + display name (quick wins)
2. Database migration for new columns and tables
3. Advanced habit types UI
4. Goals and Journal pages
5. Confetti, skeletons, share card
6. Focus timer, CSV export, drag reorder
7. Pricing page (static, last priority)

