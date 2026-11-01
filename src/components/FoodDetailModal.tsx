'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { X, Star, Clock, Plus, Minus, ShoppingBag } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-float animate-in fade-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56 w-full bg-slate-100">
          <Image
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
            alt={item.name}
            fill
            unoptimized
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-slate-700 hover:bg-white shadow-md active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Veg/Non-Veg Tag */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
            {item.isVeg ? (
              <div className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center rounded-sm">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 border-2 border-rose-600 flex items-center justify-center rounded-sm">
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-600" />
              </div>
            )}
            <span className="text-xs font-bold text-slate-800">
              {item.isVeg ? 'Pure Veg' : 'Non-Veg'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                {item.name}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.preparationTimeMin} mins prep</span>
                </div>
                {item.calories && (
                  <span className="text-xs text-slate-400">
                    🔥 {item.calories} kcal
                  </span>
                )}
              </div>
            </div>
            <div className="text-2xl font-black text-brand-600">
              ₹{item.price}
            </div>
          </div>

          <p className="text-sm text-slate-600 mt-3 leading-relaxed border-b border-slate-100 pb-4">
            {item.description}
          </p>

          {/* Spice Level Selection */}
          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Spice Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mild', 'Medium', 'Spicy'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSpiceLevel(lvl)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    spiceLevel === lvl
                      ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {lvl === 'Spicy' ? '🌶️ ' : lvl === 'Medium' ? '🌿 ' : '🍯 '}
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Special Request */}
          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Canteen Special Instructions
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Less oil, extra chutney, pack separately..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Quantity and Add Button */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center bg-slate-100 rounded-2xl p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-white active:scale-95 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-9 text-center font-bold text-slate-900 text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-white active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className="flex-grow bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-2xl shadow-elevated flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart • ₹{item.price * quantity}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
