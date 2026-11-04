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
    <div className="min-h-screen bg-[#FAF7F2] pb-28">
      
      {/* Header */}
      <div className="bg-white border-b border-[#EAE5DC] py-4 sticky top-16 sm:top-18 md:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#1A3D4F]">
              Your Campus Orders
            </h1>
            <p className="text-xs font-sans text-[#5F6B6F]">
              Live token updates and past receipts from campus canteens
            </p>
          </div>

          {/* Tab switch */}
          <div className="flex bg-[#F5EFE6] p-1 rounded-2xl border border-[#EAE5DC] max-w-xs">
            <button
              onClick={() => setTab('active')}
              className={`flex-1 py-2 px-4 text-xs font-bold font-sans rounded-xl transition ${
                tab === 'active'
                  ? 'bg-white text-[#1A3D4F] shadow-xs'
                  : 'text-[#5F6B6F] hover:text-[#1A3D4F]'
              }`}
            >
              Active ({activeOrders.length})
            </button>
            <button
              onClick={() => setTab('past')}
              className={`flex-1 py-2 px-4 text-xs font-bold font-sans rounded-xl transition ${
                tab === 'past'
                  ? 'bg-white text-[#1A3D4F] shadow-xs'
                  : 'text-[#5F6B6F] hover:text-[#1A3D4F]'
              }`}
            >
              Past ({pastOrders.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'active' ? (
          activeOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE5DC] shadow-soft max-w-md mx-auto my-6">
              <div className="w-16 h-16 rounded-2xl bg-[#FBF1D4] text-[#DBA81F] flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#1A3D4F]">No Active Orders</h3>
              <p className="text-xs font-sans text-[#5F6B6F] mt-1.5 max-w-xs mx-auto leading-relaxed">
                You don&apos;t have any meals in progress right now. Pre-order ahead so it&apos;s hot and ready when break starts!
              </p>
              <Link
                href="/menu"
                className="mt-5 inline-flex items-center gap-2 bg-[#E23744] hover:bg-[#CB202D] text-white text-xs font-bold font-sans px-5 py-3 rounded-xl shadow-md transition"
              >
                <span>Browse Canteen Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 border border-[#EAE5DC] shadow-soft hover:shadow-elevated transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="eyebrow text-[#8A7F70] block">
                        Pickup Token
                      </span>
                      <span className="font-heading font-bold text-xl text-[#1A3D4F]">
                        #{order.orderNumber}
                      </span>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="bg-[#FAF7F2] rounded-2xl p-3.5 space-y-2 text-xs font-sans border border-[#EAE5DC]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#5F6B6F]">Pickup Counter:</span>
                      <span className="font-bold text-[#1A3D4F]">{order.canteenCounter}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#5F6B6F]">Slot / Schedule:</span>
                      <span className="font-bold text-[#E23744]">{order.pickupSlot}</span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="text-xs font-sans text-[#5F6B6F] divide-y divide-[#EAE5DC]">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="py-2 flex justify-between">
                        <span className="font-medium text-[#1A3D4F]">{i.quantity}x {i.name}</span>
                        <span className="font-bold text-[#1A3D4F]">₹{i.price * i.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8A7F70] block font-sans">Total</span>
                      <span className="font-heading font-bold text-lg text-[#1A3D4F]">₹{order.total}</span>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="bg-[#E23744] hover:bg-[#CB202D] text-white text-xs font-bold font-sans px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition"
                    >
                      <span>Live Tracker</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          pastOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE5DC] shadow-soft max-w-md mx-auto my-6">
              <ReceiptText className="w-12 h-12 text-[#8A7F70] mx-auto mb-3" />
              <h3 className="font-heading font-bold text-xl text-[#1A3D4F]">No Past Orders Yet</h3>
              <p className="text-xs font-sans text-[#5F6B6F] mt-1">Completed orders will be archived here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pastOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 border border-[#EAE5DC] shadow-soft space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-heading font-bold text-base text-[#1A3D4F]">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs font-sans text-[#8A7F70] block mt-0.5">
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

                  <div className="text-xs font-sans text-[#5F6B6F] line-clamp-1">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>

                  <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between">
                    <span className="text-sm font-heading font-bold text-[#1A3D4F]">
                      ₹{order.total} • <span className="font-sans font-normal text-xs text-[#5F6B6F]">{order.paymentMethod}</span>
                    </span>

                    <Link
                      href="/cart"
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-1.5 text-xs font-bold font-sans text-[#E23744] hover:bg-[#FFE4E6] bg-[#FFF5F5] px-3.5 py-2 rounded-xl transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-order</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

    </div>
  );
}