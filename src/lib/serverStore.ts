import { Order, Restaurant, MenuItem, AppNotification } from '@/lib/types';

// Server-side in-memory shared store for multi-device live sync
// Started completely clean - user will register canteens and menu items from scratch

interface StoreData {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  orders: Order[];
  notifications: AppNotification[];
}

// Attach to globalThis in Node.js to persist across hot-reloads and API calls
const globalStore = globalThis as unknown as {
  __queueless_store?: StoreData;
};

if (!globalStore.__queueless_store) {
  globalStore.__queueless_store = {
    restaurants: [],
    menuItems: [],
    orders: [],
    notifications: [],
  };
} else {
  // Clear any existing in-memory state as requested
  globalStore.__queueless_store.restaurants = [];
  globalStore.__queueless_store.menuItems = [];
  globalStore.__queueless_store.orders = [];
  globalStore.__queueless_store.notifications = [];
}

export const serverStore = globalStore.__queueless_store;
