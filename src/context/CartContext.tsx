'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity?: number, customNote?: string, spiceLevel?: 'Mild' | 'Medium' | 'Spicy') => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  platformFee: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from local storage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('queueless_cu_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queueless_cu_cart', JSON.stringify(newItems));
    }
  };

  const addItem = (
    menuItem: MenuItem, 
    quantity: number = 1, 
    customNote?: string, 
    spiceLevel?: 'Mild' | 'Medium' | 'Spicy'
  ) => {
    if (!menuItem.isAvailable) return;

    const existingIndex = items.findIndex((i) => i.menuItem.id === menuItem.id);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
      if (customNote) updated[existingIndex].customNote = customNote;
      if (spiceLevel) updated[existingIndex].spiceLevel = spiceLevel;
    } else {
      updated = [...items, { menuItem, quantity, customNote, spiceLevel }];
    }

    saveCart(updated);
  };

  const removeItem = (menuItemId: string) => {
    const updated = items.filter((i) => i.menuItem.id !== menuItemId);
    saveCart(updated);
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    const updated = items.map((i) => 
      i.menuItem.id === menuItemId ? { ...i, quantity } : i
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const platformFee = items.length > 0 ? 2 : 0; // ₹2 flat campus canteen packaging charge
  const tax = items.length > 0 ? Math.round(subtotal * 0.05) : 0; // 5% GST
  const total = subtotal + platformFee + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        platformFee,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
