import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Upload, LogOut, Settings, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const navItems: NavItem[] = [
    {
      label: 'History',
      path: '/history',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: 'Upload',
      path: '/upload',
      icon: <Upload className="w-5 h-5" />,
    },
    {
      label: 'Chat',
      path: '/chat',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-primary p-1">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-xl hidden md:inline-block">Unirail</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <button 
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-orange-50 transition-colors"
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
        <div className="md:hidden p-4 border-t border-orange-100 animate-fade-in bg-white">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <button 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-50 transition-colors"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
