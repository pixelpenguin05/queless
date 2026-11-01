'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useMenu } from '@/context/MenuContext';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { MenuItem, FoodCategory } from '@/lib/types';
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
  Sparkles,
  Edit3,
  Search,
  ChefHat,
  ShoppingBag,
  Leaf,
  BarChart3,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

// Curated high quality presets for quick photo selection
const PRESET_DISH_IMAGES = [
  {
    name: 'Special Thali / Full Meal',
    category: 'meals',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    emoji: '🍱',
  },
  {
    name: 'Crispy Dosa & Chutney',
    category: 'south-indian',
    url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    emoji: '🥞',
  },
  {
    name: 'Burger & French Fries',
    category: 'snacks',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    emoji: '🍔',
  },
  {
    name: 'Cheesy Pizza Slice',
    category: 'snacks',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    emoji: '🍕',
  },
  {
    name: 'Hot Samosa & Chutney',
    category: 'snacks',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    emoji: '🥟',
  },
  {
    name: 'Chinese Noodles / Chowmein',
    category: 'chinese',
    url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    emoji: '🍜',
  },
  {
    name: 'Royal Biryani / Fried Rice',
    category: 'meals',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    emoji: '🍚',
  },
  {
    name: 'Cold Coffee & Frappe',
    category: 'beverages',
    url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    emoji: '🥤',
  },
  {
    name: 'Grilled Sandwich',
    category: 'snacks',
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    emoji: '🥪',
  },
  {
    name: 'Fresh Bakery Pastry',
    category: 'bakery',
    url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    emoji: '🍰',
  },
  {
    name: 'Lemon Mint Mojito Cooler',
    category: 'beverages',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    emoji: '🍹',
  },
  {
    name: 'Masala Chai & Hot Tea',
    category: 'beverages',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    emoji: '☕',
  },
];

