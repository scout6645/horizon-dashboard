import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles } from 'lucide-react';

/**
 * Handles redirect from Supabase after email confirmation or OAuth.
 * For OAuth PKCE: URL has ?code=... - we exchange it for a session.
 * For email confirm / implicit: URL has #access_token=... - client auto-parses.
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    let subscription: { unsubscribe: () => void } | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const finishAuth = () => {
      if (cancelled) return;
      navigate('/dashboard', { replace: true });
    };

    const failAuth = () => {
      if (cancelled) return;
      navigate('/', { replace: true });
    };

    (async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        if (import.meta.env.DEV) console.warn('[AuthCallback] OAuth error:', errorParam);
        failAuth();
        return;
      }

      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('[AuthCallback] exchangeCodeForSession error:', error);
            failAuth();
            return;
          }
          if (data.session && !cancelled) finishAuth();
        } catch (e) {
          console.error('[AuthCallback] exchangeCodeForSession exception:', e);
          failAuth();
        }
        return;
      }

      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session && !cancelled) finishAuth();
        }
      );
      subscription = sub;

      // Poll for session (handles hash-based email confirm + slow OAuth)
      const checkSession = async (attempt = 0) => {
        if (cancelled) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (session && !cancelled) {
          finishAuth();
          return;
        }
        if (attempt < 3) {
          timer = setTimeout(() => checkSession(attempt + 1), 600);
        } else if (!cancelled) {
          failAuth();
        }
      };

      timer = setTimeout(() => checkSession(0), 500);
    })();

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center animate-pulse-glow">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
      <p className="text-muted-foreground">Completing sign in...</p>
    </div>
  );
};

export default AuthCallback;
