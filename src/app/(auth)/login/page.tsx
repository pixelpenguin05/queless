'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UtensilsCrossed, Lock, Mail, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLoginAsStudent, quickLoginAsAdmin, isFirebaseActive } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('canteen')) {
        router.push('/admin');
      } else {
        router.push('/home');
      }
    } else {
      setError(res.error || 'Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6">
      <div className="max-w-sm mx-auto w-full pt-6">
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-500 flex items-center justify-center text-white shadow-elevated mb-6">
          <UtensilsCrossed className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome Back to <br />
          <span className="text-brand-600">QueueLess CU</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Log in with your Chandigarh University account to order meals.
        </p>

        {/* Firebase or Mock Indicator */}
        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-xs">
          <span className={`w-2 h-2 rounded-full ${isFirebaseActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>{isFirebaseActive ? 'Firebase Auth Connected' : 'Local Auth & Demo Mode Active'}</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Campus Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. 21bcs4821@cuchd.in"
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-2xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition"
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
            className="w-full bg-brand-500 hover:bg-brand-600 active:scale-98 disabled:bg-slate-300 text-white font-extrabold py-3.5 rounded-2xl shadow-elevated flex items-center justify-center gap-2 text-sm transition mt-6"
          >
            {submitting ? (
              <span>Logging In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Preset Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-3">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Fast Evaluator Login:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                quickLoginAsStudent();
                router.push('/home');
              }}
              className="bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs transition text-left flex flex-col"
            >
              <span className="text-brand-600">🎓 Student Demo</span>
              <span className="text-[10px] text-slate-400 font-normal">Aman (21BCS4821)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                quickLoginAsAdmin();
                router.push('/admin');
              }}
              className="bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs transition text-left flex flex-col"
            >
              <span className="text-rose-600">👨‍🍳 Kitchen Staff</span>
              <span className="text-[10px] text-slate-400 font-normal">Canteen Counter 3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Switch to Register */}
      <div className="text-center pt-6 pb-2 text-xs text-slate-500">
        Don&apos;t have a CU canteen account yet?{' '}
        <Link href="/register" className="font-bold text-brand-600 hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
