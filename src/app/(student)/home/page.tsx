'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMenu } from '@/context/MenuContext';
import { useOrders } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';
import { FoodCard } from '@/components/FoodCard';
import { FoodDetailModal } from '@/components/FoodDetailModal';
import { MenuItem, FoodCategory, Restaurant } from '@/lib/types';
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
  Plus,
  MapPin,
  CheckCircle2,
  Filter
} from 'lucide-react';

export default function StudentHomePage() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const { items, setSelectedCategory } = useMenu();
  const { activeOrders } = useOrders();
  const { itemCount, subtotal } = useCart();
  
  const [selectedFoodItem, setSelectedFoodItem] = useState<MenuItem | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<FoodCategory>('all');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('all');

  // Fetch approved canteens for student view
  useEffect(() => {
    const fetchApprovedCanteens = async () => {
      try {
        const res = await fetch('/api/restaurants');
        const data = await res.json();
        if (data.success && Array.isArray(data.restaurants)) {
          setRestaurants(data.restaurants);
        }
      } catch {}
    };
    fetchApprovedCanteens();
  }, []);

  // Trending / Popular dishes
  const popularItems = items.filter((item) => item.popular && item.isAvailable);
  const displayTrending = popularItems.length > 0 
    ? popularItems.slice(0, 3) 
    : items.filter((i) => i.isAvailable).slice(0, 3);

  // Live Canteen Menu filtered for student browsing
  const filteredDishes = items.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesVeg = !vegOnly || item.isVeg;
    const matchesRest = selectedRestaurantId === 'all' || item.restaurantId === selectedRestaurantId;
    const matchesSearch = !localSearch.trim() || 
      item.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(localSearch.toLowerCase());
    return matchesCat && matchesVeg && matchesRest && matchesSearch;
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

  const currentCanteenName = selectedRestaurantId === 'all' 
    ? 'All Verified CU Canteens'
    : restaurants.find(r => r.id === selectedRestaurantId)?.name || 'Campus Canteen';

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-32">
      
      {/* Top Hero & Student Welcome Bar */}
      <div className="bg-gradient-to-r from-[#1A3D4F] via-[#2E5A66] to-[#1D6E72] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-sans text-rose-100 border border-white/15 mb-2">
                <span>👋 Hello, {user?.name ? user.name.split(' ')[0] : 'Campus Student'}</span>
                {user?.phone ? (
                  <>
                    <span>•</span>
                    <span>+91 {user.phone}</span>
                  </>
                ) : (
                  <>
                    <span>•</span>
                    <button 
                      onClick={() => openAuthModal()}
                      className="underline text-[#E8B92C] font-bold hover:text-white"
                    >
                      Sign In with Phone
                    </button>
                  </>
                )}
              </div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                Ready for Campus Break?
              </h1>
              <p className="text-sm font-sans text-white/80 mt-1 max-w-xl">
                Pre-order from registered campus canteens. Skip the counter rush, pay via Cash on Delivery, and pick up your meal when ready.
              </p>
            </div>

            {/* Fast Action Buttons: Canteen Registration & Kitchen Portal */}
            <div className="flex items-center gap-3">
              <Link
                href="/register"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl px-4 py-3 flex items-center gap-2.5 transition active:scale-98 text-xs font-bold font-sans"
                title="Register your canteen or food outlet"
              >
                <Store className="w-4 h-4 text-[#E8B92C]" />
                <span>Register Canteen</span>
              </Link>

              <Link
                href="/admin"
                className="bg-[#E23744] hover:bg-[#CB202D] text-white rounded-2xl px-5 py-3 flex items-center gap-2.5 transition active:scale-98 text-xs font-bold font-sans shadow-md"
                title="Kitchen & Admin Panel"
              >
                <ChefHat className="w-4 h-4 text-white" />
                <span>Kitchen / Admin Portal</span>
              </Link>
            </div>
          </div>

          {/* Search Bar Input */}
          <form onSubmit={handleSearchSubmit} className="mt-6 max-w-3xl relative">
            <Search className="w-5 h-5 text-[#8A7F70] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search dishes (e.g. Masala Dosa, Paneer Thali, Chole Bhature, Cold Coffee)..."
              className="w-full bg-white text-[#1A3D4F] placeholder-[#8A7F70] text-sm font-sans pl-12 pr-28 py-3.5 rounded-2xl shadow-elevated focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#E23744] hover:bg-[#CB202D] text-white px-5 py-2 rounded-xl text-xs font-bold font-sans transition shadow-sm"
            >
              Search
            </button>
          </form>

        </div>
      </div>

      {/* Main Content Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Active Order Alert Bar (If student has a cooking/ready order) */}
        {currentActiveOrder && (
          <div className="bg-white rounded-3xl p-5 shadow-elevated border-2 border-[#E23744]/30 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFE4E6] text-[#E23744] flex items-center justify-center">
                  <BellRing className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-base text-[#1A3D4F]">
                      Active Token #{currentActiveOrder.orderNumber}
                    </span>
                    <span className="bg-[#FBF1D4] text-[#8A6A0B] text-xs font-bold px-2.5 py-0.5 rounded-full capitalize">
                      {currentActiveOrder.status}
                    </span>
                  </div>
                  <p className="text-xs font-sans text-[#5F6B6F] mt-1">
                    Pickup: <strong>{currentActiveOrder.pickupSlot}</strong> • {currentActiveOrder.canteenCounter}
                  </p>
                </div>
              </div>

              <Link
                href={`/orders/${currentActiveOrder.id}`}
                className="bg-[#E23744] hover:bg-[#CB202D] text-white text-xs font-bold font-sans px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
              >
                <span>Live Tracker & Code</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Canteen / Food Outlets Selection Bar (Requirement 2 & 3) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-heading font-bold text-xl text-[#1A3D4F] flex items-center gap-2">
                <Store className="w-5 h-5 text-[#E23744]" />
                <span>Registered Campus Canteens</span>
              </h2>
              <p className="text-xs font-sans text-[#5F6B6F]">Select a verified counter to view their food items</p>
            </div>
            <Link href="/register" className="text-xs font-bold font-sans text-[#E23744] hover:underline flex items-center gap-1">
              <span>+ Register Your Outlet</span>
            </Link>
          </div>

          {restaurants.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] text-center shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE4E6] text-[#E23744] flex items-center justify-center mx-auto mb-3">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#1A3D4F]">No Canteens Registered Yet</h3>
              <p className="text-xs font-sans text-[#5F6B6F] mt-1 max-w-sm mx-auto">
                Are you a canteen or restaurant owner on campus? Register your food outlet to start accepting pre-orders.
              </p>
              <Link
                href="/register"
                className="mt-3 inline-flex items-center gap-1.5 bg-[#E23744] hover:bg-[#CB202D] text-white text-xs font-bold font-sans px-4 py-2 rounded-xl shadow-xs transition"
              >
                <Store className="w-4 h-4" />
                <span>Register Your Canteen</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setSelectedRestaurantId('all')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-sans whitespace-nowrap transition border ${
                  selectedRestaurantId === 'all'
                    ? 'bg-[#1A3D4F] text-white border-[#1A3D4F] shadow-sm'
                    : 'bg-white text-[#5F6B6F] border-[#EAE5DC] hover:border-[#1A3D4F]'
                }`}
              >
                🍽️ All Outlets
              </button>

              {restaurants.map((rest) => (
                <button
                  key={rest.id}
                  onClick={() => setSelectedRestaurantId(rest.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-sans whitespace-nowrap transition border flex items-center gap-2 ${
                    selectedRestaurantId === rest.id
                      ? 'bg-[#E23744] text-white border-[#E23744] shadow-sm'
                      : 'bg-white text-[#1A3D4F] border-[#EAE5DC] hover:border-[#E23744]'
                  }`}
                >
                  <span>📍 {rest.name}</span>
                  <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded-md font-mono">
                    {rest.counterLocation.split('•')[0].trim()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-2xl text-[#1A3D4F]">
                Explore Categories
              </h2>
              <p className="text-xs font-sans text-[#5F6B6F]">Freshly prepared across campus canteen counters</p>
            </div>
            <Link href="/menu" className="text-xs font-bold font-sans text-[#E23744] hover:underline flex items-center gap-1">
              <span>Full Menu ({items.length} items)</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 active:scale-95 group ${
                  activeCategory === cat.id
                    ? 'bg-[#1A3D4F] border-[#1A3D4F] text-white shadow-md'
                    : 'bg-white border-[#EAE5DC] hover:border-[#E8B92C] text-[#1A3D4F] shadow-soft'
                }`}
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className={`text-xs font-bold font-sans truncate w-full text-center ${
                  activeCategory === cat.id ? 'text-white' : 'text-[#1A3D4F]'
                }`}>
                  {cat.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION: LIVE CANTEEN MENU (Responsive Grid on Desktop & Mobile) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EAE5DC]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="font-heading font-bold text-2xl text-[#1A3D4F]">
                  {currentCanteenName}
                </h2>
              </div>
              <p className="text-xs font-sans text-[#5F6B6F] mt-0.5">
                {filteredDishes.length} dishes ready to order • Cash on Delivery accepted at counter
              </p>
            </div>

            {/* Filters: Veg Only Toggle & Reset */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-2 text-xs font-bold font-sans px-4 py-2 rounded-xl border transition shadow-xs ${
                  vegOnly
                    ? 'bg-[#E7F5EE] border-[#0F5B4C] text-[#0F5B4C]'
                    : 'bg-white border-[#EAE5DC] text-[#5F6B6F] hover:bg-[#F5EFE6]'
                }`}
              >
                <Leaf className={`w-3.5 h-3.5 ${vegOnly ? 'text-[#0F5B4C] fill-[#0F5B4C]' : 'text-[#8A7F70]'}`} />
                <span>Pure Veg Only</span>
              </button>

              {(activeCategory !== 'all' || vegOnly || localSearch || selectedRestaurantId !== 'all') && (
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSelectedRestaurantId('all');
                    setVegOnly(false);
                    setLocalSearch('');
                  }}
                  className="text-xs font-sans text-[#E23744] hover:underline font-bold"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Dishes Responsive Grid: 1 col on mobile, 2 col on tablet, 3 col on large desktop */}
          {filteredDishes.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE5DC] shadow-soft">
              <div className="text-5xl mb-3">🍽️</div>
              <h3 className="font-heading font-bold text-[#1A3D4F] text-xl">
                {items.length === 0 ? 'No Food Dishes Added Yet' : 'No dishes match this filter'}
              </h3>
              <p className="text-xs font-sans text-[#5F6B6F] mt-1 max-w-sm mx-auto">
                {items.length === 0 
                  ? 'The canteen menu is empty right now. Canteen owners can register food items using the Kitchen Portal.' 
                  : 'Try clearing your search or switching categories to see more items.'}
              </p>
              {items.length === 0 ? (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Link
                    href="/register"
                    className="bg-[#E23744] hover:bg-[#CB202D] text-white text-xs font-bold font-sans px-5 py-2.5 rounded-xl shadow-sm transition"
                  >
                    Register Canteen
                  </Link>
                  <Link
                    href="/admin"
                    className="bg-[#1A3D4F] hover:bg-[#2E5A66] text-white text-xs font-bold font-sans px-5 py-2.5 rounded-xl shadow-sm transition"
                  >
                    Open Kitchen Admin
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSelectedRestaurantId('all');
                    setVegOnly(false);
                    setLocalSearch('');
                  }}
                  className="mt-4 bg-[#E23744] text-white text-xs font-bold font-sans px-5 py-2.5 rounded-xl shadow-sm"
                >
                  Show All Dishes
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredDishes.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  onOpenDetails={(it) => setSelectedFoodItem(it)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Trending on Campus Section */}
        {displayTrending.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#E23744] fill-[#E23744]" />
                <h2 className="font-heading font-bold text-2xl text-[#1A3D4F]">
                  Trending on CU Campus
                </h2>
              </div>
              <span className="text-xs font-sans text-[#8A7F70]">Most popular this week</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

      </div>

      {/* Floating Bottom Cart Bar (when items are in cart) */}
      {itemCount > 0 && (
        <div className="fixed bottom-18 md:bottom-6 left-0 right-0 z-40 px-4 max-w-3xl mx-auto pointer-events-none">
          <div className="pointer-events-auto bg-gradient-to-r from-[#1A3D4F] via-[#2E5A66] to-[#E23744] text-white rounded-3xl p-4 shadow-float flex items-center justify-between border border-white/20 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E8B92C] text-[#1A3D4F] flex items-center justify-center font-black text-sm shadow-sm">
                {itemCount}
              </div>
              <div>
                <p className="text-sm font-heading font-bold">{itemCount} {itemCount === 1 ? 'dish' : 'dishes'} in Tray</p>
                <p className="text-xs font-sans text-amber-200">Total: ₹{subtotal} • Pay via Cash on Delivery</p>
              </div>
            </div>

            <Link
              href="/cart"
              className="bg-white text-[#E23744] font-sans font-extrabold text-xs px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md hover:bg-rose-50 active:scale-95 transition"
            >
              <span>View Tray</span>
              <ArrowRight className="w-4 h-4" />
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
