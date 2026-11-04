'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AppNotification } from '@/lib/types';
import { sounds } from '@/lib/sound';
import { BellRing, CheckCircle, Flame, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';

export const NotificationBanner: React.FC = () => {
  const { user } = useAuth();
  const [activeNotif, setActiveNotif] = useState<AppNotification | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    const checkNotifications = async () => {
      try {
        const role = user?.role === 'restaurant_owner' ? 'restaurant_owner' : 'student';
        const res = await fetch(`/api/notifications?role=${role}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.notifications) && data.notifications.length > 0) {
          const latest = data.notifications[0] as AppNotification;

          // If this is a new notification we haven't alerted for in this session
          if (!seenIdsRef.current.has(latest.id)) {
            seenIdsRef.current.add(latest.id);

            // Play specific sound
            if (latest.type === 'order_placed') {
              sounds.playNewOrderChime();
            } else if (latest.type === 'order_ready') {
              sounds.playFoodReadyChime();
            } else {
              sounds.playStatusUpdateChime();
            }

            if (isMounted) {
              setActiveNotif(latest);
              // Auto dismiss after 7 seconds
              setTimeout(() => {
                if (isMounted) {
                  setActiveNotif((prev) => (prev?.id === latest.id ? null : prev));
                }
              }, 7000);
            }
          }
        }
      } catch (e) {
        // Silently catch fetch errors during build or offline
      }
    };

    // Initial check
    checkNotifications();

    // Poll every 2.5 seconds for cross-phone instant updates
    const interval = setInterval(checkNotifications, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  if (!activeNotif) return null;

  return (
    <div className="fixed top-20 md:top-24 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white border-2 border-[#E23744] rounded-3xl p-4 shadow-float flex items-start justify-between gap-3 relative">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFE4E6] text-[#E23744] flex items-center justify-center flex-shrink-0 animate-bounce">
            <BellRing className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-[#1A3D4F] leading-tight">
              {activeNotif.title}
            </h4>
            <p className="font-sans text-xs text-[#5F6B6F] mt-1 leading-relaxed">
              {activeNotif.message}
            </p>
            {activeNotif.orderId && (
              <Link
                href={user?.role === 'restaurant_owner' ? '/admin' : `/orders/${activeNotif.orderId}`}
                onClick={() => setActiveNotif(null)}
                className="inline-block mt-2 text-xs font-sans font-bold text-[#E23744] hover:underline"
              >
                {user?.role === 'restaurant_owner' ? 'Open Kitchen Orders →' : 'View Live Order Token →'}
              </Link>
            )}
          </div>
        </div>

        <button
          onClick={() => setActiveNotif(null)}
          className="text-[#8A7F70] hover:text-[#1A3D4F] p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

