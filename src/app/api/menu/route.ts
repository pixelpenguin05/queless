import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import { MenuItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurantId');

  let list = [...serverStore.menuItems];
  if (restaurantId) {
    list = list.filter((m) => m.restaurantId === restaurantId);
  }

  return NextResponse.json({ success: true, items: list });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const id = 'item-' + Date.now();
    const newItem: MenuItem = {
      ...body,
      id,
      price: Number(body.price) || 50,
      preparationTimeMin: Number(body.preparationTimeMin) || 10,
      isVeg: Boolean(body.isVeg),
      isAvailable: true,
      rating: 4.8,
    };

    serverStore.menuItems.push(newItem);

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, updates } = await request.json();

    const index = serverStore.menuItems.findIndex((m) => m.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    serverStore.menuItems[index] = {
      ...serverStore.menuItems[index],
      ...updates,
    };

    return NextResponse.json({ success: true, item: serverStore.menuItems[index] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID required' }, { status: 400 });
    }

    serverStore.menuItems = serverStore.menuItems.filter((m) => m.id !== id);

    return NextResponse.json({ success: true, message: 'Item deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

