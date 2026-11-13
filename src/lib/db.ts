'use client';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from './firebase';
import type { MenuItem, Order, OrderLine, Restaurant } from './types';

/* ------------------------------------------------------------------ *
 * Storage backend
 *
 * Firestore (when configured): every phone listens to the same database,
 * so changes appear on all devices in real time.
 *
 * Local fallback: data lives in this browser's localStorage and syncs
 * between tabs. Good for trying the app before adding Firebase keys.
 * ------------------------------------------------------------------ */

type Col = 'restaurants' | 'menuItems' | 'orders';
type Filter = [field: string, value: string] | undefined;
type Row = { id: string } & Record<string, unknown>;
type Unsubscribe = () => void;

interface Backend {
  watch(col: Col, filter: Filter, cb: (rows: Row[]) => void): Unsubscribe;
  find(col: Col, filter: Filter): Promise<Row[]>;
  add(col: Col, data: Record<string, unknown>): Promise<string>;
  update(col: Col, id: string, patch: Record<string, unknown>): Promise<void>;
  remove(col: Col, id: string): Promise<void>;
}

const firestoreBackend: Backend = {
  watch(col, filter, cb) {
    const ref = collection(getDb(), col);
    const q = filter ? query(ref, where(filter[0], '==', filter[1])) : ref;
    return onSnapshot(
      q,
      (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.error(`[db] watch ${col} failed`, err),
    );
  },
  async find(col, filter) {
    const ref = collection(getDb(), col);
    const snap = await getDocs(filter ? query(ref, where(filter[0], '==', filter[1])) : ref);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
  async add(col, data) {
    return (await addDoc(collection(getDb(), col), data)).id;
  },
  async update(col, id, patch) {
    await updateDoc(doc(getDb(), col, id), patch);
  },
  async remove(col, id) {
    await deleteDoc(doc(getDb(), col, id));
  },
};

const LOCAL_EVENT = 'queless-local-change';
const localKey = (col: Col) => `queless:${col}`;
const matches = (row: Row, filter: Filter) => !filter || row[filter[0]] === filter[1];

function readLocal(col: Col): Row[] {
  try {
    return JSON.parse(localStorage.getItem(localKey(col)) || '[]');
  } catch {
    return [];
  }
}

function writeLocal(col: Col, rows: Row[]) {
  localStorage.setItem(localKey(col), JSON.stringify(rows));
  window.dispatchEvent(new Event(LOCAL_EVENT));
}

const localBackend: Backend = {
  watch(col, filter, cb) {
    const emit = () => cb(readLocal(col).filter((r) => matches(r, filter)));
    emit();
    window.addEventListener('storage', emit); // other tabs
    window.addEventListener(LOCAL_EVENT, emit); // this tab
    return () => {
      window.removeEventListener('storage', emit);
      window.removeEventListener(LOCAL_EVENT, emit);
    };
  },
  async find(col, filter) {
    return readLocal(col).filter((r) => matches(r, filter));
  },
  async add(col, data) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    writeLocal(col, [...readLocal(col), { ...data, id }]);
    return id;
  },
  async update(col, id, patch) {
    writeLocal(col, readLocal(col).map((r) => (r.id === id ? { ...r, ...patch } : r)));
  },
  async remove(col, id) {
    writeLocal(col, readLocal(col).filter((r) => r.id !== id));
  },
};

const backend: Backend = isFirebaseConfigured ? firestoreBackend : localBackend;

/* ------------------------------------------------------------------ *
 * App-level API: everything the screens need.
 * ------------------------------------------------------------------ */

export const normalizePhone = (phone: string) => phone.replace(/\D/g, '').slice(-10);

const byNewest = <T extends { createdAt: number }>(rows: T[]) =>
  [...rows].sort((a, b) => b.createdAt - a.createdAt);
const byOldest = <T extends { createdAt: number }>(rows: T[]) =>
  [...rows].sort((a, b) => a.createdAt - b.createdAt);

// Restaurants
export const watchRestaurants = (cb: (rows: Restaurant[]) => void) =>
  backend.watch('restaurants', undefined, (rows) => cb(byOldest(rows as unknown as Restaurant[])));

export async function findRestaurantByPhone(phone: string): Promise<Restaurant | null> {
  const rows = await backend.find('restaurants', ['phone', normalizePhone(phone)]);
  return (rows[0] as unknown as Restaurant) ?? null;
}

export async function registerRestaurant(
  data: Pick<Restaurant, 'name' | 'ownerName' | 'phone' | 'location'>,
): Promise<Restaurant> {
  const phone = normalizePhone(data.phone);
  if (await findRestaurantByPhone(phone)) {
    throw new Error('A restaurant with this phone number already exists. Please log in instead.');
  }
  const record = { ...data, phone, createdAt: Date.now() };
  const id = await backend.add('restaurants', record);
  return { id, ...record };
}

// Menu
export const watchMenu = (restaurantId: string, cb: (rows: MenuItem[]) => void) =>
  backend.watch('menuItems', ['restaurantId', restaurantId], (rows) =>
    cb(byOldest(rows as unknown as MenuItem[])),
  );

export const addMenuItem = (data: Pick<MenuItem, 'restaurantId' | 'name' | 'price' | 'isVeg'>) =>
  backend.add('menuItems', { ...data, available: true, createdAt: Date.now() });

export const setMenuItemAvailable = (id: string, available: boolean) =>
  backend.update('menuItems', id, { available });

export const deleteMenuItem = (id: string) => backend.remove('menuItems', id);

// Orders
export const watchRestaurantOrders = (restaurantId: string, cb: (rows: Order[]) => void) =>
  backend.watch('orders', ['restaurantId', restaurantId], (rows) =>
    cb(byNewest(rows as unknown as Order[])),
  );

export const watchCustomerOrders = (phone: string, cb: (rows: Order[]) => void) =>
  backend.watch('orders', ['customerPhone', normalizePhone(phone)], (rows) =>
    cb(byNewest(rows as unknown as Order[])),
  );

export async function placeOrder(input: {
  restaurant: Restaurant;
  customerName: string;
  customerPhone: string;
  items: OrderLine[];
}): Promise<string> {
  const order: Omit<Order, 'id'> = {
    code: String(Math.floor(1000 + Math.random() * 9000)),
    restaurantId: input.restaurant.id,
    restaurantName: input.restaurant.name,
    customerName: input.customerName,
    customerPhone: normalizePhone(input.customerPhone),
    items: input.items,
    total: input.items.reduce((sum, l) => sum + l.price * l.qty, 0),
    status: 'pending',
    createdAt: Date.now(),
  };
  return backend.add('orders', order);
}

export const acceptOrder = (id: string, prepMinutes: number) => {
  const now = Date.now();
  return backend.update('orders', id, {
    status: 'accepted',
    acceptedAt: now,
    readyBy: now + prepMinutes * 60_000,
  });
};

export const extendOrder = (order: Order, minutes: number) =>
  backend.update('orders', order.id, {
    readyBy: Math.max(order.readyBy ?? 0, Date.now()) + minutes * 60_000,
  });

export const setOrderStatus = (id: string, status: Order['status']) =>
  backend.update('orders', id, { status });
