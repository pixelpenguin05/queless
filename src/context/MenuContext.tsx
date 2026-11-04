'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem, FoodCategory } from '@/lib/types';
import { INITIAL_MENU_ITEMS } from '@/lib/sampleData';

interface MenuContextType {
  items: MenuItem[];
  filteredItems: MenuItem[];
  selectedCategory: FoodCategory;
  setSelectedCategory: (category: FoodCategory) => void;
  selectedRestaurantId: string;
  setSelectedRestaurantId: (restaurantId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  vegOnly: boolean;
  setVegOnly: (vegOnly: boolean) => void;
  toggleAvailability: (itemId: string) => Promise<void>;
  updatePrice: (itemId: string, newPrice: number) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<MenuItem>) => Promise<void>;
  addNewItem: (itemData: Omit<MenuItem, 'id'>) => Promise<MenuItem>;
  deleteItem: (itemId: string) => Promise<void>;
  resetToSampleData: () => void;
  refreshMenu: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('all');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  const fetchMenuFromServer = useCallback(async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setItems(data.items);
          if (typeof window !== 'undefined') {
            localStorage.setItem('queueless_cu_menu', JSON.stringify(data.items));
          }
        }
      }
    } catch {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('queueless_cu_menu');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const clean = Array.isArray(parsed) ? parsed.filter((i: any) => !/^m\d+$/.test(i.id)) : [];
            setItems(clean);
          } catch {}
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchMenuFromServer();
  }, [fetchMenuFromServer]);

  const toggleAvailability = async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const newStatus = !item.isAvailable;
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, isAvailable: newStatus } : i)));

    try {
      await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, updates: { isAvailable: newStatus } }),
      });
    } catch {}
  };

  const updatePrice = async (itemId: string, newPrice: number) => {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, price: newPrice } : i)));
    try {
      await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, updates: { price: newPrice } }),
      });
    } catch {}
  };

  const updateItem = async (itemId: string, updates: Partial<MenuItem>) => {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, ...updates } : i)));
    try {
      await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, updates }),
      });
    } catch {}
  };

  const addNewItem = async (itemData: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.item) {
          setItems((prev) => [data.item, ...prev]);
          return data.item;
        }
      }
    } catch {}

    const newItem: MenuItem = {
      ...itemData,
      id: 'item-' + Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const deleteItem = async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    try {
      await fetch(`/api/menu?id=${itemId}`, { method: 'DELETE' });
    } catch {}
  };

  const resetToSampleData = () => {
    setItems(INITIAL_MENU_ITEMS);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queueless_cu_menu', JSON.stringify(INITIAL_MENU_ITEMS));
    }
  };

  // Filtered Items Computation
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesRestaurant = selectedRestaurantId === 'all' || item.restaurantId === selectedRestaurantId;
    const matchesVeg = !vegOnly || item.isVeg;
    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesRestaurant && matchesVeg && matchesSearch;
  });

  return (
    <MenuContext.Provider
      value={{
        items,
        filteredItems,
        selectedCategory,
        setSelectedCategory,
        selectedRestaurantId,
        setSelectedRestaurantId,
        searchQuery,
        setSearchQuery,
        vegOnly,
        setVegOnly,
        toggleAvailability,
        updatePrice,
        updateItem,
        addNewItem,
        deleteItem,
        resetToSampleData,
        refreshMenu: fetchMenuFromServer,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
