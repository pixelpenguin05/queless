'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useMenu } from '@/context/MenuContext';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { OrderStatus, MenuItem, FoodCategory } from '@/lib/types';
import { CATEGORIES } from '@/lib/sampleData';
import { 
  ShieldAlert, 
  UtensilsCrossed, 
  Flame, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  RefreshCw,
  X,
  Sparkles
} from 'lucide-react';

export default function AdminKitchenPage() {
  const router = useRouter();
  const { user, quickLoginAsAdmin } = useAuth();
  const { orders, activeOrders, updateOrderStatus } = useOrders();
  const { 
    items, 
    toggleAvailability, 
    updateItemPrice, 
    addNewItem, 
    deleteItem,
    resetToSampleData 
  } = useMenu();

  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(60);
  const [newItemCat, setNewItemCat] = useState<FoodCategory>('snacks');
  const [newItemIsVeg, setNewItemIsVeg] = useState(true);
  const [newItemPrepTime, setNewItemPrepTime] = useState(10);
  const [newItemImage, setNewItemImage] = useState(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  );

  // Access Control Guard
  const isAuthorized = user?.role === 'admin';

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black">Restricted Access</h1>
        <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
          The Kitchen & Menu Management portal requires verified Canteen Staff privileges.
        </p>

        <div className="mt-6 space-y-3 w-full max-w-xs">
          <button
            onClick={() => quickLoginAsAdmin()}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-elevated transition"
          >
            Authenticate as Canteen Staff (Chef Vikram)
          </button>
          <Link
            href="/home"
            className="w-full bg-white/10 text-slate-300 font-bold text-xs py-3 rounded-xl block transition"
          >
            Return to Student Home
          </Link>
        </div>
      </div>
    );
  }

  // Kitchen Stats Calculation
  const todayRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter((o) => o.status === filterStatus);

  const handleCreateNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    await addNewItem({
      name: newItemName,
      description: newItemDesc,
      price: Number(newItemPrice),
      category: newItemCat,
      image: newItemImage,
      isVeg: newItemIsVeg,
      isAvailable: true,
      preparationTimeMin: Number(newItemPrepTime),
      popular: false,
      rating: 4.8,
    });

    setIsAddModalOpen(false);
    setNewItemName('');
    setNewItemDesc('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24">
      {/* Admin Top Bar */}
      <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link href="/home" className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-white">Kitchen Console</span>
              <span className="bg-brand-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                Staff Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400">CU Central Canteen • Block B-3</p>
          </div>
        </div>

        <Link
          href="/home"
          className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1.5 rounded-lg"
        >
          Student View
        </Link>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3">
        <div className="grid grid-cols-2 gap-1 bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'orders'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Kitchen Queue ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'menu'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Menu Management ({items.length})
          </button>
        </div>
      </div>

      {/* Kitchen Statistics Bar */}
      <div className="px-4 pt-4 grid grid-cols-4 gap-2">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-2.5 text-center">
          <span className="text-[10px] font-bold text-amber-400 block">Pending</span>
          <span className="text-lg font-black text-white">{pendingCount}</span>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-2.5 text-center">
          <span className="text-[10px] font-bold text-orange-400 block">Cooking</span>
          <span className="text-lg font-black text-white">{preparingCount}</span>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-2.5 text-center">
          <span className="text-[10px] font-bold text-emerald-400 block">Ready</span>
          <span className="text-lg font-black text-white">{readyCount}</span>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-2.5 text-center">
          <span className="text-[10px] font-bold text-slate-400 block">Revenue</span>
          <span className="text-xs font-black text-brand-400 mt-1 block">₹{todayRevenue}</span>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="p-4 space-y-4">
          {/* Order Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['all', 'pending', 'accepted', 'preparing', 'ready', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition ${
                  filterStatus === st
                    ? 'bg-white text-slate-900'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-slate-800/50 rounded-3xl p-8 text-center border border-slate-800">
                <p className="text-xs text-slate-400">No orders under this status.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-800/90 border border-slate-700 rounded-3xl p-4 space-y-3 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400">
                          {order.studentName} ({order.studentRollNo})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Slot: <strong className="text-amber-400">{order.pickupSlot}</strong> • {order.paymentMethod}
                      </span>
                    </div>

                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>

                  {/* Order Items */}
                  <div className="bg-slate-900/70 rounded-2xl p-3 divide-y divide-slate-800 text-xs">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="py-1.5 flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-200">{i.quantity}x {i.name}</span>
                          {i.customNote && (
                            <p className="text-[10px] text-amber-300">&quot;{i.customNote}&quot;</p>
                          )}
                        </div>
                        <span className="font-semibold text-slate-300">₹{i.price * i.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between font-black text-brand-400">
                      <span>Total:</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>

                  {/* Canteen Staff Action Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'accepted')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-xs"
                      >
                        Accept Order
                      </button>
                    )}

                    {order.status === 'accepted' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Start Cooking</span>
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Ready for Pickup</span>
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-xs"
                      >
                        Handed Over to Student
                      </button>
                    )}

                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Menu Management Tab */
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>

            <button
              onClick={resetToSampleData}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Menu</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-700 overflow-hidden relative flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">{item.name}</h3>
                    <p className="text-[11px] text-slate-400">
                      ₹{item.price} • {item.isVeg ? '🌱 Veg' : '🍗 Non-Veg'} • {item.preparationTimeMin}m
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Toggle Out of Stock */}
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                      item.isAvailable
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                    title={item.isAvailable ? 'Click to mark Sold Out' : 'Click to mark Available'}
                  >
                    {item.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{item.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                  </button>

                  {/* Delete Item */}
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-extrabold text-sm text-white">Add New Canteen Dish</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Masala Maggi Special"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Description</label>
                <input
                  type="text"
                  required
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="e.g. 2-minute noodles with butter and cheese"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Prep Time (min)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newItemPrepTime}
                    onChange={(e) => setNewItemPrepTime(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Category</label>
                <select
                  value={newItemCat}
                  onChange={(e) => setNewItemCat(e.target.value as FoodCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vegCheck"
                  checked={newItemIsVeg}
                  onChange={(e) => setNewItemIsVeg(e.target.checked)}
                  className="rounded text-brand-500"
                />
                <label htmlFor="vegCheck" className="text-white font-medium">
                  Is Vegetarian (Pure Veg)
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold py-3 rounded-2xl shadow-elevated mt-4 transition"
              >
                Add Dish to Menu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
