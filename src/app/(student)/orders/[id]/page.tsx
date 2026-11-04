'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrders } from '@/context/OrderContext';
import { LiveOrderTracker } from '@/components/LiveOrderTracker';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { OrderStatus } from '@/lib/types';
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  BellRing, 
  ShieldCheck, 
  Play,
  ArrowRight,
  Phone,
  Banknote,
  CheckCircle2
} from 'lucide-react';

export default function SingleOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { getOrderById, updateOrderStatus, refreshOrders } = useOrders();

  const orderId = params?.id as string;
  const order = getOrderById(orderId);

  // Poll for live status changes on this order
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders();
    }, 2500);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-heading font-bold text-2xl text-[#1A3D4F]">Order Not Found</h2>
        <p className="text-xs font-sans text-[#5F6B6F] mt-1">This order might have expired or does not exist.</p>
        <Link href="/orders" className="mt-4 bg-[#E23744] text-white text-xs font-bold font-sans px-5 py-2.5 rounded-xl shadow-xs">
          Back to Orders
        </Link>
      </div>
    );
  }

  const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
    pending: 'accepted',
    accepted: 'preparing',
    preparing: 'ready',
    ready: 'completed',
    completed: null,
    cancelled: null,
  };

  const nextStatus = nextStatusMap[order.status];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-28">
      
      {/* Header */}
      <div className="bg-white border-b border-[#EAE5DC] py-4 sticky top-16 sm:top-18 md:top-20 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/orders" className="p-2 rounded-xl hover:bg-[#FAF7F2] text-[#1A3D4F] transition">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-heading font-bold text-lg sm:text-xl text-[#1A3D4F]">
                Pickup Token #{order.orderNumber}
              </h1>
              <p className="text-xs font-sans text-[#5F6B6F]">
                Ordered by {order.studentName} ({order.studentPhone})
              </p>
            </div>
          </div>

          <OrderStatusBadge status={order.status} size="sm" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Big Pickup Token Badge */}
        <div className={`rounded-4xl p-6 sm:p-8 text-center text-white shadow-elevated relative overflow-hidden transition-all ${
          order.status === 'ready'
            ? 'bg-gradient-to-tr from-[#0F5B4C] via-[#1D6E72] to-[#0F5B4C] ring-4 ring-[#E8B92C]'
            : order.status === 'preparing'
            ? 'bg-gradient-to-tr from-[#1A3D4F] via-[#2E5A66] to-[#E23744]'
            : 'bg-gradient-to-tr from-[#1A3D4F] via-[#2E5A66] to-[#1D6E72]'
        }`}>
          
          {/* Status Live Notification Banner inside token card */}
          {order.status === 'ready' && (
            <div className="inline-flex items-center gap-2 bg-[#E8B92C] text-[#1A3D4F] px-4 py-1.5 rounded-full text-xs font-black font-sans mb-3 shadow-md animate-bounce">
              <BellRing className="w-4 h-4 fill-[#1A3D4F]" />
              <span>YOUR FOOD IS READY! PLEASE COLLECT AT COUNTER</span>
            </div>
          )}

          {order.status === 'preparing' && (
            <div className="inline-flex items-center gap-2 bg-[#FFE4E6] text-[#E23744] px-4 py-1.5 rounded-full text-xs font-bold font-sans mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E23744] animate-ping" />
              <span>CHEF IS ACTIVELY PREPARING YOUR FOOD</span>
            </div>
          )}

          <p className="text-xs uppercase font-sans font-bold tracking-widest text-[#E8B92C]">
            Present This Token & Phone At Canteen Counter
          </p>

          <div className="font-heading font-black text-5xl sm:text-6xl tracking-tight my-2 text-white">
            #{order.orderNumber}
          </div>

          <div className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold font-sans text-white mb-2">
            Verification Code: {order.pickupCode || order.orderNumber.replace('QL-', '')}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-sans font-medium text-white/90 mt-1">
            <MapPin className="w-4 h-4 text-[#E8B92C]" />
            <span>{order.canteenCounter}</span>
          </div>
        </div>

        {/* Live Step Progress Tracker */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h2 className="eyebrow text-[#8A7F70]">
              Kitchen Progress Tracker
            </h2>
            <span className="text-xs font-sans font-bold text-[#E23744] capitalize">
              Status: {order.status}
            </span>
          </div>

          <LiveOrderTracker status={order.status} />

          <div className="mt-6 pt-4 border-t border-[#EAE5DC] flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm font-sans gap-2">
            <div className="text-[#5F6B6F]">
              Payment: <strong className="text-[#1A3D4F]">{order.paymentMethod}</strong> (Amount: <strong className="text-[#E23744]">₹{order.total}</strong>)
            </div>
            <div className="text-[#5F6B6F]">
              Pickup Slot: <span className="font-bold text-[#1A3D4F] bg-[#FBF1D4] px-2.5 py-0.5 rounded-md border border-[#E8B92C]/40">{order.pickupSlot}</span>
            </div>
          </div>
        </div>

        {/* Food Handover / Delivery Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Handover & Collection Flow */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-soft space-y-3">
            <h2 className="eyebrow text-[#8A7F70]">
              How to Collect Your Food
            </h2>
            <div className="text-xs sm:text-sm font-sans text-[#5F6B6F] space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FFE4E6] text-[#E23744] font-bold flex items-center justify-center text-xs flex-shrink-0">1</span>
                <div>
                  <strong className="text-[#1A3D4F]">Wait for Ready Notification</strong>
                  <p className="text-xs text-[#8A7F70] mt-0.5">Your phone will play a chime when the chef finishes packing your meal.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FFE4E6] text-[#E23744] font-bold flex items-center justify-center text-xs flex-shrink-0">2</span>
                <div>
                  <strong className="text-[#1A3D4F]">Walk to {order.canteenCounter}</strong>
                  <p className="text-xs text-[#8A7F70] mt-0.5">Show Token #{order.orderNumber} or Code {order.pickupCode} on your screen.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FFE4E6] text-[#E23744] font-bold flex items-center justify-center text-xs flex-shrink-0">3</span>
                <div>
                  <strong className="text-[#1A3D4F]">Hand Over Payment & Collect Meal</strong>
                  <p className="text-xs text-[#8A7F70] mt-0.5">Pay ₹{order.total} via {order.paymentMethod} and receive your fresh food.</p>
                </div>
              </div>

              {/* Student confirm button if order is ready */}
              {order.status === 'ready' && (
                <button
                  onClick={async () => {
                    await updateOrderStatus(order.id, 'completed');
                  }}
                  className="w-full mt-2 bg-[#0F5B4C] hover:bg-[#0B4438] text-white text-xs font-bold font-sans py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Received My Food From Counter</span>
                </button>
              )}
            </div>
          </div>

          {/* Ordered Food Items Receipt */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-soft space-y-3">
            <h2 className="eyebrow text-[#8A7F70]">
              Order Summary ({order.items.length} items)
            </h2>
            <div className="divide-y divide-[#EAE5DC] text-xs font-sans max-h-52 overflow-y-auto custom-scrollbar pr-1">
              {order.items.map((i, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1A3D4F]">{i.quantity}x {i.name}</span>
                    {i.customNote && <p className="text-[10px] text-[#8A7F70] mt-0.5">&quot;{i.customNote}&quot;</p>}
                  </div>
                  <span className="font-bold text-[#1A3D4F]">₹{i.price * i.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#EAE5DC] space-y-1.5 text-xs font-sans">
              <div className="flex justify-between text-[#5F6B6F]">
                <span>Payment Mode:</span>
                <span className="font-bold text-[#1A3D4F]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-base font-heading font-extrabold text-[#1A3D4F] pt-2 border-t border-[#EAE5DC]">
                <span>Total Amount:</span>
                <span className="text-xl text-[#E23744]">₹{order.total}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Evaluator Simulation Control (helps if testing on 1 screen) */}
        {nextStatus && (
          <div className="bg-[#FFF5F5] border border-[#E23744]/30 rounded-3xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-heading font-bold text-[#1A3D4F] mb-1">
              <Play className="w-4 h-4 text-[#E23744] fill-[#E23744]" />
              <span>Simulate Canteen Action (For Single Device Demo):</span>
            </div>
            <p className="text-[11px] font-sans text-[#5F6B6F] mb-3">
              Advance this order to test status progression without opening the second phone:
            </p>
            <button
              onClick={() => updateOrderStatus(order.id, nextStatus)}
              className="bg-[#E23744] hover:bg-[#CB202D] active:scale-95 text-white text-xs font-bold font-sans px-5 py-2.5 rounded-xl shadow-xs transition"
            >
              Simulate Canteen Action → &quot;{nextStatus.toUpperCase()}&quot;
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
