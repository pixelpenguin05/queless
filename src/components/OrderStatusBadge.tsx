import React from 'react';
import { OrderStatus } from '@/lib/types';
import { Clock, CheckCircle2, Flame, BellRing, Check, XCircle } from 'lucide-react';

interface Props {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const OrderStatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const config = {
    pending: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: Clock,
      label: 'Order Placed',
      pulse: false,
    },
    accepted: {
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: BellRing,
      label: 'Accepted by Kitchen',
      pulse: false,
    },
    preparing: {
      bg: 'bg-orange-50 border-orange-200 text-orange-800',
      icon: Flame,
      label: 'Preparing in Kitchen',
      pulse: true,
    },
    ready: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-500/20',
      icon: CheckCircle2,
      label: 'Ready for Pickup!',
      pulse: true,
    },
    completed: {
      bg: 'bg-slate-100 border-slate-200 text-slate-700',
      icon: Check,
      label: 'Picked Up',
      pulse: false,
    },
    cancelled: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: XCircle,
      label: 'Cancelled',
      pulse: false,
    },
  }[status];

  const Icon = config.icon;
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${config.bg} ${sizeClasses}`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.pulse ? 'animate-pulse' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
};
