'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  UtensilsCrossed, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Smartphone,
  Flame
} from 'lucide-react';

export default function WelcomePage() {
  const { user, loading, quickLoginAsStudent, quickLoginAsAdmin } = useAuth();
  const router = useRouter();

  // If user is already authenticated, redirect to appropriate home
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/home');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-16 h-16 rounded-3xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center animate-bounce">
          <UtensilsCrossed className="w-8 h-8 text-brand-500" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-300">Loading QueueLess CU...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-brand-950 text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-28 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="pt-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <UtensilsCrossed className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight leading-none">
              QueueLess <span className="text-brand-400">CU</span>
            </h1>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mt-0.5">
              Chandigarh University Canteen
            </p>
          </div>
        </div>

        <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Block 3 Live
        </span>
      </div>

      {/* Hero Content & Food Art Card */}
      <div className="my-auto py-6 z-10">
        {/* Visual Illustration Badge */}
        <div className="relative mx-auto w-full max-w-xs aspect-square rounded-3xl p-1 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-md shadow-2xl mb-8 flex flex-col justify-between overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-75 transition hover:scale-105 duration-700"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Floating Pill Highlights */}
          <div className="relative z-10 p-3 flex justify-between">
            <span className="bg-slate-900/85 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Flame className="w-3.5 h-3.5 text-brand-400 fill-brand-400" /> Hot & Fresh
            </span>
            <span className="bg-brand-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
              ₹0 Wait Time
            </span>
          </div>

          <div className="relative z-10 p-4">
            <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <Zap className="w-4 h-4 fill-emerald-400" />
                <span>Instant Campus Break Pickup</span>
              </div>
              <p className="text-xs text-slate-300">
                Order during class. Walk into Canteen. Pick up hot food directly from Counter 2.
              </p>
            </div>
          </div>
        </div>

        {/* Headlines */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Food Ordering Reimagined</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Skip the Queue. <br />
            <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-brand-500 bg-clip-text text-transparent">
              Enjoy Your Break.
            </span>
          </h2>
          <p className="text-sm text-slate-300 mt-3 max-w-xs mx-auto leading-relaxed">
            Order your favourite campus meals ahead and spend less time waiting in long lunch crowds.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-2 mt-6 text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5">
            <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-white">10m Prep</div>
            <div className="text-[10px] text-slate-400">Pre-ordered</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5">
            <Smartphone className="w-5 h-5 text-brand-400 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-white">Live Tracking</div>
            <div className="text-[10px] text-slate-400">Real-time status</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-white">Pay at Counter</div>
            <div className="text-[10px] text-slate-400">Cash or UPI</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 z-10 pt-2 pb-4">
        <Link
          href="/register"
          className="w-full bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 active:scale-98 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-elevated flex items-center justify-center gap-2 text-base transition-all"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </Link>

        <Link
          href="/login"
          className="w-full bg-white/10 hover:bg-white/15 active:scale-98 text-white font-bold py-3.5 px-6 rounded-2xl border border-white/15 flex items-center justify-center text-sm transition-all"
        >
          <span>Log In to Account</span>
        </Link>

        {/* Quick Demo Access Bar */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-[11px] text-center text-slate-400 font-medium mb-2">
            Instant Demo Review (No password needed):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                quickLoginAsStudent();
                router.push('/home');
              }}
              className="bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-brand-300 text-xs font-bold py-2 rounded-xl transition"
            >
              🎓 Explore Student
            </button>
            <button
              type="button"
              onClick={() => {
                quickLoginAsAdmin();
                router.push('/admin');
              }}
              className="bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold py-2 rounded-xl transition"
            >
              👨‍🍳 Explore Kitchen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
