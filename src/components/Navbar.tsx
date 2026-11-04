'use client';

import React, { useState } from 'react';
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
  LogIn,
  LogOut,
  Menu,
  X,
  Store,
  ChevronRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, openAuthModal, logout } = useAuth();
  const { itemCount, subtotal } = useCart();
  const { activeOrders } = useOrders();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasReadyOrder = activeOrders.some((o) => o.status === 'ready');

  const navLinks = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/menu', label: 'Menu', icon: BookOpen },
    { 
      href: '/orders', 
      label: 'Live Orders', 
      icon: ReceiptText,
      badge: hasReadyOrder ? 'Ready!' : activeOrders.length > 0 ? String(activeOrders.length) : undefined,
    },
    { href: '/profile', label: 'Account', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE5DC] transition-all shadow-xs w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 md:h-20 flex items-center justify-between gap-2">
        
        {/* Left Side: Brand Logo & Title */}
        <div className="flex items-center gap-3 lg:gap-8 min-w-0 flex-shrink-0">
          <Link 
            href={user ? (user.role === 'restaurant_owner' || user.role === 'admin' ? '/admin' : '/home') : '/'} 
            className="flex items-center gap-2.5 sm:gap-3 group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#E23744] to-[#CB202D] flex items-center justify-center text-white shadow-md shadow-[#E23744]/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-heading font-extrabold text-[#1A3D4F] tracking-tight text-lg sm:text-xl md:text-2xl leading-none whitespace-nowrap">
                  QueueLess <span className="text-[#E23744]">CU</span>
                </span>
                {user?.role === 'admin' && (
                  <span className="hidden sm:inline-block bg-[#1A3D4F] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Admin
                  </span>
                )}
                {user?.role === 'restaurant_owner' && (
                  <span className="hidden sm:inline-block bg-[#E7F5EE] border border-[#0F5B4C]/20 text-[#0F5B4C] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Owner
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] font-sans font-semibold text-[#5F6B6F] hidden sm:flex items-center gap-1.5 mt-0.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="text-[#1A3D4F] font-bold truncate">{user?.restaurantName || 'Campus Food Republic'}</span>
                <span className="text-[#8A7F70] hidden lg:inline">• Live Orders</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 ml-2 lg:ml-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/home' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-white text-[#E23744] shadow-xs font-bold border border-[#EAE5DC]'
                      : 'text-[#5F6B6F] hover:text-[#1A3D4F] hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E23744] stroke-[2.3]' : 'stroke-2'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full text-white ${
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

        {/* Right Side: Action Controls (Responsive on All Devices) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          
          {/* Canteen Owner / Kitchen Portal Button */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 bg-[#F5EFE6] hover:bg-[#EAE5DC] text-[#1A3D4F] border border-[#EAE5DC] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition font-sans shadow-2xs"
            title="Kitchen & Admin Panel"
          >
            <ChefHat className="w-4 h-4 text-[#E23744] flex-shrink-0" />
            <span className="hidden md:inline">Kitchen Admin</span>
            <span className="hidden sm:inline md:hidden">Kitchen</span>
          </Link>

          {/* Student Auth: Sign In or User Profile */}
          {!user ? (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 bg-white hover:bg-[#FAF7F2] text-[#1A3D4F] border border-[#EAE5DC] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition font-sans shadow-xs whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 text-[#E23744] flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">Student Sign In</span>
              <span className="xs:hidden sm:hidden">Sign In</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#EAE5DC] text-xs font-sans shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="font-bold text-[#1A3D4F] truncate max-w-[90px]">{user.name.split(' ')[0]}</span>
              <button
                onClick={logout}
                title="Log Out"
                className="text-[#8A7F70] hover:text-[#E23744] p-0.5 rounded transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Cart / Tray Button */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#E23744] to-[#CB202D] hover:from-[#CB202D] hover:to-[#B31924] active:scale-95 text-white px-2.5 sm:px-3.5 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl transition shadow-md shadow-[#E23744]/20 border border-[#E23744] flex-shrink-0"
            title="View Tray / Cart"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E8B92C] text-[#1A3D4F] text-[9px] sm:text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white shadow">
                  {itemCount}
                </span>
              )}
            </div>
            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-[9px] font-medium text-rose-100 uppercase tracking-wider">
                {itemCount > 0 ? `${itemCount} Items` : 'Tray'}
              </span>
              <span className="text-xs font-black">
                {itemCount > 0 ? `₹${subtotal}` : 'Empty'}
              </span>
            </div>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#1A3D4F] bg-white border border-[#EAE5DC] hover:bg-[#FAF7F2] transition shadow-2xs"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#E23744]" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer / Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-lg border-b border-[#EAE5DC] px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          
          {/* User Status Bar in Mobile Menu */}
          {user ? (
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EAE5DC] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#1A3D4F] text-white flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A3D4F] font-sans">{user.name}</div>
                  <div className="text-[10px] text-[#8A7F70] font-sans">{user.phone ? `+91 ${user.phone}` : user.role}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-[#CC191D] hover:underline px-2 py-1"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="w-full bg-[#E23744] text-white font-sans font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Student Sign In (Name & Phone)</span>
            </button>
          )}

          {/* Navigation Links in Mobile Menu */}
          <div className="grid grid-cols-2 gap-2 font-sans pt-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-3 rounded-2xl border transition ${
                    isActive 
                      ? 'bg-[#1A3D4F] text-white border-[#1A3D4F] font-bold' 
                      : 'bg-[#FAF7F2] text-[#1A3D4F] border-[#EAE5DC]'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs truncate">{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#E23744] text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Action Links in Mobile Menu */}
          <div className="pt-2 border-t border-[#EAE5DC] flex flex-col gap-2 font-sans text-xs">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE5DC] text-[#1A3D4F] hover:bg-[#F5EFE6]"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#E23744]" />
                <span className="font-bold">Register Canteen Outlet</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A7F70]" />
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE5DC] text-[#1A3D4F] hover:bg-[#F5EFE6]"
            >
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-[#0F5B4C]" />
                <span className="font-bold">Kitchen & Admin Portal</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A7F70]" />
            </Link>
          </div>

        </div>
      )}

    </header>
  );
};
