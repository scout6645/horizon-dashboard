import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SupabaseConfigError: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
    <div className="max-w-md w-full rounded-xl border border-destructive/50 bg-destructive/10 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-8 h-8 text-destructive shrink-0" />
        <h1 className="text-lg font-semibold text-foreground">Supabase Not Configured</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Add these environment variables in Vercel for the app to work:
      </p>
      <ul className="text-sm font-mono bg-muted/50 p-3 rounded-lg space-y-1">
        <li>VITE_SUPABASE_URL</li>
        <li>VITE_SUPABASE_ANON_KEY</li>
      </ul>
      <p className="text-xs text-muted-foreground">
        Get them from Supabase Dashboard → Project Settings → API. Then redeploy.
      </p>
      <div className="flex flex-col gap-2">
        <Link to="/setup-helper">
          <Button variant="outline" className="w-full">
            <Settings className="w-4 h-4 mr-2" />
            Setup Helper – copy exact values for Supabase
          </Button>
        </Link>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-primary hover:underline text-center"
        >
          Open Supabase Dashboard →
        </a>
      </div>
    </div>
  </div>
);
