'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '@/lib/types';

interface OrderContextType {
  orders: Order[];
  activeOrders: Order[];
  pastOrders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'pickupCode' | 'createdAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
}

const INITIAL_SAMPLE_ORDERS: Order[] = [];

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrdersFromServer = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
          if (typeof window !== 'undefined') {
            localStorage.setItem('queueless_cu_orders', JSON.stringify(data.orders));
          }
        }
      }
    } catch {
      // Fallback to localStorage if network/offline
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('queueless_cu_orders');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const clean = Array.isArray(parsed) ? parsed.filter((o: any) => o.id !== 'ord-101' && !o.id.includes('demo')) : [];
            setOrders(clean);
          } catch {}
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchOrdersFromServer();

    // Poll every 3 seconds so that ordering on Phone 1 updates Phone 2 in real time
    const interval = setInterval(fetchOrdersFromServer, 3000);
    return () => clearInterval(interval);
  }, [fetchOrdersFromServer]);

  const placeOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'pickupCode' | 'createdAt' | 'status'>): Promise<Order> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          setOrders((prev) => [data.order, ...prev]);
          return data.order;
        }
      }
    } catch (e) {
      console.warn('API placeOrder error, falling back locally:', e);
    }

    // Local fallback
    const id = 'ord-' + Date.now();
    const orderNumber = 'QL-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      pickupCode: orderNumber.replace('QL-', ''),
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      paymentStatus: 'Pending',
      canteenCounter: orderData.canteenCounter || 'Food Republic C1 • Counter 2',
      restaurantName: orderData.restaurantName || 'Food Republic C1',
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queueless_cu_orders', JSON.stringify(updated));
    }
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
    } catch (e) {
      console.warn('API updateOrderStatus error:', e);
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              paymentStatus: newStatus === 'completed' && o.paymentMethod === 'Cash on Delivery' ? 'Paid' : o.paymentStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString() : o.completedAt,
            }
          : o
      )
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
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
        refreshOrders: fetchOrdersFromServer,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
