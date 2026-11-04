'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMenu } from '@/context/MenuContext';
import { FoodCard } from '@/components/FoodCard';
import { FoodDetailModal } from '@/components/FoodDetailModal';
import { CATEGORIES } from '@/lib/sampleData';
import { MenuItem, FoodCategory } from '@/lib/types';
import { Search, Leaf, X, SlidersHorizontal } from 'lucide-react';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';

  const {
    filteredItems,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedRestaurantId,
    setSelectedRestaurantId,
    vegOnly,
    setVegOnly,
  } = useMenu();

  const [restaurants, setRestaurants] = useState<{ id: string; name: string }[]>([]);
  const [selectedFoodItem, setSelectedFoodItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetch('/api/restaurants')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.restaurants)) {
          setRestaurants(d.restaurants);
        }
      })
      .catch(() => {});
  }, []);

  // Sync url param if present
  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch, setSearchQuery]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      
      {/* Sticky Filter & Search Header */}
      <div className="sticky top-18 md:top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE5DC] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#8A7F70] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food by name, ingredient, or category..."
                className="w-full bg-white border border-[#EAE5DC] text-[#1A3D4F] rounded-2xl pl-12 pr-10 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#E8B92C] shadow-soft"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7F70] hover:text-[#1A3D4F] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Veg Only Toggle and Count summary */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold font-sans transition border shadow-xs ${
                  vegOnly
                    ? 'bg-[#E7F5EE] border-[#0F5B4C] text-[#0F5B4C]'
                    : 'bg-white border-[#EAE5DC] text-[#5F6B6F] hover:bg-[#F5EFE6]'
                }`}
              >
                <Leaf className={`w-4 h-4 ${vegOnly ? 'text-[#0F5B4C] fill-[#0F5B4C]' : 'text-[#8A7F70]'}`} />
                <span>Pure Veg Only</span>
              </button>

              <span className="text-xs font-sans text-[#5F6B6F] font-semibold whitespace-nowrap bg-white border border-[#EAE5DC] px-3.5 py-3 rounded-2xl shadow-xs">
                {filteredItems.length} dishes available
              </span>
            </div>
          </div>

          {/* Canteen Outlets Selection Tabs */}
          {restaurants.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              <button
                onClick={() => setSelectedRestaurantId('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans whitespace-nowrap transition border ${
                  selectedRestaurantId === 'all'
                    ? 'bg-[#E23744] text-white border-[#E23744]'
                    : 'bg-white text-[#5F6B6F] border-[#EAE5DC]'
                }`}
              >
                🍽️ All Canteens
              </button>
              {restaurants.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRestaurantId(r.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans whitespace-nowrap transition border ${
                    selectedRestaurantId === r.id
                      ? 'bg-[#E23744] text-white border-[#E23744]'
                      : 'bg-white text-[#1A3D4F] border-[#EAE5DC]'
                  }`}
                >
                  📍 {r.name}
                </button>
              ))}
            </div>
          )}

          {/* Category Scrolling Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as FoodCategory)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-sans whitespace-nowrap transition-all shadow-xs ${
                    isSelected
                      ? 'bg-[#1A3D4F] text-white'
                      : 'bg-white text-[#5F6B6F] border border-[#EAE5DC] hover:border-[#DBA81F] hover:text-[#1A3D4F]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Food Items Responsive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE5DC] shadow-soft max-w-md mx-auto my-8">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-heading font-bold text-[#1A3D4F] text-xl">No meals found</h3>
            <p className="text-xs font-sans text-[#5F6B6F] mt-1 max-w-xs mx-auto leading-relaxed">
              We couldn&apos;t find anything matching your filters. Try clearing your search or switching categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setVegOnly(false);
              }}
              className="mt-5 bg-[#E23744] hover:bg-[#CB202D] text-white text-xs font-bold font-sans px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onOpenDetails={(it) => setSelectedFoodItem(it)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item Details Customization Modal */}
      <FoodDetailModal
        item={selectedFoodItem}
        onClose={() => setSelectedFoodItem(null)}
      />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-center">
          <div className="text-sm font-sans font-semibold text-[#8A7F70]">Loading Canteen Menu...</div>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}