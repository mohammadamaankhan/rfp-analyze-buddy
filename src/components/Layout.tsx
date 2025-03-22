
import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showNav && <Navbar />}
      <main className="flex-grow flex flex-col px-4 py-6 md:px-8 md:py-12 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Unirail RFP Analyzer</p>
      </footer>
    </div>
  );
};
