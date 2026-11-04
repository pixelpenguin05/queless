import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const recipientId = searchParams.get('recipientId');
  const since = searchParams.get('since');

  let list = [...serverStore.notifications];

  if (role) {
    list = list.filter((n) => n.recipientRole === role || n.recipientRole === 'all');
  }

  if (recipientId) {
    list = list.filter((n) => !n.recipientId || n.recipientId === recipientId);
  }

  if (since) {
    const sinceTime = new Date(since).getTime();
    list = list.filter((n) => new Date(n.timestamp).getTime() > sinceTime);
  }

  return NextResponse.json({ success: true, notifications: list });
}

