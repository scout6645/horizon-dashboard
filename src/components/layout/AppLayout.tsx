import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
};
