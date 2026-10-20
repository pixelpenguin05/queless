'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, FoodCategory } from '@/lib/types';
import { INITIAL_MENU_ITEMS } from '@/lib/sampleData';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface MenuContextType {
  items: MenuItem[];
  categories: FoodCategory[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: FoodCategory;
  setSelectedCategory: (cat: FoodCategory) => void;
  vegOnly: boolean;
  setVegOnly: (veg: boolean) => void;
  filteredItems: MenuItem[];
  // Admin actions
  toggleAvailability: (id: string) => Promise<void>;
  updateItemPrice: (id: string, newPrice: number) => Promise<void>;
  addNewItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  resetToSampleData: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('all');
  const [vegOnly, setVegOnly] = useState(false);

  // Load from local storage or Firestore
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isFirebaseConfigured) {
      const fetchFirestoreMenu = async () => {
        try {
          const snapshot = await getDocs(collection(db, 'menuItems'));
          if (!snapshot.empty) {
            const list: MenuItem[] = [];
            snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() } as MenuItem));
            setItems(list);
            return;
          }
        } catch (err) {
          console.warn('Could not read from Firestore, falling back to local data', err);
        }
      };
      fetchFirestoreMenu();
    } else {
      const saved = localStorage.getItem('queueless_cu_menu');
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {
          setItems(INITIAL_MENU_ITEMS);
        }
      }
    }
  }, []);

  const saveItems = (updated: MenuItem[]) => {
    setItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queueless_cu_menu', JSON.stringify(updated));
    }
  };

  const toggleAvailability = async (id: string) => {
    const updated = items.map((item) => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    saveItems(updated);

    if (isFirebaseConfigured) {
      try {
        const item = items.find((i) => i.id === id);
        if (item) {
          await updateDoc(doc(db, 'menuItems', id), { isAvailable: !item.isAvailable });
        }
      } catch (err) {
        console.error('Firestore update error:', err);
      }
    }
  };

  const updateItemPrice = async (id: string, newPrice: number) => {
    if (newPrice <= 0) return;
    const updated = items.map((item) => 
      item.id === id ? { ...item, price: newPrice } : item
    );
    saveItems(updated);

    if (isFirebaseConfigured) {
      try {
        await updateDoc(doc(db, 'menuItems', id), { price: newPrice });
      } catch (err) {
        console.error('Firestore price update error:', err);
      }
    }
  };

  const addNewItem = async (newItemData: Omit<MenuItem, 'id'>) => {
    const newId = 'm_' + Date.now();
    const itemWithId: MenuItem = { ...newItemData, id: newId };
    const updated = [itemWithId, ...items];
    saveItems(updated);

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'menuItems', newId), itemWithId);
      } catch (err) {
        console.error('Firestore add item error:', err);
      }
    }
  };

  const deleteItem = async (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    saveItems(updated);

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'menuItems', id));
      } catch (err) {
        console.error('Firestore delete error:', err);
      }
    }
  };

  const resetToSampleData = () => {
    saveItems(INITIAL_MENU_ITEMS);
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.isVeg;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  return (
    <MenuContext.Provider
      value={{
        items,
        categories: ['all', 'meals', 'combos', 'snacks', 'south-indian', 'chinese', 'beverages', 'bakery'],
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        vegOnly,
        setVegOnly,
        filteredItems,
        toggleAvailability,
        updateItemPrice,
        addNewItem,
        deleteItem,
        resetToSampleData,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
};
