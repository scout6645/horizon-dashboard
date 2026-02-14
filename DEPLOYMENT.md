# Horizon Dashboard – FREE production deployment guide

**Stack:** React + Vite + TypeScript (frontend only), Supabase (DB + Auth).  
**Hosting:** Vercel (frontend, free). No separate backend – Supabase is used directly from the browser.

---

## STEP 1 – Repo analysis (done)

| Item | Result |
|------|--------|
| Frontend | React 18 + Vite 5 + TypeScript |
| Backend | None (Supabase client-only) |
| Supabase | `@supabase/supabase-js` – URL + anon key in env |
| Env vars | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` |
| Routing | `/` = Landing (public), `/auth` = Login/Signup, `/dashboard` and under = app (protected) |
| Build | `npm run build` → `dist/` |

---

## STEP 2 – Production prep (done in repo)

- Landing page is the default route (`/`).
- `.env.example` added – copy to `.env` locally; on Vercel use Environment Variables.
- `.env` and `.env.local` are in `.gitignore` (never commit secrets).
- `vercel.json` added for SPA routing (all routes → `index.html`).
- Post-login and email confirmation redirect to `/dashboard`.

---

## STEP 3 – Supabase setup

1. **Get your keys**  
   - Go to [Supabase Dashboard](https://app.supabase.com) → your project → **Project Settings** → **API**.  
   - Copy **Project URL** → use as `VITE_SUPABASE_URL`.  
   - Copy **anon public** key → use as `VITE_SUPABASE_PUBLISHABLE_KEY`.

2. **Auth redirect for production**  
   - In Supabase: **Authentication** → **URL Configuration**.  
   - **Site URL:** set to your Vercel URL, e.g. `https://your-app.vercel.app`.  
   - **Redirect URLs:** add (replace with your real Vercel URL):
     - `https://your-app.vercel.app/**`
     - `https://your-app.vercel.app/dashboard`
     - `https://your-app.vercel.app/auth/callback`
   - Save. Email confirmation links will send users to `/auth/callback`, then the app redirects to `/dashboard`.

3. **Optional: disable email verification**  
   - If you want users to sign in **without** confirming email:  
   - Supabase → **Authentication** → **Providers** → **Email**.  
   - Turn **OFF** “Confirm email”.  
   - Then new signups can sign in immediately; no verification email is sent.

4. **RLS**  
   - Your app uses Supabase with the anon key; RLS policies in `supabase/migrations/` apply. Run migrations in the Supabase SQL editor or via CLI if you haven’t already.

---

## STEP 4 – No separate backend (Render not needed)

This project has **no Node/Express server**. The frontend talks to Supabase from the browser.  
You only deploy the frontend to **Vercel**. Skip Render.

---

## STEP 5 – Deploy frontend on Vercel (FREE)

### 5.1 Push this repo to GitHub

Use the existing repo or your fork. Ensure all production changes are committed and pushed:

```powershell
cd c:\Users\91851\OneDrive\Desktop\HabitTracker\horizon-dashboard-deploy
git add .
git status
git commit -m "Production: landing default, vercel.json, .env.example, routing"
git remote -v
git push origin main
```

(Use `master` instead of `main` if that’s your default branch.)

### 5.2 Create Vercel project

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New** → **Project**.
3. **Import** the repo `scout6645/horizon-dashboard` (or your fork).
4. **Configure:**
   - **Framework Preset:** Vite (should be auto-detected).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `dist` (default).
   - **Install Command:** `npm install` (default).
5. **Environment Variables** (required for build and runtime):
   - `VITE_SUPABASE_URL` = your Supabase Project URL.
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase anon public key.
6. Click **Deploy**.

### 5.3 After first deploy

- Vercel will give you a URL like `https://horizon-dashboard-xxx.vercel.app`.
- Open it: you should see the **landing page** at `/`.
- Go to `/auth`, sign up or sign in – you should be redirected to `/dashboard`.

---

## STEP 6 – Exact checklist

1. **Supabase**  
   - [ ] Copy Project URL and anon key from Project Settings → API.  
   - [ ] Set Site URL and Redirect URLs in Authentication → URL Configuration to your Vercel URL.

2. **GitHub**  
   - [ ] Push latest code (including `vercel.json`, `.env.example`, routing and landing-as-default).

3. **Vercel**  
   - [ ] Import GitHub repo.  
   - [ ] Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.  
   - [ ] Deploy (Build: `npm run build`, Output: `dist`).

4. **Verify**  
   - [ ] Open live URL → landing at `/`.  
   - [ ] `/auth` → sign in → redirect to `/dashboard`.  
   - [ ] Refresh on `/dashboard` or `/habits` – no 404 (SPA routing works).

---

## Local run (optional)

```powershell
cd c:\Users\91851\OneDrive\Desktop\HabitTracker\horizon-dashboard-deploy
copy .env.example .env
# Edit .env and set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
npm install
npm run dev
```

Open `http://localhost:8080` – landing at `/`, then `/auth`, then `/dashboard`.

---

## Summary

- **100% FREE:** Vercel free tier (frontend) + Supabase free tier (DB + Auth).  
- **Single deploy:** Only Vercel; no Render or other backend host.  
- **Env vars:** Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (in Vercel and in local `.env`).  
- **Live URL:** Whatever Vercel assigns, e.g. `https://horizon-dashboard-xxx.vercel.app`.
