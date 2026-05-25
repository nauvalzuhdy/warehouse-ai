'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ClipboardList,
  MessageSquare,
  Settings,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Produk',
    href: '/dashboard/products',
    icon: <Package className="w-5 h-5" />,
  },
  {
    label: 'Gudang',
    href: '/dashboard/warehouses',
    icon: <Warehouse className="w-5 h-5" />,
  },
  {
    label: 'Manajemen Stok',
    href: '/stock',
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    label: 'AI Chat',
    href: '/chat',
    icon: <MessageSquare className="w-5 h-5" />,
  },
];

const bottomNavItems: NavItem[] = [
  {
    label: 'Pengaturan',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    // Exact match for dashboard
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    // For other routes, check if pathname starts with href
    return pathname.startsWith(href);
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);

    return (
      <Link
        href={item.href}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-lg
          transition-colors duration-150
          ${
            active
              ? 'bg-blue-600 text-white font-medium'
              : 'text-blue-200 hover:bg-blue-900 hover:text-white'
          }
        `}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 h-full bg-blue-950 flex flex-col">
      {/* Logo Section */}
      <div className="px-4 py-6 border-b border-blue-900">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h1 className="text-white font-bold text-lg">Warehouse AI</h1>
        </div>
        <p className="text-blue-400 text-xs">Powered by Claude AI</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        <h2 className="text-blue-400 text-xs font-semibold uppercase tracking-wider px-3 pb-3">
          Menu Utama
        </h2>
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <nav className="px-3 py-6 border-t border-blue-900">
        <h2 className="text-blue-400 text-xs font-semibold uppercase tracking-wider px-3 pb-3">
          Lainnya
        </h2>
        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
