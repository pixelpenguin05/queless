'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMenu } from '@/context/MenuContext';
import { FoodCard } from '@/components/FoodCard';
import { FoodDetailModal } from '@/components/FoodDetailModal';
import { CATEGORIES } from '@/lib/sampleData';
import { MenuItem, FoodCategory } from '@/lib/types';
import { Search, Leaf, X } from 'lucide-react';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';

  const {
    filteredItems,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    vegOnly,
    setVegOnly,
  } = useMenu();

  const [selectedFoodItem, setSelectedFoodItem] = useState<MenuItem | null>(null);

  // Sync url param if present
  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch, setSearchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Sticky Filter Header */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food by name or ingredient..."
            className="w-full bg-slate-100/80 border border-slate-200/80 text-slate-900 rounded-2xl pl-10 pr-9 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Veg Only Toggle and Filter summary */}
        <div className="flex items-center justify-between mt-3">
          <button
            type="button"
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition border ${
              vegOnly
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <Leaf className={`w-3.5 h-3.5 ${vegOnly ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'}`} />
            <span>Pure Veg Only</span>
          </button>

          <span className="text-xs text-slate-400 font-medium">
            {filteredItems.length} dishes available
          </span>
        </div>

        {/* Category Horizontal Scrolling Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as FoodCategory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Food Items List */}
      <div className="px-4 pt-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 mt-6 shadow-xs">
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="font-bold text-slate-800 text-base">No meals found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              We couldn&apos;t find anything matching your filters. Try clearing your search or switching categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setVegOnly(false);
              }}
              className="mt-4 bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onOpenDetails={(it) => setSelectedFoodItem(it)}
            />
          ))
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="text-xs font-semibold text-slate-400">Loading Canteen Menu...</div>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
