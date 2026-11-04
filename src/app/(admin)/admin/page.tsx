'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useMenu } from '@/context/MenuContext';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { MenuItem, FoodCategory, Restaurant, Order } from '@/lib/types';
import { CATEGORIES } from '@/lib/sampleData';
import { sounds } from '@/lib/sound';
import { 
  UtensilsCrossed, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  RefreshCw,
  X,
  Edit3,
  Search,
  ChefHat,
  ShoppingBag,
  Leaf,
  BarChart3,
  CheckCircle,
  Store,
  ShieldCheck,
  Phone,
  Banknote,
  Send,
  AlertCircle
} from 'lucide-react';

const PRESET_DISH_IMAGES = [
  { name: 'Special Thali', category: 'meals', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', emoji: '🍱' },
  { name: 'Crispy Dosa', category: 'south-indian', url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80', emoji: '🥞' },
  { name: 'Burger & Fries', category: 'snacks', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', emoji: '🍔' },
  { name: 'Pizza Slice', category: 'snacks', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', emoji: '🍕' },
  { name: 'Hot Samosa', category: 'snacks', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', emoji: '🥟' },
  { name: 'Chinese Noodles', category: 'chinese', url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80', emoji: '🍜' },
  { name: 'Biryani Rice', category: 'meals', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', emoji: '🍚' },
  { name: 'Cold Coffee', category: 'beverages', url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', emoji: '🥤' },
  { name: 'Grilled Sandwich', category: 'snacks', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', emoji: '🥪' },
  { name: 'Bakery Pastry', category: 'bakery', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', emoji: '🍰' },
  { name: 'Mojito Cooler', category: 'beverages', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', emoji: '🍹' },
  { name: 'Masala Chai', category: 'beverages', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', emoji: '☕' },
];

export default function AdminKitchenPage() {
  const router = useRouter();
  const { user, loginAsOwner, loginAsAdmin, quickLoginAsAdmin } = useAuth();
  const { orders, activeOrders, updateOrderStatus, refreshOrders } = useOrders();
  const { 
    items, 
    toggleAvailability, 
    updateItem, 
    addNewItem, 
    deleteItem,
    resetToSampleData,
    refreshMenu
  } = useMenu();

  const [portalMode, setPortalMode] = useState<'canteen_owner' | 'super_admin'>('canteen_owner');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'approvals' | 'analytics'>('orders');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Registered Restaurants state from server
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isRegisterRestModalOpen, setIsRegisterRestModalOpen] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestOwner, setNewRestOwner] = useState('');
  const [newRestPhone, setNewRestPhone] = useState('');
  const [newRestCounter, setNewRestCounter] = useState('');
  const [newRestDesc, setNewRestDesc] = useState('');

  // Menu tab filtering
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCatFilter, setMenuCatFilter] = useState<FoodCategory>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'sold_out'>('all');

  // Add Item Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(60);
  const [newItemCat, setNewItemCat] = useState<FoodCategory>('snacks');
  const [newItemIsVeg, setNewItemIsVeg] = useState(true);
  const [newItemPopular, setNewItemPopular] = useState(false);
  const [newItemPrepTime, setNewItemPrepTime] = useState(10);
  const [newItemImage, setNewItemImage] = useState(PRESET_DISH_IMAGES[0].url);

  // Edit Item Modal state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemDesc, setEditItemDesc] = useState('');
  const [editItemPrice, setEditItemPrice] = useState(60);
  const [editItemCat, setEditItemCat] = useState<FoodCategory>('snacks');
  const [editItemIsVeg, setEditItemIsVeg] = useState(true);
  const [editItemPopular, setEditItemPopular] = useState(false);
  const [editItemPrepTime, setEditItemPrepTime] = useState(10);
  const [editItemImage, setEditItemImage] = useState('');

  // Notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      const res = await fetch('/api/restaurants?all=true');
      const data = await res.json();
      if (data.success) {
        setRestaurants(data.restaurants);
      }
    } catch {}
  };

  useEffect(() => {
    fetchRestaurants();
    const interval = setInterval(() => {
      fetchRestaurants();
      refreshOrders();
    }, 2500);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  // Handle register new restaurant by an owner
  const handleRegisterRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim() || !newRestOwner.trim() || !newRestPhone.trim()) {
      showToast('Please fill all required canteen details.');
      return;
    }

    try {
      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRestName.trim(),
          ownerName: newRestOwner.trim(),
          ownerPhone: newRestPhone.trim(),
          counterLocation: newRestCounter.trim() || 'Food Court Counter 2',
          description: newRestDesc.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Restaurant registered! Status is pending Admin verification.');
        setIsRegisterRestModalOpen(false);
        setNewRestName('');
        setNewRestOwner('');
        setNewRestPhone('');
        setNewRestCounter('');
        setNewRestDesc('');
        fetchRestaurants();
      }
    } catch {
      showToast('Error registering restaurant.');
    }
  };

  // Admin Approve or Reject Restaurant
  const handleUpdateRestaurantStatus = async (restaurantId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/restaurants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, status }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Canteen ${status === 'approved' ? 'APPROVED & VERIFIED' : 'REJECTED'}`);
        fetchRestaurants();
      }
    } catch {
      showToast('Failed to update status.');
    }
  };

  // Stats calculation
  const todayRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const inStockCount = items.filter((i) => i.isAvailable).length;
  const soldOutCount = items.filter((i) => !i.isAvailable).length;

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter((o) => o.status === filterStatus);

  const managedItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCat = menuCatFilter === 'all' || item.category === menuCatFilter;
    const matchesStock = 
      stockFilter === 'all' ? true :
      stockFilter === 'in_stock' ? item.isAvailable :
      !item.isAvailable;
    return matchesSearch && matchesCat && matchesStock;
  });

  const handleCreateNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    await addNewItem({
      name: newItemName.trim(),
      description: newItemDesc.trim() || 'Freshly prepared at Food Republic C1 kitchen',
      price: Math.max(1, Number(newItemPrice)),
      category: newItemCat,
      image: newItemImage || PRESET_DISH_IMAGES[0].url,
      isVeg: newItemIsVeg,
      isAvailable: true,
      preparationTimeMin: Math.max(1, Number(newItemPrepTime)),
      popular: newItemPopular,
      rating: 4.8,
    });

    setIsAddModalOpen(false);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice(60);
    setNewItemPrepTime(10);
    setNewItemPopular(false);
    showToast(`"${newItemName}" registered successfully!`);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setEditItemName(item.name);
    setEditItemDesc(item.description);
    setEditItemPrice(item.price);
    setEditItemCat(item.category);
    setEditItemIsVeg(item.isVeg);
    setEditItemPopular(Boolean(item.popular));
    setEditItemPrepTime(item.preparationTimeMin);
    setEditItemImage(item.image);
  };

  const handleSaveEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editItemName.trim()) return;

    await updateItem(editingItem.id, {
      name: editItemName.trim(),
      description: editItemDesc.trim(),
      price: Math.max(1, Number(editItemPrice)),
      category: editItemCat,
      image: editItemImage,
      isVeg: editItemIsVeg,
      popular: editItemPopular,
      preparationTimeMin: Math.max(1, Number(editItemPrepTime)),
    });

    setEditingItem(null);
    showToast(`Updated "${editItemName}" successfully!`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A3D4F] pb-32">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0F5B4C] text-white text-xs font-sans font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Dashboard Bar */}
      <div className="bg-white border-b border-[#EAE5DC] py-4 sticky top-16 sm:top-18 md:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/home" className="p-2 rounded-xl hover:bg-[#FAF7F2] text-[#1A3D4F] border border-[#EAE5DC] transition">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A3D4F] leading-tight">
                  {portalMode === 'canteen_owner' ? 'Canteen Kitchen Hub' : 'Super Admin Portal'}
                </h1>
                <span className="bg-[#E7F5EE] border border-[#0F5B4C]/20 text-[#0F5B4C] text-[10px] font-bold font-sans px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {portalMode === 'canteen_owner' ? 'Food Republic C1' : 'Campus Admin'}
                </span>
              </div>
              <p className="text-xs font-sans text-[#5F6B6F] mt-0.5">
                {portalMode === 'canteen_owner' 
                  ? 'Real-time kitchen orders, prep tracking & menu management'
                  : 'Manage & verify restaurant registrations across Chandigarh University'}
              </p>
            </div>
          </div>

          {/* Quick Dual Switcher: Canteen Owner <-> Super Admin */}
          <div className="flex items-center gap-2 font-sans self-start sm:self-auto">
            <div className="flex bg-[#F5EFE6] p-1 rounded-2xl border border-[#EAE5DC]">
              <button
                onClick={() => setPortalMode('canteen_owner')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  portalMode === 'canteen_owner'
                    ? 'bg-white text-[#1A3D4F] shadow-xs'
                    : 'text-[#5F6B6F] hover:text-[#1A3D4F]'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5 text-[#E23744]" />
                <span>Canteen Owner</span>
              </button>
              <button
                onClick={() => setPortalMode('super_admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  portalMode === 'super_admin'
                    ? 'bg-[#1A3D4F] text-white shadow-xs'
                    : 'text-[#5F6B6F] hover:text-[#1A3D4F]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8B92C]" />
                <span>Super Admin</span>
              </button>
            </div>

            <Link
              href="/home"
              className="text-xs font-sans font-bold text-white bg-[#E23744] hover:bg-[#CB202D] px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Student View</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI Stats Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white border border-[#EAE5DC] rounded-3xl p-5 shadow-soft">
            <span className="eyebrow text-[#8A7F70] block">Active Orders</span>
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#E23744] mt-1 block">
              {activeOrders.length}
            </span>
            <span className="text-[11px] font-sans text-[#5F6B6F] mt-1 block">
              {pendingCount} Pending • {preparingCount} Cooking
            </span>
          </div>

          <div className="bg-white border border-[#EAE5DC] rounded-3xl p-5 shadow-soft">
            <span className="eyebrow text-[#8A7F70] block">Ready for Pickup</span>
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0F5B4C] mt-1 block">
              {readyCount}
            </span>
            <span className="text-[11px] font-sans text-[#5F6B6F] mt-1 block">
              Hot meals awaiting student collection
            </span>
          </div>

          <div className="bg-white border border-[#EAE5DC] rounded-3xl p-5 shadow-soft">
            <span className="eyebrow text-[#8A7F70] block">Registered Canteens</span>
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#1A3D4F] mt-1 block">
              {restaurants.length}
            </span>
            <span className="text-[11px] font-sans text-[#5F6B6F] mt-1 block">
              {restaurants.filter((r) => r.status === 'pending').length} pending admin verification
            </span>
          </div>

          <div className="bg-white border border-[#EAE5DC] rounded-3xl p-5 shadow-soft">
            <span className="eyebrow text-[#8A7F70] block">Today&apos;s Revenue</span>
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#1A3D4F] mt-1 block">
              ₹{todayRevenue}
            </span>
            <span className="text-[11px] font-sans text-[#0F5B4C] mt-1 block">
              COD & UPI Settled
            </span>
          </div>
        </div>

        {/* Action Button Row: Register Canteen / New Dish */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#EAE5DC] shadow-soft">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition flex items-center gap-2 ${
                activeTab === 'orders' ? 'bg-[#1A3D4F] text-white shadow-xs' : 'bg-[#FAF7F2] text-[#5F6B6F]'
              }`}
            >
              <Flame className="w-4 h-4 text-[#E23744]" />
              <span>Live Kitchen Orders ({activeOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition flex items-center gap-2 ${
                activeTab === 'menu' ? 'bg-[#1A3D4F] text-white shadow-xs' : 'bg-[#FAF7F2] text-[#5F6B6F]'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 text-[#E8B92C]" />
              <span>Food Items ({items.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition flex items-center gap-2 ${
                activeTab === 'approvals' ? 'bg-[#1A3D4F] text-white shadow-xs' : 'bg-[#FAF7F2] text-[#5F6B6F]'
              }`}
            >
              <Store className="w-4 h-4 text-[#0F5B4C]" />
              <span>Canteen Verifications ({restaurants.filter(r => r.status === 'pending').length} New)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRegisterRestModalOpen(true)}
              className="bg-[#1A3D4F] hover:bg-[#2E5A66] text-white text-xs font-bold font-sans px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Register New Canteen</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#E23744] hover:bg-[#CB202D] text-white text-xs font-bold font-sans px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Food Dish</span>
            </button>
          </div>
        </div>

        {/* TAB 1: LIVE KITCHEN ORDERS (Requirement 4, 5, 6) */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Status Filter Chips */}
            <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                {(['all', 'pending', 'accepted', 'preparing', 'ready', 'completed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-sans capitalize whitespace-nowrap transition ${
                      filterStatus === st
                        ? 'bg-[#1A3D4F] text-white shadow-xs'
                        : 'bg-white text-[#5F6B6F] hover:text-[#1A3D4F] border border-[#EAE5DC]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="text-xs font-sans font-bold text-[#0F5B4C] bg-[#E7F5EE] px-3 py-1.5 rounded-xl border border-[#0F5B4C]/20 whitespace-nowrap">
                ⚡ 2-Phone Real-Time Sync Active
              </div>
            </div>

            {/* Orders Responsive 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOrders.length === 0 ? (
                <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-[#EAE5DC] shadow-soft">
                  <div className="text-4xl mb-2">📋</div>
                  <h3 className="font-heading font-bold text-lg text-[#1A3D4F]">No Orders Placed Yet</h3>
                  <p className="text-xs font-sans text-[#5F6B6F] mt-1 max-w-sm mx-auto">
                    When students order from their phone, orders will appear here in real time with customer name, phone number, token, and sound alert.
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-[#EAE5DC] rounded-3xl p-5 space-y-4 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Order Header: Token, Customer Name & Phone */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-black text-2xl text-[#1A3D4F]">
                              #{order.orderNumber}
                            </span>
                            <span className="bg-[#FFE4E6] text-[#E23744] text-xs font-black font-sans px-2.5 py-0.5 rounded-lg border border-[#E23744]/20">
                              CODE: {order.pickupCode || order.orderNumber.replace('QL-', '')}
                            </span>
                          </div>
                          
                          {/* Person Name & Phone Number (Requirement 4) */}
                          <div className="mt-1 font-sans text-xs space-y-0.5">
                            <div className="font-bold text-[#1A3D4F]">
                              Customer: {order.studentName}
                            </div>
                            <div className="text-[#5F6B6F] flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#0F5B4C]" />
                              <span>Phone: <strong className="text-[#1A3D4F]">{order.studentPhone}</strong></span>
                            </div>
                            <div className="text-[#8A7F70]">
                              Slot: <span className="font-semibold text-[#E23744]">{order.pickupSlot}</span> • Mode: <strong className="text-[#0F5B4C]">{order.paymentMethod}</strong>
                            </div>
                          </div>
                        </div>

                        <OrderStatusBadge status={order.status} size="sm" />
                      </div>

                      {/* Items Ordered */}
                      <div className="bg-[#FAF7F2] rounded-2xl p-4 divide-y divide-[#EAE5DC] text-xs font-sans border border-[#EAE5DC] mt-4">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="py-2 flex justify-between items-start">
                            <div>
                              <span className="font-bold text-[#1A3D4F]">{i.quantity}x {i.name}</span>
                              {i.customNote && (
                                <p className="text-[10px] text-[#DBA81F] font-semibold">&quot;{i.customNote}&quot;</p>
                              )}
                            </div>
                            <span className="font-bold text-[#1A3D4F]">₹{i.price * i.quantity}</span>
                          </div>
                        ))}
                        <div className="pt-2.5 flex justify-between items-center font-heading font-bold text-base text-[#1A3D4F]">
                          <span className="flex items-center gap-1 font-sans text-xs font-bold text-[#0F5B4C]">
                            <Banknote className="w-4 h-4" />
                            <span>{order.paymentMethod}</span>
                          </span>
                          <span className="text-xl text-[#E23744]">₹{order.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Step Handover Action Controls (Requirement 5 & 6) */}
                    <div className="pt-2 border-t border-[#EAE5DC] font-sans">
                      {order.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              await updateOrderStatus(order.id, 'accepted');
                              showToast(`Order #${order.orderNumber} accepted!`);
                            }}
                            className="flex-1 bg-[#2E5A66] hover:bg-[#1A3D4F] text-white font-extrabold text-xs py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>1. Accept Order</span>
                          </button>
                          <button
                            onClick={async () => {
                              await updateOrderStatus(order.id, 'preparing');
                              showToast(`Started cooking #${order.orderNumber}`);
                            }}
                            className="flex-1 bg-[#E23744] hover:bg-[#CB202D] text-white font-extrabold text-xs py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <Flame className="w-4 h-4" />
                            <span>Accept & Cook Now</span>
                          </button>
                        </div>
                      )}

                      {order.status === 'accepted' && (
                        <button
                          onClick={async () => {
                            await updateOrderStatus(order.id, 'preparing');
                            showToast(`Kitchen started cooking order #${order.orderNumber}! Student phone alerted.`);
                          }}
                          className="w-full bg-[#E8B92C] hover:bg-[#DBA81F] text-[#1A3D4F] font-extrabold text-xs py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                        >
                          <Flame className="w-4 h-4 fill-[#1A3D4F]" />
                          <span>2. Start Preparing Food (Send &quot;Preparing&quot; Alert to Student)</span>
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={async () => {
                            await updateOrderStatus(order.id, 'ready');
                            showToast(`Sent "Food Ready" notification to student for #${order.orderNumber}!`);
                          }}
                          className="w-full bg-[#0F5B4C] hover:bg-[#0B4438] text-white font-extrabold text-xs py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 animate-pulse"
                        >
                          <Send className="w-4 h-4" />
                          <span>3. Food Done! Send &quot;Ready for Pickup&quot; Notification</span>
                        </button>
                      )}

                      {order.status === 'ready' && (
                        <div className="space-y-2">
                          <div className="bg-[#E7F5EE] p-2.5 rounded-xl border border-[#0F5B4C]/30 text-center text-xs font-bold text-[#0F5B4C]">
                            🔔 Notification sent to student! Awaiting pickup at Counter 2
                          </div>
                          <button
                            onClick={async () => {
                              await updateOrderStatus(order.id, 'completed');
                              showToast(`Order #${order.orderNumber} delivered & handed over to student! Cash collected.`);
                            }}
                            className="w-full bg-[#1A3D4F] hover:bg-black text-white font-extrabold text-xs py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#E8B92C]" />
                            <span>4. Hand Over Food to Student & Collect ₹{order.total} (Delivered)</span>
                          </button>
                        </div>
                      )}

                      {order.status === 'completed' && (
                        <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EAE5DC] text-center text-xs font-semibold text-[#0F5B4C] flex items-center justify-center gap-1.5">
                          <CheckCircle className="w-4 h-4" />
                          <span>Delivered & Paid via {order.paymentMethod}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MENU FOOD ITEMS */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-[#EAE5DC] shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8A7F70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search dishes..."
                    className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#1A3D4F] placeholder-[#8A7F70] focus:outline-none focus:ring-2 focus:ring-[#E8B92C] font-sans"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#E23744] hover:bg-[#CB202D] text-white text-xs font-bold font-sans py-2.5 px-5 rounded-2xl flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Register New Dish</span>
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-[#EAE5DC]">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setMenuCatFilter(cat.id as FoodCategory)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans whitespace-nowrap transition flex items-center gap-1.5 ${
                      menuCatFilter === cat.id
                        ? 'bg-[#1A3D4F] text-white shadow-xs'
                        : 'bg-[#FAF7F2] text-[#5F6B6F] hover:text-[#1A3D4F] border border-[#EAE5DC]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dishes Grid */}
            {managedItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE5DC] shadow-soft">
                <div className="text-4xl mb-2">🍳</div>
                <h3 className="font-heading font-bold text-lg text-[#1A3D4F]">No Food Items Added Yet</h3>
                <p className="text-xs font-sans text-[#5F6B6F] mt-1 max-w-sm mx-auto">
                  Your canteen menu is currently empty. Click &quot;Add Food Dish&quot; above to list your dishes and prices.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 bg-[#E23744] hover:bg-[#CB202D] text-white text-xs font-bold font-sans py-2.5 px-4 rounded-xl shadow-xs transition"
                >
                  + Add Food Dish
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {managedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#EAE5DC] rounded-3xl p-4 space-y-4 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-20 h-20 rounded-2xl bg-[#F5EFE6] overflow-hidden relative flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.image || PRESET_DISH_IMAGES[0].url} 
                          alt={item.name} 
                          className={`w-full h-full object-cover ${!item.isAvailable ? 'grayscale opacity-50' : ''}`} 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-heading font-bold text-base text-[#1A3D4F] truncate">{item.name}</h3>
                          {item.popular && (
                            <span className="bg-[#FBF1D4] text-[#8A6A0B] text-[10px] font-black px-1.5 py-0.2 rounded font-sans">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-sans text-[#5F6B6F] line-clamp-2 mt-1">{item.description}</p>
                        
                        <div className="flex items-center gap-2 mt-2 text-xs font-sans">
                          <span className="font-extrabold text-[#1A3D4F]">₹{item.price}</span>
                          <span className="text-[#8A7F70]">•</span>
                          <span className="text-[#5F6B6F] capitalize">{item.category}</span>
                          <span className="text-[#8A7F70]">•</span>
                          <span className="text-[#5F6B6F]">{item.preparationTimeMin}m prep</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#EAE5DC] gap-2 font-sans">
                      <button
                        onClick={async () => {
                          await toggleAvailability(item.id);
                          showToast(`Updated "${item.name}" availability`);
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                          item.isAvailable
                            ? 'bg-[#E7F5EE] text-[#0F5B4C] border border-[#0F5B4C]/20'
                            : 'bg-[#FFF5F5] text-[#CC191D] border border-[#CC191D]/20'
                        }`}
                      >
                        {item.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{item.isAvailable ? 'In Stock (Live)' : 'Sold Out'}</span>
                      </button>

                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 bg-[#FAF7F2] hover:bg-[#EAE5DC] text-[#1A3D4F] border border-[#EAE5DC] rounded-xl transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm(`Delete "${item.name}"?`)) {
                            await deleteItem(item.id);
                            showToast(`Deleted "${item.name}"`);
                          }
                        }}
                        className="p-2 bg-[#FAF7F2] hover:bg-[#FFF5F5] text-[#8A7F70] hover:text-[#CC191D] border border-[#EAE5DC] rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CANTEEN VERIFICATIONS & APPROVALS (Requirement 3) */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE5DC] shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-heading font-bold text-2xl text-[#1A3D4F]">
                    Canteen & Restaurant Registrations
                  </h2>
                  <p className="text-xs font-sans text-[#5F6B6F] mt-1">
                    Super Admin review panel: Accept or reject canteens before their menu goes live.
                  </p>
                </div>

                <button
                  onClick={() => setIsRegisterRestModalOpen(true)}
                  className="bg-[#E23744] hover:bg-[#CB202D] text-white text-xs font-bold font-sans py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Register Canteen</span>
                </button>
              </div>

              <div className="space-y-4 pt-2">
                {restaurants.length === 0 ? (
                  <div className="p-10 rounded-3xl border border-[#EAE5DC] bg-[#FAF7F2] text-center font-sans">
                    <div className="text-4xl mb-2">🏪</div>
                    <h3 className="font-heading font-bold text-lg text-[#1A3D4F]">No Canteens Registered Yet</h3>
                    <p className="text-xs text-[#5F6B6F] mt-1 max-w-sm mx-auto">
                      Click &quot;Register Canteen&quot; to add your canteen outlet. You will then be able to add food items and receive student orders.
                    </p>
                    <button
                      onClick={() => setIsRegisterRestModalOpen(true)}
                      className="mt-4 bg-[#1A3D4F] hover:bg-[#2E5A66] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition"
                    >
                      + Register First Canteen
                    </button>
                  </div>
                ) : (
                  restaurants.map((rest) => (
                    <div
                      key={rest.id}
                      className="p-5 rounded-3xl border border-[#EAE5DC] bg-[#FAF7F2] flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#F5EFE6] text-[#1A3D4F] flex items-center justify-center font-bold flex-shrink-0">
                          <Store className="w-7 h-7 text-[#E23744]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading font-bold text-lg text-[#1A3D4F]">{rest.name}</h3>
                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                              rest.status === 'approved'
                                ? 'bg-[#E7F5EE] text-[#0F5B4C] border border-[#0F5B4C]/20'
                                : rest.status === 'pending'
                                ? 'bg-[#FBF1D4] text-[#8A6A0B] border border-[#E8B92C]/40 animate-pulse'
                                : 'bg-[#FFF5F5] text-[#CC191D]'
                            }`}>
                              {rest.status === 'approved' ? '✓ Verified & Active' : rest.status === 'pending' ? '⏳ Pending Approval' : '✕ Rejected'}
                            </span>
                          </div>
                          <p className="text-xs text-[#5F6B6F] mt-1">
                            Owner: <strong>{rest.ownerName}</strong> • Phone: <strong>{rest.ownerPhone}</strong>
                          </p>
                          <p className="text-xs text-[#8A7F70] mt-0.5">
                            Location: {rest.counterLocation}
                          </p>
                        </div>
                      </div>

                      {/* Admin Action Buttons (Requirement 3) */}
                      <div className="flex items-center gap-2 self-start md:self-auto">
                        {rest.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateRestaurantStatus(rest.id, 'approved')}
                            className="bg-[#0F5B4C] hover:bg-[#0B4438] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve & Verify</span>
                          </button>
                        )}

                        {rest.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateRestaurantStatus(rest.id, 'rejected')}
                            className="bg-white hover:bg-[#FFF5F5] text-[#CC191D] border border-[#EAE5DC] text-xs font-bold py-2.5 px-3 rounded-xl transition"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* REGISTER NEW RESTAURANT MODAL (Requirement 2) */}
      {isRegisterRestModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A3D4F]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE5DC] w-full max-w-lg rounded-4xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC] sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-heading font-bold text-xl text-[#1A3D4F]">Register Canteen / Restaurant</h2>
                <p className="text-xs font-sans text-[#5F6B6F]">Will be submitted for Super Admin verification</p>
              </div>
              <button onClick={() => setIsRegisterRestModalOpen(false)} className="text-[#8A7F70] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterRestaurant} className="mt-5 space-y-4 text-xs font-sans">
              <div>
                <label className="eyebrow text-[#8A7F70] block mb-1">Canteen / Restaurant Name *</label>
                <input
                  type="text"
                  required
                  value={newRestName}
                  onChange={(e) => setNewRestName(e.target.value)}
                  placeholder="e.g. Nescafe Campus Corner"
                  className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                />
              </div>

              <div>
                <label className="eyebrow text-[#8A7F70] block mb-1">Owner / Lead Name *</label>
                <input
                  type="text"
                  required
                  value={newRestOwner}
                  onChange={(e) => setNewRestOwner(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                />
              </div>

              <div>
                <label className="eyebrow text-[#8A7F70] block mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newRestPhone}
                  onChange={(e) => setNewRestPhone(e.target.value)}
                  placeholder="e.g. 9811122334"
                  className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                />
              </div>

              <div>
                <label className="eyebrow text-[#8A7F70] block mb-1">Counter Location in Campus *</label>
                <input
                  type="text"
                  required
                  value={newRestCounter}
                  onChange={(e) => setNewRestCounter(e.target.value)}
                  placeholder="e.g. Food Republic C1 Ground Floor Counter 3"
                  className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                />
              </div>

              <div>
                <label className="eyebrow text-[#8A7F70] block mb-1">Description / Speciality</label>
                <input
                  type="text"
                  value={newRestDesc}
                  onChange={(e) => setNewRestDesc(e.target.value)}
                  placeholder="e.g. Cold coffee, sandwiches, and bakery fresh rolls"
                  className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E23744] hover:bg-[#CB202D] text-white font-sans font-extrabold py-3.5 rounded-2xl shadow-elevated transition active:scale-98 text-sm"
              >
                Submit Canteen for Admin Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER NEW DISH MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A3D4F]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE5DC] w-full max-w-lg rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC] sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-heading font-bold text-xl text-[#1A3D4F]">Register Food Dish</h2>
                <p className="text-xs font-sans text-[#5F6B6F]">Dishes will immediately be orderable by students</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#8A7F70] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="mt-5 space-y-4 text-xs font-sans">
              <div>
                <label className="eyebrow text-[#8A7F70] block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Butter Paneer Thali"
                  className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                />
              </div>

              <div>
                <label className="eyebrow text-[#8A7F70] block mb-1">Description</label>
                <input
                  type="text"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="e.g. Served hot with butter naan and salad"
                  className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow text-[#8A7F70] block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                  />
                </div>
                <div>
                  <label className="eyebrow text-[#8A7F70] block mb-1">Prep Time (min) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newItemPrepTime}
                    onChange={(e) => setNewItemPrepTime(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow text-[#8A7F70] block mb-1">Category *</label>
                <select
                  value={newItemCat}
                  onChange={(e) => setNewItemCat(e.target.value as FoodCategory)}
                  className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="eyebrow text-[#8A7F70] block mb-1.5">Select Preset Photo</label>
                <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto no-scrollbar p-1.5 bg-[#FAF7F2] rounded-2xl border border-[#EAE5DC]">
                  {PRESET_DISH_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setNewItemImage(preset.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                        newItemImage === preset.url ? 'border-[#E23744] scale-95 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 text-xs">{preset.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE5DC] space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItemIsVeg}
                    onChange={(e) => setNewItemIsVeg(e.target.checked)}
                    className="rounded text-[#0F5B4C] w-4 h-4"
                  />
                  <span className="text-[#1A3D4F] font-bold">🌱 Pure Vegetarian Dish</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E23744] hover:bg-[#CB202D] text-white font-sans font-extrabold py-3.5 rounded-2xl shadow-elevated text-sm"
              >
                Register Dish to Canteen Menu
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DISH MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-[#1A3D4F]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE5DC] w-full max-w-lg rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC] sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-heading font-bold text-xl text-[#1A3D4F]">Edit Dish Details</h2>
                <p className="text-xs font-sans text-[#5F6B6F]">Updates live menu instantly</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="text-[#8A7F70] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditItem} className="mt-5 space-y-4 text-xs font-sans">
              <div>
                <label className="eyebrow text-[#8A7F70] block mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={editItemName}
                  onChange={(e) => setEditItemName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow text-[#8A7F70] block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editItemPrice}
                    onChange={(e) => setEditItemPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F]"
                  />
                </div>
                <div>
                  <label className="eyebrow text-[#8A7F70] block mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editItemPrepTime}
                    onChange={(e) => setEditItemPrepTime(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-3 text-[#1A3D4F]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E23744] hover:bg-[#CB202D] text-white font-sans font-extrabold py-3.5 rounded-2xl shadow-elevated text-sm"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
