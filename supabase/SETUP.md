# Supabase Database Setup

Run these migrations in your Supabase project to set up the database.

## Option 1: Supabase CLI (recommended)

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

## Option 2: Manual SQL in Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **SQL Editor** → New query
3. Run the migration files in order:
   - `migrations/20260208100929_*.sql` (creates tables, RLS, triggers)
   - `migrations/20260212130105_*.sql` (adds habit_type, target_value, etc.)
   - `migrations/20260215000000_fix_google_profile.sql` (fixes Google OAuth profile creation)

## Auth Configuration

1. **Authentication** → **URL Configuration**
   - **Site URL:** `https://your-app.vercel.app`
   - **Redirect URLs:** add `https://your-app.vercel.app/auth/callback`

2. **Authentication** → **Providers** → **Google**
   - Enable Google
   - Add Client ID and Client Secret from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

3. **Authentication** → **Providers** → **Email**
   - For testing: turn OFF "Confirm email" to skip verification
   - For production: keep ON and ensure redirect URL is in the list above