export default function AdminKitchenPage() {
  const router = useRouter();
  const { user, quickLoginAsAdmin, updateUserName } = useAuth();
  const { orders, activeOrders, updateOrderStatus } = useOrders();
  const { 
    items, 
    toggleAvailability, 
    updateItem, 
    addNewItem, 
    deleteItem,
    resetToSampleData 
  } = useMenu();

  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'analytics'>('menu');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Owner Name Customization Modal
  const [isEditOwnerModalOpen, setIsEditOwnerModalOpen] = useState(false);
  const [ownerNameInput, setOwnerNameInput] = useState(user?.name || '');

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
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Access Control Guard with friendly one-click switch
  const isAuthorized = user?.role === 'admin';

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 mb-4 shadow-lg shadow-brand-500/10">
          <ChefHat className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black tracking-tight">Food Republic C1 Restaurant Portal</h1>
        <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
          Manage your canteen dishes, register new food items, update prices, set stock availability, and manage live student kitchen orders.
        </p>

        <div className="mt-6 space-y-3 w-full max-w-xs">
          <Link
            href="/register?role=owner"
            className="w-full bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-elevated transition active:scale-98 flex items-center justify-center gap-2"
          >
            <ChefHat className="w-4 h-4" />
            <span>Register by Your Owner Name</span>
          </Link>

          <button
            onClick={() => {
              quickLoginAsAdmin();
              showToast('Logged in as Food Republic C1 Restaurant Lead');
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-2xl border border-slate-700 block transition"
          >
            Fast Demo Login (Chef Vikram)
          </button>
          
          <Link
            href="/home"
            className="w-full bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs py-2.5 rounded-2xl block transition"
          >
            Return to Student View
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
  const inStockCount = items.filter((i) => i.isAvailable).length;
  const soldOutCount = items.filter((i) => !i.isAvailable).length;

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter((o) => o.status === filterStatus);

  // Filter menu items for management
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

  // Handle register new item
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
    showToast(`"${newItemName}" registered successfully! It is now live on the student menu.`);
  };

  // Open Edit Modal
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

  // Handle Save Edit
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link href="/home" className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-white">
                {user?.campusBlock || 'Food Republic C1'}
              </span>
              <span className="bg-brand-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                Owner Panel
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <span>Owner: <strong className="text-white">{user?.name || 'Restaurant Owner'}</strong></span>
              <button
                onClick={() => {
                  setOwnerNameInput(user?.name || '');
                  setIsEditOwnerModalOpen(true);
                }}
                className="text-brand-400 hover:text-brand-300 ml-1 underline text-[9px] font-semibold"
                title="Change Owner Name"
              >
                (Edit Name)
              </button>
            </div>
          </div>
        </div>

        {/* Switch to Student View */}
        <Link
          href="/home"
          className="text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-95"
          title="See how students view and buy from the canteen"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Student View</span>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 pt-3">
        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'menu'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Menu ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Orders ({activeOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Sales</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MENU REGISTRATION & MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="p-4 space-y-4">
          {/* Quick Stock Summary Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] font-bold text-slate-400 block">Total Dishes</span>
              <span className="text-lg font-black text-white">{items.length}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] font-bold text-emerald-400 block">In Stock</span>
              <span className="text-lg font-black text-emerald-400">{inStockCount}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] font-bold text-rose-400 block">Sold Out</span>
              <span className="text-lg font-black text-rose-400">{soldOutCount}</span>
            </div>
          </div>

          {/* Action Row: Register New Dish Button & Reset */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white text-xs font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-98 transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Register New Dish</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset canteen menu to standard initial dishes?')) {
                  resetToSampleData();
                  showToast('Menu reset to initial dishes');
                }
              }}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white p-3 rounded-2xl transition"
              title="Reset Menu to defaults"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Search & Stock Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search registered dishes..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {menuSearch && (
                <button
                  onClick={() => setMenuSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setMenuCatFilter(cat.id as FoodCategory)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1 ${
                    menuCatFilter === cat.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Stock status filter */}
            <div className="flex items-center gap-1.5 pt-1">
              {(['all', 'in_stock', 'sold_out'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStockFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                    stockFilter === st
                      ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                      : 'bg-slate-900 text-slate-500 hover:text-slate-400 border border-slate-800'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
              <span className="text-[10px] text-slate-500 ml-auto font-medium">
                Showing {managedItems.length} dishes
              </span>
            </div>
          </div>

          {/* Dishes List */}
          <div className="space-y-3 pt-1">
            {managedItems.length === 0 ? (
              <div className="bg-slate-900/50 rounded-3xl p-8 text-center border border-slate-800">
                <div className="text-3xl mb-2">🍽️</div>
                <p className="text-xs text-slate-400">No dishes match your filters.</p>
                <button
                  onClick={() => {
                    setMenuSearch('');
                    setMenuCatFilter('all');
                    setStockFilter('all');
                  }}
                  className="mt-3 text-xs font-bold text-brand-400 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              managedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-3.5 space-y-3 transition shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    {/* Image with sold out badge */}
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.image || PRESET_DISH_IMAGES[0].url} 
                        alt={item.name} 
                        className={`w-full h-full object-cover ${!item.isAvailable ? 'grayscale opacity-50' : ''}`} 
                      />
                      <div className="absolute top-1 left-1 bg-slate-950/80 backdrop-blur-sm p-0.5 rounded">
                        {item.isVeg ? (
                          <div className="w-2.5 h-2.5 border border-emerald-500 rounded-sm flex items-center justify-center">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                          </div>
                        ) : (
                          <div className="w-2.5 h-2.5 border border-rose-500 rounded-sm flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-b-[4px] border-b-rose-500" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold text-white truncate">{item.name}</h3>
                        {item.popular && (
                          <span className="bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[9px] font-black px-1.5 rounded">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                      
                      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                        <span className="font-extrabold text-white">₹{item.price}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 capitalize">{item.category}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {item.preparationTimeMin}m
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Management Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
                    {/* Stock Status Toggle */}
                    <button
                      onClick={async () => {
                        await toggleAvailability(item.id);
                        showToast(
                          item.isAvailable 
                            ? `Marked "${item.name}" as Sold Out` 
                            : `Marked "${item.name}" as In Stock`
                        );
                      }}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
                        item.isAvailable
                          ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30'
                      }`}
                    >
                      {item.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{item.isAvailable ? 'In Stock (Live)' : 'Sold Out (Hidden)'}</span>
                    </button>

                    {/* Edit Dish */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition"
                      title="Edit Dish details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Dish */}
                    <button
                      onClick={async () => {
                        if (confirm(`Are you sure you want to delete "${item.name}" from the menu?`)) {
                          await deleteItem(item.id);
                          showToast(`Deleted "${item.name}"`);
                        }
                      }}
                      className="p-2 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded-xl transition"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE KITCHEN ORDERS */}
      {activeTab === 'orders' && (
        <div className="p-4 space-y-4">
          {/* Order Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['all', 'pending', 'accepted', 'preparing', 'ready', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition ${
                  filterStatus === st
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-slate-900/50 rounded-3xl p-8 text-center border border-slate-800">
                <p className="text-xs text-slate-400">No orders under this status.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-soft"
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
                  <div className="bg-slate-950/70 rounded-2xl p-3 divide-y divide-slate-850 text-xs">
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

                  {/* Action Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    {order.status === 'pending' && (
                      <button
                        onClick={async () => {
                          await updateOrderStatus(order.id, 'accepted');
                          showToast(`Accepted order #${order.orderNumber}`);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-xs"
                      >
                        Accept Order
                      </button>
                    )}

                    {order.status === 'accepted' && (
                      <button
                        onClick={async () => {
                          await updateOrderStatus(order.id, 'preparing');
                          showToast(`Started cooking order #${order.orderNumber}`);
                        }}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Start Cooking</span>
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={async () => {
                          await updateOrderStatus(order.id, 'ready');
                          showToast(`Order #${order.orderNumber} is READY at pickup counter!`);
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Ready for Pickup</span>
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={async () => {
                          await updateOrderStatus(order.id, 'completed');
                          showToast(`Order #${order.orderNumber} completed & handed over!`);
                        }}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-xs"
                      >
                        Handed Over to Student
                      </button>
                    )}

                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <button
                        onClick={async () => {
                          if (confirm(`Cancel order #${order.orderNumber}?`)) {
                            await updateOrderStatus(order.id, 'cancelled');
                            showToast(`Order #${order.orderNumber} cancelled`);
                          }
                        }}
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
      )}

      {/* TAB 3: SALES & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="p-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Food Republic C1 Sales Overview
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Total Revenue</span>
                <span className="text-xl font-black text-brand-400 mt-1 block">₹{todayRevenue}</span>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Total Orders</span>
                <span className="text-xl font-black text-white mt-1 block">{orders.length}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-800 text-xs pt-2">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Active Live Orders</span>
                <span className="font-bold text-amber-400">{activeOrders.length}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Completed Pickups</span>
                <span className="font-bold text-emerald-400">
                  {orders.filter((o) => o.status === 'completed').length}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Cancelled</span>
                <span className="font-bold text-rose-400">
                  {orders.filter((o) => o.status === 'cancelled').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW DISH MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
              <div>
                <h2 className="font-extrabold text-sm text-white">Register New Canteen Dish</h2>
                <p className="text-[10px] text-slate-400">Will immediately appear on student menu</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Special Amritsari Kulcha"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Description</label>
                <input
                  type="text"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="e.g. Served with spicy chole, butter and pickle"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Prep Time (min) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newItemPrepTime}
                    onChange={(e) => setNewItemPrepTime(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Category *</label>
                <select
                  value={newItemCat}
                  onChange={(e) => setNewItemCat(e.target.value as FoodCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Presets Gallery */}
              <div>
                <label className="text-slate-400 block mb-1.5 font-semibold">
                  Choose Photo Preset (or paste custom link below)
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto no-scrollbar p-1 bg-slate-950 rounded-2xl border border-slate-800">
                  {PRESET_DISH_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setNewItemImage(preset.url);
                        if (!newItemCat || newItemCat === 'snacks') {
                          setNewItemCat(preset.category as FoodCategory);
                        }
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                        newItemImage === preset.url
                          ? 'border-brand-500 scale-95 shadow-md'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 text-xs">{preset.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL input */}
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Custom Image URL</label>
                <input
                  type="url"
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Veg and Popular Toggles */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItemIsVeg}
                    onChange={(e) => setNewItemIsVeg(e.target.checked)}
                    className="rounded text-brand-500 w-4 h-4 bg-slate-900 border-slate-700"
                  />
                  <span className="text-white font-medium flex items-center gap-1">
                    🌱 Pure Vegetarian Dish
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItemPopular}
                    onChange={(e) => setNewItemPopular(e.target.checked)}
                    className="rounded text-brand-500 w-4 h-4 bg-slate-900 border-slate-700"
                  />
                  <span className="text-white font-medium flex items-center gap-1">
                    🔥 Feature as Trending on Student Home
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-black py-3 rounded-2xl shadow-elevated transition active:scale-98"
              >
                Register Dish to Menu
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DISH MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
              <div>
                <h2 className="font-extrabold text-sm text-white">Edit Dish Details</h2>
                <p className="text-[10px] text-slate-400">Updating will immediately reflect for all students</p>
              </div>
              <button 
                onClick={() => setEditingItem(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditItem} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Dish Name</label>
                <input
                  type="text"
                  required
                  value={editItemName}
                  onChange={(e) => setEditItemName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Description</label>
                <input
                  type="text"
                  value={editItemDesc}
                  onChange={(e) => setEditItemDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editItemPrice}
                    onChange={(e) => setEditItemPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Prep Time (min)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editItemPrepTime}
                    onChange={(e) => setEditItemPrepTime(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Category</label>
                <select
                  value={editItemCat}
                  onChange={(e) => setEditItemCat(e.target.value as FoodCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo presets */}
              <div>
                <label className="text-slate-400 block mb-1.5 font-semibold">
                  Change Photo
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto no-scrollbar p-1 bg-slate-950 rounded-2xl border border-slate-800">
                  {PRESET_DISH_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setEditItemImage(preset.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                        editItemImage === preset.url
                          ? 'border-brand-500 scale-95 shadow-md'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 text-xs">{preset.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Image URL</label>
                <input
                  type="url"
                  value={editItemImage}
                  onChange={(e) => setEditItemImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editItemIsVeg}
                    onChange={(e) => setEditItemIsVeg(e.target.checked)}
                    className="rounded text-brand-500 w-4 h-4"
                  />
                  <span className="text-white font-medium">🌱 Pure Vegetarian Dish</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editItemPopular}
                    onChange={(e) => setEditItemPopular(e.target.checked)}
                    className="rounded text-brand-500 w-4 h-4"
                  />
                  <span className="text-white font-medium">🔥 Feature as Trending on Home</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black py-3 rounded-2xl shadow-elevated transition active:scale-98"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT OWNER NAME MODAL */}
      {isEditOwnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="font-extrabold text-sm text-white">Change Owner Name</h2>
                <p className="text-[10px] text-slate-400">Updates your name on the restaurant portal</p>
              </div>
              <button 
                onClick={() => setIsEditOwnerModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (ownerNameInput.trim()) {
                  await updateUserName(ownerNameInput.trim());
                  setIsEditOwnerModalOpen(false);
                  showToast(`Owner name updated to "${ownerNameInput.trim()}"`);
                }
              }}
              className="mt-4 space-y-3.5 text-xs"
            >
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Your Owner Name</label>
                <input
                  type="text"
                  required
                  value={ownerNameInput}
                  onChange={(e) => setOwnerNameInput(e.target.value)}
                  placeholder="e.g. Chef Vikram / Muskan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black py-2.5 rounded-xl shadow-elevated transition active:scale-98"
              >
                Save Owner Name
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
