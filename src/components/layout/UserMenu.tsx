'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutDashboard, Settings, LogOut } from 'lucide-react';

interface UserMenuProps {
  user: {
    email: string;
    id: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const supabase = createClient();

  const getInitial = (email: string): string => {
    return email.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-10 h-10 rounded-full p-0 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
        >
          {getInitial(user.email)}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User Email Section */}
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-gray-500">Akun</p>
          <p className="text-sm text-gray-700 truncate">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        {/* Dashboard Menu Item */}
        <DropdownMenuItem onClick={() => handleNavigate('/dashboard')}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>

        {/* Settings Menu Item */}
        <DropdownMenuItem onClick={() => handleNavigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Pengaturan
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout Menu Item */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
