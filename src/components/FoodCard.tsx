'use client';

import React from 'react';
import { MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Star, Clock, Plus, Minus } from 'lucide-react';
import Image from 'next/image';

interface Props {
  item: MenuItem;
  onOpenDetails?: (item: MenuItem) => void;
}

export const FoodCard: React.FC<Props> = ({ item, onOpenDetails }) => {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const qty = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white rounded-3xl p-3 shadow-soft border border-slate-100 flex gap-3.5 transition-all hover:shadow-elevated relative overflow-hidden group">
      {/* Food Image with Veg/Non-Veg Tag */}
      <div 
        onClick={() => onOpenDetails?.(item)}
        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 cursor-pointer"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 112px, 128px"
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            !item.isAvailable ? 'grayscale opacity-60' : ''
          }`}
        />

        {/* Dietary Tag Badge */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-1 rounded-md shadow-sm">
          {item.isVeg ? (
            <div className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center rounded-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 border-2 border-rose-600 flex items-center justify-center rounded-sm">
              <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-600" />
            </div>
          )}
        </div>

        {/* Prep Time */}
        <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-[10px] text-white font-medium flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          <span>{item.preparationTimeMin}m</span>
        </div>

        {/* Out of Stock Overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Details & Action */}
      <div className="flex flex-col justify-between flex-grow min-w-0 py-0.5">
        <div onClick={() => onOpenDetails?.(item)} className="cursor-pointer">
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate leading-snug">
              {item.name}
            </h3>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[11px] font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{item.rating}</span>
            </div>
            {item.calories && (
              <span className="text-[11px] text-slate-400">{item.calories} kcal</span>
            )}
          </div>
        </div>

        {/* Pricing and Cart Stepper */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
          <div>
            <span className="text-xs text-slate-400">Price</span>
            <div className="text-base font-extrabold text-slate-900">
              ₹{item.price}
            </div>
          </div>

          <div>
            {!item.isAvailable ? (
              <button
                disabled
                className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : qty === 0 ? (
              <button
                onClick={() => addItem(item, 1)}
                className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>ADD</span>
              </button>
            ) : (
              <div className="flex items-center bg-brand-50 border border-brand-200 rounded-xl p-0.5 shadow-sm">
                <button
                  onClick={() => updateQuantity(item.id, qty - 1)}
                  className="w-7 h-7 flex items-center justify-center text-brand-700 hover:bg-brand-100 rounded-lg active:scale-90 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-brand-900">
                  {qty}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, qty + 1)}
                  className="w-7 h-7 flex items-center justify-center text-brand-700 hover:bg-brand-100 rounded-lg active:scale-90 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
