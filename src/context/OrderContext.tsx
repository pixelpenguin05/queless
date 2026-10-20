'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc, query, orderBy } from 'firebase/firestore';

interface OrderContextType {
  orders: Order[];
  activeOrders: Order[];
  pastOrders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
}

const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'QL-4821',
    studentId: 'student-cu-101',
    studentName: 'Aman Sharma',
    studentPhone: '+91 98765 43210',
    studentRollNo: '21BCS4821',
    items: [
      { id: 'm1', name: 'Special Paneer Butter Masala Thali', price: 130, quantity: 1, isVeg: true },
      { id: 'm5', name: 'Cold Coffee with Choco Fudge', price: 55, quantity: 1, isVeg: true }
    ],
    subtotal: 185,
    platformFee: 2,
    tax: 9,
    total: 196,
    status: 'preparing',
    pickupSlot: 'Immediate (15-20 min)',
    paymentMethod: 'UPI at Pickup',
    paymentStatus: 'Pending',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    estimatedReadyTime: '15 mins',
    canteenCounter: 'Counter 1 (Main Kitchen)',
  },
  {
    id: 'ord-102',
    orderNumber: 'QL-4819',
    studentId: 'student-cu-102',
    studentName: 'Simran Kaur',
    studentPhone: '+91 98888 77766',
    studentRollNo: '21BCS3044',
    items: [
      { id: 'm2', name: 'Crispy Veg Masala Dosa', price: 75, quantity: 2, isVeg: true },
      { id: 'm11', name: 'Fresh Mint Mojito Cooler', price: 50, quantity: 1, isVeg: true }
    ],
    subtotal: 200,
    platformFee: 2,
    tax: 10,
    total: 212,
    status: 'ready',
    pickupSlot: 'Break Time (1:15 PM)',
    paymentMethod: 'Pay at Counter',
    paymentStatus: 'Pending',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    estimatedReadyTime: 'Ready Now',
    canteenCounter: 'Counter 2 (South Indian & Juices)',
  },
  {
    id: 'ord-103',
    orderNumber: 'QL-4805',
    studentId: 'student-cu-101',
    studentName: 'Aman Sharma',
    studentPhone: '+91 98765 43210',
    studentRollNo: '21BCS4821',
    items: [
      { id: 'm9', name: 'Masala Chai & Samosa Combo', price: 40, quantity: 2, isVeg: true }
    ],
    subtotal: 80,
    platformFee: 2,
    tax: 4,
    total: 86,
    status: 'completed',
    pickupSlot: 'Morning Break',
    paymentMethod: 'UPI at Pickup',
    paymentStatus: 'Paid',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    estimatedReadyTime: 'Completed',
    canteenCounter: 'Counter 3 (Snacks & Tea)',
  }
];

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_SAMPLE_ORDERS);

  // Firestore live subscription or LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isFirebaseConfigured) {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const liveOrders: Order[] = [];
          snapshot.forEach((doc) => liveOrders.push({ id: doc.id, ...doc.data() } as Order));
          setOrders(liveOrders);
        }
      }, (err) => {
        console.warn('Firestore live order subscription error:', err);
      });
      return () => unsubscribe();
    } else {
      const saved = localStorage.getItem('queueless_cu_orders');
      if (saved) {
        try {
          setOrders(JSON.parse(saved));
        } catch {
          setOrders(INITIAL_SAMPLE_ORDERS);
        }
      }
    }
  }, []);

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queueless_cu_orders', JSON.stringify(updated));
    }
  };

  const placeOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<Order> => {
    const id = 'ord-' + Date.now();
    const orderNumber = 'QL-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'orders', id), newOrder);
      } catch (err) {
        console.error('Firestore order creation error:', err);
      }
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    saveOrders(updated);

    if (isFirebaseConfigured) {
      try {
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      } catch (err) {
        console.error('Firestore order update error:', err);
      }
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const activeOrders = orders.filter((o) => ['pending', 'accepted', 'preparing', 'ready'].includes(o.status));
  const pastOrders = orders.filter((o) => ['completed', 'cancelled'].includes(o.status));

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrders,
        pastOrders,
        placeOrder,
        updateOrderStatus,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
};
