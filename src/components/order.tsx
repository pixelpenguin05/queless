'use client';

import { useNow } from '@/lib/hooks';
import type { Order } from '@/lib/types';
import { clock, rupees } from './ui';

/** Live countdown to order.readyBy, with a progress bar. */
export function Countdown({ order, large }: { order: Order; large?: boolean }) {
  const now = useNow();
  if (!order.readyBy || !order.acceptedAt) return null;

  const left = Math.max(0, order.readyBy - now);
  const total = Math.max(1, order.readyBy - order.acceptedAt);
  const progress = Math.min(100, ((total - left) / total) * 100);
  const mm = Math.floor(left / 60_000);
  const ss = Math.floor((left % 60_000) / 1000)
    .toString()
    .padStart(2, '0');

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className={large ? 'text-4xl font-extrabold tabular-nums' : 'text-2xl font-bold tabular-nums'}>
          {left > 0 ? `${mm}:${ss}` : 'Any moment'}
        </span>
        <span className="text-sm text-muted">ready by {clock(order.readyBy)}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-brand transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export function OrderLines({ order }: { order: Order }) {
  return (
    <div className="space-y-1 text-sm">
      {order.items.map((l) => (
        <div key={l.itemId} className="flex justify-between gap-2">
          <span>
            <span className="font-semibold">{l.qty}×</span> {l.name}
          </span>
          <span className="text-muted">{rupees(l.price * l.qty)}</span>
        </div>
      ))}
      <div className="flex justify-between border-t border-line pt-2 font-semibold">
        <span>Total · pay at counter</span>
        <span>{rupees(order.total)}</span>
      </div>
    </div>
  );
}
