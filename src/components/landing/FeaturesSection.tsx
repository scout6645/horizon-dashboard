import React from 'react';
import {
  Target,
  Brain,
  Trophy,
  BarChart3,
  Shield,
  Smartphone,
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Smart Habit Tracking',
    description: 'Track daily habits with streaks, categories, priorities, and smart check-ins.',
  },
  {
    icon: Brain,
    title: 'AI Productivity Insights',
    description: 'Get AI-powered suggestions to improve consistency and optimize your routine.',
  },
  {
    icon: Trophy,
    title: 'Gamified Progress',
    description: 'Earn XP, level up, and unlock achievement badges as you build better habits.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Visualize progress with beautiful charts, heatmaps, and trend analysis.',
  },
  {
    icon: Shield,
    title: 'Secure Login & Cloud Sync',
    description: 'Your data syncs across all devices securely with enterprise-grade encryption.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Fully responsive design that works beautifully on any device, anywhere.',
  },
];

export const FeaturesSection: React.FC = () => (
  <section id="features" className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          FEATURES
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Everything You Need to Succeed
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Powerful features designed to help you build and maintain habits that stick
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shrink-0">
              <feature.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed flex-1">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
