import { Order, Restaurant, MenuItem, AppNotification } from '@/lib/types';
import { INITIAL_MENU_ITEMS } from '@/lib/sampleData';

// Server-side in-memory shared store for multi-device live sync
// Accessible by all devices connecting via LAN or localhost

interface StoreData {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  orders: Order[];
  notifications: AppNotification[];
}

const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-c1',
    name: 'Food Republic C1',
    ownerName: 'Chef Vikram',
    ownerPhone: '+91 98111 22334',
    counterLocation: 'Food Republic C1 • Ground Floor Counter 2',
    status: 'approved',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Premier Chandigarh University multi-cuisine campus canteen with pre-order express counter.',
  },
  {
    id: 'rest-south',
    name: 'South Indian & Juice Corner',
    ownerName: 'Murugan Swamy',
    ownerPhone: '+91 98765 11223',
    counterLocation: 'Block B-3 Cafeteria • Counter 1',
    status: 'approved',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    description: 'Crispy hot dosas, steamed idlis, fresh filter coffee and fruit coolers.',
  },
  {
    id: 'rest-pending-demo',
    name: 'Nescafe Campus Hub',
    ownerName: 'Rahul Verma',
    ownerPhone: '+91 99887 76655',
    counterLocation: 'Academic Lawn Near Central Library',
    status: 'pending',
    createdAt: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    description: 'Quick bites, hot brewed coffees, iced frappes, and bakery rolls.',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'QL-4821',
    pickupCode: '4821',
    studentId: 'student-demo-1',
    studentName: 'Aman Sharma',
    studentPhone: '9876543210',
    studentRollNo: '21BCS4821',
    restaurantId: 'rest-c1',
    restaurantName: 'Food Republic C1',
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
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    estimatedReadyTime: '15 mins',
    canteenCounter: 'Food Republic C1 • Counter 2',
    readyNotificationSent: false,
  },
];

// Attach to globalThis in Node.js to persist across hot-reloads and API calls
const globalStore = globalThis as unknown as {
  __queueless_store?: StoreData;
};

if (!globalStore.__queueless_store) {
  globalStore.__queueless_store = {
    restaurants: INITIAL_RESTAURANTS,
    menuItems: INITIAL_MENU_ITEMS.map((item: MenuItem) => ({
      ...item,
      restaurantId: 'rest-c1',
      restaurantName: 'Food Republic C1',
    })),
    orders: INITIAL_ORDERS,
    notifications: [],
  };
}

export const serverStore = globalStore.__queueless_store;
