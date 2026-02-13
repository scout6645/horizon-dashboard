import React from 'react';
import { Sparkles } from 'lucide-react';

export const LandingFooter: React.FC = () => (
  <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
    <div className="max-w-6xl mx-auto">
      <div className="grid sm:grid-cols-3 gap-8 items-center">
        {/* Brand */}
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">DisciplineX</span>
        </div>

        {/* About */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Built by a passionate developer crafting productivity tools for the modern world.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center sm:justify-end gap-4">
          <a
            href="mailto:your-email@example.com"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Email
          </a>
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 DisciplineX. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
