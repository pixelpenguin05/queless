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
      bg: 'bg-[#FBF1D4] border-[#E8B92C] text-[#8A6A0B]',
      icon: Clock,
      label: 'Order Placed',
      pulse: false,
    },
    accepted: {
      bg: 'bg-[#E7F5EE] border-[#0F5B4C]/30 text-[#0F5B4C]',
      icon: BellRing,
      label: 'Accepted by Kitchen',
      pulse: false,
    },
    preparing: {
      bg: 'bg-[#FFF5F5] border-[#E23744]/30 text-[#E23744]',
      icon: Flame,
      label: 'Preparing in Kitchen',
      pulse: true,
    },
    ready: {
      bg: 'bg-[#E7F5EE] border-[#0F5B4C] text-[#0F5B4C] ring-2 ring-[#0F5B4C]/20',
      icon: CheckCircle2,
      label: 'Ready for Pickup!',
      pulse: true,
    },
    completed: {
      bg: 'bg-[#F5EFE6] border-[#EAE5DC] text-[#5F6B6F]',
      icon: Check,
      label: 'Picked Up',
      pulse: false,
    },
    cancelled: {
      bg: 'bg-[#FFF5F5] border-[#CC191D]/30 text-[#CC191D]',
      icon: XCircle,
      label: 'Cancelled',
      pulse: false,
    },
  }[status];

  const Icon = config.icon;
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs font-semibold',
    lg: 'px-4 py-1.5 text-sm font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs font-sans ${config.bg} ${sizeClasses}`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.pulse ? 'animate-pulse' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
};