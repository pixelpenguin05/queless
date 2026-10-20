'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Info,
  ChevronLeft
} from 'lucide-react';
import Image from 'next/image';

export default function CartPage() {
  const router = useRouter();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    subtotal, 
    platformFee, 
    tax, 
    total 
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-brand-50 border-2 border-brand-100 flex items-center justify-center text-brand-500 mb-4 shadow-inner">
          <ShoppingBag className="w-10 h-10 stroke-[1.8]" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Your Canteen Cart is Empty
        </h2>
        <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
          Looks like you haven&apos;t added any campus meals yet. Check out the menu and order ahead before break!
        </p>
        <Link
          href="/menu"
          className="mt-6 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-elevated flex items-center gap-2 transition"
        >
          <span>Explore Canteen Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-2">
          <Link href="/menu" className="p-1 rounded-xl hover:bg-slate-100 text-slate-600">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-extrabold text-base text-slate-900">
            Your Tray ({items.reduce((sum, i) => sum + i.quantity, 0)} items)
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 p-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Tray</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Estimated Prep Notice */}
        <div className="bg-amber-50 border border-amber-200/70 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-amber-900">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Average prep time: <strong>10-15 mins</strong>. Pre-order ready for pickup at Counter 2.</span>
        </div>

        {/* Cart Items List */}
        <div className="space-y-3">
          {items.map(({ menuItem, quantity, customNote, spiceLevel }) => (
            <div
              key={menuItem.id}
              className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-soft flex gap-3 relative"
            >
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                <Image
                  src={menuItem.image}
                  alt={menuItem.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-between flex-grow min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {menuItem.name}
                    </h3>
                    <button
                      onClick={() => removeItem(menuItem.id)}
                      className="text-slate-300 hover:text-rose-500 p-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {spiceLevel && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                        Spice: {spiceLevel}
                      </span>
                    )}
                    {customNote && (
                      <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded font-medium truncate max-w-[150px]">
                        &quot;{customNote}&quot;
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                  <div className="font-extrabold text-slate-900 text-sm">
                    ₹{menuItem.price * quantity}
                    <span className="text-[10px] font-normal text-slate-400 ml-1">
                      (₹{menuItem.price} each)
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-brand-50 border border-brand-200 rounded-xl p-0.5">
                    <button
                      onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-brand-700 hover:bg-brand-100 rounded-lg active:scale-90 transition"
                    >
                      <Minus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-brand-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-brand-700 hover:bg-brand-100 rounded-lg active:scale-90 transition"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add More Items Button */}
        <Link
          href="/menu"
          className="w-full bg-white border border-dashed border-brand-300 text-brand-600 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 hover:bg-brand-50/50 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add More Dishes</span>
        </Link>

        {/* Transparent Bill Summary */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-2.5">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-2">
            Bill Details
          </h3>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Item Subtotal</span>
            <span className="font-semibold text-slate-900">₹{subtotal}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span>Campus Packaging Charge</span>
              <Info className="w-3 h-3 text-slate-400" />
            </span>
            <span className="font-semibold text-slate-900">₹{platformFee}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Govt. Taxes & GST (5%)</span>
            <span className="font-semibold text-slate-900">₹{tax}</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm font-black text-slate-900">
            <span>To Pay</span>
            <span className="text-base text-brand-600">₹{total}</span>
          </div>
        </div>

        {/* Canteen Payment Policy Alert */}
        <div className="bg-slate-100/80 rounded-2xl p-3 text-[11px] text-slate-500 leading-relaxed">
          💡 <strong>Notice:</strong> QueueLess CU reserves your food in the canteen queue. You pay directly at the counter upon pickup via UPI QR or cash. No advance payment deducted.
        </div>
      </div>

      {/* Floating Checkout Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Total Amount
            </span>
            <span className="text-lg font-black text-slate-900">₹{total}</span>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="flex-grow bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-extrabold text-sm py-3 px-5 rounded-2xl shadow-elevated flex items-center justify-center gap-2 transition"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
