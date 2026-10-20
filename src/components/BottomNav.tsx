'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOrders } from '@/context/OrderContext';
import { Home, Utensils, ReceiptText, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { activeOrders } = useOrders();

  // Do not show bottom nav on welcome, login, register, or admin pages
  if (['/', '/login', '/register', '/admin'].includes(pathname)) {
    return null;
  }

  const hasReadyOrder = activeOrders.some((o) => o.status === 'ready');

  const links = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/menu', label: 'Menu', icon: Utensils },
    { 
      href: '/orders', 
      label: 'Orders', 
      icon: ReceiptText,
      badge: hasReadyOrder ? 'Ready!' : activeOrders.length > 0 ? String(activeOrders.length) : undefined,
      badgeColor: hasReadyOrder ? 'bg-emerald-500 animate-bounce' : 'bg-brand-500'
    },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-lg pb-safe">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/home' && pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {link.badge && (
                  <span className={`absolute -top-1.5 -right-3 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs ${link.badgeColor}`}>
                    {link.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-black' : 'font-medium'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
