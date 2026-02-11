import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  Brain, 
  Trophy, 
  BarChart3, 
  ArrowRight, 
  Check,
  Zap,
  Shield,
  Cloud
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Smart Habit Tracking',
      description: 'Create, organize, and track habits with categories, priorities, and daily check-ins.'
    },
    {
      icon: TrendingUp,
      title: 'Streak & Progress',
      description: 'Build momentum with streak tracking, completion heatmaps, and progress analytics.'
    },
    {
      icon: Brain,
      title: 'AI Insights',
      description: 'Get personalized suggestions, productivity reports, and smart recommendations.'
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'Earn XP, level up, and unlock achievement badges as you build better habits.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Visualize your progress with beautiful charts, heatmaps, and trend analysis.'
    },
    {
      icon: Cloud,
      title: 'Cloud Sync',
      description: 'Your data syncs across all devices automatically and securely.'
    },
  ];

  const benefits = [
    'Unlimited habit tracking',
    'AI-powered insights',
    'Cross-device sync',
    'Dark & light modes',
    'Achievement system',
    '100% Free forever',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">DisciplineX</span>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button variant="gradient" size="sm">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-scale-in">
            <Zap className="w-4 h-4" />
            Life Operating System
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up">
            Master Your Discipline.
            <span className="block text-gradient">Operate Your Life.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Track habits, build streaks, and get AI-powered insights to unlock your full potential. 
            Your personal life operating system, completely free.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/auth">
              <Button size="lg" variant="gradient" className="text-lg px-8 h-14 shadow-glow">
                Start Free Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                View Demo
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
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
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you build and maintain habits that stick
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Why Choose DisciplineX?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We've built the most comprehensive discipline tracking platform, completely free. 
                No hidden fees, no premium tiers, just pure productivity tools.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/auth" className="inline-block mt-8">
                <Button size="lg" variant="gradient">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl gradient-primary p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold mb-2">Track. Grow. Achieve.</h3>
                  <p className="text-white/80">Join thousands building better habits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Habits?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join DisciplineX today and start your journey to a more disciplined you.
          </p>
          
          <Link to="/auth">
            <Button size="lg" variant="gradient" className="text-lg px-10 h-14 shadow-glow">
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-foreground">DisciplineX</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2026 DisciplineX. Built for your success.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
