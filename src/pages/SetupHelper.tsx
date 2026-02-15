import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, ExternalLink, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Setup helper - shows exact values to copy into Supabase & Vercel.
 * Access at /setup-helper (add route) or via direct link.
 */
const SetupHelper: React.FC = () => {
  const { toast } = useToast();
  const [vercelUrl, setVercelUrl] = useState(
    typeof window !== 'undefined' ? window.location.origin : ''
  );
  const [copied, setCopied] = useState<string | null>(null);

  const redirectUrl = `${vercelUrl}/auth/callback`;
  const redirectUrlsList = [
    `${vercelUrl}/auth/callback`,
    `${vercelUrl}/**`,
  ].join('\n');

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({ title: 'Copied!', description: `${label} copied to clipboard` });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-background max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to app
      </Link>
      <h1 className="text-2xl font-bold mb-2">Supabase Setup Helper</h1>
      <p className="text-muted-foreground mb-6">
        Copy these values into your Supabase dashboard.
      </p>

      <div className="space-y-2 mb-6">
        <Label>Your app URL (update if different)</Label>
        <Input
          value={vercelUrl}
          onChange={(e) => setVercelUrl(e.target.value)}
          placeholder="https://your-app.vercel.app"
        />
      </div>

      <div className="space-y-6">
        {/* URL Configuration */}
        <section className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">1. URL Configuration</h2>
            <a
              href="https://supabase.com/dashboard/project/_/auth/url-configuration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              Open <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div>
            <Label className="text-xs">Site URL</Label>
            <div className="flex gap-2 mt-1">
              <Input value={vercelUrl} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copy(vercelUrl, 'Site URL')}
              >
                {copied === 'Site URL' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs">Redirect URLs (add both)</Label>
            <div className="flex gap-2 mt-1">
              <Input value={redirectUrl} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copy(redirectUrlsList, 'Redirect URLs')}
              >
                {copied === 'Redirect URLs' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </section>

        {/* Sign In / Providers */}
        <section className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">2. Sign In / Providers → Google</h2>
            <a
              href="https://supabase.com/dashboard/project/_/auth/providers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              Open <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Enable Google provider</li>
            <li>Create OAuth credentials at Google Cloud Console</li>
            <li>Copy redirect URI from Supabase page into Google</li>
            <li>Paste Client ID & Secret into Supabase</li>
          </ul>
        </section>

        {/* Vercel Env */}
        <section className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">3. Vercel Environment Variables</h2>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              Open <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Add these in Vercel → Project → Settings → Environment Variables:
          </p>
          <ul className="text-sm font-mono space-y-2">
            <li>VITE_SUPABASE_URL</li>
            <li>VITE_SUPABASE_ANON_KEY</li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Get values from Supabase → Project Settings → API
          </p>
        </section>
      </div>
    </div>
  );
};

export default SetupHelper;
