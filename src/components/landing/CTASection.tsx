import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export const CTASection: React.FC = () => (
  <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
        Start Building Better Habits Today
      </h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
        Join thousands of people using DisciplineX to transform their daily routine.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/auth">
          <Button size="xl" variant="gradient" className="shadow-glow">
            Create Free Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        <Link to="/auth">
          <Button size="xl" variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Try Demo
          </Button>
        </Link>
      </div>
    </div>
  </section>
);
