import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Flame, LayoutGrid, PlaySquare, Search } from 'lucide-react';

export function MobileBottomNav() {
  const location = useLocation();
  const path = location.pathname;

  // Hide bottom bar on admin dashboard so editing forms have full screen
  if (path.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      label: 'होम',
      english: 'Home',
      to: '/',
      icon: Home,
      isActive: path === '/',
    },
    {
      label: 'ताज़ा',
      english: 'Latest',
      to: '/latest',
      icon: Flame,
      isActive: path === '/latest',
    },
    {
      label: 'कैटेगरी',
      english: 'Categories',
      to: '/categories',
      icon: LayoutGrid,
      isActive: path === '/categories' || path.startsWith('/category/'),
    },
    {
      label: 'वीडियो',
      english: 'Videos',
      to: '/videos',
      icon: PlaySquare,
      isActive: path === '/videos',
    },
    {
      label: 'खोजें',
      english: 'Search',
      to: '/search',
      icon: Search,
      isActive: path === '/search',
    },
  ];

  return (
    <nav
      aria-label="मोबाइल बॉटम नेविगेशन"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 h-14 px-1"
    >
      <div className="grid grid-cols-5 h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
                item.isActive
                  ? 'text-[#C8102E] font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <IconComponent
                className={`w-5 h-5 ${
                  item.isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'
                }`}
              />
              <span className="text-[11px] leading-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
