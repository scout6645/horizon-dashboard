import React, { useState } from 'react';
import dashboardMockup from '@/assets/dashboard-mockup.png';
import addHabitMockup from '@/assets/add-habit-mockup.png';
import analyticsMockup from '@/assets/analytics-mockup.png';
import mobileMockup from '@/assets/mobile-mockup.png';

const screenshots = [
  { label: 'Dashboard', src: dashboardMockup, alt: 'DisciplineX Dashboard view' },
  { label: 'Add Habit', src: addHabitMockup, alt: 'Add new habit modal' },
  { label: 'Analytics', src: analyticsMockup, alt: 'Analytics dashboard' },
  { label: 'Mobile', src: mobileMockup, alt: 'Mobile responsive view' },
];

export const ScreenshotsSection: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="screenshots" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            APP PREVIEW
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            See DisciplineX in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A glimpse into the powerful tools at your fingertips
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {screenshots.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active === i
                  ? 'gradient-primary text-primary-foreground shadow-glow'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Screenshot display */}
        <div className="relative max-w-4xl mx-auto">
          <div className={`rounded-2xl overflow-hidden border border-border shadow-2xl transition-all duration-500 ${active === 3 ? 'max-w-xs mx-auto' : ''}`}>
            <img
              src={screenshots[active].src}
              alt={screenshots[active].alt}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
