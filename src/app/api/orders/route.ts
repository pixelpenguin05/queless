import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import { Order, OrderStatus, AppNotification } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurantId');
  const studentPhone = searchParams.get('studentPhone');
  const studentId = searchParams.get('studentId');

  let list = [...serverStore.orders];

  if (restaurantId) {
    list = list.filter((o) => !o.restaurantId || o.restaurantId === restaurantId);
  }
  if (studentPhone) {
    list = list.filter((o) => o.studentPhone === studentPhone);
  } else if (studentId) {
    list = list.filter((o) => o.studentId === studentId);
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ success: true, orders: list });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const id = 'ord-' + Date.now();
    const orderNumber = 'QL-' + Math.floor(1000 + Math.random() * 9000);
    const pickupCode = orderNumber.replace('QL-', '');

    const newOrder: Order = {
      ...body,
      id,
      orderNumber,
      pickupCode,
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentMethod: body.paymentMethod || 'Cash on Delivery',
      paymentStatus: 'Pending',
      canteenCounter: body.canteenCounter || 'Food Republic C1 • Counter 2',
      restaurantName: body.restaurantName || 'Food Republic C1',
      restaurantId: body.restaurantId || 'rest-c1',
    };

    serverStore.orders.unshift(newOrder);

    // Create a notification for the Restaurant Owner
    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      recipientRole: 'restaurant_owner',
      recipientId: newOrder.restaurantId,
      title: `🔔 New Order Received: #${newOrder.orderNumber}`,
      message: `${newOrder.studentName} (${newOrder.studentPhone}) ordered ${newOrder.items.length} items • ₹${newOrder.total} (${newOrder.paymentMethod})`,
      type: 'order_placed',
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      timestamp: new Date().toISOString(),
      read: false,
    };
    serverStore.notifications.unshift(notif);

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();

    const index = serverStore.orders.findIndex((o) => o.id === orderId);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const currentOrder = serverStore.orders[index];
    const updatedOrder: Order = {
      ...currentOrder,
      status: status as OrderStatus,
      paymentStatus: status === 'completed' && currentOrder.paymentMethod === 'Cash on Delivery' ? 'Paid' : currentOrder.paymentStatus,
      completedAt: status === 'completed' ? new Date().toISOString() : currentOrder.completedAt,
    };

    serverStore.orders[index] = updatedOrder;

    // Create student notification based on new status
    let title = '';
    let message = '';
    let type: AppNotification['type'] = 'order_accepted';

    if (status === 'accepted') {
      title = `👨‍🍳 Order #${updatedOrder.orderNumber} Accepted!`;
      message = `${updatedOrder.restaurantName} accepted your order and queued it for preparation.`;
      type = 'order_accepted';
    } else if (status === 'preparing') {
      title = `🔥 Cooking Started for #${updatedOrder.orderNumber}`;
      message = `Chef is actively preparing your meal. Estimated ready in 10-15 mins!`;
      type = 'order_preparing';
    } else if (status === 'ready') {
      title = `🎉 Your Food is Ready! #${updatedOrder.orderNumber}`;
      message = `Your meal is hot & packed! Please collect at ${updatedOrder.canteenCounter} with Token #${updatedOrder.orderNumber}.`;
      type = 'order_ready';
      updatedOrder.readyNotificationSent = true;
    } else if (status === 'completed') {
      title = `✅ Food Handed Over #${updatedOrder.orderNumber}`;
      message = `Thank you! Your order was delivered at the counter. Enjoy your campus break!`;
      type = 'order_completed';
    }

    if (title) {
      const studentNotif: AppNotification = {
        id: 'notif-' + Date.now(),
        recipientRole: 'student',
        recipientId: updatedOrder.studentId,
        title,
        message,
        type,
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        timestamp: new Date().toISOString(),
        read: false,
      };
      serverStore.notifications.unshift(studentNotif);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

