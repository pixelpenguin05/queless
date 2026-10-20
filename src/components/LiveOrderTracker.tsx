import React from 'react';
import { OrderStatus } from '@/lib/types';
import { Check, Clock, Flame, ShoppingBag } from 'lucide-react';

interface Props {
  status: OrderStatus;
}

const STEPS: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
  { key: 'pending', label: 'Order Sent', desc: 'Awaiting canteen', icon: Clock },
  { key: 'accepted', label: 'Accepted', desc: 'Order queued', icon: Check },
  { key: 'preparing', label: 'Preparing', desc: 'Chef cooking', icon: Flame },
  { key: 'ready', label: 'Ready', desc: 'Collect at counter', icon: ShoppingBag },
];

export const LiveOrderTracker: React.FC<Props> = ({ status }) => {
  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'pending': return 0;
      case 'accepted': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'completed': return 4;
      default: return -1;
    }
  };

  const currentIndex = getStepIndex(status);

  if (status === 'cancelled') {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-center">
        <p className="font-semibold">This order was cancelled</p>
        <p className="text-xs text-rose-600 mt-1">Please contact the canteen counter if you have questions.</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="relative flex items-center justify-between">
        {/* Background connector line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
        {/* Active connector line */}
        <div 
          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-brand-500 transition-all duration-500 -z-0"
          style={{ width: `${Math.min(100, Math.max(0, (currentIndex / 3) * 100))}%` }}
        />

        {STEPS.map((step, idx) => {
          const isDone = currentIndex > idx;
          const isCurrent = currentIndex === idx;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-brand-600 text-white shadow-md'
                    : isCurrent
                    ? 'bg-white border-2 border-brand-500 text-brand-600 shadow-lg ring-4 ring-brand-100 scale-110'
                    : 'bg-slate-100 border border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`mt-2 text-xs font-semibold ${
                  isCurrent ? 'text-brand-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-slate-400 text-center hidden sm:block">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
