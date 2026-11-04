import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import { Restaurant, RestaurantStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includePending = searchParams.get('all') === 'true';

  let list = [...serverStore.restaurants];
  if (!includePending) {
    list = list.filter((r) => r.status === 'approved');
  }

  return NextResponse.json({ success: true, restaurants: list });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const id = 'rest-' + Date.now();
    const newRestaurant: Restaurant = {
      id,
      name: body.name || 'Campus Canteen',
      ownerName: body.ownerName || 'Restaurant Lead',
      ownerPhone: body.ownerPhone || '+91 98000 00000',
      counterLocation: body.counterLocation || 'Campus Food Court',
      status: 'pending', // Requires admin verification
      createdAt: new Date().toISOString(),
      image: body.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      description: body.description || 'Campus food outlet registered on QueueLess.',
    };

    serverStore.restaurants.push(newRestaurant);

    return NextResponse.json({ 
      success: true, 
      restaurant: newRestaurant,
      message: 'Registration submitted! Admin verification is pending.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Admin approve or reject restaurant
export async function PATCH(request: NextRequest) {
  try {
    const { restaurantId, status } = await request.json();

    const index = serverStore.restaurants.findIndex((r) => r.id === restaurantId);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    serverStore.restaurants[index].status = status as RestaurantStatus;

    return NextResponse.json({ 
      success: true, 
      restaurant: serverStore.restaurants[index],
      message: `Restaurant status updated to ${status}` 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

