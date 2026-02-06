import React from 'react';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Bell, 
  Download, 
  Trash2, 
  User,
  Palette
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useHabits } from '@/hooks/useHabits';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { habits, stats } = useHabits();

  const handleExportData = () => {
    const data = {
      habits,
      stats,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitflow-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('habitflow_data');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-secondary">
          <SettingsIcon className="w-6 h-6 text-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Customize your experience</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Guest User</h3>
              <p className="text-sm text-muted-foreground">Free Plan</p>
              <p className="text-xs text-muted-foreground mt-1">
                Level {stats.level} • {stats.totalXP} XP
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-sm text-foreground">
              🔒 Sign in to sync your data across devices and unlock cloud features.
            </p>
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Theme</h3>
                <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
              </div>
              <button
                onClick={toggleTheme}
                className={cn(
                  "relative w-14 h-8 rounded-full transition-colors",
                  theme === 'dark' ? "bg-primary" : "bg-secondary"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center",
                  theme === 'dark' ? "translate-x-7" : "translate-x-1"
                )}>
                  {theme === 'dark' ? (
                    <Moon className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-accent" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Browser Notifications</h3>
                <p className="text-sm text-muted-foreground">Get reminders for your habits</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  if ('Notification' in window) {
                    Notification.requestPermission().then(permission => {
                      if (permission === 'granted') {
                        new Notification('HabitFlow', {
                          body: 'Notifications enabled! You\'ll receive habit reminders.',
                          icon: '/favicon.ico'
                        });
                      }
                    });
                  }
                }}
              >
                Enable
              </Button>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Export Data</h3>
                <p className="text-sm text-muted-foreground">Download your habits and progress</p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <h3 className="font-medium text-destructive">Clear All Data</h3>
                <p className="text-sm text-muted-foreground">Permanently delete all habits and progress</p>
              </div>
              <Button variant="destructive" onClick={handleClearData}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </section>

        {/* App Info */}
        <section className="rounded-2xl border border-border bg-card p-5 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <h3 className="font-semibold text-foreground">HabitFlow</h3>
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          <p className="text-xs text-muted-foreground mt-2">
            Built with ❤️ for better habits
          </p>
        </section>
      </div>
    </div>
  );
};

export default Settings;
