'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { X, Star, Clock, Plus, Minus, ShoppingBag, Flame } from 'lucide-react';
import Image from 'next/image';

interface Props {
  item: MenuItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<Props> = ({ item, onClose }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Spicy'>('Medium');
  const [customNote, setCustomNote] = useState('');

  if (!item) return null;

  const handleAddToCart = () => {
    addItem(item, quantity, customNote, spiceLevel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A3D4F]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#EAE5DC] animate-in fade-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-64 w-full bg-[#F5EFE6]">
          <Image
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
            alt={item.name}
            fill
            unoptimized
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-md p-2 rounded-full text-[#1A3D4F] shadow-md active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Veg/Non-Veg Tag */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
            {item.isVeg ? (
              <div className="w-3.5 h-3.5 border-2 border-[#0F5B4C] flex items-center justify-center rounded-sm">
                <div className="w-1.5 h-1.5 bg-[#0F5B4C] rounded-full" />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 border-2 border-[#CC191D] flex items-center justify-center rounded-sm">
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-[#CC191D]" />
              </div>
            )}
            <span className="text-xs font-bold font-sans text-[#1A3D4F]">
              {item.isVeg ? 'Pure Veg' : 'Non-Veg'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-2xl text-[#1A3D4F] leading-tight">
                {item.name}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-xs font-bold text-[#1A3D4F] bg-[#FBF1D4] px-2.5 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-[#DBA81F] text-[#DBA81F]" />
                  <span>{item.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-sans text-[#5F6B6F]">
                  <Clock className="w-3.5 h-3.5 text-[#E8B92C]" />
                  <span>{item.preparationTimeMin} mins prep</span>
                </div>
                {item.calories && (
                  <span className="text-xs font-sans text-[#8A7F70]">
                    🔥 {item.calories} kcal
                  </span>
                )}
              </div>
            </div>
            <div className="font-heading font-extrabold text-2xl text-[#E23744]">
              ₹{item.price}
            </div>
          </div>

          <p className="text-sm font-sans text-[#5F6B6F] mt-3 leading-relaxed border-b border-[#EAE5DC] pb-4">
            {item.description}
          </p>

          {/* Spice Level Preference */}
          <div className="mt-5">
            <label className="eyebrow text-[#8A7F70] block mb-2 font-sans">
              Select Spice Preference
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Mild', 'Medium', 'Spicy'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSpiceLevel(lvl)}
                  className={`py-2.5 text-xs font-bold rounded-2xl border transition-all font-sans ${
                    spiceLevel === lvl
                      ? 'border-[#E23744] bg-[#FFF5F5] text-[#E23744] ring-2 ring-[#E23744]/20 shadow-xs'
                      : 'border-[#EAE5DC] text-[#5F6B6F] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {lvl === 'Spicy' ? '🌶️ ' : lvl === 'Medium' ? '🌿 ' : '🍯 '}
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mt-5">
            <label className="eyebrow text-[#8A7F70] block mb-1.5 font-sans">
              Kitchen Special Instructions
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Less oil, extra green chutney, pack separately..."
              className="w-full text-xs font-sans bg-[#FAF7F2] border border-[#EAE5DC] rounded-2xl px-4 py-3 text-[#1A3D4F] placeholder-[#8A7F70] focus:outline-none focus:ring-2 focus:ring-[#E23744] focus:border-transparent transition"
            />
          </div>

          {/* Quantity and Add Button */}
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[#EAE5DC]">
            <div className="flex items-center bg-[#F5EFE6] rounded-2xl p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#1A3D4F] hover:bg-white active:scale-95 transition"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="w-10 text-center font-bold text-[#1A3D4F] text-base font-sans">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#1A3D4F] hover:bg-white active:scale-95 transition"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className="flex-grow bg-[#E23744] hover:bg-[#CB202D] disabled:bg-[#EAE5DC] disabled:text-[#8A7F70] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-elevated flex items-center justify-center gap-2 active:scale-98 transition font-sans text-sm"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>Add to Tray • ₹{item.price * quantity}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};