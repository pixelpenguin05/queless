'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMenu } from '@/context/MenuContext';
import { useOrders } from '@/context/OrderContext';
import { FoodCard } from '@/components/FoodCard';
import { FoodDetailModal } from '@/components/FoodDetailModal';
import { MenuItem, FoodCategory } from '@/lib/types';
import { CATEGORIES } from '@/lib/sampleData';
import { 
  Search, 
  Sparkles, 
  Flame, 
  Clock, 
  ArrowRight, 
  BellRing, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

export default function StudentHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, setSelectedCategory } = useMenu();
  const { activeOrders } = useOrders();
  const [selectedFoodItem, setSelectedFoodItem] = useState<MenuItem | null>(null);
  const [localSearch, setLocalSearch] = useState('');

  const popularItems = items.filter((item) => item.popular);
  const currentActiveOrder = activeOrders[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      router.push(`/menu?search=${encodeURIComponent(localSearch.trim())}`);
    } else {
      router.push('/menu');
    }
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId as FoodCategory);
    router.push('/menu');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Student Greeting Banner */}
      <div className="bg-gradient-to-b from-brand-500 via-brand-600 to-amber-600 text-white px-5 pt-4 pb-14 rounded-b-4xl shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-100 flex items-center gap-1">
              <span>👋 Hello, {user?.name ? user.name.split(' ')[0] : 'Campus Student'}</span>
            </p>
            <h1 className="text-xl font-black tracking-tight mt-0.5">
              Ready for Campus Break?
            </h1>
            <p className="text-[11px] text-brand-100/90 mt-0.5">
              Roll No: {user?.rollNumber || '21BCS4821'} • Block B-3 Canteen
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xl shadow-inner">
            🥘
          </div>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search Samosa, Paneer Thali, Cold Coffee..."
            className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs font-medium pl-11 pr-24 py-3 rounded-2xl shadow-elevated focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
          >
            Find
          </button>
        </form>
      </div>

      <div className="px-4 -mt-8 space-y-6">
        {/* Active Order Alert Bar (If student has a cooking/ready order) */}
        {currentActiveOrder && (
          <div className="bg-white rounded-3xl p-4 shadow-float border-2 border-brand-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <BellRing className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900">
                      Order #{currentActiveOrder.orderNumber}
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                      {currentActiveOrder.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pickup: {currentActiveOrder.pickupSlot} • Counter 1
                  </p>
                </div>
              </div>

              <Link
                href={`/orders/${currentActiveOrder.id}`}
                className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs flex items-center gap-1"
              >
                <span>Track</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Campus Canteen Promo Card */}
        <div className="bg-gradient-to-r from-amber-500 via-brand-500 to-orange-600 rounded-3xl p-4 text-white shadow-soft relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Lunch Rush Hack
            </span>
            <h2 className="text-base font-extrabold mt-1.5 leading-snug">
              Order before 1:00 PM
            </h2>
            <p className="text-xs text-amber-100 mt-0.5">
              Food will be bagged and hot at Counter 2 when the bell rings.
            </p>
          </div>
          <div className="absolute -right-4 -bottom-6 text-6xl opacity-30 select-none">
            🥪
          </div>
        </div>

        {/* Categories Horizontal Carousel */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>Categories</span>
            </h2>
            <Link href="/menu" className="text-xs font-bold text-brand-600 hover:underline">
              See All Menu
            </Link>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="flex flex-col items-center flex-shrink-0 bg-white border border-slate-200/70 hover:border-brand-300 rounded-2xl p-2.5 w-20 shadow-xs hover:shadow-soft active:scale-95 transition"
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-[11px] font-bold text-slate-800 text-center truncate w-full">
                  {cat.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Campus Picks */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-brand-600 fill-brand-500" />
              <h2 className="text-sm font-extrabold text-slate-900">
                Trending on CU Campus
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Most ordered today</span>
          </div>

          <div className="space-y-3">
            {popularItems.slice(0, 4).map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onOpenDetails={(it) => setSelectedFoodItem(it)}
              />
            ))}
          </div>
        </div>

        {/* Quick Features Footer Banner */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/70 shadow-xs flex items-center justify-around text-center">
          <div>
            <div className="text-base">⚡</div>
            <p className="text-[11px] font-bold text-slate-800 mt-1">Pre-order</p>
            <p className="text-[10px] text-slate-400">Zero wait</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="text-base">📍</div>
            <p className="text-[11px] font-bold text-slate-800 mt-1">Block B-3</p>
            <p className="text-[10px] text-slate-400">Direct pickup</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="text-base">💳</div>
            <p className="text-[11px] font-bold text-slate-800 mt-1">UPI & Cash</p>
            <p className="text-[10px] text-slate-400">At counter</p>
          </div>
        </div>
      </div>

      {/* Item Details Customization Modal */}
      <FoodDetailModal
        item={selectedFoodItem}
        onClose={() => setSelectedFoodItem(null)}
      />
    </div>
  );
}
