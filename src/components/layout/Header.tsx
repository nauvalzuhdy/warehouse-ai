'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';

interface User {
  email: string;
  id: string;
}

interface HeaderProps {
  user: User;
  onMobileMenuToggle: () => void;
}

export default function Header({ user, onMobileMenuToggle }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 h-full">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* App Name - Mobile Only */}
          <h1 className="text-lg font-bold text-gray-900 md:hidden">
            Warehouse AI
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* AI Ready Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
            <span className="flex w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-700">AI Ready</span>
          </div>

          {/* User Menu */}
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
