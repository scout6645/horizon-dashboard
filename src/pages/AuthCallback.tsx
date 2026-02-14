import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles } from 'lucide-react';

/**
 * Handles redirect from Supabase after email confirmation or OAuth.
 * Supabase sends users here with #access_token=...; we wait for the
 * client to process the hash then redirect to dashboard.
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          navigate('/dashboard', { replace: true });
        }
      }
    );

    // Process OAuth callback hash and poll for session (Supabase parses hash async)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    };

    const timer = setTimeout(checkSession, 800);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

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
