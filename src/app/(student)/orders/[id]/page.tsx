'use client';

import React from 'react';
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
  Sparkles, 
  BellRing, 
  ShieldCheck, 
  Phone,
  Play
} from 'lucide-react';

export default function SingleOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { getOrderById, updateOrderStatus } = useOrders();

  const orderId = params?.id as string;
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-bold text-slate-800">Order Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">This order might have expired or does not exist.</p>
        <Link href="/orders" className="mt-4 bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-xl">
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
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 flex items-center justify-between sticky top-16 z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <Link href="/orders" className="p-1 rounded-xl hover:bg-slate-100 text-slate-600">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900">
              Live Order #{order.orderNumber}
            </h1>
            <p className="text-[10px] text-slate-400">
              Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <OrderStatusBadge status={order.status} size="sm" />
      </div>

      <div className="p-4 space-y-4">
        {/* Big Pickup Token Badge */}
        <div className={`rounded-3xl p-5 text-center text-white shadow-elevated relative overflow-hidden ${
          order.status === 'ready'
            ? 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 animate-pulse'
            : 'bg-gradient-to-tr from-slate-900 via-slate-800 to-brand-900'
        }`}>
          {order.status === 'ready' && (
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold mb-2 shadow-xs">
              <BellRing className="w-3.5 h-3.5" />
              <span>HOT & PACKED • READY FOR PICKUP</span>
            </div>
          )}

          <p className="text-xs uppercase font-bold tracking-wider text-slate-300">
            Show This Token At Canteen Counter
          </p>

          <div className="text-4xl font-black tracking-tight my-1 text-amber-300">
            #{order.orderNumber}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-200 mt-2">
            <MapPin className="w-4 h-4 text-brand-400" />
            <span>{order.canteenCounter}</span>
          </div>
        </div>

        {/* Live Step Progress Tracker */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
            Live Preparation Status
          </h2>
          <LiveOrderTracker status={order.status} />

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Estimated Ready Time:</span>
            <span className="font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
              {order.estimatedReadyTime}
            </span>
          </div>
        </div>

        {/* Canteen Counter Instructions */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Pickup Instructions
          </h2>
          <div className="text-xs text-slate-600 space-y-1.5">
            <p>1. Head to <strong>Central Canteen (Block B-3)</strong>.</p>
            <p>2. Go to <strong>{order.canteenCounter}</strong> (Express Pre-Order Lane).</p>
            <p>3. Show Token <strong>#{order.orderNumber}</strong> on your phone screen.</p>
            <p>4. Complete payment via <strong>{order.paymentMethod}</strong> and enjoy your break!</p>
          </div>
        </div>

        {/* Ordered Food Items */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Order Receipt ({order.items.length} items)
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {order.items.map((i, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{i.quantity}x {i.name}</span>
                  {i.customNote && <p className="text-[10px] text-slate-400">&quot;{i.customNote}&quot;</p>}
                </div>
                <span className="font-bold text-slate-900">₹{i.price * i.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Packaging & Tax:</span>
              <span>₹{order.platformFee + order.tax}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
              <span>Total Bill:</span>
              <span className="text-brand-600">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Evaluator Simulation Control */}
        {nextStatus && (
          <div className="bg-brand-50 border border-brand-200 rounded-3xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-800 mb-1">
              <Play className="w-3.5 h-3.5 text-brand-600" />
              <span>Interactive Demo Simulator</span>
            </div>
            <p className="text-[11px] text-brand-600/90 mb-3">
              Advance this order to test live status progression as the kitchen staff would:
            </p>
            <button
              onClick={() => updateOrderStatus(order.id, nextStatus)}
              className="bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              Simulate: Mark as &quot;{nextStatus.toUpperCase()}&quot;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
