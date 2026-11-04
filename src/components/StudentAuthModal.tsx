'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, User, Phone, ArrowRight, Sparkles, UtensilsCrossed } from 'lucide-react';

export const StudentAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginAsStudent, quickLoginAsStudent } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await loginAsStudent(name, phone);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Failed to sign up');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A3D4F]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white border border-[#EAE5DC] w-full max-w-md rounded-4xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-[#8A7F70] hover:text-[#1A3D4F] p-1.5 rounded-full hover:bg-[#FAF7F2] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon */}
        <div className="w-13 h-13 rounded-2xl bg-[#FFE4E6] text-[#E23744] flex items-center justify-center mb-4 p-3 shadow-sm">
          <UtensilsCrossed className="w-7 h-7 stroke-[2.3]" />
        </div>

        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A3D4F] tracking-tight">
          Welcome to <span className="text-[#E23744]">QueueLess</span>
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#5F6B6F] mt-1.5 leading-relaxed">
          Fill your name & phone number to start ordering hot meals from Chandigarh University canteens.
        </p>

        {error && (
          <div className="mt-4 bg-[#FFF5F5] border border-[#CC191D]/30 text-[#CC191D] px-3.5 py-2.5 rounded-xl text-xs font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 font-sans">
          <div>
            <label className="eyebrow text-[#8A7F70] block mb-1.5">
              Your Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8A7F70] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aman Sharma"
                className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#1A3D4F] placeholder-[#8A7F70] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="eyebrow text-[#8A7F70] block mb-1.5">
              Mobile Number (For Order Tracking) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#8A7F70] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                maxLength={10}
                className="w-full bg-[#FAF7F2] border border-[#EAE5DC] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#1A3D4F] placeholder-[#8A7F70] focus:outline-none focus:ring-2 focus:ring-[#E8B92C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E23744] hover:bg-[#CB202D] active:scale-98 disabled:bg-[#EAE5DC] text-white font-sans font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-elevated flex items-center justify-center gap-2 transition mt-2"
          >
            {loading ? (
              <span>Saving...</span>
            ) : (
              <>
                <span>Start Ordering Campus Food</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#EAE5DC] text-center text-xs font-sans text-[#8A7F70]">
          <span>Your mobile number will be linked to your order token for counter pickup.</span>
        </div>
      </div>
    </div>
  );
};

