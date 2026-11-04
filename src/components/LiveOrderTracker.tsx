import React from 'react';
import { OrderStatus } from '@/lib/types';
import { Check, Clock, Flame, ShoppingBag } from 'lucide-react';

interface Props {
  status: OrderStatus;
}

const STEPS: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
  { key: 'pending', label: 'Order Sent', desc: 'Awaiting kitchen', icon: Clock },
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
      <div className="bg-[#FFF5F5] border border-[#CC191D]/30 text-[#CC191D] rounded-2xl p-4 text-center">
        <p className="font-heading font-bold text-base">This order was cancelled</p>
        <p className="text-xs font-sans text-[#CC191D]/80 mt-1">Please contact Food Republic C1 Counter 2 if you have questions.</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between">
        {/* Background connector line */}
        <div className="absolute left-6 right-6 top-5 h-1 bg-[#EAE5DC] -z-0" />
        {/* Active connector line */}
        <div 
          className="absolute left-6 top-5 h-1 bg-gradient-to-r from-[#2E5A66] to-[#E23744] transition-all duration-500 -z-0"
          style={{ width: `${Math.min(100, Math.max(0, (currentIndex / 3) * 100))}%` }}
        />

        {STEPS.map((step, idx) => {
          const isDone = currentIndex > idx;
          const isCurrent = currentIndex === idx;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-[#2E5A66] text-white shadow-md'
                    : isCurrent
                    ? 'bg-white border-2 border-[#E23744] text-[#E23744] shadow-lg ring-4 ring-[#FFE4E6] scale-110'
                    : 'bg-[#FAF7F2] border border-[#EAE5DC] text-[#8A7F70]'
                }`}
              >
                {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : <Icon className="w-5 h-5 stroke-[2.2]" />}
              </div>
              <span
                className={`mt-2 text-xs font-sans font-bold ${
                  isCurrent ? 'text-[#E23744]' : isDone ? 'text-[#1A3D4F]' : 'text-[#8A7F70]'
                }`}
              >
                {step.label}
              </span>
              <span className="text-[11px] font-sans text-[#8A7F70] text-center hidden sm:block">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};