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
  Utensils,
  LogIn,
  User,
  Phone
} from 'lucide-react';

const PICKUP_SLOTS = [
  { id: 'Immediate', label: 'Immediate (15-20 min)', note: 'Cooked right away for instant pickup' },
  { id: 'Break 1 (11:00 AM)', label: 'Morning Break (11:00 AM)', note: 'Packed & ready at 10:55 AM' },
  { id: 'Lunch Break (1:15 PM)', label: 'Lunch Break (1:15 PM)', note: 'Peak canteen slot • zero wait' },
  { id: 'Evening Break (4:30 PM)', label: 'Evening Snacks (4:30 PM)', note: 'Hot chai & snacks ready' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, openAuthModal, loginAsStudent } = useAuth();
  const { items, total, subtotal, platformFee, tax, clearCart } = useCart();
  const { placeOrder } = useOrders();

  const [pickupSlot, setPickupSlot] = useState('Immediate (15-20 min)');
  // Default to Cash on Delivery as requested
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI at Pickup'>('Cash on Delivery');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If cart is empty, redirect
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
        <p className="font-heading font-bold text-xl text-[#1A3D4F]">Your tray is empty.</p>
        <Link href="/menu" className="mt-4 font-sans text-sm font-bold text-[#E23744] underline">
          Return to Canteen Menu
        </Link>
      </div>
    );
  }

  const handleConfirmOrder = async () => {
    setError(null);

    // If user is not logged in, require name & phone right on checkout or through modal
    let studentName = user?.name || guestName.trim();
    let studentPhone = user?.phone || guestPhone.trim().replace(/\s+/g, '');

    if (!studentName || !studentPhone) {
      setError('Please provide your Name and Phone Number so the canteen knows who the order is for.');
      return;
    }

    if (studentPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // If not logged in yet, auto-save profile
    if (!user) {
      await loginAsStudent(studentName, studentPhone);
    }

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
        studentId: user?.id || 'student-' + studentPhone.slice(-6),
        studentName,
        studentPhone,
        studentRollNo: user?.rollNumber || 'CU-' + studentPhone.slice(-4),
        restaurantId: items[0]?.menuItem.restaurantId || 'rest-c1',
        restaurantName: items[0]?.menuItem.restaurantName || 'Food Republic C1',
        items: orderItems,
        subtotal,
        platformFee,
        tax,
        total,
        pickupSlot,
        paymentMethod,
        paymentStatus: 'Pending',
        estimatedReadyTime: pickupSlot.includes('Immediate') ? '15 mins' : pickupSlot,
        canteenCounter: 'Food Republic C1 • Counter 2',
      });

      clearCart();
      router.push(`/orders/${newOrder.id}`);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to place order. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-32">
      
      {/* Header */}
      <div className="bg-white border-b border-[#EAE5DC] py-4 sticky top-18 md:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-[#FAF7F2] text-[#1A3D4F] transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#1A3D4F]">
              Confirm Canteen Pre-Order
            </h1>
            <p className="text-xs font-sans text-[#5F6B6F]">
              Cash on Delivery (Pay at Counter) • Pick up with Token
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-[#FFF5F5] border border-[#CC191D]/30 text-[#CC191D] p-4 rounded-2xl text-xs sm:text-sm font-sans font-bold">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Student Information */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <h2 className="eyebrow text-[#8A7F70]">
                  1. Student Details (For Kitchen Pickup)
                </h2>
                {user ? (
                  <span className="text-xs font-bold font-sans text-[#0F5B4C] bg-[#E7F5EE] border border-[#0F5B4C]/20 px-3 py-1 rounded-full">
                    Signed In
                  </span>
                ) : (
                  <button
                    onClick={openAuthModal}
                    className="text-xs font-bold font-sans text-[#E23744] hover:underline flex items-center gap-1"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Have Account? Quick Sign In</span>
                  </button>
                )}
              </div>

              {user ? (
                <div>
                  <div className="text-lg font-heading font-bold text-[#1A3D4F]">
                    {user.name}
                  </div>
                  <div className="text-xs font-sans text-[#5F6B6F] mt-1 space-y-0.5">
                    <div>Mobile: <strong className="text-[#1A3D4F]">{user.phone}</strong> (Canteen will issue Token for this number)</div>
                    <div>Campus ID: <span className="font-bold text-[#1A3D4F]">{user.rollNumber || 'CU Student'}</span></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 font-sans">
                  <p className="text-xs text-[#5F6B6F]">
                    Enter your name & phone number so the kitchen can announce your token when hot and ready:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8A7F70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Your Name (e.g. Aman)"
                        className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1A3D4F] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#8A7F70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="10-digit Phone Number"
                        maxLength={10}
                        className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1A3D4F] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selector (Focusing on Cash on Delivery) */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-soft">
              <h2 className="eyebrow text-[#8A7F70] mb-3">
                2. Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3.5 transition font-sans ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-[#E23744] bg-[#FFF5F5] ring-2 ring-[#E23744]/20 shadow-xs'
                      : 'border-[#EAE5DC] hover:border-[#DBA81F] bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E7F5EE] text-[#0F5B4C] flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A3D4F]">Cash on Delivery (COD)</div>
                    <p className="text-[11px] text-[#5F6B6F]">Pay cash at counter upon collecting meal</p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('UPI at Pickup')}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3.5 transition font-sans ${
                    paymentMethod === 'UPI at Pickup'
                      ? 'border-[#E23744] bg-[#FFF5F5] ring-2 ring-[#E23744]/20 shadow-xs'
                      : 'border-[#EAE5DC] hover:border-[#DBA81F] bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFE4E6] text-[#E23744] flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A3D4F]">UPI / QR at Pickup</div>
                    <p className="text-[11px] text-[#5F6B6F]">Scan GPay/PhonePe at counter</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Location & Counter */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-soft">
              <h2 className="eyebrow text-[#8A7F70] mb-3">
                3. Pickup Location
              </h2>
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#FFE4E6] text-[#E23744] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 stroke-[2.3]" />
                </div>
                <div>
                  <div className="text-base font-heading font-bold text-[#1A3D4F]">
                    {items[0]?.menuItem.restaurantName || 'Food Republic C1'}
                  </div>
                  <p className="text-xs sm:text-sm font-sans text-[#5F6B6F] mt-1">
                    Food Republic C1, Ground Floor • <strong>Counter 2 (Express Food Lane)</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Pickup Time Slot */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#E23744]" />
                <h2 className="eyebrow text-[#8A7F70]">
                  4. Select When to Pickup
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PICKUP_SLOTS.map((slot) => {
                  const isSelected = pickupSlot === slot.label;
                  return (
                    <div
                      key={slot.id}
                      onClick={() => setPickupSlot(slot.label)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between font-sans ${
                        isSelected
                          ? 'border-[#E23744] bg-[#FFF5F5] ring-2 ring-[#E23744]/20 shadow-xs'
                          : 'border-[#EAE5DC] hover:border-[#DBA81F] bg-white'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-[#1A3D4F]">{slot.label}</div>
                        <div className="text-[11px] text-[#5F6B6F] mt-0.5">{slot.note}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ml-2 ${
                          isSelected ? 'border-[#E23744] bg-[#E23744] text-white' : 'border-[#EAE5DC]'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Order Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-soft space-y-4 sticky top-36">
              <h2 className="eyebrow text-[#8A7F70] pb-2 border-b border-[#EAE5DC]">
                Pre-Order Summary ({items.length} items)
              </h2>

              <div className="divide-y divide-[#EAE5DC] text-xs font-sans max-h-56 overflow-y-auto custom-scrollbar pr-1">
                {items.map((i) => (
                  <div key={i.menuItem.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#1A3D4F]">{i.quantity}x {i.menuItem.name}</span>
                      {i.customNote && <p className="text-[10px] text-[#8A7F70] mt-0.5">&quot;{i.customNote}&quot;</p>}
                    </div>
                    <span className="font-bold text-[#1A3D4F]">₹{i.menuItem.price * i.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#EAE5DC] space-y-2 font-sans text-sm">
                <div className="flex justify-between text-[#5F6B6F]">
                  <span>Item Subtotal:</span>
                  <span className="font-semibold text-[#1A3D4F]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#5F6B6F]">
                  <span>Packaging & Tax:</span>
                  <span className="font-semibold text-[#1A3D4F]">₹{platformFee + tax}</span>
                </div>
                <div className="pt-2 border-t border-[#EAE5DC] flex items-center justify-between text-base font-heading font-extrabold text-[#1A3D4F]">
                  <span>Total to Pay (COD)</span>
                  <span className="text-2xl text-[#E23744]">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={submitting}
                className="w-full bg-[#E23744] hover:bg-[#CB202D] active:scale-98 disabled:bg-[#EAE5DC] disabled:text-[#8A7F70] text-white font-sans font-extrabold text-base py-4 px-6 rounded-2xl shadow-elevated flex items-center justify-center gap-2 transition"
              >
                {submitting ? (
                  <span>Sending Order to Canteen...</span>
                ) : (
                  <>
                    <Utensils className="w-5 h-5 stroke-[2.3]" />
                    <span>Confirm Order & Get Token</span>
                  </>
                )}
              </button>

              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE5DC] text-[11px] font-sans text-[#5F6B6F] text-center">
                💵 <strong>Cash on Delivery:</strong> Pay cash at the counter when you pick up your hot meal.
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
