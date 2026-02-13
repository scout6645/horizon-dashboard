import React from 'react';
import { Button } from '@/components/ui/button';
import { Code2, ExternalLink } from 'lucide-react';

export const FreelanceSection: React.FC = () => (
  <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="rounded-3xl border border-primary/20 bg-card p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
            <Code2 className="w-8 h-8 text-primary-foreground" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Need a Custom Productivity or Habit Tracker App?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            I build custom productivity dashboards, habit trackers, and admin panels for clients and startups. Let's bring your idea to life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:your-email@example.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="gradient" className="shadow-glow">
                Hire Me
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline">
                💬 WhatsApp Me
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
