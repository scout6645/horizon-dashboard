import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Shield, Cloud } from 'lucide-react';
import dashboardMockup from '@/assets/dashboard-mockup.png';

export const HeroSection: React.FC = () => (
  <section className="pt-24 pb-12 lg:pt-32 lg:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
    <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute top-1/3 right-0 w-56 h-56 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        {/* Left - Copy */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-scale-in">
            ⚡ AI-Powered Life Operating System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 animate-slide-up">
            Build Discipline &{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>
              Track Habits Like a Pro
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            AI-powered habit tracker to improve productivity, consistency and daily growth. Free forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/auth">
              <Button size="xl" variant="gradient" className="shadow-glow w-full sm:w-auto">
                Start Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                <Play className="w-4 h-4 mr-2" />
                Try Demo
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              Secure & Private
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-primary" />
              Cloud Synced
            </div>
          </div>
        </div>

        {/* Right - Dashboard Mockup */}
        <div className="relative animate-slide-up lg:pl-4" style={{ animationDelay: '0.3s' }}>
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
            <img
              src={dashboardMockup}
              alt="DisciplineX Dashboard - AI-powered habit tracking dashboard"
              className="w-full h-auto block"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div>
          {/* Floating badges - hidden on small screens to prevent overflow */}
          <div className="hidden sm:block absolute -bottom-4 -left-4 glass rounded-xl px-4 py-3 shadow-lg animate-float">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-success flex items-center justify-center">
                <span className="text-sm">🔥</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Streak</p>
                <p className="text-sm font-bold text-foreground">21 Days</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block absolute -top-4 -right-4 glass rounded-xl px-4 py-3 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                <span className="text-sm">⭐</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">XP Earned</p>
                <p className="text-sm font-bold text-foreground">2,450 XP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
