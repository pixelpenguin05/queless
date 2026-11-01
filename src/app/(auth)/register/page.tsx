'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  AlertCircle,
  ChefHat,
  Store,
  ShoppingBag,
  Eye,
  EyeOff
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [restaurantName, setRestaurantName] = useState('Food Republic C1');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your Owner Name.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const res = await register(
      name.trim(),
      email.trim(),
      password,
      undefined,
      phone.trim() || '+91 98111 22334',
      'admin',
      restaurantName.trim() || 'Food Republic C1'
    );
    setSubmitting(false);

    if (res.success) {
      router.push('/admin');
    } else {
      setError(res.error || 'Failed to register restaurant owner account.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6">
      <div className="max-w-sm mx-auto w-full pt-4">
        {/* Header Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-500 flex items-center justify-center text-white shadow-elevated p-3">
            <ChefHat className="w-7 h-7 stroke-[2.5]" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200/70 px-3 py-1 rounded-full">
            Restaurant Portal
          </span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
          Register as <br />
          <span className="text-brand-600">Restaurant Owner</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Register your name to manage the Food Republic C1 canteen, publish menu dishes, and handle orders.
        </p>

        {error && (
          <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {/* Owner Full Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Your Name (Restaurant Owner / Lead) *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Muskan / Chef Vikram"
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
              />
            </div>
          </div>

          {/* Restaurant / Canteen Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Restaurant / Canteen Name *
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Food Republic C1"
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Owner Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. owner@canteen.in"
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
              />
            </div>
          </div>

          {/* Contact Phone */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Contact Phone (For Canteen Orders)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98111 22334"
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Password (Min. 6 Characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 active:scale-98 disabled:bg-slate-300 text-white font-extrabold py-3.5 rounded-2xl shadow-elevated flex items-center justify-center gap-2 text-sm transition mt-6"
          >
            {submitting ? (
              <span>Registering Restaurant...</span>
            ) : (
              <>
                <ChefHat className="w-4 h-4" />
                <span>Register as Restaurant Owner</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Direct links to buying food / sign in */}
      <div className="text-center pt-8 pb-2 space-y-2 text-xs text-slate-500">
        <div>
          Already registered as owner?{' '}
          <Link href="/login" className="font-bold text-brand-600 hover:underline">
            Sign In
          </Link>
        </div>

        <div>
          <Link 
            href="/home" 
            className="inline-flex items-center gap-1 font-bold text-slate-700 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition shadow-xs mt-1"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-brand-500" />
            <span>Go directly to Canteen Menu (Buy Food)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
