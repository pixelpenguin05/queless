'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMenu } from '@/context/MenuContext';
import { useOrders } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';
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
  ChefHat,
  Leaf,
  ShoppingBag,
  Store,
  ChevronRight,
  Plus
} from 'lucide-react';

export default function StudentHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, setSelectedCategory } = useMenu();
  const { activeOrders } = useOrders();
  const { itemCount, subtotal } = useCart();
  
  const [selectedFoodItem, setSelectedFoodItem] = useState<MenuItem | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<FoodCategory>('all');
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  // Trending / Popular dishes (registered popular items or first 4 available)
  const popularItems = items.filter((item) => item.popular && item.isAvailable);
  const displayTrending = popularItems.length > 0 
    ? popularItems.slice(0, 4) 
    : items.filter((i) => i.isAvailable).slice(0, 4);

  // Live Canteen Menu filtered for student browsing
  const filteredDishes = items.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesVeg = !vegOnly || item.isVeg;
    const matchesSearch = !localSearch.trim() || 
      item.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(localSearch.toLowerCase());
    return matchesCat && matchesVeg && matchesSearch;
  });

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
    setActiveCategory(catId as FoodCategory);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
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
            <p className="text-[11px] text-brand-100/90 mt-0.5 flex items-center gap-1.5">
              <span>Roll No: {user?.rollNumber || '21BCS4821'}</span>
              <span>•</span>
              <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
                Food Republic C1
              </span>
            </p>
          </div>

          <Link
            href="/admin"
            className="w-12 h-12 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-inner transition active:scale-95"
            title="Open Restaurant Owner Panel"
          >
            <ChefHat className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-wider mt-0.5">Owner</span>
          </Link>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search Samosa, Thali, Dosa, Cold Coffee..."
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
                    Pickup: {currentActiveOrder.pickupSlot} • Counter 2
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

        {/* Restaurant Owner Quick Action Banner */}
        <div className="bg-slate-900 rounded-3xl p-4 text-white shadow-soft flex items-center justify-between border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white flex-shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Owner Restaurant Portal</h3>
              <p className="text-[10px] text-slate-400">Register new dishes & manage live stock</p>
            </div>
          </div>

          <Link
            href="/admin"
            className="bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-sm transition"
          >
            <span>Manage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Horizontal Carousel */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>Categories</span>
            </h2>
            <Link href="/menu" className="text-xs font-bold text-brand-600 hover:underline">
              Full Menu ({items.length})
            </Link>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex flex-col items-center flex-shrink-0 border rounded-2xl p-2.5 w-20 transition active:scale-95 ${
                  activeCategory === cat.id
                    ? 'bg-brand-500 border-brand-600 text-white shadow-soft'
                    : 'bg-white border-slate-200/70 hover:border-brand-300 text-slate-800 shadow-xs'
                }`}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className={`text-[11px] font-bold text-center truncate w-full ${
                  activeCategory === cat.id ? 'text-white' : 'text-slate-800'
                }`}>
                  {cat.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION: LIVE CANTEEN MENU (All dishes registered by the owner) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-extrabold text-slate-900">
                  Food Republic C1 Menu
                </h2>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {filteredDishes.length} items live & ready to order
              </p>
            </div>

            {/* Pure Veg Toggle */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition ${
                vegOnly
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <Leaf className={`w-3 h-3 ${vegOnly ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'}`} />
              <span>Veg Only</span>
            </button>
          </div>

          {/* Dishes List */}
          <div className="space-y-3">
            {filteredDishes.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-xs">
                <div className="text-4xl mb-2">🍽️</div>
                <h3 className="font-bold text-slate-800 text-sm">No dishes found</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Try changing category or clearing the search.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setVegOnly(false);
                    setLocalSearch('');
                  }}
                  className="mt-3 text-xs font-bold text-brand-600 hover:underline"
                >
                  Show all dishes
                </button>
              </div>
            ) : (
              filteredDishes.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  onOpenDetails={(it) => setSelectedFoodItem(it)}
                />
              ))
            )}
          </div>
        </div>

        {/* Popular Campus Picks */}
        {displayTrending.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-brand-600 fill-brand-500" />
                <h2 className="text-sm font-extrabold text-slate-900">
                  Trending on CU Campus
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">Chef&apos;s recommendations</span>
            </div>

            <div className="space-y-3">
              {displayTrending.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  onOpenDetails={(it) => setSelectedFoodItem(it)}
                />
              ))}
            </div>
          </div>
        )}

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
            <p className="text-[11px] font-bold text-slate-800 mt-1">Food Republic C1</p>
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

      {/* Floating Bottom Cart Bar when user has items in cart */}
      {itemCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4 max-w-md mx-auto pointer-events-none">
          <div className="pointer-events-auto bg-gradient-to-r from-brand-600 to-amber-600 text-white rounded-2xl p-3.5 shadow-float flex items-center justify-between border border-white/20 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
                {itemCount}
              </div>
              <div>
                <p className="text-xs font-black">{itemCount} {itemCount === 1 ? 'item' : 'items'} in Tray</p>
                <p className="text-[10px] text-amber-100">Total: ₹{subtotal} • Express Counter 2</p>
              </div>
            </div>

            <Link
              href="/cart"
              className="bg-white text-brand-600 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition"
            >
              <span>View Tray</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Item Details Customization Modal */}
      <FoodDetailModal
        item={selectedFoodItem}
        onClose={() => setSelectedFoodItem(null)}
      />
    </div>
  );
}
