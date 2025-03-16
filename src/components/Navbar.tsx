
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Upload, LogOut } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: 'Upload',
      path: '/upload',
      icon: <Upload className="w-5 h-5" />,
    },
    {
      label: 'Results',
      path: '/results',
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-primary p-1">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-xl hidden md:inline-block">RFP Analyzer</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-secondary transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d={isMenuOpen 
                ? "M18 6L6 18M6 6L18 18" 
                : "M4 6h16M4 12h16M4 18h16"} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden p-4 border-t border-border/50 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <button className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
