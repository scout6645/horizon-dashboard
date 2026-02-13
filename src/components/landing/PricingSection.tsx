import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Get started with essential habit tracking',
    features: [
      '5 habits limit',
      'Basic daily tracking',
      'Streak counter',
      'Light & dark modes',
      'Free forever',
    ],
    cta: 'Start Free',
    variant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹99',
    period: '/month',
    description: 'Unlock the full power of DisciplineX',
    features: [
      'Unlimited habits',
      'Reminder system',
      'Advanced analytics',
      'AI habit suggestions',
      'Priority support',
      'CSV & JSON export',
    ],
    cta: 'Coming Soon',
    variant: 'gradient' as const,
    popular: true,
  },
];

export const PricingSection: React.FC = () => (
  <section id="pricing" className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          PRICING
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Simple, Transparent Pricing
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Start free and upgrade when you're ready to unlock your full potential
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-1 flex flex-col ${
              plan.popular
                ? 'border-primary/50 bg-card shadow-glow'
                : 'border-border bg-card hover:border-primary/20'
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-accent text-accent-foreground border-0 px-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Coming Soon
              </Badge>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {plan.popular ? (
              <Button variant={plan.variant} className="w-full" disabled>
                {plan.cta}
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant={plan.variant} className="w-full">
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);
