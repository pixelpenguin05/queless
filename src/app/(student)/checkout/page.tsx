'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { 
  ChevronLeft, 
  Clock, 
  MapPin, 
  QrCode, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  Utensils 
} from 'lucide-react';

const PICKUP_SLOTS = [
  { id: 'Immediate', label: 'Immediate (15-20 min)', note: 'Cooked right away' },
  { id: 'Break 1 (11:00 AM)', label: 'Morning Break (11:00 AM)', note: 'Ready at 10:55 AM' },
  { id: 'Lunch Break (1:15 PM)', label: 'Lunch Break (1:15 PM)', note: 'Peak break slot' },
  { id: 'Evening Break (4:30 PM)', label: 'Evening Snacks (4:30 PM)', note: 'Hot chai & samosas' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, subtotal, platformFee, tax, clearCart } = useCart();
  const { placeOrder } = useOrders();

  const [pickupSlot, setPickupSlot] = useState('Immediate (15-20 min)');
  const [paymentMethod, setPaymentMethod] = useState<'UPI at Pickup' | 'Pay at Counter'>('UPI at Pickup');
  const [submitting, setSubmitting] = useState(false);

  // If cart is empty, redirect
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-semibold text-slate-600">Your tray is empty.</p>
        <Link href="/menu" className="mt-4 text-xs font-bold text-brand-600 underline">
          Return to Menu
        </Link>
      </div>
    );
  }

  const handleConfirmOrder = async () => {
    setSubmitting(true);

    try {
      const orderItems = items.map((i) => ({
        id: i.menuItem.id,
        name: i.menuItem.name,
        price: i.menuItem.price,
        quantity: i.quantity,
        isVeg: i.menuItem.isVeg,
        customNote: i.customNote,
      }));

      const newOrder = await placeOrder({
        studentId: user?.id || 'guest-student',
        studentName: user?.name || 'Campus Student',
        studentPhone: user?.phone || '+91 98765 43210',
        studentRollNo: user?.rollNumber || '21BCS4821',
        items: orderItems,
        subtotal,
        platformFee,
        tax,
        total,
        pickupSlot,
        paymentMethod,
        paymentStatus: 'Pending',
        estimatedReadyTime: pickupSlot.includes('Immediate') ? '15 mins' : pickupSlot,
        canteenCounter: 'Counter 2 (Food Republic C1)',
      });

      clearCart();
      router.push(`/orders/${newOrder.id}`);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 flex items-center gap-2 sticky top-16 z-30 shadow-xs">
        <button onClick={() => router.back()} className="p-1 rounded-xl hover:bg-slate-100 text-slate-600">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-base text-slate-900">
          Confirm Canteen Pre-Order
        </h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Student Details Card */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Student Information
            </h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Verified Student
            </span>
          </div>

          <div className="text-sm font-bold text-slate-900">
            {user?.name || 'Aman Sharma'}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Roll No: <span className="font-semibold text-slate-700">{user?.rollNumber || '21BCS4821'}</span>
          </div>
          <div className="text-xs text-slate-500">
            Phone: <span className="font-semibold text-slate-700">{user?.phone || '+91 98765 43210'}</span>
          </div>
        </div>

        {/* Pickup Location & Counter */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
            Pickup Counter Location
          </h2>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Chandigarh University Food Republic C1
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Food Republic C1, Ground Floor • <strong>Counter 2 (Pre-Order Express)</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Pickup Time Slot Selection */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Clock className="w-4 h-4 text-brand-600" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Select Pickup Time
            </h2>
          </div>

          <div className="space-y-2">
            {PICKUP_SLOTS.map((slot) => {
              const isSelected = pickupSlot === slot.label;
              return (
                <div
                  key={slot.id}
                  onClick={() => setPickupSlot(slot.label)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{slot.label}</div>
                    <div className="text-[11px] text-slate-500">{slot.note}</div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
            Payment Option at Pickup
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            <div
              onClick={() => setPaymentMethod('UPI at Pickup')}
              className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition ${
                paymentMethod === 'UPI at Pickup'
                  ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/20'
                  : 'border-slate-200'
              }`}
            >
              <QrCode className="w-5 h-5 text-brand-600 mb-2" />
              <div>
                <div className="text-xs font-bold text-slate-900">UPI at Counter</div>
                <p className="text-[10px] text-slate-500">Scan QR on pickup</p>
              </div>
            </div>

            <div
              onClick={() => setPaymentMethod('Pay at Counter')}
              className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition ${
                paymentMethod === 'Pay at Counter'
                  ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/20'
                  : 'border-slate-200'
              }`}
            >
              <Banknote className="w-5 h-5 text-emerald-600 mb-2" />
              <div>
                <div className="text-xs font-bold text-slate-900">Cash / Card</div>
                <p className="text-[10px] text-slate-500">Pay cash at counter</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Items */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
            Items Ordered ({items.length})
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {items.map((i) => (
              <div key={i.menuItem.id} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">{i.quantity}x {i.menuItem.name}</span>
                  {i.customNote && <p className="text-[10px] text-slate-400">&quot;{i.customNote}&quot;</p>}
                </div>
                <span className="font-bold text-slate-900">₹{i.menuItem.price * i.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-sm font-black text-slate-900">
            <span>Final Amount</span>
            <span className="text-base text-brand-600">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Place Order CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Total to Pay
            </span>
            <span className="text-lg font-black text-slate-900">₹{total}</span>
          </div>

          <button
            onClick={handleConfirmOrder}
            disabled={submitting}
            className="flex-grow bg-brand-500 hover:bg-brand-600 active:scale-98 disabled:bg-slate-300 text-white font-extrabold text-sm py-3 px-5 rounded-2xl shadow-elevated flex items-center justify-center gap-2 transition"
          >
            {submitting ? (
              <span>Placing Pre-Order...</span>
            ) : (
              <>
                <Utensils className="w-4 h-4" />
                <span>Confirm & Send to Kitchen</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
