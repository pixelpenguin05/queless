'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  ChefHat, 
  Home, 
  BookOpen, 
  ReceiptText, 
  User, 
  ShieldCheck,
  LogIn
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, openAuthModal, logout } = useAuth();
  const { itemCount, subtotal } = useCart();
  const { activeOrders } = useOrders();

  const hasReadyOrder = activeOrders.some((o) => o.status === 'ready');

  const navLinks = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/menu', label: 'Canteen Menu', icon: BookOpen },
    { 
      href: '/orders', 
      label: 'Live Orders', 
      icon: ReceiptText,
      badge: hasReadyOrder ? 'Ready!' : activeOrders.length > 0 ? String(activeOrders.length) : undefined,
    },
    { href: '/profile', label: 'My Account', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE5DC] transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 md:h-20 flex items-center justify-between">
        
        {/* Brand & Canteen Subtitle */}
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href={user ? (user.role === 'restaurant_owner' || user.role === 'admin' ? '/admin' : '/home') : '/'} className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#E23744] to-[#CB202D] flex items-center justify-center text-white shadow-md shadow-[#E23744]/25 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-[#1A3D4F] tracking-tight text-xl md:text-2xl leading-none">
                  QueueLess <span className="text-[#E23744]">CU</span>
                </span>
                {user?.role === 'admin' && (
                  <span className="bg-[#1A3D4F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Super Admin
                  </span>
                )}
                {user?.role === 'restaurant_owner' && (
                  <span className="bg-[#E7F5EE] border border-[#0F5B4C]/20 text-[#0F5B4C] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Canteen Owner
                  </span>
                )}
              </div>
              <p className="text-[11px] font-sans font-semibold text-[#5F6B6F] flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[#1A3D4F] font-bold">{user?.restaurantName || 'Food Republic C1'}</span>
                <span className="text-[#8A7F70] hidden sm:inline">• Live Orders Active</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 ml-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/home' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-white text-[#E23744] shadow-xs font-bold border border-[#EAE5DC]'
                      : 'text-[#5F6B6F] hover:text-[#1A3D4F] hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E23744] stroke-[2.3]' : 'stroke-2'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full text-white ${
                      hasReadyOrder ? 'bg-emerald-600 animate-bounce' : 'bg-[#E23744]'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Owner & Admin Portal Switcher */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 bg-[#F5EFE6] hover:bg-[#EAE5DC] text-[#1A3D4F] border border-[#EAE5DC] px-3.5 py-2 rounded-xl text-xs font-bold transition font-sans"
            title="Canteen Owner & Admin Portal"
          >
            <ChefHat className="w-4 h-4 text-[#E23744]" />
            <span className="hidden sm:inline">Owner / Admin</span>
            <span className="sm:hidden">Kitchen</span>
          </Link>

          {/* Student Auth: Simple Login Modal trigger or User Info */}
          {!user ? (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 bg-white hover:bg-[#FAF7F2] text-[#1A3D4F] border border-[#EAE5DC] px-3.5 py-2 rounded-xl text-xs font-bold transition font-sans shadow-xs"
            >
              <LogIn className="w-4 h-4 text-[#E23744]" />
              <span>Student Sign In</span>
            </button>
          ) : (
            <div className="hidden lg:flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#EAE5DC] text-xs font-sans">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-[#1A3D4F]">{user.name.split(' ')[0]}</span>
              <span className="text-[#8A7F70]">({user.role === 'restaurant_owner' ? 'Owner' : user.role === 'admin' ? 'Admin' : user.phone})</span>
            </div>
          )}

          {/* Cart / Tray Button */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 bg-gradient-to-r from-[#E23744] to-[#CB202D] hover:from-[#CB202D] hover:to-[#B31924] active:scale-95 text-white px-3.5 sm:px-4 py-2.5 rounded-2xl transition shadow-md shadow-[#E23744]/20 border border-[#E23744]"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E8B92C] text-[#1A3D4F] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white shadow">
                  {itemCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-[10px] font-medium text-rose-100 uppercase tracking-wider">
                {itemCount > 0 ? `${itemCount} Items` : 'Tray'}
              </span>
              <span className="text-xs font-black">
                {itemCount > 0 ? `₹${subtotal}` : 'Empty'}
              </span>
            </div>
          </Link>
        </div>

      </div>
    </header>
  );
};
