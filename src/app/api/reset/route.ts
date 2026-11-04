import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  serverStore.restaurants = [];
  serverStore.menuItems = [];
  serverStore.orders = [];
  serverStore.notifications = [];

  return NextResponse.json({
    success: true,
    message: 'All system data (restaurants, menu items, orders, notifications) has been completely wiped to 0.',
    state: {
      restaurants: serverStore.restaurants.length,
      menuItems: serverStore.menuItems.length,
      orders: serverStore.orders.length,
      notifications: serverStore.notifications.length,
    }
  });
}

export async function POST() {
  return GET();
}

