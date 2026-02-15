# Troubleshooting – App Not Working

## 1. "Supabase Not Configured" screen

**Cause:** Missing env vars in Vercel.

**Fix:**
1. Vercel → Your project → **Settings** → **Environment Variables**
2. Add:
   - `VITE_SUPABASE_URL` = from Supabase Dashboard → Project Settings → API → Project URL
   - `VITE_SUPABASE_ANON_KEY` = from same page → anon public key
3. Redeploy (Deployments → … → Redeploy)

---

## 2. Login / Sign up not working

**Checklist:**
- [ ] Supabase env vars set in Vercel (see above)
- [ ] Supabase → **Authentication** → **URL Configuration**:
  - **Site URL:** `https://your-vercel-app.vercel.app`
  - **Redirect URLs:** `https://your-vercel-app.vercel.app/auth/callback`
- [ ] Supabase → **Authentication** → **Providers** → **Email** → "Confirm email" OFF for testing (optional)

---

## 3. Google login not working

**Fix:**
1. Supabase → **Authentication** → **Providers** → **Google** → Enable
2. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Create OAuth 2.0 Client ID (Web app)
3. **Authorized redirect URI:** copy from Supabase Google provider page (e.g. `https://xxxx.supabase.co/auth/v1/callback`)
4. Paste **Client ID** and **Client Secret** into Supabase Google settings
5. Save

---

## 4. Habits not saving / "Failed to create habit"

**Causes:** RLS or missing tables.

**Fix:**
1. Supabase → **SQL Editor** → run migrations from `supabase/migrations/` in order
2. Ensure you're logged in before creating habits

---

## 5. Email verification not arriving

- Check **spam/junk** folder
- Supabase free tier: ~3 emails/hour
- Use **Resend verification email** on the auth page
- Or turn OFF "Confirm email" in Supabase → Authentication → Providers → Email

---

## 6. Still not working?

1. Open DevTools (F12) → **Console** – check for red errors
2. **Network** tab – failed requests to `supabase.co`?
3. Verify Supabase project is running (Dashboard loads)
4. Try incognito mode to rule out old session issues
