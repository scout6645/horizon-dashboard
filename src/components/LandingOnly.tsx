import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Landing from '@/pages/Landing';

/**
 * Shows the landing page only for guests. Logged-in users hitting "/" are
 * redirected to /dashboard so the app always lands on the marketing page
 * for new visitors.
 */
export const LandingOnly: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center animate-pulse-glow">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Landing />;
};
