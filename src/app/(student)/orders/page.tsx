'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOrders } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';
import { useMenu } from '@/context/MenuContext';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { 
  ReceiptText, 
  Clock, 
  MapPin, 
  ArrowRight, 
  RotateCcw, 
  UtensilsCrossed 
} from 'lucide-react';

export default function OrdersPage() {
  const { activeOrders, pastOrders } = useOrders();
  const { addItem } = useCart();
  const { items: allMenuItems } = useMenu();
  const [tab, setTab] = useState<'active' | 'past'>('active');

  const handleReorder = (order: typeof pastOrders[0]) => {
    order.items.forEach((item) => {
      const found = allMenuItems.find((m) => m.name === item.name);
      if (found && found.isAvailable) {
        addItem(found, item.quantity);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-16 z-30 shadow-xs">
        <h1 className="font-extrabold text-base text-slate-900">
          Your Campus Orders
        </h1>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl mt-3">
          <button
            onClick={() => setTab('active')}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              tab === 'active'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            onClick={() => setTab('past')}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              tab === 'past'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Past Orders ({pastOrders.length})
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {tab === 'active' ? (
          activeOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-xs mt-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">No Active Orders</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                You don&apos;t have any meals in progress right now. Pre-order ahead so it&apos;s ready when break starts!
              </p>
              <Link
                href="/menu"
                className="mt-4 inline-flex items-center gap-1.5 bg-brand-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs"
              >
                <span>Browse Canteen Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            activeOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Token ID
                    </span>
                    <span className="text-base font-black text-slate-900">
                      #{order.orderNumber}
                    </span>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-medium text-slate-500">Pickup Counter:</span>
                    <span className="font-bold text-slate-900">{order.canteenCounter}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-medium text-slate-500">Slot / Prep:</span>
                    <span className="font-bold text-brand-600">{order.pickupSlot}</span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="text-xs text-slate-600 divide-y divide-slate-100">
                  {order.items.map((i, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between">
                      <span>{i.quantity}x {i.name}</span>
                      <span className="font-bold text-slate-900">₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total</span>
                    <span className="text-sm font-black text-slate-900">₹{order.total}</span>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition"
                  >
                    <span>View Live Tracker</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )
        ) : (
          pastOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-xs mt-4">
              <ReceiptText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No Past Orders Yet</h3>
              <p className="text-xs text-slate-400 mt-1">Completed orders will show up here.</p>
            </div>
          ) : (
            pastOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-slate-900">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <OrderStatusBadge status={order.status} size="sm" />
                </div>

                <div className="text-xs text-slate-600">
                  {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    ₹{order.total} • <span className="font-normal text-slate-500">{order.paymentMethod}</span>
                  </span>

                  <Link
                    href="/cart"
                    onClick={() => handleReorder(order)}
                    className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-order</span>
                  </Link>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
