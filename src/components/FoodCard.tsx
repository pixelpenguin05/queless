'use client';

import React from 'react';
import { MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Star, Clock, Plus, Minus, Flame } from 'lucide-react';
import Image from 'next/image';

interface Props {
  item: MenuItem;
  onOpenDetails?: (item: MenuItem) => void;
  layout?: 'row' | 'grid';
}

export const FoodCard: React.FC<Props> = ({ item, onOpenDetails, layout = 'grid' }) => {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const qty = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white rounded-3xl p-4 shadow-soft border border-[#EAE5DC] flex flex-col sm:flex-row gap-4 transition-all duration-300 hover:shadow-elevated hover:border-[#DBA81F]/40 relative overflow-hidden group card-hover">
      
      {/* Food Image Container */}
      <div 
        onClick={() => onOpenDetails?.(item)}
        className="relative w-full sm:w-36 h-44 sm:h-36 rounded-2xl overflow-hidden bg-[#F5EFE6] flex-shrink-0 cursor-pointer"
      >
        <Image
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={item.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, 150px"
          className={`object-cover transition-transform duration-500 group-hover:scale-108 ${
            !item.isAvailable ? 'grayscale opacity-60' : ''
          }`}
        />

        {/* Dietary Veg/Non-Veg Tag */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md p-1.5 rounded-lg shadow-sm">
          {item.isVeg ? (
            <div className="w-4 h-4 border-2 border-[#0F5B4C] flex items-center justify-center rounded-sm">
              <div className="w-2 h-2 bg-[#0F5B4C] rounded-full" />
            </div>
          ) : (
            <div className="w-4 h-4 border-2 border-[#CC191D] flex items-center justify-center rounded-sm">
              <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[7px] border-b-[#CC191D]" />
            </div>
          )}
        </div>

        {/* Prep Time Pill */}
        <div className="absolute bottom-2.5 left-2.5 bg-[#1A3D4F]/85 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[11px] text-white font-sans font-semibold flex items-center gap-1 shadow-sm">
          <Clock className="w-3 h-3 text-[#E8B92C]" />
          <span>{item.preparationTimeMin}m prep</span>
        </div>

        {/* Popular Tag */}
        {item.popular && (
          <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-[#DBA81F] to-[#E8B92C] text-[#1A3D4F] text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <Flame className="w-3 h-3 fill-[#1A3D4F]" />
            <span>TOP PICK</span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-[#1A3D4F]/75 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-[#CC191D] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Details & Action Column */}
      <div className="flex flex-col justify-between flex-grow min-w-0">
        <div onClick={() => onOpenDetails?.(item)} className="cursor-pointer">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-bold text-[#1A3D4F] text-lg sm:text-xl group-hover:text-[#E23744] transition-colors leading-snug">
              {item.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm font-sans text-[#5F6B6F] line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center gap-2.5 mt-2.5">
            <div className="flex items-center gap-1 bg-[#FBF1D4] text-[#DBA81F] px-2 py-0.5 rounded-md text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-[#DBA81F] text-[#DBA81F]" />
              <span className="text-[#1A3D4F]">{item.rating}</span>
            </div>
            {item.calories && (
              <span className="text-xs font-sans font-medium text-[#8A7F70]">
                {item.calories} kcal
              </span>
            )}
            <span className="text-xs font-sans text-[#8A7F70] truncate max-w-[120px]">
              • {item.restaurantName || 'Food Republic C1'}
            </span>
          </div>
        </div>

        {/* Pricing and Cart Stepper */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#EAE5DC]">
          <div>
            <span className="text-[11px] font-sans text-[#8A7F70] uppercase tracking-wider font-semibold block">Price</span>
            <div className="font-heading font-bold text-[#1A3D4F] text-xl">
              ₹{item.price}
            </div>
          </div>

          <div>
            {!item.isAvailable ? (
              <button
                disabled
                className="px-4 py-2 text-xs font-bold text-[#8A7F70] bg-[#EAE5DC] rounded-xl cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : qty === 0 ? (
              <button
                onClick={() => addItem(item, 1)}
                className="flex items-center gap-1.5 bg-[#E23744] hover:bg-[#CB202D] active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#E23744]/20 transition-all font-sans"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>ADD</span>
              </button>
            ) : (
              <div className="flex items-center bg-[#FFE4E6] border border-[#E23744]/40 rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => updateQuantity(item.id, qty - 1)}
                  className="w-7 h-7 flex items-center justify-center text-[#E23744] hover:bg-white rounded-lg active:scale-90 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="w-7 text-center text-xs font-black text-[#1A3D4F] font-sans">
                  {qty}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, qty + 1)}
                  className="w-7 h-7 flex items-center justify-center text-[#E23744] hover:bg-white rounded-lg active:scale-90 transition-all"
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