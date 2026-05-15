Dashboard-page.tsx
'use client';

import { createClient } from '@/lib/supabase/client'; // sesuaikan path import supabase kamu
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Tombol sementara untuk logout */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

component-Header
'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { typography } from '@/lib/typography';
import UserMenu from './UserMenu';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  email: string;
  id: string;
}

interface HeaderProps {
  user: User;
  onMobileMenuToggle: () => void;
  /** Page-level title shown below the top bar */
  title?: string;
  /** Optional subtitle / description */
  description?: string;
  /** Optional action slot (e.g. a "New Item" button) */
  action?: React.ReactNode;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AIReadyBadge() {
  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
      <span className="flex w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-xs font-medium text-green-700">AI Ready</span>
    </div>
  );
}

function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="md:hidden"
      aria-label="Open mobile menu"
    >
      <Menu className="w-5 h-5" />
    </Button>
  );
}

function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border pb-6 mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className={typography.heading.h1}>{title}</h1>
          {description && (
            <p className={`mt-2 ${typography.body.muted}`}>{description}</p>
          )}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Header({
  user,
  onMobileMenuToggle,
  title,
  description,
  action,
}: HeaderProps) {
  return (
    <div>
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 h-full">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <MobileMenuButton onClick={onMobileMenuToggle} />
            <h1 className="text-lg font-bold text-gray-900 md:hidden">
              Warehouse AI
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-4">
            <AIReadyBadge />
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      {/* Page Header (rendered only when a title is provided) */}
      {title && (
        <div className="px-4 md:px-6 pt-6">
          <PageHeader title={title} description={description} action={action} />
        </div>
      )}
    </div>
  );
}