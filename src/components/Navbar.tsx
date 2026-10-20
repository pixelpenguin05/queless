'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, UtensilsCrossed, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { itemCount, subtotal } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand & Canteen Subtitle */}
        <Link href={user ? (user.role === 'admin' ? '/admin' : '/home') : '/'} className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 tracking-tight text-base">
                QueueLess <span className="text-brand-600">CU</span>
              </span>
              {user?.role === 'admin' && (
                <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                  Staff
                </span>
              )}
            </div>
            <p className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Canteen Block 3 • Open
            </p>
          </div>
        </Link>

        {/* Right Side: Admin switch or Cart */}
        <div className="flex items-center gap-2">
          {user?.role === 'admin' ? (
            <Link
              href="/admin"
              className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-brand-400" />
              <span>Kitchen</span>
            </Link>
          ) : (
            <Link
              href="/cart"
              className="relative flex items-center gap-2 bg-brand-50 hover:bg-brand-100/80 active:scale-95 text-brand-700 px-3 py-2 rounded-2xl transition border border-brand-200/60"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-brand-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                    {itemCount}
                  </span>
                )}
              </div>
              {itemCount > 0 && (
                <span className="text-xs font-extrabold text-brand-900 hidden sm:inline">
                  ₹{subtotal}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
