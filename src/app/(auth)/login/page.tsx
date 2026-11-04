'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UtensilsCrossed, User, Phone, ArrowRight, AlertCircle, Sparkles, ChefHat, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsStudent, quickLoginAsStudent, quickLoginAsAdmin, openAuthModal } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setSubmitting(true);
    const res = await loginAsStudent(name.trim(), cleanPhone);
    setSubmitting(false);

    if (res.success) {
      router.push('/home');
    } else {
      setError(res.error || 'Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-4xl p-8 sm:p-10 border border-[#EAE5DC] shadow-soft">
        
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E23744] to-[#CB202D] flex items-center justify-center text-white shadow-elevated mb-6">
          <UtensilsCrossed className="w-8 h-8 stroke-[2.3]" />
        </div>

        <h1 className="font-heading font-extrabold text-3xl text-[#1A3D4F] tracking-tight">
          Student Sign In <br />
          <span className="text-[#E23744]">QueueLess CU</span>
        </h1>
        <p className="font-sans text-sm text-[#5F6B6F] mt-1.5 leading-relaxed">
          No complicated passwords. Just enter your name and phone number to start ordering campus food.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 bg-[#FFF5F5] border border-[#CC191D]/30 text-[#CC191D] px-4 py-3 rounded-2xl text-xs font-sans flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Simple Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#8A7F70] uppercase tracking-wider block mb-1.5">
              Your Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8A7F70] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aman Sharma"
                className="w-full bg-[#FAF7F2] border border-[#EAE5DC] text-[#1A3D4F] rounded-2xl pl-11 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#E23744] shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#8A7F70] uppercase tracking-wider block mb-1.5">
              10-Digit Mobile Number
            </label>
            <div className="relative">
              <span className="text-xs font-bold text-[#8A7F70] absolute left-4 top-1/2 -translate-y-1/2 font-sans">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                className="w-full bg-[#FAF7F2] border border-[#EAE5DC] text-[#1A3D4F] rounded-2xl pl-12 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#E23744] shadow-xs"
              />
            </div>
            <p className="text-[11px] text-[#8A7F70] font-sans mt-1">
              Your order token & pickup alerts will be linked to this number.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#E23744] hover:bg-[#CB202D] active:scale-98 disabled:bg-[#EAE5DC] disabled:text-[#8A7F70] text-white font-sans font-extrabold py-3.5 rounded-2xl shadow-elevated flex items-center justify-center gap-2 text-sm transition mt-6"
          >
            {submitting ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Enter Canteen & View Menu</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="mt-8 pt-6 border-t border-[#EAE5DC] text-center text-xs font-sans text-[#5F6B6F]">
          Are you a canteen or restaurant owner?{' '}
          <Link href="/register" className="font-bold text-[#E23744] hover:underline">
            Register Canteen Here
          </Link>
        </div>

      </div>
    </div>
  );
}
