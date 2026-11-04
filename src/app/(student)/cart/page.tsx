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
  Clock, 
  Info,
  ChevronLeft,
  UtensilsCrossed
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
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-[#FFE4E6] border-2 border-[#E23744]/30 flex items-center justify-center text-[#E23744] mb-4 shadow-sm">
          <ShoppingBag className="w-10 h-10 stroke-[1.8]" />
        </div>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1A3D4F] tracking-tight">
          Your Canteen Tray is Empty
        </h2>
        <p className="font-sans text-sm text-[#5F6B6F] mt-2 max-w-sm leading-relaxed">
          Looks like you haven&apos;t added any campus meals yet. Check out the menu and order ahead before your lecture break!
        </p>
        <Link
          href="/menu"
          className="mt-6 bg-[#E23744] hover:bg-[#CB202D] active:scale-95 text-white font-sans font-extrabold text-sm px-7 py-3.5 rounded-2xl shadow-elevated flex items-center gap-2 transition"
        >
          <span>Explore Canteen Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-32">
      
      {/* Top Header */}
      <div className="bg-white border-b border-[#EAE5DC] py-4 sticky top-18 md:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/menu" className="p-2 rounded-xl hover:bg-[#FAF7F2] text-[#1A3D4F] transition">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#1A3D4F]">
                Your Order Tray
              </h1>
              <p className="text-xs font-sans text-[#5F6B6F]">
                {items.reduce((sum, i) => sum + i.quantity, 0)} items selected from Food Republic C1
              </p>
            </div>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-sans text-[#CC191D] hover:text-[#991316] font-bold flex items-center gap-1.5 p-2 rounded-xl hover:bg-[#FFF5F5] transition"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Tray</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Estimated Prep Notice */}
        <div className="bg-[#FBF1D4] border border-[#E8B92C]/50 rounded-2xl p-4 mb-6 flex items-center gap-3 text-xs sm:text-sm font-sans text-[#8A6A0B]">
          <Clock className="w-5 h-5 text-[#DBA81F] flex-shrink-0" />
          <span>Average kitchen preparation: <strong>10-15 mins</strong>. Pre-order ready for direct express pickup at <strong>Counter 2</strong>.</span>
        </div>

        {/* Desktop Split View: Items on Left, Bill Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Items List */}
          <div className="lg:col-span-7 space-y-4">
            {items.map(({ menuItem, quantity, customNote, spiceLevel }) => (
              <div
                key={menuItem.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EAE5DC] shadow-soft flex gap-4 transition-all hover:shadow-elevated"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#F5EFE6] flex-shrink-0">
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
                      <h3 className="font-heading font-bold text-base sm:text-lg text-[#1A3D4F] truncate">
                        {menuItem.name}
                      </h3>
                      <button
                        onClick={() => removeItem(menuItem.id)}
                        className="text-[#8A7F70] hover:text-[#CC191D] p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 font-sans">
                      {spiceLevel && (
                        <span className="text-[11px] bg-[#FAF7F2] border border-[#EAE5DC] text-[#5F6B6F] px-2 py-0.5 rounded-md font-semibold">
                          Spice: {spiceLevel}
                        </span>
                      )}
                      {customNote && (
                        <span className="text-[11px] bg-[#FBF1D4] text-[#8A6A0B] px-2 py-0.5 rounded-md font-medium truncate max-w-[200px]">
                          &quot;{customNote}&quot;
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#EAE5DC]">
                    <div className="font-heading font-bold text-lg text-[#1A3D4F]">
                      ₹{menuItem.price * quantity}
                      <span className="text-xs font-sans font-normal text-[#8A7F70] ml-1">
                        (₹{menuItem.price} each)
                      </span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-[#FFE4E6] border border-[#E23744]/30 rounded-xl p-0.5">
                      <button
                        onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#E23744] hover:bg-white rounded-lg active:scale-90 transition"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <span className="w-7 text-center text-xs font-black text-[#1A3D4F] font-sans">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#E23744] hover:bg-white rounded-lg active:scale-90 transition"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Items Button */}
            <Link
              href="/menu"
              className="w-full bg-white border border-dashed border-[#DBA81F] text-[#1A3D4F] hover:text-[#E23744] font-sans font-bold text-sm py-4 rounded-3xl flex items-center justify-center gap-2 hover:bg-[#FBF1D4]/30 transition shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add More Campus Dishes</span>
            </Link>
          </div>

          {/* Right Column: Sticky Bill Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-soft space-y-4 sticky top-36">
              <h3 className="eyebrow text-[#8A7F70] pb-2 border-b border-[#EAE5DC]">
                Bill Breakdown
              </h3>

              <div className="space-y-3 font-sans text-sm">
                <div className="flex items-center justify-between text-[#5F6B6F]">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-[#1A3D4F]">₹{subtotal}</span>
                </div>

                <div className="flex items-center justify-between text-[#5F6B6F]">
                  <span className="flex items-center gap-1.5">
                    <span>Campus Packaging Charge</span>
                    <Info className="w-3.5 h-3.5 text-[#8A7F70]" />
                  </span>
                  <span className="font-bold text-[#1A3D4F]">₹{platformFee}</span>
                </div>

                <div className="flex items-center justify-between text-[#5F6B6F]">
                  <span>Govt. Taxes & GST (5%)</span>
                  <span className="font-bold text-[#1A3D4F]">₹{tax}</span>
                </div>

                <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between text-base font-heading font-extrabold text-[#1A3D4F]">
                  <span>Total Amount</span>
                  <span className="text-2xl text-[#E23744]">₹{total}</span>
                </div>
              </div>

              {/* Checkout Button on Desktop */}
              <div className="pt-2">
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-[#E23744] hover:bg-[#CB202D] active:scale-98 text-white font-sans font-extrabold text-base py-4 px-6 rounded-2xl shadow-elevated flex items-center justify-center gap-2 transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Notice */}
              <div className="bg-[#FAF7F2] rounded-2xl p-4 text-xs font-sans text-[#5F6B6F] leading-relaxed border border-[#EAE5DC]">
                💡 <strong>Pre-Order Note:</strong> Food is reserved in the canteen queue. You can pay directly at Counter 2 using UPI QR or cash when you pick it up.
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Checkout Bar for Mobile Screens */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-white border-t border-[#EAE5DC] px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[#8A7F70] uppercase font-bold tracking-wider block font-sans">
              To Pay
            </span>
            <span className="text-xl font-heading font-extrabold text-[#1A3D4F]">₹{total}</span>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="flex-grow bg-[#E23744] hover:bg-[#CB202D] active:scale-98 text-white font-sans font-extrabold text-sm py-3 px-5 rounded-2xl shadow-elevated flex items-center justify-center gap-2 transition"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}