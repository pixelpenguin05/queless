export interface Customer {
  name: string;
  phone: string;
}

export interface Restaurant {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  location: string;
  createdAt: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  isVeg: boolean;
  available: boolean;
  createdAt: number;
}

/**
 * pending   → customer placed it, waiting for the restaurant
 * accepted  → restaurant accepted and set a ready time (readyBy)
 * ready     → food is ready for pickup
 * completed → customer picked it up
 * rejected / cancelled → closed without food
 */
export type OrderStatus = 'pending' | 'accepted' | 'ready' | 'completed' | 'rejected' | 'cancelled';

export interface OrderLine {
  itemId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  code: string; // 4-digit pickup code
  restaurantId: string;
  restaurantName: string;
  customerName: string;
  customerPhone: string;
  items: OrderLine[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  acceptedAt?: number;
  readyBy?: number; // epoch ms: when the restaurant promised the food
}
