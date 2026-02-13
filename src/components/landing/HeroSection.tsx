import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Shield, Cloud } from 'lucide-react';
import dashboardMockup from '@/assets/dashboard-mockup.png';

export const HeroSection: React.FC = () => (
  <section className="pt-28 pb-16 lg:pt-36 lg:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
    <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/6 w-72 h-72 bg-accent/8 rounded-full blur-3xl" />

    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left - Copy */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-scale-in">
            ⚡ AI-Powered Life Operating System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.15] mb-6 animate-slide-up">
            Build Discipline &{' '}
            <span className="text-gradient inline-block pb-1">Track Habits Like a Pro</span>
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

          <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-muted-foreground">
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
        <div className="relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
            <img
              src={dashboardMockup}
              alt="DisciplineX Dashboard - AI-powered habit tracking dashboard"
              className="w-full h-auto"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 glass rounded-xl px-4 py-3 shadow-lg animate-float">
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
          <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 glass rounded-xl px-4 py-3 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
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
